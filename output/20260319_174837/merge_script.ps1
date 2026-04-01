$ErrorActionPreference = "Stop"
$outPath = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_174837\merged\merged.pptx"
$originalSourceFile = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_174837\pptx\【製品情報】S・CU-A160・AC・B・OKC・BK.pptx"
$tempSourceFile = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_174837\merged\tmp_sources\source_001.pptx"
$outDir = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_174837\merged"

function Log($msg) { Write-Output "PS_LOG: $msg" }

Log "OUT_PATH=$outPath"
Log "OUT_DIR_EXISTS=$(Test-Path -LiteralPath $outDir)"

Log "STARTING_PPT_COM"
$ppt = New-Object -ComObject PowerPoint.Application

Log "CREATING_NEW_PRES"
$presentation = $ppt.Presentations.Add()

Log "ORIGINAL_SOURCE_FILE=$originalSourceFile"
Log "TEMP_SOURCE_FILE=$tempSourceFile"
$tempExists = Test-Path -LiteralPath $tempSourceFile
Log "TEMP_SOURCE_EXISTS=$tempExists"

if ($tempExists) {
    try {
        $sourcePres = $ppt.Presentations.Open($tempSourceFile, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $sourceSlideCount = $sourcePres.Slides.Count
        $sourcePres.Close()
        Log "SOURCE_SLIDE_COUNT=$sourceSlideCount"
    } catch {
        Log "SOURCE_SLIDE_COUNT=READ_FAILED_($_)"
    }

    $beforeCount = $presentation.Slides.Count
    Log "MERGED_BEFORE_COUNT=$beforeCount"

    try {
        $presentation.Slides.InsertFromFile($tempSourceFile, $beforeCount) | Out-Null
        $afterCount = $presentation.Slides.Count
        Log "MERGED_AFTER_COUNT=$afterCount"
        Log "INSERT_SUCCESS"
    } catch {
        Log "INSERT_FAILED: $_"
    }
} else {
    Log "INSERT_FAILED: TEMP_FILE_NOT_FOUND"
}

$finalCount = $presentation.Slides.Count
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
