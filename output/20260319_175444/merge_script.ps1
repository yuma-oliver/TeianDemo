$ErrorActionPreference = "Stop"
$outPath = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged\merged.pptx"
$outDir = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged"

$tempFiles = @(
    "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged\tmp_sources\source_001.pptx",
    "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged\tmp_sources\source_002.pptx",
    "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged\tmp_sources\source_003.pptx",
    "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_175444\merged\tmp_sources\source_004.pptx"
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
            $sourcePres.Close()
            Log "SOURCE_SLIDE_COUNT=$sourceSlideCount"
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
    $presentation.SaveAs($outPath)
    Log "SAVE_SUCCESS"
} else {
    Log "SAVE_FAILED_0_SLIDES"
}

Log "OUTPUT_EXISTS_AFTER_SAVE=$(Test-Path -LiteralPath $outPath)"
$presentation.Close()
Log "QUIT_PPT_COM"
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
