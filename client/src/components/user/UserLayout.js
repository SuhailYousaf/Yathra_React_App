import React from 'react'
import UserHeader from './UserHeader'
import Home from './Home';
// import Footer from './Footer';
import Main from './Main';

import { Outlet } from 'react-router-dom'



const UserLayout = () => {
  return (
    <div>
      <UserHeader />
      <Home/>
      <Main/>
      
    </div>
  )
}

export default UserLayout
