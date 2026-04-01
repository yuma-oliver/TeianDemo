import React from 'react';

const FileIcon = ({ type }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
    )
}

export default function MatchedFilesTable({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="card">
            <h2 className="card-title" style={{ color: 'var(--success)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                一致ファイル一覧
            </h2>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>CSV製品(シンボル名 / 品名)</th>
                            <th style={{ width: '15%' }}>品目CD</th>
                            <th style={{ width: '30%' }}>抽出された PPT</th>
                            <th style={{ width: '30%' }}>抽出された PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.product.displayName || '-'}</div>
                                    {item.product.productCodes && item.product.productCodes.length > 0 && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {item.product.productCodes.join(' / ')}
                                        </div>
                                    )}
                                </td>
                                <td>
                                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                                    {item.product.itemCode || '-'}
                                  </span>
                                </td>
                                <td>
                                    {item.ppts.length > 0 ? item.ppts.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                            <span className="badge badge-ppt"><FileIcon /> PPT</span> 
                                            <span style={{ opacity: 0.9 }}>{p.name}</span>
                                        </div>
                                    )) : <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>-</span>}
                                </td>
                                <td>
                                    {item.pdfs.length > 0 ? item.pdfs.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                            <span className="badge badge-pdf"><FileIcon /> PDF</span> 
                                            <span style={{ opacity: 0.9 }}>{p.name}</span>
                                        </div>
                                    )) : <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
