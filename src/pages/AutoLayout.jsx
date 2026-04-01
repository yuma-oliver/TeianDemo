import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronDown, User, Bot, Check } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';
import './AutoLayout.css';
import '../index.css';

export default function AutoLayout() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProject, setTargetProject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      const updated = projects.filter(p => p.id !== deleteTargetId);
      setProjects(updated);
      localStorage.setItem('teian_projects', JSON.stringify(updated));
    }
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  useEffect(() => {
    const saved = localStorage.getItem('teian_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjects(parsed.slice(0, 10)); // とりあえず10件表示
      } catch (e) {}
    } else {
      setProjects([
        { id: '1', name: '株式会社デンソー勝山', date: '2025/11/17', version: '' },
        { id: '2', name: '株式会社デンソー勝山', date: '2025/11/17', version: '' },
      ]);
    }
  }, []);

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FAFAFA' }}>
          <div className="al-layout" style={{ flex: 1, overflowY: 'auto' }}>
            <main className="al-main" style={{ padding: '2rem 3rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 2rem 0' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>自動レイアウト管理</h1>
                  <p style={{ color: '#4B5563', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>ヒアリングフォームから作成した案件の自動レイアウト・ゾーニング作業を行います。</p>
                </div>
              </div>

        <div className="al-table-wrapper">
          <table className="al-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>案件名</th>
                <th style={{ width: '15%' }}>ステータス</th>
                <th style={{ width: '15%' }}>作成日</th>
                <th style={{ width: '15%' }}>更新日</th>
                <th style={{ width: '15%', textAlign: 'right' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => {
                // 日付から時刻を落としてYYYY/MM/DD形式にする（モック合わせ）
                const dateOnly = proj.date.split(' ')[0];
                return (
                  <tr key={proj.id || idx}>
                    <td className="al-project-name">{proj.name}</td>
                    <td>
                      <div className="al-status-wrapper">
                        <span className="al-badge-status">進行中</span>
                        <ChevronDown size={14} className="al-status-arrow" />
                      </div>
                    </td>
                    <td>{dateOnly}</td>
                    <td>{dateOnly}</td>
                    <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                      {proj.hasAutoLayout ? (
                        <button className="al-action-btn" onClick={() => navigate(`/auto-layout/${proj.id}`)}>
                          開く
                        </button>
                      ) : (
                        <button className="al-action-btn" style={{ background: '#ECFDF5', borderColor: '#A7F3D0', color: '#059669' }} onClick={() => { setTargetProject(proj); setIsModalOpen(true); }}>
                          新規作成
                        </button>
                      )}
                      <button className="al-btn-delete" onClick={() => { setDeleteTargetId(proj.id); setIsDeleteDialogOpen(true); }}>
                        <Trash2 size={16} strokeWidth={2} /> 削除
                      </button>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>案件がありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {projects.length > 0 && (
          <div className="al-pagination">
            <span>{projects.length}件中 1 - {projects.length} を表示</span>
            <div className="al-pagination-controls">
              <button className="al-page-btn">前へ</button>
              <span>1 / 1</span>
              <button className="al-page-btn">次へ</button>
            </div>
          </div>
        )}
            </main>
          </div>
        </main>
      </div>

      {/* モーダル表示部分 */}
      {isModalOpen && (
        <div className="al-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="al-modal-container" onClick={e => e.stopPropagation()}>
            <h2 className="al-modal-title">自動レイアウトに関する概要説明＆注意事項</h2>
            
            <div className="al-modal-desc-box">
              <span className="al-modal-subtitle">自動レイアウトシステムとは</span>
              <p className="al-modal-text">
                提案DXのアンケート結果からAIが自動で内容を把握し、<br/>
                CADデータ上に家具を配置し、製品の選定を自動で行い、レイアウト位置情報を書き出すシステム
              </p>
            </div>

            <div className="al-timeline">
              <div className="al-step">
                <div className="al-step-circle"></div>
                <div className="al-step-icon" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}><Bot size={24} color="#6B7280" /></div>
                <div className="al-step-ver">Ver 1.0<br/>2025/08</div>
                <p className="al-step-desc">AIによる自動レイアウト提案を最大の目標とし、最小限の入力データで出力可能にする。</p>
              </div>
              <div className="al-step">
                <div className="al-step-circle active"></div>
                <div className="al-step-icon" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}><Bot size={24} color="#10B981" /></div>
                <div className="al-step-ver">Ver 1.1<br/>2026/02</div>
                <p className="al-step-desc">家具のデータを全数対象とし、条件に合った家具が自動選択されるようにし、配置データと合わせて配置選定されたリストとして同時出力する。</p>
              </div>
              <div className="al-step">
                <div className="al-step-circle"></div>
                <div className="al-step-icon" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '0.5rem' }}><Bot size={24} color="#6B7280" /></div>
                <div className="al-step-ver">Ver 1.2<br/>2026/08</div>
                <p className="al-step-desc">自動ゾーニング作業をAIが自動で行うようにする。</p>
              </div>
            </div>

            <div className="al-notice-box">
              <div className="al-notice-title">操作前に、下記をご用意ください</div>
              <div className="al-notice-list" style={{ textAlign: 'center' }}>
                ① CADデータ (DXF) 不要線等整理済<br/>
                ② 提案DXアンケート結果CSVデータ
              </div>
              <div className="al-notice-example" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '2px' }}>例</div>
                <ul>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}><Check size={14} /> レイヤーの整理</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}><Check size={14} /> 不必要な文字や寸法線の削除</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={14} /> ゾーニングスペースの線や文字の削除</li>
                </ul>
              </div>
            </div>

            <button className="al-btn-submit" onClick={() => { 
                // 作成処理モック。現在のプロジェクトに hasAutoLayout フラグを立てて保存
                if(targetProject) {
                   const updated = projects.map(p => p.id === targetProject.id ? { ...p, hasAutoLayout: true } : p);
                   setProjects(updated);
                   localStorage.setItem('teian_projects', JSON.stringify(updated));
                   navigate(`/auto-layout/${targetProject.id}`);
                }
                setIsModalOpen(false); 
            }}>
              新規レイアウト作成
            </button>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {isDeleteDialogOpen && (
        <div className="al-modal-overlay">
          <div className="al-modal-container" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111827', fontWeight: 700 }}>本当に削除しますか？</h3>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              この操作は取り消せません。<br/>対象案件に関するすべての情報が削除されます。
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="al-action-btn" 
                onClick={() => setIsDeleteDialogOpen(false)} 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
              >
                キャンセル
              </button>
              <button 
                className="al-btn-delete" 
                onClick={confirmDelete} 
                style={{ flex: 1, padding: '0.75rem', background: '#EF4444', color: 'white', border: 'none', fontSize: '0.9rem', justifyContent: 'center', margin: 0 }}
                onMouseOver={e => e.currentTarget.style.background = '#DC2626'}
                onMouseOut={e => e.currentTarget.style.background = '#EF4444'}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
