import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // モック：ダッシュボードへ遷移
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-header">
          <div className="logo-icon-auth">✨</div>
          <h2>無料でアカウント作成</h2>
          <p>30秒で登録完了。新しい提案体験を始めましょう。</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">お名前</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                className="input-field with-icon" 
                placeholder="田中 太郎" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">メールアドレス</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                className="input-field with-icon" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">パスワード</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                className="input-field with-icon" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block btn-large">
            無料で始める <ArrowRight size={18} />
          </button>

          <p className="terms-text">
            登録することで、<a href="#">利用規約</a>および<a href="#">プライバシーポリシー</a>に同意したものとみなされます。
          </p>
        </form>
        
        <div className="auth-footer">
          すでにアカウントをお持ちですか？ <Link to="/login" className="auth-link">ログイン</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
