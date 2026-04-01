import React, { useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import MatchedFilesTable from '../components/MatchedFilesTable';
import UnmatchedTable from '../components/UnmatchedTable';
import DuplicateTable from '../components/DuplicateTable';
import MergeResultCard from '../components/MergeResultCard';
import EstimatePreviewDialog from '../components/EstimatePreviewDialog';
import { getEstimatePreview } from '../api/client';

export default function Home({ config, loading, result, mergeResult, errorMsg, onExtract }) {
    const [estimateData, setEstimateData] = useState(null);
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleShowEstimate = async (s3CsvKey) => {
        setEstimateLoading(true);
        try {
            const data = await getEstimatePreview(s3CsvKey);
            setEstimateData(data);
            setFileName(s3CsvKey);
        } catch (err) {
            alert(err.message);
        } finally {
            setEstimateLoading(false);
        }
    };

    const handleCloseEstimate = () => {
        setEstimateData(null);
    };

    console.log("Home render", { onExtract });
    return (
        <div>
            <header className="page-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ fontSize: '1.75rem' }}>製品資料 自動抽出エンジン</h1>
                <p className="page-subtitle" style={{ fontSize: '0.875rem' }}>S3上のプロジェクト要件CSVとS3上の参照元を紐付け、対象ドキュメントを抽出します。</p>
            </header>

            {errorMsg && (
                <div style={{ padding: '1rem', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{errorMsg}</span>
                </div>
            )}

            <UploadPanel 
                defaultRefFolder={config?.defaultReferenceFolder || ''} 
                onExtract={onExtract}
                loading={loading}
                onShowEstimate={handleShowEstimate}
                estimateLoading={estimateLoading}
            />

            <EstimatePreviewDialog 
                data={estimateData} 
                fileName={fileName} 
                onClose={handleCloseEstimate} 
            />

            {(mergeResult?.pdf || mergeResult?.pptx) && (
                <MergeResultCard mergeResult={mergeResult} />
            )}

            {result && (
                <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                        照合結果テーブル
                    </h3>
                    <DuplicateTable items={result.duplicateCandidates} />
                    <MatchedFilesTable items={result.matchedProducts} />
                    <UnmatchedTable items={result.unmatchedProducts} />
                </div>
            )}
        </div>
    );
}
