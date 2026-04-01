import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Zap, Shield } from 'lucide-react';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <main className="landing-hero">
        <div className="hero-content">
          <div className="badge-pill">✨ 新世代の提案書自動生成プラットフォーム</div>
          <h1 className="hero-title">
            提案業務を、<br />
            <span className="text-gradient">圧倒的にスマートに。</span>
          </h1>
          <p className="hero-subtitle">
            過去の提案書や資料から最適な情報をAIが自動抽出し、<br />
            ワンクリックで高品質な提案書（PDF/PPT）を生成します。
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              今すぐ始める <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-large">
              デモ画面を見る
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-panel main-panel">
            {/* ダミーのUIを表現 */}
            <div className="panel-header">
              <div className="dots">
                <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
              </div>
            </div>
            <div className="panel-body">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="stats-grid">
                <div className="stat-card"></div>
                <div className="stat-card"></div>
              </div>
            </div>
          </div>
          <div className="glass-panel floating-panel-1">
            <FileText size={32} color="#2563EB" />
            <span>PDF統合完了</span>
          </div>
          <div className="glass-panel floating-panel-2">
            <Zap size={32} color="#F59E0B" />
            <span>データ抽出完了</span>
          </div>
        </div>
      </main>

      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon"><FileText size={24} /></div>
          <h3 className="feature-title">ドキュメント自動統合</h3>
          <p className="feature-desc">PDFやPPTなどの複数ドキュメントをシームレスに一つのファイルにマージします。</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Zap size={24} /></div>
          <h3 className="feature-title">超高速なデータ抽出</h3>
          <p className="feature-desc">必要な情報を瞬時に抽出し、整理された形でエクスポートします。作業時間を大幅に削減。</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><Shield size={24} /></div>
          <h3 className="feature-title">セキュアな設計</h3>
          <p className="feature-desc">最新のセキュリティ基準に準拠し、機密性の高いドキュメントを安全に処理します。</p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
