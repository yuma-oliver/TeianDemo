import { normalizeString, extractBaseCode, createCompareString } from './normalizeService.js';

export function matchProductsWithFiles(products, files) {
    const matchedProducts = [];
    const unmatchedProducts = [];
    const duplicateCandidates = [];

    // Pre-calculate file properties for speed
    const processedFiles = files.map(f => {
        const normalizedName = normalizeString(f.name);
        const compareStr = createCompareString(f.name);
        const baseCode = extractBaseCode(f.name);
        // Base without dash sometimes useful for loose match
        const looseBase = baseCode.replace(/[-]/g, '');

        return {
            ...f,
            normalizedName,
            compareStr,
            baseCode,
            looseBase
        };
    });

    const pptFiles = processedFiles.filter(f => f.type === 'ppt');
    const pdfFiles = processedFiles.filter(f => f.type === 'pdf');

    let pptCount = 0;
    let pdfCount = 0;

    for (const product of products) {
        const { displayName, productCodes, itemCode } = product;

        const itemCompare = createCompareString(itemCode);
        
        const codesCompare = productCodes.map(createCompareString).filter(Boolean);
        const codesBase = productCodes.map(extractBaseCode).filter(Boolean);
        const codesLooseBase = codesBase.map(b => b.replace(/[-]/g, '')).filter(Boolean);

        const matchedPpts = pptFiles.filter(f => {
            if (codesCompare.some(c => f.compareStr.includes(c))) return true;
            if (codesBase.some(b => f.baseCode === b)) return true;
            if (codesLooseBase.some(b => f.looseBase === b)) return true;
            return false;
        });

        const matchedPdfs = pdfFiles.filter(f => {
            if (codesBase.some(b => f.baseCode === b)) return true;
            if (codesLooseBase.some(b => f.looseBase === b)) return true;
            if (codesCompare.some(c => f.compareStr.includes(c))) return true;
            if (itemCompare && f.compareStr.includes(itemCompare)) return true;
            
            // As a final fallback for PDF, if displayName exists and is found fully inside filename
            const nameCompare = createCompareString(displayName);
            if (nameCompare && nameCompare.length > 3 && f.compareStr.includes(nameCompare)) return true;

            return false;
        });

        // Dedup matches
        const uniquePpts = [...new Set(matchedPpts)];
        const uniquePdfs = [...new Set(matchedPdfs)];

        if (uniquePpts.length > 0 || uniquePdfs.length > 0) {
            matchedProducts.push({
                product,
                ppts: uniquePpts,
                pdfs: uniquePdfs
            });
            pptCount += uniquePpts.length;
            pdfCount += uniquePdfs.length;

            if (uniquePpts.length > 1 || uniquePdfs.length > 1) {
                duplicateCandidates.push({
                    product,
                    ppts: uniquePpts,
                    pdfs: uniquePdfs
                });
            }
        } else {
            unmatchedProducts.push(product);
        }
    }

    return {
        matchedProducts,
        unmatchedProducts,
        duplicateCandidates,
        summary: {
            pptCount,
            pdfCount
        }
    };
}
