import React, { useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Change "link" to "Link"
import UserCard from '../../components/user/UserCard';
import { getTours } from '../../redux/features/tourSlice';

const UserHome = () => {
  const { tours, loading } = useSelector((state) => ({ ...state.tour }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTours());
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <section className='home'>
        <div className='secContainer container'>
          <div className='homeText'>
            <h1 className='title'>Plan Your Trip With Yathra</h1>
            <p className='subTitle'>
              Travel To Your Favourite City Respectful Of The Environment!
            </p>
            <button className='btn'>
              <Link to='/explore'>Explore Now</Link> {/* Use the Link component */}
            </button>
          </div>
        </div>
      </section>

      <div
        style={{
          margin: 'auto',
          padding: '15px',
          maxWidth: '1000px',
          textAlign: 'center', // Use textAlign instead of alignContent
        }}
      >
        <MDBRow className='mt-5'>
          {tours.length === 0 && (
            <MDBTypography className='text-center mb-0' tag='h2'>
              No Tours Found
            </MDBTypography>
          )}
          <MDBCol>
            <MDBContainer>
              <MDBRow className='row-cols-1 row-cols-md-3 g-2'>
                {tours.map((item, index) => (
                  <UserCard key={index} {...item} />
                ))}
              </MDBRow>
            </MDBContainer>
          </MDBCol>
        </MDBRow>
      </div>
    </div>
  );
};

export default UserHome;
