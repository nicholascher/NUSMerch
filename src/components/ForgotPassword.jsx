import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "../../firebase/firebase";
import logo from "../../Images/Logo.png";
import Validation from "./ForgotPasswordValidation";
import "./Styles.css";

function ForgotPassword() {
  const [values, setValues] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const isValid = Object.keys(validationErrors).every(
      (key) => validationErrors[key] === ""
    );

    if (isValid) {
      const email = values.email;
      sendPasswordResetEmail(auth, email)
        .then(() => {
          navigate("/forgotpassconfirm");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/user-not-found") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "User does not exist",
            }));
          }
        });
    }
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
                  <div className="mb-3">
                    <label
                      className="form-label login-form-label"
                      htmlFor="form2Example17"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="form2Example17"
                      className="form-control form-control-lg"
                      value={values.email}
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <span className="text-danger error-message">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-dark btn-lg btn-block button-primary"
                    type="submit"
                  >
                    Send Reset Link
                  </button>
                  <p></p>
                  <Link to="/" className="login-link">
                    Back to Login
                  </Link>
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
