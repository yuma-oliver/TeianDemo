import { PDFDocument } from 'pdf-lib';
import fs from 'fs-extra';
import path from 'path';
import fg from 'fast-glob';

export async function mergePdfsInFolder(baseOutputFolder) {
    const pdfDir = path.join(baseOutputFolder, 'pdf');
    const mergeDir = path.join(baseOutputFolder, 'merged');

    const pdfFiles = await fg([`${pdfDir.replace(/\\/g, '/')}/*.pdf`], { absolute: true });

    if (pdfFiles.length === 0) {
        throw new Error('No PDF files found to merge.');
    }

    // Create a new document
    const mergedPdf = await PDFDocument.create();

    for (const pdfFile of pdfFiles) {
        try {
            const pdfBytes = await fs.readFile(pdfFile);
            // Load the source PDF
            const pdfDoc = await PDFDocument.load(pdfBytes);
            // Copy all pages
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            // Add pages to merged Document
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (err) {
            console.error(`Failed to merge file: ${pdfFile}`, err);
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const finalMergePath = path.join(mergeDir, 'merged.pdf');
    
    await fs.writeFile(finalMergePath, mergedPdfBytes);

    const stats = await fs.stat(finalMergePath);

    return {
        mergedPdfPath: finalMergePath,
        mergedPdfExists: true,
        mergedPdfFileName: 'merged.pdf',
        mergedPdfSize: stats.size,
        mergedPdfPageCount: mergedPdf.getPageCount()
    };
}
