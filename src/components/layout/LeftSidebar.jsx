import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LayoutTemplate, FileText, Database, Users, Settings, HelpCircle } from 'lucide-react';

export default function LeftSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const NavItem = ({ icon: Icon, label, path }) => {
        // 現在のパスが該当メニューと一致しているか
        const active = location.pathname === path || (path !== '/dashboard' && path !== '/' && location.pathname.startsWith(path));
        
        return (
            <div className={`nav-item ${active ? 'active' : ''}`} onClick={() => navigate(path)} style={{ cursor: 'pointer' }}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ color: active ? 'var(--primary)' : '#6B7280' }} />
                <span className="nav-label" style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
                {active && <div className="active-indicator" />}
            </div>
        );
    };

    return (
        <aside className="left-sidebar">
            <nav className="nav-menu">
                <div className="nav-section-title" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>MAIN</div>
                <NavItem icon={FileText} label="ヒアリングフォーム一覧" path="/dashboard" />
                <NavItem icon={LayoutTemplate} label="自動レイアウト管理" path="/auto-layout" />
                
                <div className="nav-section-title" style={{ marginTop: '2.5rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>SYSTEM</div>
                <NavItem icon={Database} label="見積資料管理" path="/settings/estimates" />
                <NavItem icon={Users} label="メンバー管理" path="/settings/users" />
                <NavItem icon={Settings} label="一般設定" path="/settings/general" />
            </nav>

            <div className="left-sidebar-footer">
                <div className="help-widget" style={{ cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#EEF2FF'} onMouseOut={e => e.currentTarget.style.background = '#F3F4F6'}>
                    <HelpCircle size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>ヘルプセンター</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>マニュアルを見る</div>
                </div>
            </div>
        </aside>
    );
}
