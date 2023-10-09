import React, { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
  MDBValidationItem
} from 'mdb-react-ui-kit';
import ChipInput from 'material-ui-chip-input';
import FileBase from 'react-file-base64';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTour, getCategory } from '../../../redux/features/tourSlice';

const initialState = {
  title: '',
  description: '',
  tags: [],
  city: '',
  price: '',
  dayone: '',
  daytwo: '',
  imageFiles: [], // Updated to hold selected image files
  category: ''
};

const AddProduct = () => {
  const [tourData, setTourData] = useState(initialState);
  const { error, loading, categories } = useSelector((state) => ({ ...state.tour }));
  const { admin } = useSelector((state) => ({ ...state.auth }));

  const { title, description, tags, city, price, dayone, daytwo, category, imageFiles } = tourData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [validation, setValidation] = useState({
    title: false,
    city: false,
    price: false,
    description: false,
    dayone: false,
    daytwo: false,
    imageFiles: false
  });



  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  if (loading || !tourData) {
    return <p>Loading...</p>; // You can display a loading indicator here
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (title && description && tags && imageFiles.length > 0) {
      const formData = new FormData();
  
      formData.append('title', title);
      formData.append('description', description);
      formData.append('city', city);
      formData.append('price', price);
      formData.append('dayone', dayone);
      formData.append('daytwo', daytwo);
      formData.append('category', category);
  
      tags.forEach((tag) => {
        formData.append('tags[]', tag);
      });
  
      // Append all selected image files to the formData
      imageFiles.forEach((file, index) => {
        formData.append(`imageFiles`, file); // Use the file object itself, no need for file.base64
        // Log each image's details
        console.log(`Image ${index + 1}:`, file.name);
      });
  
      dispatch(createTour({ formData, navigate, toast }));
      handleClear();
    } else {
      // Handle the case when required fields are missing or no images are selected.
      // You can display an error message or handle it according to your UI requirements.
    }
  };
  

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: value });
  };

  const handleAddTag = (tag) => {
    setTourData({ ...tourData, tags: [...tourData.tags, tag] });
  };

  const handleDeleteTag = (deleteTag) => {
    setTourData({ ...tourData, tags: tourData.tags.filter((tag) => tag !== deleteTag) });
  };

  const handleClear = () => {
    setTourData(initialState);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image types if needed
  
    const invalidFiles = files.filter((file) => !allowedFileTypes.includes(file.type));
  
    if (invalidFiles.length > 0) {
      // Invalid file types are selected, show a toast message
      toast.error('Please select image files only.');
    } else {
      setTourData({ ...tourData, imageFiles: files });
    }
  };
  
  


  

  return (
    <div style={{ color: 'black', margin: 'auto', padding: '10px', maxWidth: '450px', alignContent: 'center', marginTop: '5px' }} className='container'>
      <MDBCard alignment='center'>
        <h5 style={{ color: 'black' }}>Add Tours</h5>
        <MDBCardBody >
          <MDBValidation onSubmit={handleSubmit} className='row g-3' noValidate>
            <div className='col-md-12'>
              <input
                placeholder='title'
                type='text'
                value={title}
                name='title'
                onChange={onInputChange}
                className='form-control'
                style={{ height: '30px' }} 
                required
                invalid={validation.title}
              />
            </div>
            <div className='col-md-12'>
              <MDBValidationItem feedback="please enter the city" invalid>
              <input
                  placeholder='city'
                  type='text'
                  value={city}
                  name='city'
                  onChange={onInputChange}
                  className='form-control'
                  style={{ height: '30px' }} 
                  required
                  invalid={validation.city}
                />
              </MDBValidationItem>
            </div>
            <div className='col-md-12'>
            <MDBValidationItem feedback="please enter day one" invalid>
              <input
                placeholder='dayone'
                type='text'
                value={dayone}
                name='dayone'
                onChange={onInputChange}
                className='form-control'
                style={{ height: '30px' }}
                required
                invalid={validation.dayone}
              />
            </MDBValidationItem>
          </div>

          <div className='col-md-12'>
              <MDBValidationItem feedback="please enter day two" invalid>
                <input
                  placeholder='daytwo'
                  type='text'
                  value={daytwo}
                  name='daytwo'
                  onChange={onInputChange}
                  className='form-control'
                  style={{ height: '30px' }}
                  required
                  invalid={validation.daytwo}
                />
              </MDBValidationItem>
            </div>

            <div className='col-md-12'>
              <MDBValidationItem feedback="please select a category" invalid={validation.category}>
                <select
                  name="category"
                  value={category}
                  onChange={onInputChange}
                  className='form-select'
                  style={{ height: '40px' }} 
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.title} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </MDBValidationItem>
            </div>
            <div className='col-md-12'>
              <MDBValidationItem feedback="please enter the price" invalid>
              <input
                  placeholder='price'
                  type='text'
                  value={price}
                  name='price'
                  onChange={onInputChange}
                  className='form-control'
                  style={{ height: '30px' }} 
                  required
                  invalid={validation.price}
                />
              </MDBValidationItem>
            </div>
            <div className='col-md-12'>
              <textarea
                placeholder='description'
                type='text'
                style={{ height: "100px" }}
                value={description}
                name='description'
                onChange={onInputChange}
                className='form-control'
                style={{ height: '50px' }} 
                required
                invalid={validation.description}
              />
            </div>
            <div className='col-md-12'>
              <ChipInput
                name="tags"
                varient="outlined"
                placeholder='Enter tag'
                fullWidth
                value={tags}
                onAdd={(tag) => handleAddTag(tag)}
                style={{ height: '30px' }} 
                onDelete={(tag) => handleDeleteTag(tag)}
              />
            </div>
            <div style={{ color: 'black' }} className='d-flex justify-content-start'>
            <input
                type='file'
                multiple={true}
                accept='image/*' // Specify accepted file types (images in this case)
                onChange={handleFileUpload} // Handle file upload
                style={{ height: '40px' }} 
              />
            </div>
            <div className='col-12'>
              <MDBBtn style={{ width: '100%' }}>Submit</MDBBtn>
              </div>
              <div>
              <MDBBtn style={{ width: '100%' }} onClick={handleClear}>Clear</MDBBtn>
            </div>
          </MDBValidation>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default AddProduct;



       
