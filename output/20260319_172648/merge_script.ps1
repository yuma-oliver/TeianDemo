$ErrorActionPreference = "Stop"
$outPath = "C:\Users\yu-tanioka\WebApps\39_DEMO\output\20260319_172648\merged\merged.pptx"

$ppt = New-Object -ComObject PowerPoint.Application
$presentation = $ppt.Presentations.Add()
$presentation.SaveAs($outPath)
$presentation.Close()
$ppt.Quit()
