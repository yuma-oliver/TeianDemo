import React from 'react';
import SummaryCards from '../SummaryCards';

export default function RightSidebar({ result, merging, mergingPptx, onMergePdf, onMergePptx, onOpenFolder }) {
    if (!result) return (
        <aside className="right-sidebar empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-focus)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>抽出結果プレビュー</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem', textAlign: 'center' }}>
                アップロードと抽出を開始すると、<br/>ここに結果のプロパティと実行アクションが表示されます。
            </div>
        </aside>
    );

    return (
        <aside className="right-sidebar">
            <div className="right-section-title">抽出プロパティ</div>
            
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
                        {mergingPptx ? '結合中...' : '抽出された全PPTを 1つに結合'}
                    </button>
                    <button className="btn btn-primary w-full" onClick={onMergePdf} disabled={merging || mergingPptx} style={{ marginTop: '0.5rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #DC2626, #991B1B)' }}>
                        {merging ? '結合中...' : '抽出された全PDFを 1つに結合'}
                    </button>
                </div>
            </div>

            <div className="right-section-title" style={{ marginTop: '2rem' }}>抽出統計</div>
            <SummaryCards summary={result.summary} />
        </aside>
    );
}
