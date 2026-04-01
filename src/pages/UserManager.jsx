import React, { useState } from 'react';
import { Users, Mail, Plus, Edit2, Trash2 } from 'lucide-react';
import LeftSidebar from '../components/layout/LeftSidebar';

export default function UserManager() {
  const [users] = useState([
    { id: 1, name: '谷岡 勇真', email: 'ys_tanioka@oliverinc.co.jp', role: 'Admin', status: 'Active', lastLogin: '2026/04/01 12:30' },
    { id: 2, name: '提案DX 担当者A', email: 'dx_member1@oliverinc.co.jp', role: 'Editor', status: 'Active', lastLogin: '2026/03/30 09:15' },
    { id: 3, name: '提案DX 担当者B', email: 'dx_member2@oliverinc.co.jp', role: 'Viewer', status: 'Invited', lastLogin: '-' },
  ]);

  return (
    <div className="layout">
      <div className="layout-body">
        <LeftSidebar />
        <main className="main-content" style={{ padding: '2rem 3rem', background: '#FAFAFA', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} color="#73A07A" />
                メンバー管理
              </h1>
              <p style={{ color: '#4B5563', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                DISP Platform にアクセスできるメンバーの招待と権限管理を行います。
              </p>
            </div>
            
            <button style={{ background: '#73A07A', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Plus size={16} /> メンバーを招待
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>名前</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>連絡先</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>権限</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>ステータス</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>最終ログイン</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ borderBottom: idx < users.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.9rem' }}>{user.name}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.85rem' }}>
                        <Mail size={14} color="#94A3B8" /> {user.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: user.role === 'Admin' ? '#EEF2FF' : '#F1F5F9',
                        color: user.role === 'Admin' ? '#4F46E5' : '#475569'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        background: user.status === 'Active' ? '#ECFDF5' : '#FFFBEB',
                        color: user.status === 'Active' ? '#059669' : '#D97706',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'Active' ? '#10B981' : '#F59E0B' }}></div>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#64748B' }}>
                      {user.lastLogin}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button style={{ background: 'transparent', border: '1px solid #E2E8F0', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#475569' }}>
                          <Edit2 size={16} />
                        </button>
                        <button style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', color: '#EF4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
