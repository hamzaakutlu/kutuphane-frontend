import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!token || !user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
        <h1>📚 Kütüphane Yönetim Sistemi</h1>
        <button onClick={() => navigate('/login')} style={{ padding: '12px 30px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>Giriş Yap</button>
      </div>
    );
  }

  const userRole = String(user.role).toLowerCase();

  return (
    <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ margin: 0, color: '#333' }}>📚 Kütüphane Yönetim Sistemi</h2>
        <div>
          <span style={{ fontSize: '15px' }}>Hoş geldin, <b>{user.email}</b> ({userRole})</span>
          <button onClick={logout} style={{ marginLeft: '20px', color: '#dc3545', cursor: 'pointer', border: '1px solid #dc3545', padding: '6px 12px', borderRadius: '6px', background: 'white', fontWeight: 'bold' }}>Çıkış Yap</button>
        </div>
      </header>

      <main style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
        {userRole === 'admin' ? (
          /* --- ADMİN PANELİ --- */
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#856404', textAlign: 'center', marginBottom: '30px' }}>🛠️ Yönetici Paneli</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={() => navigate('/admin/categories')} style={adminBtnStyle}>📁 Kategorileri Düzenle</button>
              <button onClick={() => navigate('/admin/authors')} style={adminBtnStyle}>✍️ Yazarları Düzenle</button>
              <button onClick={() => navigate('/admin/books')} style={adminBtnStyle}>📖 Kitap Envanterini Yönet</button>
              <button onClick={() => navigate('/admin/users')} style={{ ...adminBtnStyle, backgroundColor: '#dc3545' }}>👥 Üyeleri Yönet & Yetkilendir</button>
              <button onClick={() => navigate('/books')} style={{ ...adminBtnStyle, backgroundColor: '#28a745' }}>📋 Kitap Durum Listesi</button>
            </div>
          </div>
        ) : (
          /* --- BÜYÜTÜLMÜŞ OKUYUCU MENÜSÜ --- */
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '50px', 
            borderRadius: '25px', 
            width: '100%', 
            maxWidth: '600px', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.07)', 
            border: '1px solid #e0e0e0',
            textAlign: 'center' 
          }}>
            <h2 style={{ color: '#0c5460', fontSize: '28px', marginBottom: '15px' }}>📖 Okuyucu Menüsü</h2>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
              Kütüphane kataloğuna göz atmak ve kitapların güncel durumunu görmek için aşağıdaki butona tıklayın.
            </p>
            <button 
              onClick={() => navigate('/books')} 
              style={{ 
                width: '100%', 
                padding: '25px', 
                cursor: 'pointer', 
                backgroundColor: '#0c5460', 
                color: 'white', 
                border: 'none', 
                borderRadius: '15px', 
                fontWeight: 'bold', 
                fontSize: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '15px',
                transition: 'transform 0.2s',
                boxShadow: '0 8px 20px rgba(12, 84, 96, 0.2)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '30px' }}>📚</span> Kitap Listesini Görüntüle
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const adminBtnStyle = { width: '100%', padding: '18px', cursor: 'pointer', backgroundColor: '#856404', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '17px', textAlign: 'left', display: 'flex', alignItems: 'center' };

export default Home;