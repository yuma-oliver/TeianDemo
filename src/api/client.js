const API_BASE = 'http://localhost:3001/api';

export async function fetchConfig() {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
}

export async function fetchS3CsvList() {
    const res = await fetch(`${API_BASE}/s3/csv-list`);
    if (!res.ok) throw new Error('Failed to fetch CSV list from S3');
    return res.json();
}

export async function extractFiles(s3CsvKey, referenceFolder) {
    const formData = new FormData();
    formData.append('s3CsvKey', s3CsvKey);
    // referenceFolder is unused in backend but we keep appending it to avoid breaking changes if not needed
    formData.append('referenceFolder', referenceFolder || 'S3: refarence（仮）/');

    const res = await fetch(`${API_BASE}/extract`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Extraction failed');
    }
    return res.json();
}

export async function mergePdf(outputPath) {
    const res = await fetch(`${API_BASE}/merge-pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ outputPath })
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'PDF Merge failed');
    }
    return res.json();
}

export async function mergePptx(outputPath) {
    const res = await fetch(`${API_BASE}/merge-pptx`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ outputPath })
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'PPTX Merge failed');
    }
    return res.json();
}

export async function selectFolder() {
    const res = await fetch(`${API_BASE}/select-folder`);
    if (!res.ok) {
        throw new Error('Failed to open folder dialog');
    }
    return res.json();
}

export async function openPath(targetPath) {
    const res = await fetch(`${API_BASE}/open-path`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetPath })
    });
    if (!res.ok) {
        throw new Error('Failed to open path');
    }
    return res.json();
}

export async function getEstimatePreview(s3CsvKey) {
    const formData = new FormData();
    formData.append('s3CsvKey', s3CsvKey);

    const res = await fetch(`${API_BASE}/estimate-preview`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Estimate Preview failed');
    }
    return res.json();
}
