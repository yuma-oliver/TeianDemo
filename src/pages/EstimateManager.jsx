import React, { useState, useEffect } from 'react';
import { Database, FileText, CheckCircle, Search } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';

export default function EstimateManager() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('teian_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // CSV（s3Key）を持っている案件のみフィルタ、または全件表示して持っているものを強調
        setProjects(parsed);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        <main className="main-content" style={{ padding: '2rem 3rem', background: '#FAFAFA', overflowY: 'auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={24} color="#73A07A" />
              見積資料・CSV連携管理
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              各案件に紐づくアップロード済みのアンケート結果や見積CSVデータを一元管理します。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {projects.filter(p => p.s3Key).length === 0 && (
              <div style={{ padding: '3rem', background: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280' }}>
                アップロード済みのCSVデータ（見積連携済み）の案件はありません。
              </div>
            )}
            {projects.filter(p => p.s3Key).map(project => (
              <div key={project.id} style={{ background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#1E293B', lineHeight: 1.4 }}>{project.name}</h3>
                  <span style={{ background: '#ECFDF5', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={12} /> 連携済
                  </span>
                </div>
                
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.5rem' }}>
                  作成日時: {project.date || '未定'} / バージョン1
                </div>

                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '6px', border: '1px solid #E2E8F0', flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '0.5rem' }}>登録中ファイル一覧</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
                    <FileText size={16} color="#3B82F6" />
                    <span style={{ fontSize: '0.8rem', color: '#334155', display: 'inline-block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.s3Key.split('/').pop() || project.s3Key}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                   <button style={{ flex: 1, padding: '0.5rem', background: 'white', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                     データ更新
                   </button>
                   <button style={{ flex: 1, padding: '0.5rem', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                     詳細を確認
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#374151' }}>未連携の案件（参考）</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {projects.filter(p => !p.s3Key).slice(0, 3).map(project => (
                <div key={project.id} style={{ background: '#FFFFFF', borderRadius: '6px', border: '1px dashed #CBD5E1', padding: '1rem' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>{project.name}</div>
                   <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>作成: {project.date}</div>
                   <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#EF4444' }}>データ未登録</div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
