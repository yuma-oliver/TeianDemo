$ErrorActionPreference = "Stop"
$outPath = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_173613\merged\merged.pptx"
$sourceFile = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_173613\pptx\【製品情報】S・CU-A160・AC・B・OKC・BK.pptx"

function Log($msg) { Write-Output "PS_LOG: $msg" }

Log "STARTING_PPT_COM"
$ppt = New-Object -ComObject PowerPoint.Application

Log "CREATING_NEW_PRES"
$presentation = $ppt.Presentations.Add()

Log "SOURCE_FILE: $sourceFile"
$fileExists = Test-Path -LiteralPath $sourceFile
Log "SOURCE_EXISTS: $fileExists"

if ($fileExists) {
    try {
        $sourcePres = $ppt.Presentations.Open($sourceFile, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
        $sourceSlideCount = $sourcePres.Slides.Count
        $sourcePres.Close()
        Log "SOURCE_SLIDE_COUNT: $sourceSlideCount"
    } catch {
        Log "SOURCE_SLIDE_COUNT: READ_FAILED_($_)"
    }

    $beforeCount = $presentation.Slides.Count
    Log "MERGED_BEFORE_COUNT: $beforeCount"

    try {
        $presentation.Slides.InsertFromFile($sourceFile, $beforeCount) | Out-Null
        $afterCount = $presentation.Slides.Count
        Log "MERGED_AFTER_COUNT: $afterCount"
        Log "INSERT_SUCCESS"
    } catch {
        Log "INSERT_FAILED: $_"
    }
} else {
    Log "INSERT_FAILED: FILE_NOT_FOUND"
}

$finalCount = $presentation.Slides.Count
if ($finalCount -gt 0) {
    Log "SAVING_TO: $outPath"
    $presentation.SaveAs($outPath)
    Log "SAVE_SUCCESS"
} else {
    Log "SAVE_FAILED_0_SLIDES"
}

$presentation.Close()
Log "QUIT_PPT_COM"
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
