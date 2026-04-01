export function generateEstimateList(products) {
    const items = products.map((p, index) => {
        const orig = p.originalData;
        let unitPrice = 0, quantity = 1, amount = 0;
        let name = '', productCode = '', itemCode = '', color = '', rank = '';
        
        if (p.sourceType === 'estimate') {
            const rawPrice = (orig['UnitPrice'] || '').toString().replace(/[^\d.-]/g, '');
            unitPrice = parseFloat(rawPrice) || 0;
            const rawQty = (orig['Quantity'] || '').toString().replace(/[^\d.-]/g, '');
            if (rawQty) {
                const parsed = parseFloat(rawQty);
                if (!isNaN(parsed) && parsed > 0) quantity = parsed;
            }
            amount = unitPrice * quantity;
            name = orig['ItemName'] || '';
            productCode = orig['MatchedProductCode'] || '';
            itemCode = orig['ItemCode'] || '';
        } else {
            const rawPrice = (orig['価格'] || '').toString().replace(/[^\d.-]/g, '');
            unitPrice = parseFloat(rawPrice) || 0;
            const rawQty = (orig['数量'] || '').toString().replace(/[^\d.-]/g, '');
            if (rawQty) {
                const parsed = parseFloat(rawQty);
                if (!isNaN(parsed) && parsed > 0) quantity = parsed;
            }
            amount = unitPrice * quantity;
            name = orig['シンボル名(normal_product_code)'] || '';
            productCode = orig['product_code(カラー変更）'] || '';
            itemCode = orig['品目CD'] || '';
            color = orig['カラー'] || '';
            rank = orig['張地ランク'] || '';
        }

        return {
            no: index + 1,
            name,
            productCode,
            itemCode,
            color,
            rank,
            unitPrice,
            quantity,
            amount
        };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    return { items, totalAmount };
}
