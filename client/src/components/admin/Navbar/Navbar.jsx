import React from 'react';
import './Navbar.css';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from '../../../redux/features/adminSlice';

const Navbar = () => {

  const dispatch = useDispatch();

  const admin = useSelector(state => state.admin.admin);
  console.log('user', admin)

  const handleLogout = () => {
    
    dispatch(setLogout());
    
}
  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="" />
        <span>Yathra</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
  <img src="/notifications.svg" alt="" className="notification-icon" />
  <span>1</span>
</div>

        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>Admin</span>

        </div>
       
        {admin?.adminDoc._id ? (
          <button className="btn">
            <a onClick={handleLogout} href="/" >LogOut</a>
            </button>
        ): (
          <button className="btn">
          <a href="/adminlogin">login</a>
          </button>
           ) }
      </div>
    </div>
  );
}

export default Navbar;
