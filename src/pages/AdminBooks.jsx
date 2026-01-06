import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', categoryId: '', authorIds: [], pageCount: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [b, c, a] = await Promise.all([api.get('/book'), api.get('/category'), api.get('/author')]);
      setBooks(b.data); setCategories(c.data); setAuthors(a.data);
    } catch (e) { console.error("Veri hatası:", e); }
  };

  const toggleAuthor = (authorId) => {
    const id = parseInt(authorId);
    setNewBook(prev => ({
      ...prev,
      authorIds: prev.authorIds.includes(id)
        ? prev.authorIds.filter(i => i !== id)
        : [...prev.authorIds, id]
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.categoryId || newBook.authorIds.length === 0) return alert("Eksik alan bırakmayın.");
    try {
      await api.post('/book', {
        ...newBook,
        categoryId: parseInt(newBook.categoryId),
        pageCount: parseInt(newBook.pageCount) || 0
      });
      setNewBook({ title: '', categoryId: '', authorIds: [], pageCount: '' });
      setShowAuthorDropdown(false);
      loadData();
    } catch (err) { alert("Hata oluştu."); }
  };

  const styles = {
    // Kapsayıcıyı 1300px'e çıkardık
    container: { maxWidth: '1300px', margin: '40px auto', fontFamily: '"Inter", sans-serif', padding: '0 20px' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px' },
    formLine: { display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'nowrap' }, // Daha geniş ekran için nowrap
    inputGroup: { display: 'flex', flexDirection: 'column', flex: '1', position: 'relative' },
    label: { fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px', textTransform: 'uppercase' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #c8e6c9', fontSize: '15px', outline: 'none', backgroundColor: '#fdfdfd' },
    dropdownBox: { 
      padding: '12px', borderRadius: '6px', border: '1px solid #c8e6c9', fontSize: '15px', 
      cursor: 'pointer', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
    },
    dropdownMenu: {
      position: 'absolute', top: '105%', left: 0, right: 0, background: '#fff', 
      border: '1px solid #c8e6c9', borderRadius: '6px', zIndex: 100, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
    },
    authorItem: { display: 'flex', alignItems: 'center', padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s' },
    checkbox: { width: '18px', height: '18px', marginRight: '12px', cursor: 'pointer', accentColor: '#2e7d32' },
    button: { padding: '0 35px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', height: '45px' },
    badge: { background: '#e8f5e9', color: '#1b5e20', padding: '4px 12px', borderRadius: '15px', fontSize: '13px', marginRight: '6px', border: '1px solid #c8e6c9' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{color: '#1b5e20', marginBottom: '30px', fontSize: '28px'}}>🌿 Kütüphane Admin Paneli</h1>
      
      <div style={styles.card}>
        <form onSubmit={handleAddBook} style={styles.formLine}>
          <div style={{...styles.inputGroup, flex: '2'}}>
            <label style={styles.label}>Kitap Adı</label>
            <input style={styles.input} placeholder="Kitabın tam adını giriniz..." value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Kategori</label>
            <select style={styles.input} value={newBook.categoryId} onChange={e => setNewBook({...newBook, categoryId: e.target.value})} required>
              <option value="">Seçiniz...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Yazarlar</label>
            <div style={styles.dropdownBox} onClick={() => setShowAuthorDropdown(!showAuthorDropdown)}>
              <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {newBook.authorIds.length > 0 ? `${newBook.authorIds.length} Yazar Seçili` : 'Yazar Seçiniz...'}
              </span>
              <span style={{fontSize: '10px', marginLeft: '10px'}}>{showAuthorDropdown ? '▲' : '▼'}</span>
            </div>
            {showAuthorDropdown && (
              <div style={styles.dropdownMenu}>
                {authors.map(a => (
                  <div key={a.id} style={styles.authorItem} onClick={() => toggleAuthor(a.id)} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f8f1'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <input type="checkbox" style={styles.checkbox} checked={newBook.authorIds.includes(a.id)} readOnly />
                    <span style={{fontSize: '15px'}}>{a.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{...styles.inputGroup, flex: '0.5'}}>
            <label style={styles.label}>Sayfa</label>
            <input style={styles.input} type="number" placeholder="0" value={newBook.pageCount} onChange={e => setNewBook({...newBook, pageCount: e.target.value})} />
          </div>

          <button type="submit" style={styles.button} onMouseOver={e => e.target.style.backgroundColor = '#1b5e20'} onMouseOut={e => e.target.style.backgroundColor = '#2e7d32'}>
            KAYDET
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #a5d6a7', backgroundColor: '#f9fdf9'}}>
              <th style={{textAlign: 'left', padding: '18px', fontSize: '14px', color: '#2e7d32'}}>KİTAP</th>
              <th style={{textAlign: 'left', padding: '18px', fontSize: '14px', color: '#2e7d32'}}>YAZARLAR</th>
              <th style={{textAlign: 'center', padding: '18px', fontSize: '14px', color: '#2e7d32'}}>SAYFA</th>
              <th style={{textAlign: 'right', padding: '18px', fontSize: '14px', color: '#2e7d32'}}>İŞLEM</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id} style={{borderBottom: '1px solid #eee', transition: 'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{padding: '18px', fontWeight: '600', fontSize: '16px'}}>{b.title}</td>
                <td style={{padding: '18px'}}>
                  {b.authors?.map(a => <span key={a.id} style={styles.badge}>{a.name}</span>)}
                </td>
                <td style={{padding: '18px', textAlign: 'center', fontWeight: 'bold', color: '#2e7d32', fontSize: '16px'}}>
                  {b.pageCount || 0}
                </td>
                <td style={{padding: '18px', textAlign: 'right'}}>
                  <button 
                    style={{color: '#d32f2f', border: '1px solid #ffcdd2', background: '#fff5f5', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'}} 
                    onClick={() => { if(window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) api.delete(`/book/${b.id}`).then(loadData) }}
                  >
                    SİL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;