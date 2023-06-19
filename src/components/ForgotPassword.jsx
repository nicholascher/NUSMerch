import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.png";
import "./Styles.css";

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
      });
  };
  return (
    <section className="login-section">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>
          <div className="row col-md-5">
            <div className="card login-card shadow-lg">
              <div className="card-body p-4 p-lg-5 text-black">
                <form onSubmit={handleSubmit}>
                  <h5 className="fw-bold mb-3 pb-1">Forgot Password</h5>
          <div className='mb-3'>
          <label className="form-label login-form-label" htmlFor="form2Example17">Email</label>
            <input
              type="email"
              id="form2Example17"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-dark btn-lg btn-block button-primary" type="submit">Send Reset Link</button>
          <p></p>
          <Link to="/" className="login-link">Back to Login</Link>
        </form>
      </div>
    </div>
    </div>
    </div>
    </div>
    </section>
  );
}

export default ForgotPassword;