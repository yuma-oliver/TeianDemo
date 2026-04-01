import React, { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';

export default function GeneralSettings() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        <main className="main-content" style={{ padding: '2rem 3rem', background: '#FAFAFA', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={24} color="#73A07A" />
              一般設定
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              システムの基本情報や各動作のデフォルト設定を変更します。
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '2rem', maxWidth: '800px' }}>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>基本情報の確認・編集</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 30%) 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>組織名・会社名</label>
                <input type="text" defaultValue="オリバー株式会社 (Oliver Inc.)" style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', width: '100%', fontSize: '0.9rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 30%) 1fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginTop: '0.5rem' }}>システムの言語</label>
                <select style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', width: '100%', maxWidth: '300px', fontSize: '0.9rem' }}>
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>提案書（PowerPoint）設定</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 30%) 1fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginTop: '0.5rem' }}>デフォルト表紙デザイン</label>
                <div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ border: '2px solid #73A07A', borderRadius: '4px', padding: '0.5rem', width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#1E293B', fontWeight: 700, background: '#F8FAFC' }}>
                      モダン（標準）<CheckCircle size={16} color="#10B981" style={{ position: 'absolute', transform: 'translate(50px, -30px)' }} />
                    </div>
                    <div style={{ border: '1px solid #CBD5E1', borderRadius: '4px', padding: '0.5rem', width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748B', background: '#F1F5F9', cursor: 'pointer' }}>
                      クラシック
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>出力時に上書き変更が可能です。</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 30%) 1fr', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>デフォルト出力フォルダ</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <input type="text" readOnly defaultValue="S3: default_proposals/" style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', width: '100%', fontSize: '0.9rem', background: '#F8FAFC', color: '#64748B' }} />
                   <button style={{ padding: '0 1rem', background: 'white', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>変更</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
              {isSaved && <span style={{ color: '#059669', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={16} /> 保存しました</span>}
              <button onClick={handleSave} style={{ background: '#73A07A', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
                <Save size={18} /> 設定を保存する
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
