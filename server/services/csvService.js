import { parse } from 'csv-parse/sync';
import iconv from 'iconv-lite';

export function detectCsvType(records) {
    if (!records || records.length === 0) return 'unknown';
    const firstRow = records[0];
    if ('シンボル名(normal_product_code)' in firstRow) {
        return 'legacy';
    }
    if ('MatchedProductCode' in firstRow && 'ItemName' in firstRow) {
        return 'estimate';
    }
    return 'unknown';
}

function isLegacyProductRow(row) {
    const symbolCode = (row['シンボル名(normal_product_code)'] || '').trim();
    const productColorChange = (row['product_code(カラー変更）'] || '').trim();
    const itemCode = (row['品目CD'] || '').trim();

    if (!symbolCode && !productColorChange && !itemCode) return false;

    if (symbolCode && !productColorChange && !itemCode) {
        if (symbolCode.length <= 2) return false;
        const roomNames = ['受付', 'エントランス', 'ロビー', '事務室a', '会議室a'];
        if (roomNames.includes(symbolCode.toLowerCase())) return false;
        if (/^\d+$/.test(symbolCode)) return false;
    }
    return true;
}

export function extractProductsFromLegacyCsv(records) {
    const products = [];
    records.forEach((record, index) => {
        if (isLegacyProductRow(record)) {
            products.push({
                rowIndex: index,
                sourceType: 'legacy',
                originalData: record
            });
        }
    });
    return products;
}

export function extractProductsFromEstimateCsv(records) {
    const products = [];
    const seenCodes = new Set();

    records.forEach((record, index) => {
        let matchedCodesStr = (record['MatchedProductCode'] || '').trim();
        const itemName = (record['ItemName'] || '').trim();
        const itemCode = (record['ItemCode'] || '').trim();
        
        if (!matchedCodesStr && !itemName && !itemCode) return; 

        // Clean
        matchedCodesStr = matchedCodesStr.replace(/\[Unknown:[^\]]+\]/g, '').trim();
        
        // Split by +
        const parts = matchedCodesStr.split(/(?:\+|＋)/).map(s => s.trim()).filter(Boolean);
        
        const effectiveItemCode = (itemCode && itemCode.toLowerCase() !== 'nocode') ? itemCode : '';

        // skip meaningless rows
        if (parts.length === 0 && !effectiveItemCode && !itemName) {
            return;
        }

        const hash = parts.join('+') + '|' + effectiveItemCode + '|' + itemName;
        if (!hash.replace(/\|/g, '')) return;
        if (seenCodes.has(hash)) return;
        seenCodes.add(hash);

        products.push({
            rowIndex: index,
            sourceType: 'estimate',
            productCodes: parts,
            effectiveItemCode: effectiveItemCode,
            itemName: itemName,
            originalData: record
        });
    });
    return products;
}

export function normalizeExtractedProducts(products) {
    return products.map(p => {
        if (p.sourceType === 'legacy') {
            const orig = p.originalData;
            const symbolCode = (orig['シンボル名(normal_product_code)'] || '').trim();
            const productColor = (orig['product_code(カラー変更）'] || '').trim();
            const itemCode = (orig['品目CD'] || '').trim();

            const codes = [symbolCode, productColor].filter(Boolean);
            
            return {
                rowIndex: p.rowIndex,
                sourceType: p.sourceType,
                displayName: symbolCode || productColor || itemCode || 'Unknown',
                productCodes: codes,
                itemCode: itemCode,
                originalData: orig
            };
        } else if (p.sourceType === 'estimate') {
            return {
                rowIndex: p.rowIndex,
                sourceType: p.sourceType,
                displayName: p.itemName || (p.productCodes.length > 0 ? p.productCodes[0] : 'Unknown'),
                productCodes: p.productCodes,
                itemCode: p.effectiveItemCode,
                originalData: p.originalData
            };
        }
        return p;
    });
}

export function parseCsvBuffer(buffer) {
    let text = buffer.toString('utf8');
    if (text.includes('\uFFFD')) { 
        text = iconv.decode(buffer, 'Shift_JIS');
    }

    const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true
    });

    const type = detectCsvType(records);
    let rawProducts = [];

    if (type === 'legacy') {
        rawProducts = extractProductsFromLegacyCsv(records);
    } else if (type === 'estimate') {
        rawProducts = extractProductsFromEstimateCsv(records);
    } else {
        rawProducts = extractProductsFromLegacyCsv(records); 
    }

    const normalizedProducts = normalizeExtractedProducts(rawProducts);

    return { 
        totalRows: records.length, 
        csvType: type,
        products: normalizedProducts 
    };
}
