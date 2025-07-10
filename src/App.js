import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import LoginForm from './userAuth/Login/Login';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Admin from './pages/admin/Admin';
import Customers from './pages/customers/Customers';
import ProtectedRoute from './components/protectedRoutes';
import AdminRequests from './pages/adminRequests/adminRequests';
import Staff from './pages/Staff/Staff';
import Products from './pages/products/Products';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer position="top-left" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LoginForm/>}/>
        <Route path="/HomePage" element={<HomePage/>}/>
        <Route path="/Customers" element={<ProtectedRoute><Customers/></ProtectedRoute>}/>
        <Route path="/Admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path="/AdminRequests" element={<AdminRequests/>}/>
        <Route path="/Staff" element={<Staff/>}/>
        <Route path="/Products" element={<Products/>}/>
      </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;