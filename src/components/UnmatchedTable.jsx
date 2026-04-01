import React from 'react';

export default function UnmatchedTable({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="card" style={{ borderColor: 'var(--error-bg)', backgroundColor: 'var(--surface)' }}>
            <h2 className="card-title" style={{ color: 'var(--error)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                不一致製品一覧 (ファイルが見つからなかった製品)
            </h2>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>CSV製品(シンボル名 / 品名)</th>
                            <th style={{ width: '30%' }}>関連コード</th>
                            <th style={{ width: '30%' }}>品目CD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((prod, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{prod.displayName || '-'}</div>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        {prod.productCodes && prod.productCodes.length > 0 ? prod.productCodes.join(' / ') : '-'}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{prod.itemCode || '-'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
