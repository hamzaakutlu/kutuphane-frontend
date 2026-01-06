import React, { useEffect, useState } from 'react';
import api from '../api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => { loadBooks(); }, []);
  
  const loadBooks = async () => { 
    try {
      const res = await api.get('/book'); 
      setBooks(res.data); 
    } catch (e) { console.error("Kitaplar yüklenemedi", e); }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'borrow') await api.post(`/book/borrow/${id}`, { userEmail: user.email });
      else await api.post(`/book/return/${id}`);
      loadBooks();
    } catch (e) { alert("İşlem sırasında bir hata oluştu."); }
  };

  const styles = {
    container: { maxWidth: '1300px', margin: '40px auto', fontFamily: '"Inter", sans-serif', padding: '0 20px' },
    header: { color: '#1b5e20', marginBottom: '30px', fontSize: '28px', borderBottom: '2px solid #a5d6a7', paddingBottom: '10px' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '18px', fontSize: '14px', color: '#2e7d32', backgroundColor: '#f9fdf9', borderBottom: '2px solid #a5d6a7' },
    td: { padding: '18px', borderBottom: '1px solid #eee', fontSize: '15px' },
    badge: { background: '#e8f5e9', color: '#1b5e20', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', marginRight: '5px', border: '1px solid #c8e6c9' },
    statusBadge: (bg, color) => ({
      padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'inline-block', backgroundColor: bg, color: color
    }),
    btn: (bg) => ({
      padding: '8px 20px', background: bg, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.3s'
    })
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📚 Kitap Durum Listesi</h1>
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>KİTAP ADI</th>
              <th style={styles.th}>YAZARLAR</th>
              <th style={styles.th}>KATEGORİ</th>
              <th style={{...styles.th, textAlign: 'center'}}>SAYFA</th>
              <th style={{...styles.th, textAlign: 'center'}}>DURUM</th>
              <th style={{...styles.th, textAlign: 'right'}}>İŞLEM / BİLGİ</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => {
              const isMine = b.borrowedBy === user?.email;
              
              // Durum Renkleri
              let statusLabel = 'Mevcut';
              let statusStyles = styles.statusBadge('#e8f5e9', '#2e7d32'); // Yeşil
              
              if (b.isBorrowed) {
                if (isMine) {
                  statusLabel = 'Sizde';
                  statusStyles = styles.statusBadge('#e3f2fd', '#1565c0'); // Mavi
                } else {
                  statusLabel = 'Ödünç Verildi';
                  statusStyles = styles.statusBadge('#fff3e0', '#e65100'); // Turuncu
                }
              }

              return (
                <tr key={b.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{...styles.td, fontWeight: '600'}}>{b.title}</td>
                  <td style={styles.td}>
                    {b.authors?.map(a => <span key={a.id} style={styles.badge}>{a.name}</span>)}
                  </td>
                  <td style={{...styles.td, color: '#666'}}>{b.category?.name || '—'}</td>
                  <td style={{...styles.td, textAlign: 'center', fontWeight: 'bold'}}>{b.pageCount || 0}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <span style={statusStyles}>{statusLabel}</span>
                  </td>
                  <td style={{...styles.td, textAlign: 'right'}}>
                    {isAdmin ? (
                      <span style={{fontSize: '13px', color: '#666', fontStyle: 'italic'}}>
                        {b.borrowedBy || 'Rafta'}
                      </span>
                    ) : (
                      <>
                        {!b.isBorrowed && (
                          <button 
                            style={styles.btn('#2e7d32')} 
                            onClick={() => handleAction(b.id, 'borrow')}
                            onMouseOver={e => e.target.style.backgroundColor = '#1b5e20'}
                            onMouseOut={e => e.target.style.backgroundColor = '#2e7d32'}
                          >
                            Ödünç Al
                          </button>
                        )}
                        {isMine && (
                          <button 
                            style={styles.btn('#1565c0')} 
                            onClick={() => handleAction(b.id, 'return')}
                            onMouseOver={e => e.target.style.backgroundColor = '#0d47a1'}
                            onMouseOut={e => e.target.style.backgroundColor = '#1565c0'}
                          >
                            İade Et
                          </button>
                        )}
                        {b.isBorrowed && !isMine && (
                          <span style={{color: '#999', fontSize: '13px'}}>İşlem Yapılamaz</span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;