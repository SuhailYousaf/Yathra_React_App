import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardGroup } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { GrLocation } from 'react-icons/gr';
import { BsClipboardCheck } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const UserCard = ({ images, description, title, tags, _id, name }) => {
  const user = useSelector((state) => state.userr.user); // Get user data from Redux store

  // Function to check if the user is logged in
  const isLoggedIn = user !== null;

  // Function to handle the "Details" button click
  const handleDetailsClick = () => {
    if (isLoggedIn) {
      // User is logged in, navigate to the details page
      window.location.href = `/getTour/${_id}`;
    } else {
      // User is not logged in, show a toast message and prompt to log in
      toast.error('Please log in to view details.');
    }
  };

  // Function to create an excerpt of the description
  const excerpt = (str) => {
    if (str.length > 45) {
      str = str.substring(0, 45) + '...';
    }
    return str;
  };

  return (
    <MDBCardGroup>
      <MDBCard className='h-50 mt-1 d-sm-flex agent-card'>
        <MDBCardImage
          src={images.length > 0 ? images[0] : images}
          alt={title}
          position='top'
          className='card-image'
        />
        <div className='top-left'>{name}</div>
        <div className='text-start tag-card'>
          {tags.map((item, index) => (
            <span key={index}>#{item} </span>
          ))}
        </div>
        <MDBCardBody>
          <MDBCardTitle className='text-start' style={{ fontSize: '24px' }}>
            <GrLocation style={{ fontSize: '24px' }} /> {title}
          </MDBCardTitle>

          <MDBCardText className='text-start'> {excerpt(description)}</MDBCardText>
          <div className='text-start'>
            {/* Use the handleDetailsClick function for the onClick event */}
            <button
              onClick={handleDetailsClick}
              className='btn flex'
              style={{ fontSize: '18px' }}
            >
              DETAILS <BsClipboardCheck style={{ fontSize: '24px' }} />
            </button>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  );
};

export default UserCard;
