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

export default function DuplicateTable({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="card" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--warning-bg)' }}>
            <h2 className="card-title" style={{ color: 'var(--warning)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <line x1="12" x2="12" y1="9" y2="13"/>
                    <line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
                重複候補一覧 (複数ファイルがヒットした製品)
            </h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: '#B45309', fontWeight: 500 }}>
                同じ製品に対して複数のファイル候補が抽出されました。結果からどちらを採用するか目視で確認してください。
            </p>
            <div className="table-wrapper">
                <table style={{ backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>CSV製品(シンボル名 / 品名)</th>
                            <th style={{ width: '35%' }}>抽出された複数 PPT</th>
                            <th style={{ width: '35%' }}>抽出された複数 PDF</th>
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
                                    {item.ppts.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                            <span className="badge badge-ppt"><FileIcon /> PPT</span> 
                                            <span style={{ opacity: 0.9 }}>{p.name}</span>
                                        </div>
                                    ))}
                                    {item.ppts.length === 0 && <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>-</span>}
                                </td>
                                <td>
                                    {item.pdfs.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                            <span className="badge badge-pdf"><FileIcon /> PDF</span> 
                                            <span style={{ opacity: 0.9 }}>{p.name}</span>
                                        </div>
                                    ))}
                                    {item.pdfs.length === 0 && <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
