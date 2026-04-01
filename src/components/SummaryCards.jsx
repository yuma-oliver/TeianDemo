import React from 'react';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);

const DocumentIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
    </svg>
);

export default function SummaryCards({ summary }) {
    if (!summary) return null;

    return (
        <div className="summary-vertical-list">
            <div className="summary-list-item">
                <div className="summary-list-label">CSV総行数</div>
                <div className="summary-list-value">{summary.totalCsvRows}</div>
            </div>
            <div className="summary-list-item">
                <div className="summary-list-label" style={{ color: 'var(--primary)' }}>抽出対象 製品行</div>
                <div className="summary-list-value" style={{ color: 'var(--primary)' }}>{summary.productRows}</div>
            </div>
            
            <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
            
            <div className="summary-list-item">
                <div className="summary-list-label" style={{ color: 'var(--success)' }}>
                    <CheckIcon /> 一致製品
                </div>
                <div className="summary-list-value">{summary.matchedProducts}</div>
            </div>
            <div className="summary-list-item">
                <div className="summary-list-label" style={{ color: 'var(--error)' }}>
                    <XIcon /> 不一致製品
                </div>
                <div className="summary-list-value">{summary.unmatchedProducts}</div>
            </div>
            <div className="summary-list-item">
                <div className="summary-list-label" style={{ color: 'var(--ppt-color)' }}>
                    <DocumentIcon color="var(--ppt-color)" /> 一致PPT
                </div>
                <div className="summary-list-value">{summary.matchedPptCount}</div>
            </div>
            <div className="summary-list-item">
                <div className="summary-list-label" style={{ color: 'var(--pdf-color)' }}>
                    <DocumentIcon color="var(--pdf-color)" /> 一致PDF
                </div>
                <div className="summary-list-value">{summary.matchedPdfCount}</div>
            </div>
        </div>
    );
}
