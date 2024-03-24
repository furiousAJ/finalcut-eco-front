import React, { useEffect } from 'react'
import Flexdraw from './Flexdraw'
import Slidebar from './Slidebar'
import './flexslide.scss'
import Footer from '../Userfooter/Footer'
import Midpart from '../Userfooter/Midpart'
import Minfooter from '../Userfooter/Minfooter'
import { useNavigate } from 'react-router-dom'

const Flexslide = () => {
  const navigate = useNavigate(); // Define navigate variable

  useEffect(() => {
    const getToken = () => {
      return localStorage.getItem('token');
    };
  
    const token = getToken();
    if (!token) {
      navigate('/login');
    } else {
      console.log('Token fetched:', token);
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Invalid token format');
        navigate('/login');
        return;
      }
      const payload = tokenParts[1];
      console.log('Token Payload:', payload);
      try {
        const decodedPayload = atob(payload);
        console.log('Decoded Payload:', decodedPayload);
        const parsedPayload = JSON.parse(decodedPayload);
        const userId = parsedPayload.userId; // Assuming the payload contains userId
        console.log('User Id:', userId);
        // Further actions with userId if needed
      } catch (error) {
        console.error('Error decoding token payload:', error);
        navigate('/login');
      }
    }
  }, [navigate]);
  
  return (
    <div className='midall'>
      
      <Flexdraw/><br></br>
      
      <div className='alignflexbox'>
      <Slidebar/></div><br></br>
      <h2 className='hd'>Featured Categories</h2>
      <div className='homefooterbottom'>
      
        <div className='usermid'>
        <Midpart/>
        </div>
      </div><div>
      <Minfooter/>
      <Footer/>
      </div>
     
    </div>
  )
}

export default Flexslide