import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import Home from './Home';
import { fetchConfig, extractFiles, mergePdf, mergePptx } from '../api/client';
import '../index.css';

function Dashboard() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergingPptx, setMergingPptx] = useState(false);
  const [result, setResult] = useState(null);
  const [mergeResult, setMergeResult] = useState({ pdf: null, pptx: null });
  const [errorMsg, setErrorMsg] = useState('');
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
      fetchConfig()
          .then(data => setConfig(data))
          .catch(err => setErrorMsg('初期設定の取得に失敗しました: ' + err.message));
  }, []);

  const handleExtract = async (file, refFolder) => {
      setLoading(true);
      setErrorMsg('');
      setResult(null);
      setMergeResult({ pdf: null, pptx: null });
      try {
          const data = await extractFiles(file, refFolder);
          setResult(data);
          // Smooth scroll to tables if needed
          setTimeout(() => {
              window.scrollTo({ top: 300, behavior: 'smooth' });
          }, 100);
      } catch (err) {
          setErrorMsg(err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleMergePdf = async () => {
      if (!result || !result.outputPath) return;
      setMerging(true);
      setErrorMsg('');
      try {
          const data = await mergePdf(result.outputPath);
          setMergeResult(prev => ({ ...prev, pdf: data }));
          alert(`PDFを結合しました！\n保存先: ${data.mergedPdfPath}`);
      } catch (err) {
          setErrorMsg(err.message);
      } finally {
          setMerging(false);
      }
  };

  const handleMergePptx = async () => {
      if (!result || !result.outputPath) return;
      setMergingPptx(true);
      setErrorMsg('');
      try {
          const data = await mergePptx(result.outputPath);
          setMergeResult(prev => ({ ...prev, pptx: data }));
          
          let alertMsg = `✅ 統合PowerPointを作成しました！\n`;
          if (data.processedCount !== undefined && data.totalSlides !== undefined) {
              alertMsg += `📄 対象ファイル: ${data.processedCount}件\n`;
              alertMsg += `📊 総スライド数: ${data.totalSlides}枚\n\n`;
          }
          if (data.warningMessages && data.warningMessages.length > 0) {
              alertMsg += `⚠️ 後処理中に一部警告がありましたが、出力ファイルは保存済みです。\n\n`;
          }
          alertMsg += `保存先パス: ${data.mergedPptxPath}`;

          try {
              await navigator.clipboard.writeText(data.mergedPptxPath);
              alert(alertMsg + `\n\n※パスをクリップボードにコピーしました。「フォルダを開く」から確認できます。`);
          } catch(e) {
              prompt(alertMsg + `\n\nパスは以下です（コピー可）:`, data.mergedPptxPath);
          }
      } catch (err) {
          setErrorMsg(err.message);
      } finally {
          setMergingPptx(false);
      }
  };

  const handleOpenFolder = () => {
      if (result?.outputPath) {
          alert(`出力フォルダパスをご自身のPCで開いて確認してください: \n${result.outputPath}`);
      }
  };

  const handleCopyPathPptx = (path) => {
      navigator.clipboard.writeText(path).then(() => {
          alert('統合PPTのパスをクリップボードにコピーしました');
      }).catch(err => {
          alert('パスのコピーに失敗しました');
      });
  };

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        
        <main className="main-content">
          <Home 
            config={config}
            loading={loading}
            result={result}
            mergeResult={mergeResult}
            errorMsg={errorMsg}
            onExtract={handleExtract}
            onSelectProject={setActiveProject}
          />
        </main>
        
        <RightSidebar 
          activeProject={activeProject}
          result={result}
          merging={merging}
          mergingPptx={mergingPptx}
          onMergePdf={handleMergePdf}
          onMergePptx={handleMergePptx}
          onOpenFolder={handleOpenFolder}
        />
      </div>
    </div>
  );
}

export default Dashboard;
