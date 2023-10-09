import React, { useState } from 'react';
import './AddCategory.css'; // Import your CSS file for styling
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux';
import { adminaddCategory } from '../../../redux/features/categorySlice';

const AddCategory = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryData = { title, description }
    dispatch(adminaddCategory({ updatedTourData: categoryData, navigate, toast }))


    setTitle('');
    setDescription('');
  };

  return (
    <div className="add-category">
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
