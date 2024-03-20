import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './pages/Header';
import Footer from './pages/Footer';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import Form from './Components/Form/Form';

function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      {token ? (
        <>
          <Header />
          <Routes>
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path='/admin/AdminDashboard' element={<AdminDashboard />} />
            <Route path='/admin/add-book' element={<Form />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </>
  );
}

export default App;
