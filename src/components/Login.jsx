import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.jpg"; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/landingpage');
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
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
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder='Password'
              className='form-control rounded-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='btn btn-primary w-100'>Log in</button>
          <p></p>
          <Link to="/signup" className='btn btn-success border w-100'>Create Account</Link>
          <p></p>
          <Link to='/forgotPassword' className='btn btn-secondary border w-100'>Forgot Password</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
