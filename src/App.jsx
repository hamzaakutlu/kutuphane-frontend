import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import AdminBooks from './pages/AdminBooks';
import AdminAuthors from './pages/AdminAuthors';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && String(user.role).toLowerCase().trim() === 'admin';

  return (
    <Router>
      <div style={{ fontFamily: 'Arial' }}>
        <Routes>
          {/* Ana Sayfa: Kontrol Merkezi */}
          <Route path="/" element={<Home />} />
          
          {/* Kimlik Doğrulama */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Kullanıcı Sayfaları */}
          <Route path="/books" element={token ? <BookList /> : <Navigate to="/login" />} />
          
          {/* Admin Yönetim Sayfaları */}
          <Route path="/admin/books" element={isAdmin ? <AdminBooks /> : <Navigate to="/" />} />
          <Route path="/admin/authors" element={isAdmin ? <AdminAuthors /> : <Navigate to="/" />} />
          <Route path="/admin/categories" element={isAdmin ? <AdminCategories /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;