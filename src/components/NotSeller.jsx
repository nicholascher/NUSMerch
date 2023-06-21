import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.png"; 

function NotSeller() {

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>  
      <div className='position-absolute top-0 start-0 p-3'>
        <img src={logo} alt='Logo' className='rounded' style={{ width: '100px', height: 'auto' }} />
      </div> 
      <div className='bg-white p-3 rounded w-25'>
        <h2>This account is not approved as a seller</h2>
        <p>To register as a seller please contact us at jingyu2987@gmail.com</p>
        <Link to="/landingpage" className='btn btn-success border w-100'>Back to Home Page</Link>
      </div>
    </div>
  );
}

export default NotSeller;