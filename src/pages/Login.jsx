import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend'e giriş isteği atıyoruz
      const response = await api.post('/auth/login', { email, password });
      
      // 1. Token ve kullanıcı bilgilerini tarayıcı hafızasına kaydediyoruz
      localStorage.setItem('token', response.data.access_token);
      
      // 2. Rol bilgisini (admin/user) içeren kullanıcı nesnesini kaydediyoruz
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('Giriş başarılı! Yönlendiriliyorsunuz...');
      
      // 3. SAYFAYI TAMAMEN YENİLEME: Bu işlem localStorage'daki yeni rolün 
      // App.jsx tarafından okunmasını ve admin menüsünün açılmasını sağlar.
      window.location.href = '/'; 
      
    } catch (error) {
      // Hata durumunda backend'den gelen mesajı gösteriyoruz
      const errorMsg = error.response?.data?.message || 'Giriş başarısız! Bilgilerinizi kontrol edin.';
      alert(errorMsg);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '50px auto', 
      border: '1px solid #ddd', 
      borderRadius: '10px', 
      fontFamily: 'Arial',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
    }}>
      <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Kütüphane Girişi</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>E-posta:</label>
          <input 
            type="email" 
            placeholder="ornek@mail.com"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input 
            type="password" 
            placeholder="******"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '16px' 
          }}
        >
          Giriş Yap
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Hesabınız yok mu? {' '}
        <span 
          onClick={() => navigate('/register')} 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          Buradan Kayıt Olun
        </span>
      </div>
    </div>
  );
};

export default Login;