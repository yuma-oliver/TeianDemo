import React, { useState, useMemo } from 'react';

const EstimatePreviewDialog = ({ data, fileName, onClose }) => {
    if (!data) return null;

    const totalQuantity = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalItems = data.items.length;

    // 検索フィルタ用 state
    const [searchTerm, setSearchTerm] = useState('');
    
    // 検索フィルタ処理
    const filteredItems = useMemo(() => {
        if (!searchTerm) return data.items;
        const lower = searchTerm.toLowerCase();
        return data.items.filter(item => 
            (item.name || '').toLowerCase().includes(lower) ||
            (item.productCode || '').toLowerCase().includes(lower) ||
            (item.itemCode || '').toLowerCase().includes(lower)
        );
    }, [data.items, searchTerm]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            padding: '2rem', backdropFilter: 'blur(4px)'
        }}>
            <style>{`
                .estimate-table th {
                    position: sticky;
                    top: 0;
                    background: var(--bg-main, #ffffff);
                    z-index: 10;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-muted, #64748b);
                    border-bottom: 2px solid var(--border-color, #e2e8f0);
                    white-space: nowrap;
                }
                .estimate-table td {
                    padding: 0.875rem 1rem;
                    font-size: 0.875rem;
                    border-bottom: 1px solid var(--border-color, #e2e8f0);
                    color: var(--text-main, #1e293b);
                    vertical-align: middle;
                }
                .estimate-table tbody tr {
                    background: transparent;
                    transition: background-color 0.15s ease;
                }
                .estimate-table tbody tr:nth-child(even) {
                    background: rgba(241, 245, 249, 0.4);
                }
                .estimate-table tbody tr:hover {
                    background: rgba(226, 232, 240, 0.6);
                }
                .estimate-table-container::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .estimate-table-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .estimate-table-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .estimate-table-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .summary-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    padding: 1rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .summary-card.highlight {
                    background: #fff1f2;
                    border-color: #fecdd3;
                }
            `}</style>

            <div style={{
                background: '#ffffff', borderRadius: '1rem', 
                width: '100%', maxWidth: '1200px', height: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e21f26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            見積プレビュー
                        </h2>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                            CSVファイル「<span style={{color:'#334155', fontWeight:500}}>{fileName}</span>」から生成した見積内容を確認できます。
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem', borderRadius: '0.375rem', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                {/* Summary & Toolbar */}
                <div style={{ padding: '1.5rem 2rem 1rem 2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                        <div className="summary-card" style={{ flex: '1', maxWidth: '180px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>明細件数</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{totalItems}<span style={{fontSize:'1rem', fontWeight:500, color:'#64748b', marginLeft:'2px'}}>件</span></div>
                        </div>
                        <div className="summary-card" style={{ flex: '1', maxWidth: '180px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>合計数量</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{totalQuantity}</div>
                        </div>
                        <div className="summary-card highlight" style={{ flex: '1', maxWidth: '300px', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#be123c' }}>合計金額 (税抜)</span>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#e11d48', letterSpacing: '-0.025em' }}>
                                <span style={{fontSize:'1.25rem', marginRight:'4px'}}>¥</span>{data.totalAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Search box implementation */}
                    <div style={{ position: 'relative', width: '260px' }}>
                        <svg style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input 
                            type="text" 
                            placeholder="品番・品名で絞り込み..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', 
                                border: '1px solid #cbd5e1', borderRadius: '2rem', 
                                fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s'
                            }}
                            onFocus={e=>e.target.style.borderColor='#94a3b8'}
                            onBlur={e=>e.target.style.borderColor='#cbd5e1'}
                        />
                    </div>
                </div>

                {/* Table Area */}
                <div className="estimate-table-container" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
                    <table className="estimate-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                                <th style={{ minWidth: '200px' }}>製品名</th>
                                <th style={{ width: '180px' }}>品番</th>
                                <th style={{ width: '140px' }}>品目CD</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>カラー</th>
                                <th style={{ width: '80px', textAlign: 'center' }}>ランク</th>
                                <th style={{ width: '110px', textAlign: 'right' }}>単価</th>
                                <th style={{ width: '80px', textAlign: 'right' }}>数量</th>
                                <th style={{ width: '130px', textAlign: 'right', paddingRight: '2rem' }}>金額</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, i) => {
                                const isZero = item.amount === 0;
                                return (
                                    <tr key={i} style={{ opacity: isZero ? 0.6 : 1 }}>
                                        <td style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>{item.no}</td>
                                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                                        <td style={{ fontFamily: 'monospace', color: '#475569' }}>{item.productCode}</td>
                                        <td style={{ fontFamily: 'monospace', color: '#475569' }}>{item.itemCode}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                                                {item.color || '-'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.rank || '-'}</td>
                                        <td style={{ textAlign: 'right', color: '#475569' }}>
                                            {item.unitPrice ? `￥${item.unitPrice.toLocaleString()}` : '-'}
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 500 }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', paddingRight: '2rem', fontWeight: 700, color: isZero ? '#94a3b8' : '#0f172a' }}>
                                            ￥{item.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
                                        {data.items.length > 0 ? '検索条件に一致する項目がありません。' : '見積対象データがありません。'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{ 
                    padding: '1.25rem 2rem', 
                    borderTop: '1px solid #e2e8f0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: '#f8fafc' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                        内容を確認の上、問題なければダイアログを閉じて抽出処理へ進んでください。
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => {
                                navigator.clipboard.writeText(data.items.map(i => `${i.name}\t${i.quantity}\t${i.amount}`).join('\n'))
                                    .then(() => alert('簡易データをクリップボードにコピーしました'));
                            }}
                            style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', cursor: 'pointer', fontWeight: 500 }}
                        >
                            <svg style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            見積をコピー
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={onClose}
                            style={{ padding: '0.625rem 2rem', borderRadius: '0.5rem', background: '#0f172a', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        >
                            確認して閉じる
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstimatePreviewDialog;
