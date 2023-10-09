import React, { useState,useEffect } from 'react';
import './Home.css';
import image1 from '../../Assets/image1.jpg';
import { GrLocation } from 'react-icons/gr';
import { MDBCol, MDBContainer, MDBRow, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';

import Aos from 'aos';
import 'aos/dist/aos.css';
const Home = () => {
  
 
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

 

  return (
    <section className='home'>
      <div className='overlay'></div>
      <img src={image1} alt="Image description"  />
      <div className='homeContent container'>
        <div className='textDiv'>
          <span data-aos='fade-up' className='smallText'>
            Our Packages
          </span>
          <h1 data-aos='fade-up' className='homeTitle'>
            Search Your Holiday
          </h1>
       
          
        
        </div>
      </div>
    </section>
  );
};







export default Home;
