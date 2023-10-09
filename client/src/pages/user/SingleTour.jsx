import React, { useEffect,useState } from "react";
import './SingleTour.css';
import { MDBCard, MDBValidationItem, MDBInput, MDBCardBody, MDBCardText, MDBCardImage, MDBContainer, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from "react-redux";
import {useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getTour } from "../../redux/features/tourSlice";
import { bookPackage } from '../../redux/features/bookingSlice';

// import RelatedTours from "../components/RelatedTours";
// import DisqusThread from "../components/DisqusThread";

const SingleTour = () => {
  const dispatch=useDispatch()
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { tour } = useSelector((state) => ({ ...state.tour }));
    const { user } = useSelector((state) => ({ ...state.userr }));
    console.log('userrrrrrrrrr',user);
  // const { tours, loading } = useSelector((state) => ({ ...state.tour }));

    const { id } = useParams();
    const navigate = useNavigate();

    const [bookin, setBookin] = useState('');
    const [guestno, setGuestno] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');


      const handleSubmit = (e) => {
      e.preventDefault();
      const packagedata = { bookin, name, email, guestno, phone, place: tour._id, price: tour.price, owner: user.UserDoc };
      dispatch(bookPackage({ packagedata, navigate }))
      // Redirect after booking is successful
      // Redirect to the desired route  
      console.log(user.UserDoc, "555555555555555555555555555555555")

      console.log(packagedata, 'pppppppppppppppp')

      setBookin('');
      setGuestno(1); // Reset guestno to a number
      setName('');
      setEmail('');
      setPhone('');
  };
  

 
  useEffect(() => {
    if (id) {
      dispatch(getTour(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
   
    <div className="Single" style={{ marginTop: '150px', overflowX: 'hidden' }}>
      <div className="details">
      <div className="big-img">
  {Array.isArray(tour.images) && tour.images.length > 0 && (
    <img src={tour.images[selectedImageIndex]} alt="" />
  )}
</div>

    
        <div className="box">
          <div className="row">
          <h2>{tour.title}</h2>
          <h7>day1:{tour.dayone}</h7>
          <h7>day2:{tour.daytwo}</h7>
          <span>price : ${tour.price}</span>
          <h5>{tour.tags}</h5>
          <p>{tour.description}</p>
          </div>

           
          
          <div className="thumb">
          {Array.isArray(tour.images) && tour.images.length > 0 && (
            tour.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                className={`thumbnail-image ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)} // Update the selected image index
              />
            ))
          )}
        </div>
        

          <div className='col-md-12'>
          <MDBValidationItem feedback="please enter the title" invalid>
              <MDBInput
                  placeholder='bookin'
                  type='date'
                  value={bookin}
                  name='bookin'
                  onChange={(ev) => { setBookin(ev.target.value) }}
                  className='form-control'
                  required
              // invalid={validation.bookin}
              // validation="please provide title"



              />
          </MDBValidationItem>

      </div>
      <div className='col-md-12'>
          <MDBValidationItem feedback="please enter the title" invalid>
              <MDBInput
                  placeholder='guestno'
                  type='Number'
                  value={guestno}
                  name='guestno'
                  onChange={(ev) => { setGuestno(ev.target.value) }}
                  className='form-control'
                  required
              // invalid={validation.bookin}
              // validation="please provide title"



              />
          </MDBValidationItem>

      </div>

      <div className='col-md-12'>
          <MDBValidationItem feedback="please enter the title" invalid>
              <MDBInput
                  placeholder='name'
                  type='text'
                  value={name}
                  name='name'
                  onChange={(ev) => setName(ev.target.value)}
                  className='form-control'
                  required
              // invalid={validation.bookin}
              // validation="please provide title"



              />
          </MDBValidationItem>

      </div>
      <div className='col-md-12'>
          <MDBValidationItem feedback="please enter the title" invalid>
              <MDBInput
                  placeholder='email'
                  type='text'
                  value={email}
                  name='email'
                  onChange={(ev) => setEmail(ev.target.value)}
                  className='form-control'
                  required
              // invalid={validation.bookin}
              // validation="please provide title"



              />
          </MDBValidationItem>

      </div>

      <div className='col-md-12'>
          <MDBValidationItem feedback="please enter the title" invalid>
              <MDBInput
                  placeholder='phone'
                  type='text'
                  value={phone}
                  name='phone'
                  onChange={(ev) => setPhone(ev.target.value)}
                  className='form-control'
                  required
              // invalid={validation.bookin}
              // validation="please provide title"

              />
          </MDBValidationItem>

      </div>
      <div className='book-button-container'>
          <MDBBtn onClick={handleSubmit} className='book-button'>
              Book This Package
          </MDBBtn>
      </div>
        </div>
      </div>
  </div>

  )
}

export default SingleTour
