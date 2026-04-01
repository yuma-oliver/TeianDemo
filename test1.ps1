try {
    $pptApp = New-Object -ComObject PowerPoint.Application
    $pptApp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
    Write-Output "PPT_START_SUCCESS"
    $pptApp.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
    Write-Output "CLEANUP_SUCCESS"
} catch {
    Write-Error "PPT_START_FAILED: $_"
    exit 1
}
