import fs from 'fs-extra';
import path from 'path';
import { downloadS3Object } from './s3Service.js';

function getTimestamp() {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function createOutputAndCopy(matchResult, baseOutputFolder) {
    const timestamp = getTimestamp();
    const runFolder = path.join(baseOutputFolder, timestamp);

    const pptDir = path.join(runFolder, 'pptx');
    const pdfDir = path.join(runFolder, 'pdf');
    const mergeDir = path.join(runFolder, 'merged');

    await fs.ensureDir(pptDir);
    await fs.ensureDir(pdfDir);
    await fs.ensureDir(mergeDir);

    const { matchedProducts } = matchResult;

    const copiedPpts = new Set();
    const copiedPdfs = new Set();

    for (const match of matchedProducts) {
        // Copy PPTs (Download from S3)
        for (const file of match.ppts) {
            if (!copiedPpts.has(file.path)) {
                // 以前は fs.copy() でローカルコピーをしていましたが、S3からのダウンロードへ変更します。
                // await fs.copy(file.path, path.join(pptDir, file.name));
                await downloadS3Object(file.path, path.join(pptDir, file.name));
                copiedPpts.add(file.path);
            }
        }

        // Copy PDFs (Download from S3)
        for (const file of match.pdfs) {
            if (!copiedPdfs.has(file.path)) {
                // await fs.copy(file.path, path.join(pdfDir, file.name));
                await downloadS3Object(file.path, path.join(pdfDir, file.name));
                copiedPdfs.add(file.path);
            }
        }
    }

    // Save JSON result
    const jsonPath = path.join(runFolder, 'result.json');
    await fs.writeJson(jsonPath, matchResult, { spaces: 2 });

    return {
        outputPath: runFolder,
        savedJsonPath: jsonPath
    };
}
