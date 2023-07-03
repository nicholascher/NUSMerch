import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import firebaseConfig from "../../firebase/firebase";
import { db, auth } from "../../firebase/firebase";
import logo from "../../Images/Logo.png";
import Validation from "./SignupValidation";
import "./Styles.css";

const app = initializeApp(firebaseConfig);

function Signup() {
  const [name, setName] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    passwordAgain: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const auth = getAuth(app);

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).every(
      (key) => validationErrors[key] === ""
    );
    if (isValid) {
      const { email, password } = values;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const profileCollectionRef = doc(db, 'Profile', values.email)
          setDoc(profileCollectionRef, {name, basket: {}, }, values.email);
          updateDoc(profileCollectionRef, {
            basket: arrayUnion("New entry")
          })
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/email-already-in-use") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email is already in use",
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
                  <h5 className="fw-bold mb-3 pb-1">Create your account</h5>
                  <div className="form-group mb-4">
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
                  <div className="mb-3">
                    <label
                      className="form-label login-form-label"
                    >
                      Name
                    </label>
                    <input
                      className="form-control form-control-lg"
                      value= {name}
                      onChange={(event) => { 
                        setName(event.target.value )}                   
                      }
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label
                      className="form-label login-form-label"
                      htmlFor="form2Example17"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="form2Example17"
                      className="form-control form-control-lg"
                      value={values.password}
                      onChange={(e) =>
                        setValues({ ...values, password: e.target.value })
                      }
                    />
                    {errors.password && (
                      <span className="text-danger error-message">
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label
                      className="form-label login-form-label"
                      htmlFor="form2Example17"
                    >
                      Enter Password Again
                    </label>
                    <input
                      type="password"
                      id="form2Example17"
                      className="form-control form-control-lg"
                      value={values.passwordAgain}
                      onChange={(e) =>
                        setValues({ ...values, passwordAgain: e.target.value })
                      }
                    />
                    {errors.passwordAgain && (
                      <span className="text-danger error-message">
                        {errors.passwordAgain}
                      </span>
                    )}
                  </div>
                  <div className="pt-1 mb-4">
                    <button
                      className="btn btn-dark btn-lg btn-block button-primary"
                      type="submit"
                    >
                      Sign up
                    </button>
                  </div>
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

export default Signup;
