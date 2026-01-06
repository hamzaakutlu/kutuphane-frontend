import { useState, useEffect } from 'react';
import api from '../api';

const AdminInventory = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/book');
      setBooks(res.data);
    } catch (error) {
      console.error("Envanter yüklenemedi", error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #343a40', paddingBottom: '10px' }}>
        <h2>📊 Kitaplık Envanter Takibi</h2>
        <button onClick={() => window.history.back()} style={{ padding: '8px 15px', cursor: 'pointer' }}>Geri Dön</button>
      </div>
      
      <p style={{ marginTop: '15px', color: '#666' }}>Tüm kitapların barkod, kategori ve ödünç durumlarını buradan takip edebilirsiniz.</p>
      
      <table border="1" width="100%" style={{ borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
          <tr>
            <th style={{ padding: '15px' }}>Barkod No</th>
            <th style={{ padding: '15px' }}>Kitap Adı</th>
            <th style={{ padding: '15px' }}>Kategori</th>
            <th style={{ padding: '15px' }}>Durum</th>
            <th style={{ padding: '15px' }}>Ödünç Alan Kullanıcı</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id} style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>{book.isbn}</td>
              <td style={{ padding: '12px' }}>{book.title}</td>
              <td style={{ padding: '12px' }}>{book.category?.name || '-'}</td>
              <td style={{ padding: '12px' }}>
                {book.isBorrowed ? 
                  <span style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>🔴 Ödünçte</span> : 
                  <span style={{ color: '#28a745', backgroundColor: '#d4edda', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>🟢 Rafta</span>
                }
              </td>
              <td style={{ padding: '12px', color: book.isBorrowed ? '#000' : '#ccc', fontStyle: book.isBorrowed ? 'normal' : 'italic' }}>
                {book.isBorrowed ? book.borrowedBy : 'Müsait'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {books.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          <h3>Henüz kayıtlı kitap bulunamadı.</h3>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;