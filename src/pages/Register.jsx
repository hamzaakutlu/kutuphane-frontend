import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Artık role göndermiyoruz, backend otomatik 'user' atıyor
      await api.post('/auth/register', { email, password });
      alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Kayıt sırasında bir hata oluştu.';
      alert(errorMessage);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '10px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#28a745' }}>Yeni Kayıt</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label>E-posta:</label>
          <input 
            type="email" 
            placeholder="ornek@mail.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Şifre:</label>
          <input 
            type="password" 
            placeholder="******" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} 
          />
        </div>
        
        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Kayıt Ol
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        Zaten hesabınız var mı? {' '}
        <span 
          onClick={() => navigate('/login')} 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Giriş Yapın
        </span>
      </div>
    </div>
  );
};

export default Register;