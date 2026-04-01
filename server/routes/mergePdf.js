import express from 'express';
import { mergePdfsInFolder } from '../services/pdfMergeService.js';

export const mergePdfRoute = express.Router();

mergePdfRoute.post('/merge-pdf', async (req, res) => {
  try {
    const { outputPath } = req.body;
    if (!outputPath) {
      return res.status(400).json({ error: 'Output path is required.' });
    }

    const mergedResult = await mergePdfsInFolder(outputPath);
    res.json({ success: true, ...mergedResult });
  } catch (error) {
    console.error('Merge PDF Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
