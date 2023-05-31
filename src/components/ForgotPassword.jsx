import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.jpg"; 

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/forgotpassconfirm")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        // ..
      });
  };
  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>  
      <div className='position-absolute top-0 start-0 p-3'>
        <img src={logo} alt='Logo' className='rounded' style={{ width: '100px', height: 'auto' }} />
      </div> 
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder='Email address'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className='btn btn-primary w-100'>Send Reset Link</button>
          <p></p>
          <Link to="/" className='btn btn-success border w-100'>Back to Login</Link>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;