import React from 'react';
import SummaryCards from '../SummaryCards';
import { Info, CheckCircle, Clock } from 'lucide-react';

export default function RightSidebar({ activeProject, result, merging, mergingPptx, onMergePdf, onMergePptx, onOpenFolder }) {
    if (!activeProject && !result) return (
        <aside className="right-sidebar empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-focus)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>案件情報・プレビュー</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem', textAlign: 'center' }}>
                カードをクリックすると、<br/>ここに案件の詳細情報が表示されます。
            </div>
        </aside>
    );

    return (
        <aside className="right-sidebar" style={{ overflowY: 'auto', padding: '1.5rem' }}>
            {activeProject && (
                <div style={{ marginBottom: result ? '2.5rem' : '0' }}>
                    <div className="right-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <Info size={16} /> 案件インフォメーション
                    </div>
                    
                    <div style={{ background: 'var(--bg-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '1rem', lineHeight: 1.4 }}>
                            {activeProject.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            <Clock size={14} /> 作成日時: {activeProject.date}
                        </div>
                        {activeProject.s3Key ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                                <CheckCircle size={14} /> 見積データ連携済み
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                                <div style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderRadius: '50%' }}></div> 見積データ未連携
                            </div>
                        )}
                    </div>

                    <div className="right-section-title" style={{ fontSize: '0.85rem' }}>ヒアリング回答内容</div>
                    <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>必要スペース</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', maxWidth: '60%' }}>{activeProject.answers?.space || '未回答'}</span>
                        </div>
                        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>床面積</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeProject.answers?.floorSpace ? `${activeProject.answers.floorSpace} 坪` : '未回答'}</span>
                        </div>
                        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>想定社員数</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeProject.answers?.employees ? `${activeProject.answers.employees} 名` : '未回答'}</span>
                        </div>
                        <div style={{ padding: '0.8rem 1rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>デスクサイズ</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right' }}>
                                {activeProject.answers?.deskWidth && activeProject.answers?.deskDepth 
                                    ? `${activeProject.answers.deskWidth} × ${activeProject.answers.deskDepth} mm` 
                                    : '未回答'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {result && (
                <div>
                    <div className="right-section-title" style={{ fontSize: '0.85rem' }}>抽出プロパティ</div>
                    
                    <div className="property-group">
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            抽出先ディレクトリ
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                            {result.outputPath}
                        </div>
                        
                        <div className="property-actions">
                            <button className="btn btn-secondary w-full" onClick={onOpenFolder} style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}>
                                フォルダを開く
                            </button>
                            <button className="btn btn-primary w-full" onClick={onMergePptx} disabled={mergingPptx || merging} style={{ marginTop: '1rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #D97706, #B45309)' }}>
                                {mergingPptx ? '結合中...' : '抽出された全PPTを結合'}
                            </button>
                            <button className="btn btn-primary w-full" onClick={onMergePdf} disabled={merging || mergingPptx} style={{ marginTop: '0.5rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #DC2626, #991B1B)' }}>
                                {merging ? '結合中...' : '抽出された全PDFを結合'}
                            </button>
                        </div>
                    </div>

                    <div className="right-section-title" style={{ marginTop: '2.5rem', fontSize: '0.85rem' }}>抽出統計</div>
                    <SummaryCards summary={result.summary} />
                </div>
            )}
        </aside>
    );
}
