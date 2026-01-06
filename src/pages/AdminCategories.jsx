import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '' });

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/category');
      setCategories(res.data);
    } catch (e) { console.error("Kategoriler yüklenemedi", e); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      await api.post('/category', newCategory);
      setNewCategory({ name: '' });
      loadCategories();
    } catch (err) { alert("Kategori eklenirken hata oluştu."); }
  };

  const styles = {
    container: { maxWidth: '1300px', margin: '40px auto', fontFamily: '"Inter", sans-serif', padding: '0 20px' },
    header: { color: '#1b5e20', marginBottom: '30px', fontSize: '28px', borderBottom: '2px solid #a5d6a7', paddingBottom: '10px' },
    card: { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '30px' },
    formLine: { display: 'flex', gap: '20px', alignItems: 'flex-end' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: '1' },
    label: { fontSize: '13px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px', textTransform: 'uppercase' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #c8e6c9', fontSize: '15px', outline: 'none', backgroundColor: '#fdfdfd' },
    button: { padding: '0 35px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', height: '45px', transition: '0.3s' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '18px', fontSize: '14px', color: '#2e7d32', backgroundColor: '#f9fdf9', borderBottom: '2px solid #a5d6a7' },
    td: { padding: '18px', borderBottom: '1px solid #eee', fontSize: '16px' },
    deleteBtn: { color: '#d32f2f', border: '1px solid #ffcdd2', background: '#fff5f5', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📂 Kategori Yönetimi</h1>
      
      <div style={styles.card}>
        <form onSubmit={handleAddCategory} style={styles.formLine}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kategori Adı</label>
            <input 
              style={styles.input} 
              placeholder="Örn: Dünya Klasikleri" 
              value={newCategory.name} 
              onChange={e => setNewCategory({ name: e.target.value })} 
              required 
            />
          </div>
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={e => e.target.style.backgroundColor = '#1b5e20'}
            onMouseOut={e => e.target.style.backgroundColor = '#2e7d32'}
          >
            KATEGORİ EKLE
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>KATEGORİ ADI</th>
              <th style={{...styles.th, textAlign: 'center'}}>KİTAP SAYISI</th>
              <th style={{...styles.th, textAlign: 'right'}}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{...styles.td, fontWeight: '600'}}>{cat.name}</td>
                <td style={{...styles.td, textAlign: 'center'}}>
                  {cat.books?.length || 0}
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <button 
                    style={styles.deleteBtn} 
                    onClick={() => { if(window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) api.delete(`/category/${cat.id}`).then(loadCategories) }}
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

export default AdminCategories;