import React, { useState, useEffect } from 'react';
import { fetchS3CsvList } from '../api/client';

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="6" />
    <line x1="12" x2="12" y1="18" y2="22" />
    <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
    <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
    <line x1="2" x2="6" y1="12" y2="12" />
    <line x1="18" x2="22" y1="12" y2="12" />
    <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
    <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
  </svg>
);

export default function UploadPanel({ onExtract, loading, onShowEstimate, estimateLoading }) {
  const [s3File, setS3File] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvList, setCsvList] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);

  const fixedRefFolder = 'S3: refarence（仮）/';

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

  const openCsvModal = () => {
    setIsModalOpen(true);
    if (csvList.length === 0) {
      loadCsvList();
    }
  };

  const closeCsvModal = () => {
    setIsModalOpen(false);
  };

  const selectCsv = (file) => {
    setS3File(file);
    closeCsvModal();
  };

  const handleExtractClick = () => {
    if (!s3File) {
      alert('CSVファイルを選択してください');
      return;
    }
    // file is skipped, we pass the s3 key over
    onExtract(s3File.key, fixedRefFolder);
  };

  const handleEstimateClick = () => {
    if (!s3File) return;
    onShowEstimate(s3File.key);
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      <h2 className="card-title">データソースを準備</h2>

      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        <div>
          <label className="input-label">1. 製品リストCSV</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <button className="btn btn-secondary" onClick={openCsvModal} disabled={loading}>
              S3からCSVを選択
            </button>
            {s3File ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ color: 'var(--primary)' }}><FileIcon /></div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{s3File.filename}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    S3 Key: {s3File.key} | {(s3File.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>CSVが選択されていません</div>
            )}
          </div>
        </div>

        <div>
          <label className="input-label">2. 参照元 (PPT / PDF がある場所)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }}>
                <FolderIcon />
              </div>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem', opacity: 0.8 }}
                value={fixedRefFolder}
                readOnly
                disabled
              />
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            指定したS3プレフィックス配下を検索し、CSV内の製品と合致する資料を探します。
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={handleEstimateClick}
          disabled={loading || estimateLoading || !s3File}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
        >
          {estimateLoading ? '生成中...' : '見積リストを表示'}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleExtractClick}
          disabled={loading || !s3File}
          style={{ flex: 2, padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
        >
          {loading ? (
            <>
              <SpinnerIcon />
              抽出中...
            </>
          ) : (
            <>抽出を開始する</>
          )}
        </button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ 
            background: 'var(--surface)', width: '600px', maxWidth: '90%', maxHeight: '80vh',
            borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.25rem' }}>S3上のCSVファイルを選択</h3>
            
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              {csvLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>読み込み中...</div>
              ) : csvList.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>CSVファイルが見つかりません。</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {csvList.map(item => (
                    <li key={item.key} style={{ borderBottom: '1px solid var(--border)' }}>
                      <button 
                        onClick={() => selectCsv(item)}
                        style={{ 
                          width: '100%', padding: '1rem', textAlign: 'left', background: 'transparent',
                          border: 'none', color: 'var(--text-main)', cursor: 'pointer', transition: 'background 0.2s',
                          display: 'flex', flexDirection: 'column', gap: '0.25rem'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontWeight: 600 }}>{item.filename}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          パス: {item.key} | サイズ: {(item.size / 1024).toFixed(1)} KB | 更新: {new Date(item.lastModified).toLocaleString()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={loadCsvList} disabled={csvLoading}>更新</button>
              <button className="btn btn-secondary" onClick={closeCsvModal}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
