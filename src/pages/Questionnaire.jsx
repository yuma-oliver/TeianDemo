import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Briefcase, Coffee, Presentation, DoorClosed, Inbox, Check, FileText } from 'lucide-react';
import './Questionnaire.css';

export default function Questionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId || null;
  const projectName = location.state?.projectName || '新規案件';

  const [step, setStep] = useState(1);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState(projectId);
  
  const [answers, setAnswers] = useState({
    space: '',
    address: '',
    floorSpace: '',
    employees: '',
    deskWidth: '',
    deskDepth: ''
  });

  const handleSelectSpace = (val) => {
    setAnswers({ ...answers, space: val });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);
  const handleFinish = () => {
    const saved = localStorage.getItem('teian_projects');
    let projects = [];
    if (saved) {
        try { projects = JSON.parse(saved); } catch(e){}
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getDate().toString().padStart(2,'0')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    if (projectId) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            projects[index] = {
                ...projects[index],
                isAnswered: true,
                answers: answers
            };
            setSavedProjectId(projectId);
        } else {
            const newProject = {
                id: projectId,
                name: projectName,
                date: dateStr,
                version: "バージョン1",
                s3Key: "",
                isAnswered: true,
                answers: answers
            };
            projects.unshift(newProject);
            setSavedProjectId(projectId);
        }
    } else {
        const newId = Date.now();
        const newProject = {
            id: newId,
            name: projectName,
            date: dateStr,
            version: "バージョン1",
            s3Key: "",
            isAnswered: true,
            answers: answers
        };
        projects.unshift(newProject);
        setSavedProjectId(newId);
    }

    localStorage.setItem('teian_projects', JSON.stringify(projects));
    setShowFinishDialog(true);
  };

  const navigateWithLoading = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
    }, 1500); // カッコいいローディングを見せるための遅延
  };

  const renderProgress = () => {
    let pct = 0;
    if (step === 1) pct = 10;
    if (step === 2) pct = 80;
    if (step === 3) pct = 100;
    
    return (
      <div className="q-progress">
        {/* イラストの代用としてシンプルなラインとマーカー */}
        <div className="q-progress-line">
          <div className="q-progress-label" style={{ left: `${pct}%` }}>
            {step === 3 ? 'FINISH!' : `Q${step === 1 ? '1' : '15'}`}
          </div>
          <div className="q-progress-marker" style={{ left: `${pct}%` }}></div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="animation-fade-in">
      <h2 className="q-question-title">
        Q1. 今回、提案が必要なスペースを教えてください。<span className="q-badge-required">必須</span>
      </h2>
      <div className="q-grid">
        {[
          { icon: Users, label: 'エントランス・受付・来客待合' },
          { icon: Briefcase, label: '執務スペース', desc: 'フリーアドレス・固定席問わず' },
          { icon: Coffee, label: 'コミュニケーションスペース' },
          { icon: Presentation, label: 'ミーティングスペース' },
          { icon: DoorClosed, label: '個室ブース' },
          { icon: Users, label: '会議室' },
          { icon: Inbox, label: '会長・社長・役員個室' },
          { icon: Coffee, label: '休憩室・食堂' },
          { icon: DoorClosed, label: '休養スペース' },
        ].map((item) => (
          <div 
            key={item.label} 
            className={`q-tile ${answers.space === item.label ? 'selected' : ''}`}
            onClick={() => handleSelectSpace(item.label)}
          >
            <div className="q-tile-icon">
              <item.icon size={48} strokeWidth={1.5} color={answers.space === item.label ? 'white' : '#D9A05B'} />
            </div>
            <div className="q-tile-title">{item.label}</div>
            {item.desc && <div className="q-tile-desc">{item.desc}</div>}
            {answers.space === item.label && <Check className="q-check" size={32} />}
          </div>
        ))}
      </div>
      <div className="q-footer-nav">
        <button className="btn-dark" onClick={handleNext} disabled={!answers.space} style={{ padding: '0.75rem 3rem', fontSize: '1rem' }}>
          次へ
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animation-fade-in">
      <h2 className="q-question-title">
        Q15. 最後に、オフィスの基本情報を教えてください。
      </h2>
      
      <div className="q-form-section" data-title="現在のオフィス情報">
        <div className="q-form-group">
          <label className="q-label">現住所</label>
          <input 
            type="text" 
            className="q-input" 
            name="address"
            placeholder="例：〒103-0022 東京都中央区日本橋室町1-7-1 スルガビル9F" 
            value={answers.address}
            onChange={handleChange}
          />
        </div>

        <div className="q-form-group">
          <label className="q-label">床面積</label>
          <div className="q-inline-inputs">
            <input type="number" className="q-input q-input-short" name="floorSpace" value={answers.floorSpace} onChange={handleChange} />
            <span>坪（平米 0㎡）</span>
          </div>
        </div>

        <div className="q-form-group">
          <label className="q-label">社員数</label>
          <div className="q-inline-inputs">
            <input type="number" className="q-input q-input-short" name="employees" value={answers.employees} onChange={handleChange} />
            <span>名</span>
          </div>
        </div>

        <div className="q-form-group">
          <label className="q-label">一人当たりのデスクサイズ</label>
          <div className="q-inline-inputs">
            <input type="number" className="q-input q-input-short" name="deskWidth" value={answers.deskWidth} onChange={handleChange} />
            <span>mm</span>
            <span>×</span>
            <input type="number" className="q-input q-input-short" name="deskDepth" value={answers.deskDepth} onChange={handleChange} />
            <span>mm</span>
          </div>
        </div>
      </div>
      
      <div className="q-form-section" data-title="新しいオフィス情報">
        <div className="q-form-group">
          <label className="q-label">※モックアップ</label>
        </div>
      </div>

      <div className="q-footer-nav">
        <button className="btn-outline-dark" onClick={handlePrev} style={{ padding: '0.75rem 2rem' }}>戻る</button>
        <button className="btn-dark" onClick={handleNext} style={{ padding: '0.75rem 3rem', fontSize: '1rem' }}>
          確認画面へ
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animation-fade-in">
      <h2 className="q-question-title" style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
        質問は以上です。回答内容を確認してください。
      </h2>
      
      <div className="q-form-section" data-title="回答一覧">
        
        <div className="q-summary-item">
          <div className="q-summary-header">
            <span>プライバシーポリシー</span>
            <span className="q-summary-edit">回答を編集</span>
          </div>
          <div className="q-summary-answer red">同意する（固定モック）</div>
        </div>

        <div className="q-summary-item" style={{ marginTop: '2rem' }}>
          <div className="q-summary-header">
            <span>Q1. 今回、提案が必要なスペースを教えてください。</span>
            <span className="q-summary-edit" onClick={() => setStep(1)}>回答を編集</span>
          </div>
          <div className="q-summary-answer" style={{ fontWeight: 'bold' }}>
            {answers.space || '未回答'}
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>選択済 ∨</div>
          </div>
        </div>

        <div className="q-summary-item" style={{ marginTop: '2rem' }}>
          <div className="q-summary-header" style={{ background: '#FCE7F3' }}>
            <span>Q2. 今回対象となるオフィス形態について教えてください。</span>
            <span className="q-summary-edit">回答を編集</span>
          </div>
          <div className="q-summary-answer">
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.25rem' }}>ご相談内容</div>
            <div className="red">未回答</div>
          </div>
        </div>

        <div className="q-summary-item" style={{ marginTop: '2rem' }}>
          <div className="q-summary-header">
            <span>Q15. 基本情報をご確認ください。</span>
            <span className="q-summary-edit" onClick={() => setStep(2)}>回答を編集</span>
          </div>
          <div className="q-summary-answer">
            社員数: {answers.employees || '未設定'}名<br/>
            床面積: {answers.floorSpace || '未設定'}坪
          </div>
        </div>

      </div>

      <div className="q-footer-nav">
        <button className="btn-outline-dark" onClick={handlePrev} style={{ padding: '0.75rem 2rem' }}>戻る</button>
        <button className="btn-dark" onClick={handleFinish} style={{ padding: '0.75rem 3rem', fontSize: '1rem' }}>
          完了して保存
        </button>
      </div>
    </div>
  );

  return (
    <div className="questionnaire-layout">
      <main className="q-container">
        {renderProgress()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>

      {/* 完了ダイアログ */}
      {showFinishDialog && !isNavigating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#111827' }}>回答を保存しました</h3>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              案件の基本情報と質問への回答が保存されました。<br/>次に進むアクションを選択してください。
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexDirection: 'column' }}>
              <button 
                onClick={() => navigateWithLoading(`/auto-layout/${savedProjectId}`)}
                style={{ background: '#10B981', color: 'white', padding: '0.875rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.95rem' }}
                onMouseOver={e => e.target.style.background = '#059669'}
                onMouseOut={e => e.target.style.background = '#10B981'}
              >
                自動レイアウトの作業へ進む
              </button>
              <button 
                onClick={() => navigateWithLoading('/dashboard')}
                style={{ background: 'white', color: '#4B5563', padding: '0.875rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.95rem' }}
                onMouseOver={e => e.target.style.background = '#F3F4F6'}
                onMouseOut={e => e.target.style.background = 'white'}
              >
                ホームへ戻る
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ローディングオーバーレイ */}
      {isNavigating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <div className="q-loader"></div>
          <div style={{ color: 'white', fontWeight: 700, letterSpacing: '0.2em', fontSize: '0.875rem', marginTop: '1rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
            PROCESSING...
          </div>
        </div>
      )}
    </div>
  );
}
