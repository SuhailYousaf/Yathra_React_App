import React, { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../../components/admin/DataTable/DataTable';
import { Link } from 'react-router-dom';
import { getTours } from '../../../redux/features/tourSlice';
import { adminDeletePackage } from '../../../redux/features/adminSlice';
import { toast } from "react-toastify"

import './Products.css';

const Products = () => {
  const [open, setOpen] = useState(false);
  const {error, admin } = useSelector((state) => state.admin);
  const { tours, loading } = useSelector((state) => state.tour);
  const dispatch = useDispatch();


  

  useEffect(() => {
    if (!admin) {
      toast.error('Admin not logged in'); // Show toast message for not logged in
  } else {
      dispatch(getTours());
  }
  }, [dispatch, admin]);
 

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const rows = tours.map((tour, index) => ({
    id: index, // You can use a unique identifier here if available
    ...tour,
  }));


  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the package");
  
    if (!confirmDelete) {
      return;
    }
  
    try {
      // Make the API request to delete the package
      await dispatch(adminDeletePackage(_id));
  
      // If the request is successful, update the UI by fetching the tours again
      dispatch(getTours());
      toast.success("Product status changed successfully!");
      // Optionally, you can show a success message to the user
    } catch (error) {
      console.error('Error deleting package:', error);
      // Optionally, you can show an error message to the user
      toast.error("Error deleting product. Please try again later.");
    }
  };
  


  // Define your data grid columns here
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'images',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => {
        if (Array.isArray(params.row.images) && params.row.images.length > 0) {
          const firstImage = params.row.images[0];
          return (
            <img
              src={firstImage}
              alt={`First Image`}
              className="image"
            />
          );
        } else {
          return <img src="/noavatar.png" alt="No Image" className="no-image" />;
        }
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 100,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
      type: 'boolean',
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <div className="action">
            <div className="delete" onClick={() => handleDelete({ _id: params.row._id })}>
              <img src="/delete.svg" alt="" />
            </div>
          </div>
        );
      },
    },
  ];
  

  return (
    <div className='products'>
      <div className='info'>
        <h1>Products</h1>
        <Link to='/admin/addProduct'>
        <button>Add New Product</button>
      </Link>
      </div>
      <DataTable slug='tours' columns={columns} rows={rows} />
    </div>
  );
};

export default Products;
