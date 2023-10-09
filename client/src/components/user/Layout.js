import React from 'react';
import UserHeader from './UserHeader';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <UserHeader />
      <Outlet />
    </div>
  );
};

export default Layout;
