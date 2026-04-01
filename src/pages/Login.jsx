import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import './Auth.css';

function Login() {
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
          <div className="logo-icon-auth">🔐</div>
          <h2>おかえりなさい</h2>
          <p>アカウントにログインして、提案作成を再開しましょう。</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <div className="label-with-link">
              <label className="input-label">パスワード</label>
              <a href="#" className="forgot-link">パスワードをお忘れですか？</a>
            </div>
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
            サインイン <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="auth-footer">
          アカウントをお持ちでないですか？ <Link to="/register" className="auth-link">新規登録</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
