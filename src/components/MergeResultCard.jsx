import React from 'react';
import { openPath } from '../api/client';

// convert bytes to human readable form
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const MergeResultCard = ({ mergeResult }) => {
    if (!mergeResult?.pdf && !mergeResult?.pptx) {
        return null;
    }

    const handleCopyPath = (path) => {
        navigator.clipboard.writeText(path)
            .then(() => alert('パスをクリップボードにコピーしました: \n' + path))
            .catch(() => prompt('パスのコピーに失敗しました。以下を手動でコピーしてください:', path));
    };

    const handleOpenFolder = (filePath) => {
        // extract folder path from file path
        const folderPath = filePath.substring(0, filePath.lastIndexOf('\\')) || filePath.substring(0, filePath.lastIndexOf('/'));
        openPath(folderPath).catch(err => alert('フォルダを開けませんでした: ' + err.message));
    };

    const handleOpenFileNative = (filePath) => {
        openPath(filePath).catch(err => alert('ファイルを開けませんでした: ' + err.message));
    };

    // encode for the API proxy file streaming
    const getFileProxyUrl = (filePath) => {
        return `http://localhost:3001/api/file?path=${encodeURIComponent(filePath)}`;
    };

    return (
        <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                統合結果
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mergeResult.pptx && (
                    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#db4a39', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            PowerPoint 統合ファイル: {mergeResult.pptx.mergedPptxFileName || 'merged.pptx'}
                        </h4>
                        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <p style={{ margin: '0.25rem 0' }}>📂 保存先: {mergeResult.pptx.mergedPptxPath}</p>
                            <p style={{ margin: '0.25rem 0' }}>📏 サイズ: {formatBytes(mergeResult.pptx.mergedPptxSize)}</p>
                            <p style={{ margin: '0.25rem 0' }}>📄 対象ファイル: {mergeResult.pptx.processedCount}件 / 総スライド: {mergeResult.pptx.mergedSlideCount || mergeResult.pptx.totalSlides}枚</p>
                            {mergeResult.pptx.warningMessages && mergeResult.pptx.warningMessages.length > 0 && (
                                <p style={{ margin: '0.5rem 0', color: 'var(--warning)', fontWeight: 'bold' }}>⚠️ 後処理中に警告がありましたがファイルは正常です</p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => handleOpenFileNative(mergeResult.pptx.mergedPptxPath)}>
                                PPTXを開く
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleOpenFolder(mergeResult.pptx.mergedPptxPath)}>
                                フォルダを開く
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleCopyPath(mergeResult.pptx.mergedPptxPath)}>
                                パスをコピー
                            </button>
                        </div>
                    </div>
                )}

                {mergeResult.pdf && (
                    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#e21f26', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
                            PDF 統合ファイル: {mergeResult.pdf.mergedPdfFileName || 'merged.pdf'}
                        </h4>
                        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <p style={{ margin: '0.25rem 0' }}>📂 保存先: {mergeResult.pdf.mergedPdfPath}</p>
                            <p style={{ margin: '0.25rem 0' }}>📏 サイズ: {formatBytes(mergeResult.pdf.mergedPdfSize)}</p>
                            {mergeResult.pdf.mergedPdfPageCount && (
                                <p style={{ margin: '0.25rem 0' }}>📄 ページ数: {mergeResult.pdf.mergedPdfPageCount}p</p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <a href={getFileProxyUrl(mergeResult.pdf.mergedPdfPath)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                別タブでプレビュー
                            </a>
                            <button className="btn btn-secondary" onClick={() => handleOpenFolder(mergeResult.pdf.mergedPdfPath)}>
                                フォルダを開く
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleCopyPath(mergeResult.pdf.mergedPdfPath)}>
                                パスをコピー
                            </button>
                        </div>
                        {/* Inline Preview via iframe */}
                        <div style={{ width: '100%', height: '500px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                            <iframe 
                                src={getFileProxyUrl(mergeResult.pdf.mergedPdfPath)} 
                                width="100%" 
                                height="100%" 
                                style={{ border: 'none' }} 
                                title="PDF Preview"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MergeResultCard;
