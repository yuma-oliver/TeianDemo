import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import { extractRoute } from './routes/extract.js';
import { mergePdfRoute } from './routes/mergePdf.js';
import { mergePptxRoute } from './routes/mergePptx.js';
import { estimatePreviewRoute } from './routes/estimatePreview.js';
import { BUCKET_NAME, AWS_REGION, CSV_PREFIX } from './services/s3Service.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', extractRoute);
app.use('/api', mergePdfRoute);
app.use('/api', mergePptxRoute);
app.use('/api', estimatePreviewRoute);

app.get('/api/config', (req, res) => {
  res.json({
    defaultReferenceFolder: 'C:\\Users\\yu-tanioka\\yuma_oliver\\02-OtherProject\\22_Revit+AWS'
  });
});

import { exec } from 'child_process';

app.get('/api/select-folder', (req, res) => {
  // Use PowerShell to open a native Windows FolderBrowserDialog
  // -STA is required for Windows Forms dialogs
  const psCommand = `powershell.exe -STA -Command "Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = '参照フォルダを選択してください'; $f.ShowNewFolderButton = $false; if($f.ShowDialog() -eq 'OK'){ Write-Output $f.SelectedPath }"`;
  
  exec(psCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Folder selection error:', error);
      return res.status(500).json({ error: 'フォルダ選択ダイアログの起動に失敗しました' });
    }
    const selectedPath = stdout.trim();
    if (selectedPath) {
      res.json({ folder: selectedPath });
    } else {
      res.json({ folder: null }); // User cancelled
    }
  });
});

app.get('/api/file', (req, res) => {
    const filePath = req.query.path;
    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(path.basename(filePath))}"`);
    res.sendFile(filePath);
});

app.post('/api/open-path', (req, res) => {
    const { targetPath } = req.body;
    if (!targetPath || !fs.existsSync(targetPath)) {
        return res.status(404).json({ error: 'Path not found' });
    }
    
    // Wrap targetPath in double quotes because single quotes can cause issues if path contains single quotes itself, 
    // though replace works too. Using explorer.exe safely.
    const psCommand = `powershell.exe -NoProfile -Command "Start-Process explorer.exe '${targetPath.replace(/'/g, "''")}'"`;
    exec(psCommand, (error) => {
        if (error) {
            console.error('Failed to open path:', error);
            return res.status(500).json({ error: 'Failed to open path' });
        }
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`[S3] bucket=${BUCKET_NAME} region=${AWS_REGION} prefix=${CSV_PREFIX}`);
});
