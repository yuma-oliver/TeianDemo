import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import iconv from 'iconv-lite'; // To safely decode Shift_JIS from PowerShell if needed, but we'll stick to English logs.

export async function mergePptxFiles(outputPath) {
    const resultJsonPath = path.join(outputPath, 'result.json');
    if (!await fs.pathExists(resultJsonPath)) {
        throw new Error('NO_JSON_FOUND');
    }

    const matchResult = await fs.readJson(resultJsonPath);
    const matchedProducts = matchResult.matchedProducts || [];

    const uniqPptSet = new Set();
    const orderedPptPaths = [];

    const allCandidates = [...matchedProducts];
    if (matchResult.duplicateCandidates) {
        allCandidates.push(...matchResult.duplicateCandidates);
    }

    for (const match of allCandidates) {
        if (!match.ppts || match.ppts.length === 0) continue;
        const sortedPpts = [...match.ppts].sort((a, b) => a.name.localeCompare(b.name, 'ja'));
        for (const file of sortedPpts) {
            const actualPath = path.join(outputPath, 'pptx', file.name);
            if (!uniqPptSet.has(actualPath)) {
                uniqPptSet.add(actualPath);
                orderedPptPaths.push(actualPath);
            }
        }
    }

    console.log("=== PowerPoint Merge Target Details ===");
    console.log("TOTAL_PPT_COUNT:", orderedPptPaths.length);
    orderedPptPaths.forEach((p, idx) => {
        console.log(`[${idx}] EXISTS:${fs.existsSync(p)} EXT:${path.extname(p)} PATH:${p}`);
    });

    if (orderedPptPaths.length === 0) {
        throw new Error('NO_PPT_FILES_FOUND');
    }

    const mergeDir = path.join(outputPath, 'merged');
    const mergedPptxPath = path.join(mergeDir, 'merged.pptx');
    await fs.ensureDir(mergeDir);

    if (await fs.pathExists(mergedPptxPath)) {
        await fs.remove(mergedPptxPath);
    }

    // 先に古いtmp_sourcesがあれば削除して作り直す
    const tmpSourceDir = path.join(outputPath, 'merged', 'tmp_sources');
    if (await fs.pathExists(tmpSourceDir)) {
        await fs.remove(tmpSourceDir);
    }
    await fs.ensureDir(tmpSourceDir);

    const psArrayLines = [];
    
    // 全対象ファイルをASCII名のテンポラリファイルへ一括コピー（文字化け対策）
    for (let i = 0; i < orderedPptPaths.length; i++) {
        const targetFile = orderedPptPaths[i];
        const seq = String(i + 1).padStart(3, '0'); // 001, 002...
        const asciiFilename = `source_${seq}${path.extname(targetFile)}`;
        const tempPptPath = path.join(tmpSourceDir, asciiFilename);
        
        await fs.copy(targetFile, tempPptPath);

        const safeTempPath = tempPptPath.replace(/'/g, "''").replace(/"/g, '`"');
        psArrayLines.push(`    "${safeTempPath}"`);
    }

    const sanitizePath = (p) => p.replace(/'/g, "''").replace(/"/g, '`"');
    const outPathStr = sanitizePath(mergedPptxPath);
    const outDirStr = sanitizePath(mergeDir);

    // PowerShellで配列として受け取る
    const arrayDefinition = psArrayLines.join(',\n');

    // テンプレート文字列内の本来の改行をそのまま使用
    const scriptContent = `$ErrorActionPreference = "Stop"
$outPath = "${outPathStr}"
$outDir = "${outDirStr}"

$tempFiles = @(
${arrayDefinition}
)

function Log($msg) { Write-Output "PS_LOG: $msg" }

Log "OUT_PATH=$outPath"
Log "OUT_DIR_EXISTS=$(Test-Path -LiteralPath $outDir)"

Log "STARTING_PPT_COM"
$ppt = New-Object -ComObject PowerPoint.Application

Log "CREATING_NEW_PRES"
$presentation = $ppt.Presentations.Add()

$loopIndex = 1
foreach ($tempFile in $tempFiles) {
    Log "--- LOOP_INDEX=$loopIndex ---"
    Log "TEMP_SOURCE_FILE=$tempFile"

    $tempExists = Test-Path -LiteralPath $tempFile
    Log "TEMP_SOURCE_EXISTS=$tempExists"

    if ($tempExists) {
        try {
            # 原本を開いて枚数をカウント
            $sourcePres = $ppt.Presentations.Open($tempFile, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
            $sourceSlideCount = $sourcePres.Slides.Count
            Log "SOURCE_SLIDE_COUNT=$sourceSlideCount"
            try {
                $sourcePres.Close()
            } catch {
                Log "WARNING: SOURCE_PRES_CLOSE_FAILED_($_)"
            }
        } catch {
            Log "SOURCE_SLIDE_COUNT=READ_FAILED_($_)"
        }

        $beforeCount = $presentation.Slides.Count
        Log "MERGED_BEFORE_COUNT=$beforeCount"

        try {
            $presentation.Slides.InsertFromFile($tempFile, $beforeCount) | Out-Null
            $afterCount = $presentation.Slides.Count
            Log "MERGED_AFTER_COUNT=$afterCount"
            Log "INSERT_SUCCESS"
        } catch {
            Log "INSERT_FAILED: $_"
        }
    } else {
        Log "INSERT_FAILED: TEMP_FILE_NOT_FOUND"
    }

    $loopIndex++
}

$finalCount = $presentation.Slides.Count
Log "FINAL_TOTAL_SLIDES=$finalCount"

if ($finalCount -gt 0) {
    Log "ABOUT_TO_SAVE"
    try {
        $presentation.SaveAs($outPath)
        Log "SAVE_SUCCESS"
    } catch {
        Log "SAVE_FAILED_($_)"
    }
} else {
    Log "SAVE_FAILED_0_SLIDES"
}

Log "OUTPUT_EXISTS_AFTER_SAVE=$(Test-Path -LiteralPath $outPath)"

try {
    $presentation.Close()
} catch {
    Log "WARNING: MERGED_PRES_CLOSE_FAILED_($_)"
}

try {
    Log "QUIT_PPT_COM"
    $ppt.Quit()
} catch {
    Log "WARNING: PPT_QUIT_FAILED_($_)"
}

try {
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
} catch {
    Log "WARNING: COM_RELEASE_FAILED_($_)"
}
`;

    // BOMなし UTF-8 で純粋に保存
    const ps1Path = path.join(outputPath, 'merge_script.ps1');
    fs.writeFileSync(ps1Path, scriptContent, 'utf8');

    console.log("=== merge_script.ps1 executing (Multi-File) ===");

    return new Promise((resolve, reject) => {
        const ps = spawn('powershell.exe', [
            '-ExecutionPolicy', 'Bypass',
            '-NoProfile',
            '-NonInteractive',
            '-File', ps1Path
        ]);

        let output = '';
        let errorOutput = '';

        ps.stdout.on('data', (data) => { 
            const decoded = iconv.decode(data, 'cp932');
            output += decoded;
            decoded.split('\n').forEach(line => {
                if(line.trim() !== '') console.log('[PS_OUT]', line.trim());
            });
        });
        ps.stderr.on('data', (data) => { 
            const decoded = iconv.decode(data, 'cp932');
            errorOutput += decoded;
            decoded.split('\n').forEach(line => {
                if(line.trim() !== '') console.error('[PS_ERR]', line.trim());
            });
        });

        ps.on('close', async (code) => {
            console.log(`[PS_CLOSE] Code: ${code}`);
            
            const isOutDirExist = fs.existsSync(mergeDir);
            const isMergedFileExist = fs.existsSync(mergedPptxPath);
            
            console.log(`[JS_VALIDATION] OUT_DIR_EXISTS: ${isOutDirExist}`);
            console.log(`[JS_VALIDATION] MERGED_FILE_EXISTS: ${isMergedFileExist}`);
            
            const finalSlideMatch = output.match(/FINAL_TOTAL_SLIDES=(\d+)/);
            const totalSlides = finalSlideMatch ? parseInt(finalSlideMatch[1], 10) : 0;
            
            const warningMessages = [];
            const warningRegex = /WARNING: (.*)/g;
            let wm;
            while ((wm = warningRegex.exec(output)) !== null) {
                warningMessages.push(wm[1].trim());
            }
            if (errorOutput.length > 0) {
                warningMessages.push(`STDERR: ${errorOutput.trim()}`);
            }
            
            if (isMergedFileExist && totalSlides > 0) {
                const stats = fs.statSync(mergedPptxPath);
                resolve({ 
                    mergedPptxPath,
                    mergedFileExists: true,
                    mergedPptxExists: true,
                    mergedPptxFileName: 'merged.pptx',
                    mergedPptxSize: stats.size,
                    totalSlides,
                    mergedSlideCount: totalSlides,
                    processedCount: orderedPptPaths.length,
                    warningMessages
                });
            } else {
                console.error("PS Merge Process Failed. Output:", output);
                reject(new Error(`[PPTX_MERGE_ERR] 統合処理中に致命的なエラーが発生しました、またはスライドが0件です。\n詳細: ${errorOutput || output.match(/PS_LOG: (.*FAILED.*)/)?.[1] || '不明なエラー'}`));
            }
        });
    });
}
