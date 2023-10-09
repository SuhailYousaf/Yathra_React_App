import React, { useEffect } from 'react';
import './users.css';
import UserDatatable from '../../../components/admin/DataTable/UserDatatable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../../redux/features/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const dispatch = useDispatch();
    const { users, error, admin } = useSelector((state) => state.admin);
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
        <div className='adminuser'>
            {admin ? (
                <UserDatatable rows={users} />
            ) : (
                <div className="error-message">Admin not logged in</div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Users;
