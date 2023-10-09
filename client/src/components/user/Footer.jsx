import React,{useEffect} from 'react'
import './Footer.css'
import image from '../../Assets/image.jpg';
import {FiSend} from 'react-icons/fi';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Footer = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
   <section className='footer'>
       <div  className='videoDiv'>
       <img src={image} alt="Image description" style={{ height: '80%', width: '150%', objectFit: 'cover' }} />

       </div>

       <div  className='secContent container'>
        <div className='contactDiv flex'>

        <div className='text'>

        <small data-aos='fade-up' >Keep In Touch</small>
        <h2 data-aos='fade-up'>Travel With Us</h2>
        </div>
        <div className='inputDiv flex'>
            <input  type='text' placeholder='Enter Email Address'></input>
              <button  className='btn flex' type='submit'>
                  SEND<FiSend className="icon"/>
              </button>
            </div>
           
        </div>     
       
       </div>
        
       </section>
  )
}

export default Footer