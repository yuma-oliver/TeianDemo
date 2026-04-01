import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchedFilesTable from '../components/MatchedFilesTable';
import UnmatchedTable from '../components/UnmatchedTable';
import DuplicateTable from '../components/DuplicateTable';
import MergeResultCard from '../components/MergeResultCard';
import EstimatePreviewDialog from '../components/EstimatePreviewDialog';
import { getEstimatePreview, fetchS3CsvList } from '../api/client';
import { ChevronRight, Cloud, FileText, Zap, Search, Plus, ArrowRight, Trash2, ExternalLink, LayoutTemplate } from 'lucide-react';
import './Dashboard.css';

// ダミーのプロジェクトリスト
const initialProjects = [
  { id: 1, name: "株式会社○○様 オフィス・食堂ご提案", date: "2025/11/13 16:12", version: "バージョン1", s3Key: "" },
  { id: 2, name: "豊田合成美和技術センタースレッド様", date: "2025/11/13 09:46", version: "バージョン1", s3Key: "" },
  { id: 3, name: "丸栄宮崎株式会社_MTV技術工場棟", date: "2025/11/13 09:28", version: "バージョン1", s3Key: "" },
  { id: 4, name: "豊田自動織機大府工場多目的共創スペース", date: "2025/11/10 15:42", version: "バージョン1", s3Key: "" },
  { id: 5, name: "USJMBS内事務所改装", date: "2025/11/10 15:23", version: "バージョン1", s3Key: "" },
  { id: 6, name: "ヘソホールディングスオフィス", date: "2025/11/10 14:39", version: "バージョン1", s3Key: "" },
];

export default function Home({ config, loading, result, mergeResult, errorMsg, onExtract, onSelectProject }) {
    const navigate = useNavigate();
    
    // プロジェクトリストの初期化（localStorageから）
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('teian_projects');
        if (saved) {
            try { return JSON.parse(saved); } catch(e){}
        }
        return initialProjects;
    });

    // プロジェクトが変更されたらlocalStorageに保存
    useEffect(() => {
        localStorage.setItem('teian_projects', JSON.stringify(projects));
    }, [projects]);

    const [estimateData, setEstimateData] = useState(null);
    const [estimateLoading, setEstimateLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    
    // CSVモーダル用の状態
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [csvList, setCsvList] = useState([]);
    const [csvLoading, setCsvLoading] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState(null);

    // 新規作成ウィザード用の状態
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    // 削除確認ダイアログ用の状態
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const fixedRefFolder = config?.defaultReferenceFolder || 'S3: refarence（仮）/';

    const handleOpenProject = (project) => {
        navigate('/questionnaire', { state: { projectId: project.id, projectName: project.name } });
    };

    const handleDeleteClick = (projectId) => {
        setDeleteTargetId(projectId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteTargetId !== null) {
            setProjects(prev => prev.filter(p => p.id !== deleteTargetId));
        }
        setIsDeleteDialogOpen(false);
        setDeleteTargetId(null);
    };

    const handleShowEstimate = async (project) => {
        if (!project.s3Key) {
            alert('先に「S3からCSVを選択」してください。');
            return;
        }
        setEstimateLoading(true);
        try {
            const data = await getEstimatePreview(project.s3Key);
            setEstimateData(data);
            setFileName(project.s3Key);
        } catch (err) {
            alert(err.message);
        } finally {
            setEstimateLoading(false);
        }
    };

    const handleExtractRow = (project) => {
        if (!project.s3Key) {
            alert('先に「S3からCSVを選択」してください。');
            return;
        }
        onExtract(project.s3Key, fixedRefFolder);
    };

    const loadCsvList = async () => {
        setCsvLoading(true);
        try {
            const data = await fetchS3CsvList();
            if (data.success) {
                setCsvList(data.files || []);
            }
        } catch (err) {
            alert('S3からのCSV一覧取得に失敗しました: ' + err.message);
        } finally {
            setCsvLoading(false);
        }
    };

    const openCsvModal = (projectId) => {
        setActiveProjectId(projectId);
        setIsCsvModalOpen(true);
        if (csvList.length === 0) {
            loadCsvList();
        }
    };

    const closeCsvModal = () => {
        setIsCsvModalOpen(false);
        setActiveProjectId(null);
    };

    const selectCsvForProject = (file) => {
        if (activeProjectId) {
            setProjects(prev => prev.map(p => 
                p.id === activeProjectId ? { ...p, s3Key: file.key } : p
            ));
        }
        closeCsvModal();
    };

    return (
        <div className="home-container">
            {/* 上部コントロールパネル */}
            <div className="dashboard-header">
                <div className="dashboard-controls-left">
                    <div className="control-group">
                        <span className="control-label">案件名</span>
                        <div className="input-wrapper">
                            <Search className="input-icon" size={16} />
                            <input type="text" className="input-field search with-icon" placeholder="株式会社○○様 オフィス・食堂ご提案" />
                        </div>
                    </div>
                    <div className="control-group">
                        <span className="control-label">営業所</span>
                        <div className="input-wrapper">
                            <select className="input-field select">
                                <option>テスト用</option>
                                <option>本社営業部</option>
                                <option>関西支社</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="dashboard-controls-right">
                    <button className="btn btn-primary" onClick={() => { setIsCreateModalOpen(true); setCreateStep(1); setAgreed(false); }}>
                        新規作成 <Plus size={16} />
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', background: '#FEF2F2', color: '#EF4444', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500, border: '1px solid #FECACA' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* プロジェクトグリッド */}
            <div className="project-grid">
                {projects.map(project => (
                    <div 
                        className="project-card" 
                        key={project.id} 
                        onClick={() => onSelectProject && onSelectProject(project)}
                        style={{ cursor: 'pointer', transition: 'border-color 0.2s', border: '1px solid #E2E8F0' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#73A07A'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                    >
                        <h3 className="project-name">{project.name}</h3>
                        <p className="project-meta">作成日時: {project.date}</p>
                        
                        <div className="project-version">
                            <span className="version-label">提案書</span>
                            <a href="#" className="version-link">{project.version}</a>
                            <span className="version-date">{project.date} 作成</span>
                        </div>

                        {/* 開く・レイアウト・削除ボタン */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                            <button 
                                className="btn" 
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem', fontSize: '0.75rem', background: 'white', border: '1px solid #CBD5E1', color: '#334155', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                onClick={(e) => { e.stopPropagation(); handleOpenProject(project); }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <ExternalLink size={14} /> 開く
                            </button>
                            <button 
                                className="btn" 
                                style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem', fontSize: '0.75rem', background: project.isAnswered ? '#10B981' : '#F1F5F9', border: '1px solid', borderColor: project.isAnswered ? '#10B981' : '#E2E8F0', color: project.isAnswered ? 'white' : '#94A3B8', borderRadius: '6px', cursor: project.isAnswered ? 'pointer' : 'not-allowed', fontWeight: 600, transition: 'all 0.2s' }}
                                onClick={(e) => { e.stopPropagation(); if(project.isAnswered) navigate(`/auto-layout/${project.id}`); }}
                                onMouseOver={(e) => { if(project.isAnswered) e.currentTarget.style.background = '#059669' }}
                                onMouseOut={(e) => { if(project.isAnswered) e.currentTarget.style.background = '#10B981' }}
                                disabled={!project.isAnswered}
                            >
                                <LayoutTemplate size={14} /> レイアウト
                            </button>
                            <button 
                                className="btn" 
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem', fontSize: '0.75rem', color: '#EF4444', border: '1px solid #FCA5A5', background: '#FEF2F2', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(project.id); }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#FEF2F2'}
                            >
                                <Trash2 size={14} /> 削除
                            </button>
                        </div>

                        {/* カード内ボタン */}
                        <div className="project-actions">
                            {project.s3Key ? (
                                <div className="selected-csv-info">
                                    <Cloud size={14} />
                                    <span>選択済: {project.s3Key.split('/').pop()}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); openCsvModal(project.id); }} 
                                        style={{background:'none', border:'none', color:'#10B981', textDecoration:'underline', cursor:'pointer', fontSize:'0.75rem', marginLeft:'auto'}}
                                    >変更</button>
                                </div>
                            ) : (
                                <button className="btn btn-secondary w-full" onClick={(e) => { e.stopPropagation(); openCsvModal(project.id); }}>
                                    <Cloud size={16}/> S3からCSVを選択
                                </button>
                            )}

                            <div className="action-row">
                                <button 
                                    className="btn btn-secondary btn-sm" 
                                    onClick={(e) => { e.stopPropagation(); handleShowEstimate(project); }}
                                    disabled={!project.s3Key || estimateLoading}
                                >
                                    <FileText size={16}/> 見積リスト表示
                                </button>
                                <button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={(e) => { e.stopPropagation(); handleExtractRow(project); }}
                                    disabled={!project.s3Key || loading}
                                >
                                    {loading ? '抽出中...' : <><Zap size={16}/> 抽出を開始する</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <EstimatePreviewDialog 
                data={estimateData} 
                fileName={fileName} 
                onClose={() => setEstimateData(null)} 
            />

            {(mergeResult?.pdf || mergeResult?.pptx) && (
                <MergeResultCard mergeResult={mergeResult} />
            )}

            {result && (
                <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>
                        <Zap size={20} color="#2563EB" />
                        照合結果および抽出ファイル一覧
                    </h3>
                    <DuplicateTable items={result.duplicateCandidates} />
                    <MatchedFilesTable items={result.matchedProducts} />
                    <UnmatchedTable items={result.unmatchedProducts} />
                </div>
            )}

            {/* CSV選択モーダル (UploadPanelのUIを流用してリッチ化) */}
            {isCsvModalOpen && (
                <div className="modal-overlay">
                    <div className="csv-modal">
                        <div className="csv-modal-header">
                            <h3 className="csv-modal-title">S3上のCSVファイルを選択</h3>
                            <button onClick={closeCsvModal} style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#94A3B8'}}>&times;</button>
                        </div>
                        
                        <div className="csv-list-container">
                        {csvLoading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>読み込み中...</div>
                        ) : csvList.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>CSVファイルが見つかりません。</div>
                        ) : (
                            csvList.map(item => (
                                <button key={item.key} className="csv-list-item" onClick={() => selectCsvForProject(item)}>
                                    <span className="csv-item-name">{item.filename}</span>
                                    <span className="csv-item-meta">
                                        パス: {item.key} | サイズ: {(item.size / 1024).toFixed(1)} KB | 更新: {new Date(item.lastModified).toLocaleString()}
                                    </span>
                                </button>
                            ))
                        )}
                        </div>

                        <div className="csv-modal-footer">
                            <button className="btn btn-secondary" onClick={loadCsvList} disabled={csvLoading}>データを更新</button>
                            <button className="btn btn-primary" onClick={closeCsvModal}>閉じる</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 新規作成ウィザード用のダイアログ */}
            {isCreateModalOpen && (
                <div className="modal-overlay">
                    <div className="csv-modal" style={{ maxWidth: '500px' }}>
                        <div className="csv-modal-header">
                            <h3 className="csv-modal-title">
                                {createStep === 1 ? '案件情報の入力' : 'プライバシーポリシーへの同意'}
                            </h3>
                            <button onClick={() => setIsCreateModalOpen(false)} style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#94A3B8'}}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '1rem 0' }}>
                            {createStep === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>案件名</label>
                                        <input 
                                            type="text" 
                                            className="input-field" 
                                            placeholder="○○様 オフィス移転プロジェクト" 
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>営業所</label>
                                        <select className="input-field">
                                            <option>テスト用</option>
                                            <option>本社</option>
                                        </select>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>案件作成後、提案に必要な項目を質問形式で入力いただきます。</p>
                                </div>
                            )}

                            {createStep === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: '#F8FAFC', padding: '1rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', height: '150px', overflowY: 'auto' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0' }}>プライバシーポリシー</h4>
                                        <p style={{ margin: '0 0 0.5rem 0' }}>当社の提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。</p>
                                        <p style={{ margin: 0 }}>第1条（個人情報）<br/>「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし...</p>
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                        <span>プライバシーポリシーに同意する</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="csv-modal-footer">
                            {createStep === 1 && (
                                <>
                                    <button className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>キャンセル</button>
                                    <button className="btn btn-primary" disabled={!newProjectName} onClick={() => setCreateStep(2)}>次へ <ArrowRight size={16} /></button>
                                </>
                            )}
                            {createStep === 2 && (
                                <>
                                    <button className="btn btn-secondary" onClick={() => setCreateStep(1)}>戻る</button>
                                    <button className="btn btn-primary" disabled={!agreed} onClick={() => { setIsCreateModalOpen(false); navigate('/questionnaire', { state: { projectName: newProjectName } }); }}>
                                        質問ページへ進む <ArrowRight size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 削除確認ダイアログ */}
            {isDeleteDialogOpen && (
                <div className="modal-overlay">
                    <div className="csv-modal" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#111827', fontWeight: 700 }}>本当に削除しますか？</h3>
                        <p style={{ color: '#4B5563', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                            この操作は取り消せません。<br/>対象案件に関するすべての情報が削除されます。
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button 
                                className="btn" 
                                onClick={() => setIsDeleteDialogOpen(false)} 
                                style={{ flex: 1, padding: '0.75rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#374151', transition: 'background 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                                onMouseOut={e => e.currentTarget.style.background = 'white'}
                            >
                                キャンセル
                            </button>
                            <button 
                                className="btn" 
                                onClick={confirmDelete} 
                                style={{ flex: 1, padding: '0.75rem', background: '#EF4444', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s' }}
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
