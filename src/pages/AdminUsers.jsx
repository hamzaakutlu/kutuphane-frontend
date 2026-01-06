import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (e) { console.error("Kullanıcılar yüklenemedi", e); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Backend'deki @Patch('users/:id/role') rotasına istek atar
      await api.patch(`/auth/users/${userId}/role`, { role: newRole });
      alert(`Yetki başarıyla ${newRole} olarak güncellendi.`);
      loadUsers(); // Listeyi günceller
    } catch (e) { 
      console.error(e);
      alert("Yetki değiştirilemedi. Backend servisindeki hatayı kontrol edin.");
    }
  };

  const styles = {
    container: { maxWidth: '1300px', margin: '40px auto', fontFamily: '"Inter", sans-serif', padding: '0 20px' },
    header: { color: '#1b5e20', marginBottom: '30px', fontSize: '28px', borderBottom: '2px solid #a5d6a7', paddingBottom: '10px' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '18px', fontSize: '14px', color: '#2e7d32', backgroundColor: '#f9fdf9', borderBottom: '2px solid #a5d6a7' },
    td: { padding: '18px', borderBottom: '1px solid #eee', fontSize: '15px' },
    roleBadge: (role) => ({
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      backgroundColor: role === 'admin' ? '#e8f5e9' : '#f5f5f5',
      color: role === 'admin' ? '#2e7d32' : '#616161',
      border: `1px solid ${role === 'admin' ? '#c8e6c9' : '#e0e0e0'}`,
      textTransform: 'uppercase'
    }),
    actionBtn: (color, bg) => ({
      padding: '8px 16px', border: `1px solid ${color}`, background: bg, color: color,
      borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', marginLeft: '8px', transition: '0.3s'
    })
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>👥 Üye & Yetki Yönetimi</h1>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>E-POSTA ADRESİ</th>
              <th style={{...styles.th, textAlign: 'center'}}>MEVCUT ROL</th>
              <th style={{...styles.th, textAlign: 'right'}}>YETKİ VE İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{...styles.td, fontWeight: '500'}}>{user.email}</td>
                <td style={{...styles.td, textAlign: 'center'}}>
                  <span style={styles.roleBadge(user.role)}>{user.role}</span>
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  {/* Giriş yapan admin kendi yetkisini değiştiremesin */}
                  {user.email !== currentUser?.email && (
                    <>
                      {user.role === 'user' ? (
                        <button 
                          style={styles.actionBtn('#2e7d32', '#e8f5e9')}
                          onClick={() => handleRoleChange(user.id, 'admin')}
                        >
                          ADMİN YAP
                        </button>
                      ) : (
                        <button 
                          style={styles.actionBtn('#e65100', '#fff3e0')}
                          onClick={() => handleRoleChange(user.id, 'user')}
                        >
                          YETKİ KALDIR
                        </button>
                      )}
                      <button 
                        style={styles.actionBtn('#d32f2f', '#fff5f5')}
                        onClick={() => { if(window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) api.delete(`/auth/users/${user.id}`).then(loadUsers) }}
                      >
                        SİL
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;