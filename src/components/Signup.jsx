import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.png"; 
import Validation from './SignupValidation';

const app = initializeApp(firebaseConfig);

function Signup() {
  const [values, setValues] = useState({
    email: '',
    password: '', 
    passwordAgain: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const database = getDatabase(app);
    const auth = getAuth(app);

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).every((key) => validationErrors[key] === '');
      if (isValid) {
      const { email, password } = values;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/email-already-in-use') {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: 'Email is already in use',
            }));
          }
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="position-absolute top-0 start-0 p-3">
        <img src={logo} alt="Logo" className="rounded" style={{ width: '100px', height: 'auto' }} />
      </div>
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Email address"
              className="form-control rounded-0"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="form-control rounded-0"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Enter Password Again</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password Again"
              className="form-control rounded-0"
              value={values.passwordAgain}
              onChange={(e) => setValues({ ...values, passwordAgain: e.target.value })}
            />
            {errors.passwordAgain && <span className='text-danger'>{errors.passwordAgain}</span>}
          </div>
          <button className="btn btn-primary w-100">Sign Up</button>
          <p></p>
          <Link to="/" className="btn btn-success border w-100">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
