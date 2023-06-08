// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase";
import Validation from './LoginValidation';
import logo from "../../Images/Logo.png";
import "./Styles.css"; // Import the styles.css file

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
    <section className="login-section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>
          <div className="col-md-6">
            <div className="card login-card shadow-lg">
              <div className="card-body p-4 p-lg-5 text-black">
                <form onSubmit={handleSubmit}>
                  <h5 className="fw-bold mb-3 pb-1">Sign into your account</h5>

                  <div className="form-group mb-4">
                    <label className="form-label login-form-label" htmlFor="form2Example17">Email address</label>
                    <input
                      type="email"
                      id="form2Example17"
                      className="form-control form-control-lg"
                      value={values.email}
                      onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                    {errors.email && <span className="text-danger error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label login-form-label" htmlFor="form2Example27">Password</label>
                    <input
                      type="password"
                      id="form2Example27"
                      className="form-control form-control-lg"
                      value={values.password}
                      onChange={(e) => setValues({ ...values, password: e.target.value })}
                    />
                    {errors.password && <span className="text-danger error-message">{errors.password}</span>}
                  </div>

                  <div className="pt-1 mb-4">
                    <button className="btn btn-dark btn-lg btn-block button-primary" type="submit">Login</button>
                  </div>

                  <Link to="/forgotPassword" className="small text-muted login-link">Forgot password?</Link>
                  <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                    Don't have an account? <Link to="/signup" className="login-link">Register here</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
