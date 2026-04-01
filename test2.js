const fs = require('fs');
const cp = require('child_process');

const scriptLines = [
    `$ErrorActionPreference = "Stop"`,
    `$outPath = "c:\\Users\\yu-tanioka\\WebApps\\39_DEMO\\output\\test.pptx"`,
    `$ppt = New-Object -ComObject PowerPoint.Application`,
    `$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue`,
    `$presentation = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoTrue)`,
    `$presentation.SaveAs($outPath)`,
    `$presentation.Close()`,
    `$ppt.Quit()`
];

const content = scriptLines.join('\n');
fs.writeFileSync('c:\\Users\\yu-tanioka\\WebApps\\39_DEMO\\test2.ps1', content, 'utf8');

console.log("=== test2.ps1 head ===");
console.log(content.split('\n').slice(0, 5).join('\n'));

try {
    console.log("Executing...");
    const res = cp.execSync('powershell -ExecutionPolicy Bypass -File c:\\Users\\yu-tanioka\\WebApps\\39_DEMO\\test2.ps1', { encoding: 'utf8' });
    console.log("Success:", res);
} catch(e) {
    console.error("Error:", e.message);
    if (e.stdout) console.error("STDOUT:", e.stdout);
    if (e.stderr) console.error("STDERR:", e.stderr);
}
