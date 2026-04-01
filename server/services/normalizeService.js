export function normalizeString(str) {
    if (!str) return '';
    let s = str.toString();
    // Remove "【製品情報】"
    s = s.replace(/【製品情報】/g, '');
    // Remove Extensions
    s = s.replace(/\.pptx$/i, '');
    s = s.replace(/\.ppt$/i, '');
    s = s.replace(/\.pdf$/i, '');
    // Remove spaces (half/full)
    s = s.replace(/[\s　]+/g, '');
    // Uppercase
    s = s.toUpperCase();
    return s.trim();
}

export function extractBaseCode(str) {
    if (!str) return '';
    let s = str.toString().replace(/【製品情報】/g, '').replace(/[\s　]+/g, '').toUpperCase();
    
    // Sometimes format is S・CU-A160・AC
    // Split by common separators to find base code parts
    const parts = s.split(/[・_]/);
    
    if (parts.length >= 2) {
        // Base is usually part 0 concatenated with part 1
        return `${parts[0]}${parts[1]}`;
    }
    
    return s; // If no separator, assume the string itself
}

export function createCompareString(str) {
    if (!str) return '';
    let s = normalizeString(str);
    // Remove specific marks
    s = s.replace(/[・_ \-]/g, '');
    return s;
}
