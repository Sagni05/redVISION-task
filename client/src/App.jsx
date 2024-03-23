import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import Form from './Components/Form/Form';
import PrivateRoute from './PrivateRoute';
import { ToastContainer } from 'react-toastify';

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathName = location.pathname


  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {

      if (pathName != "/login" && pathName != "/signup") {
        navigate(pathName)
      } else {
        navigate("/books")
      }
    } else {
      navigate("/login")
    }
  }, [])

  return (
    <>
      <Routes>

        <Route path="/" element={<PrivateRoute token={token} />} >
          <Route path="books" element={<BookList />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path='admin/AdminDashboard' element={<AdminDashboard />} />
          <Route path='admin/add-book' element={<Form />} />
        </Route>


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App;
