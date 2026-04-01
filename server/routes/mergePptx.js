import express from 'express';
import { mergePptxFiles } from '../services/pptxMergeService.js';

export const mergePptxRoute = express.Router();

mergePptxRoute.post('/merge-pptx', async (req, res) => {
    try {
        const { outputPath } = req.body;
        if (!outputPath) {
            return res.status(400).json({ error: 'outputPath requires for merging pptx files' });
        }

        const result = await mergePptxFiles(outputPath);
        res.json(result);
    } catch (err) {
        console.error('Merge PPTX Error:', err);
        res.status(500).json({ error: err.message });
    }
});
