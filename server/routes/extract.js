import express from 'express';
import multer from 'multer';
import { parseCsvBuffer } from '../services/csvService.js';
import { searchFiles } from '../services/fileSearchService.js';
import { matchProductsWithFiles } from '../services/matchingService.js';
import { createOutputAndCopy } from '../services/outputService.js';
import { listS3CsvFiles, getS3ObjectBuffer } from '../services/s3Service.js';
import path from 'path';

export const extractRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

extractRoute.get('/s3/csv-list', async (req, res) => {
  try {
    const files = await listS3CsvFiles();
    res.json({ success: true, files });
  } catch (error) {
    console.error('List CSV Error:', error);
    res.status(500).json({ error: 'Failed to list CSV files from S3' });
  }
});

extractRoute.post('/extract', upload.none(), async (req, res) => {
  try {
    const { s3CsvKey, outputRoot } = req.body;

    if (!s3CsvKey) {
      return res.status(400).json({ error: 's3CsvKey is required.' });
    }

    // 1. Fetch CSV from S3
    const csvBuffer = await getS3ObjectBuffer(s3CsvKey);

    // 2. Parse CSV & Filter valid product rows
    const { totalRows, products } = await parseCsvBuffer(csvBuffer);

    // 3. Search Reference Folder (Now hardcoded to S3 prefix inside searchFiles, so parameter is no longer strictly needed but we pass the required placeholder string to maintain signature for now)
    const fixedReference = 'S3: refarence（仮）/';
    const foundFiles = await searchFiles(fixedReference);

    // 4. Match Products with Files
    const matchResult = matchProductsWithFiles(products, foundFiles);

    // 5. Output: Download files to destination
    const finalOutputRoot = outputRoot || path.join(process.cwd(), 'output');
    const { outputPath, savedJsonPath } = await createOutputAndCopy(matchResult, finalOutputRoot);

    res.json({
      success: true,
      summary: {
        totalCsvRows: totalRows,
        productRows: products.length,
        matchedProducts: matchResult.matchedProducts.length,
        unmatchedProducts: matchResult.unmatchedProducts.length,
        matchedPptCount: matchResult.summary.pptCount,
        matchedPdfCount: matchResult.summary.pdfCount,
      },
      matchedProducts: matchResult.matchedProducts,
      unmatchedProducts: matchResult.unmatchedProducts,
      duplicateCandidates: matchResult.duplicateCandidates,
      outputPath,
      savedJsonPath
    });
  } catch (error) {
    console.error('Extract Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
