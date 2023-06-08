import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.png"; 

function ForgotPassword() {

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>  
      <div className='position-absolute top-0 start-0 p-3'>
        <img src={logo} alt='Logo' className='rounded' style={{ width: '100px', height: 'auto' }} />
      </div> 
      <div className='bg-white p-3 rounded w-25'>
        <h2>A password reset link has been sent to your email.</h2>
        <p>Please ensure that the new password contains at least 12 characters, including uppercase, lowercase, numeric characters, and special characters. </p>
        <Link to="/" className='btn btn-success border w-100'>Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;