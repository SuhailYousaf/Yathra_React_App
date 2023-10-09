import React, { useEffect } from 'react';
import { fetchAdminUsers } from '../../../redux/features/adminSlice'
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import './TopBox.css';
const TopBox = () => {
  const dispatch = useDispatch();
  const {users, error, admin } = useSelector((state) => state.admin);
   console.log("adminnnnn",admin)
   
  useEffect(() => {
      // Check if admin is logged in before fetching users
      if (!admin) {
          toast.error('Admin not logged in'); // Show toast message for not logged in
      } else {
          dispatch(fetchAdminUsers());
      }
  }, [dispatch, admin]);

  return (
    <div className="topBox">
    <h3>Top Users</h3>
    
    <div className="list">
      {users.map(user=>(
        <div className="listItem" key={user.id}>
          <div className="user">
            <div className="userTexts">
              <span className="username">{user.firstname}</span>
              <span className="email">{user.email}</span>
              <hr
              style={{
                width: '95%',
                border: '0.1px solid #ececec',
                marginTop: '20px',
              }}
            />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default TopBox