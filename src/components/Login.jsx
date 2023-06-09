import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from '../../Images/New Logo.png';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    const isValid = Object.keys(validationErrors).every((key) => validationErrors[key] === '');

    if (isValid) {
      const { email, password } = values;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          navigate('/landingpage');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: 'Incorrect password',
            }));
          }
          if (errorCode === 'auth/user-not-found') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: 'User does not exist',
            }));
          }
        });
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>  
      <div className='position-absolute top-0 start-0 p-3'>
        <img src={logo} alt='Logo' className='rounded' style={{ width: '200px', height: 'auto' }} />
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
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder='Password'
              className='form-control rounded-0'
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
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