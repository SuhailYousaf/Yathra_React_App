import React, { useState, useEffect } from 'react';
import './Main.css';
import { MDBCol, MDBContainer, MDBRow, MDBTypography } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import Aos from 'aos';
import 'aos/dist/aos.css';
import UserCard from '../../components/user/UserCard';
import { getTours, searchTours } from '../../redux/features/tourSlice';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Packages.css';

const Packages = () => {
  const { tours, loading } = useSelector((state) => ({ ...state.tour }));
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTours());
  }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  const itemsPerPage = 5;

  const filteredTours = search
    ? tours.filter((tour) =>
        tour.title.toLowerCase().includes(search.toLowerCase())
      )
    : tours;

  const pageCount = Math.ceil(filteredTours.length / itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to the first page when a new search is performed
    if (search) {
      dispatch(searchTours(search));
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTours = filteredTours.slice(startIndex, endIndex);

  return (
    <section data-aos='fade-up' className='main container section'>
    <div className='text'>
        <h3 className='title'>Our Packages</h3>
        </div>
      <div data-aos='fade-up'>
        <form className='d-flex input-group w-auto' onSubmit={handleSubmit}>
        <div className='search-bar-container'>
        <input
            type='text'
            className='form-control'
            placeholder='Search Tour'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          </div> 
        </form>
        <MDBRow className='mt-5'>
          {displayedTours.length === 0 ? (
            <MDBTypography className='text-center mb-0' tag='h2'>
              No Tours Found
            </MDBTypography>
          ) : (
            <MDBCol>
              <MDBContainer>
                <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                  {displayedTours.map((item, index) => (
                    <UserCard key={index} {...item} />
                  ))}
                </MDBRow>
              </MDBContainer>
            </MDBCol>
          )}
        </MDBRow>
        <div className='pagination-container'>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      </div>
    </section>
  );
};

export default Packages;
