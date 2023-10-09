import React, { useEffect, useState } from 'react';
import './Home.css';
import TopBox from '../../../components/admin/topBox/TopBox';
import Chart from '../../../components/admin/ChartBox/Chart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../../redux/features/adminSlice';
import { toast, ToastContainer } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const { users, error, admin } = useSelector((state) => state.admin);
  const [Users, setUsers] = useState([]);
  console.log("adminnnnn", admin);

  useEffect(() => {
    // Check if admin is logged in before fetching users
    if (!admin) {
      toast.error('Admin not logged in'); // Show toast message for not logged in
    } else {
      dispatch(fetchAdminUsers());
    }
  }, [dispatch, admin]);

  console.log('userssss', users);

  const chartBoxUser = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Total Users",
    number: users.length, // Pass the user count here
    dataKey: "users",
    percentage: 45,
    chartData: [
      { name: "Sun", users: 400 },
      { name: "Mon", users: 600 },
      { name: "Tue", users: 500 },
      { name: "Wed", users: 700 },
      { name: "Thu", users: 400 },
      { name: "Fri", users: 500 },
      { name: "Sat", users: 450 },
    ],
  };

  return (
    <div className='adminHome'>
      <div className='box Box1'><TopBox /></div>
      <div className='box Box2'><Chart {...chartBoxUser} /></div>
      <div className='box Box3'>Box3</div>
      <div className='box Box4'>Box4</div>
      <div className='box Box5'>Box5</div>
      <div className='box Box6'>Box6</div>
      <div className='box Box7'>Box7</div>
      <div className='box Box8'>Box8</div>
      <div className='box Box9'>Box9</div>
    </div>
  );
};

export default Home;
