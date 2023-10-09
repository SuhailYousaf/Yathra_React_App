import React, { useEffect } from 'react';
import { toast } from "react-toastify"
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { adminCategoryList } from '../../../redux/features/adminSlice';
import { adminDeleteCategory } from '../../../redux/features/adminSlice';
import DataTable from '../../../components/admin/DataTable/DataTable';
import './Category.css';

const Category = () => {


  const { categories,error,admin, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
 

  useEffect(() => {
    if (!admin) {
      toast.error('Admin not logged in'); // Show toast message for not logged in
  } else {
      dispatch(adminCategoryList());
  }
  }, [dispatch, admin]);
  

  // Check if categories is undefined or loading
  if (loading || !categories) {
    return <p>Loading...</p>; // You can display a loading indicator here
  }

  const rows = categories.map((category, index) => ({
    id: index, // You can use a unique identifier here if available
    ...category,
  }));


  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
  
    if (!confirmDelete) {
      return;
    }
  
    try {
      // Make the API request to delete the category
      await dispatch(adminDeleteCategory(_id));
  
      // If the request is successful, update the UI by fetching the categories again
      dispatch(adminCategoryList());
  
      // Optionally, you can show a success message to the user
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error('Error deleting category:', error);
      // Optionally, you can show an error message to the user
      toast.error("Error deleting category. Please try again later.");
    }
  };
  

  


  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      editable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      editable: false,
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
            <div className='action'>
            <div className='delete' onClick={() => handleDelete({ _id: params.row._id })}>
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
        <Link to='/admin/addCategory'>
          <button>Add New Category</button>
        </Link>
      </div>
      <DataTable slug='categories' columns={columns} rows={rows} />
    </div>
  );
};

export default Category;
