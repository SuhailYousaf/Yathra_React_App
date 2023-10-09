import React, { useEffect } from 'react';
import './App.css';
import './styles/global.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route,  Router  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/features/userrSlice'


import UserLayout from './components/user/UserLayout';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';
import SingleTour from './pages/user/SingleTour';
import Layout from './components/user/Layout';
import Payment from './pages/user/Payment';
import Success from './pages/user/Success';
import Main from './components/user/Main';
import AdminLogin from './pages/admin/AdminLogin'
import { setAdmin } from './redux/features/adminSlice'
import AddProduct from './pages/admin/products/AddProduct';
import Navbar from './components/admin/Navbar/Navbar';
import Footer from './components/admin/Footer/Footer';
import Menu from './components/admin/Menu/Menu';
import { Outlet } from 'react-router-dom';
import AdminHome from './pages/admin/home/Home';
import AdminUsers from './pages/admin/users/Users';
import AdminProducts from './pages/admin/products/Products';
import Category from './pages/admin/Category/Category';
import AddCategory from './pages/admin/Category/AddCategory';
import  Profile from './pages/user/profile/Profile';
import BookingList from './pages/user/BookingLIst/BookingList';
import BookingDatatable from './components/admin/DataTable/BookingTable';
import Packages from './components/user/Packages';
import Chat from './pages/Chat/Chat';
import ChatAdmin from './pages/admin/Chat/ChatAdmin';

function App() {
  
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("userprofile"))
  const admin = JSON.parse(localStorage.getItem("profile"))

  useEffect(() => {
    dispatch(setAdmin(admin))
  }, [])

  useEffect(() => {
    dispatch(setUser(user))
  }, [])



  const AdminLayout = () =>{

    
       
    return (     
      <div className="AdminMain">
        <Navbar />
        <div className="AdminContainer">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
              <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          

          <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="" element={<AdminHome />} />
          <Route path="addProduct" element={<AddProduct/>} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="Category" element={<Category />} />
          <Route path="addCategory" element={<AddCategory/>}/>
          <Route path="bookings" element={<BookingDatatable/>}/>
          <Route path="chatAdmin" element={<ChatAdmin/>}/>
        </Route>
        <Route path="adminlogin" element={<AdminLogin />} />
          



        <Route path="" element={<Layout/>}>
    <Route path="/" element={<UserLayout />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/register" element={<UserRegister />}/>
    <Route path="/getTour/:id" element={<SingleTour/>} />
    <Route path="/payment/:id" element={<Payment />} />
    <Route path='/success' element={<Success/>}/>
    <Route path="/tours/search" element={<UserLayout/>} />
    <Route path="/profile" element={<Profile/>} />
    <Route path='/bookings' element={<BookingList/>}/>
    <Route path='/packages' element={<Packages/>}/>
    <Route path='/chat' element={<Chat/>}/>

    </Route>
    

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
