import express from 'express';
import multer from 'multer';
import { parseCsvBuffer } from '../services/csvService.js';
import { generateEstimateList } from '../services/estimateService.js';
import { getS3ObjectBuffer } from '../services/s3Service.js';

export const estimatePreviewRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

estimatePreviewRoute.post('/estimate-preview', upload.none(), async (req, res) => {
    try {
        const { s3CsvKey } = req.body;
        if (!s3CsvKey) {
            return res.status(400).json({ error: 's3CsvKey is required.' });
        }

        const csvBuffer = await getS3ObjectBuffer(s3CsvKey);
        const { products } = await parseCsvBuffer(csvBuffer);
        const { items, totalAmount } = generateEstimateList(products);

        res.json({
            success: true,
            items,
            totalAmount
        });
    } catch (error) {
        console.error('Estimate Preview Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
