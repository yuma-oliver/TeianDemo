\ufeff$ErrorActionPreference = "Stop"\n$outPath = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_171516\merged\merged.pptx"\n$files = @(\n  "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_171516\pptx\【製品情報】S・CU-A160・AC・B・OKC・BK.pptx",\n  "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_171516\pptx\【製品情報】S・CW-106A・NB・AC・G.pptx",\n  "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_171516\pptx\【製品情報】S・OG-960・A.pptx",\n  "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_171516\pptx\【製品情報】S・TW-H820・C・OM_S・LW-H820・C・OM.pptx"\n)\n
function Log($msg) { Write-Output "PS_LOG: $msg" }

Log "STARTING_PPT_COM"
try {
    $pptApp = New-Object -ComObject PowerPoint.Application
    # Minimize visibility issues by making it msoTrue but minimized, or just leave it invisible, 
    # but invisible might hang Activation Wizards. Let's use visible.
    $pptApp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
} catch {
    Write-Output "PPT_START_FAILED: $_"
    exit 1
}

try {
    Log "CREATING_NEW_PRES"
    $newPres = $pptApp.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoTrue)
    Log "NEW_PRES_CREATED"

    foreach ($file in $files) {
        Log "PROCESSING_FILE: $file"
        if (Test-Path -LiteralPath $file) {
            $beforeCount = $newPres.Slides.Count
            
            try {
                Log "OPENING_SOURCE"
                $sourcePres = $pptApp.Presentations.Open($file, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
                $sourceSlidesCount = $sourcePres.Slides.Count
                $sourcePres.Close()
                Log "SOURCE_HAS_SLIDES: $sourceSlidesCount"
                
                Log "INSERTING_INTO_IDX: $beforeCount"
                $newPres.Slides.InsertFromFile($file, $beforeCount) | Out-Null
                
                $afterCount = $newPres.Slides.Count
                Log "INSERT_SUCCESS: BEFORE=$beforeCount AFTER=$afterCount"
            } catch {
                Write-Output "INSERT_FAILED: $file | $_"
            }
        } else {
            Write-Output "SOURCE_NOT_FOUND: $file"
        }
    }

    $finalCount = $newPres.Slides.Count
    Log "FINAL_SLIDE_COUNT: $finalCount"

    if ($finalCount -gt 0) {
        Log "SAVING_TO: $outPath"
        $newPres.SaveAs($outPath)
        $newPres.Close()
        Log "SAVE_SUCCESS"
    } else {
        $newPres.Close()
        Write-Output "SAVE_FAILED_0_SLIDES"
        exit 1
    }
} catch {
    Write-Output "UNEXPECTED_ERROR: $_"
    exit 1
} finally {
    if ($pptApp) {
        Log "CLOSING_PPT_COM"
        $pptApp.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
    }
}
    