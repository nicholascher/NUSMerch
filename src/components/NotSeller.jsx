import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "../../firebase/firebase";
import logo from "../../Images/Logo.png";

function NotSeller() {
  return (
    <section className="login-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 d-flex justify-content-center">
            <img
              src={logo}
              alt="Logo"
              className="login-logo"
              style={{
                width: "500px",
                height: "auto",
                marginTop: "-200px",
                marginBottom: "-70px",
              }}
            />
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-8 offset-md-2">
            <div className="card login-card">
              <h2 className="fw-bold mb-3 pb-1" style={{ marginTop: "20px" }}>
                This account is not registered as a seller.
              </h2>
              <p
                className="text-muted"
                style={{ marginLeft: "5px", marginRight: "5px" }}
              >
                To register as a seller, please contact us at
                jingyu2987@gmail.com
              </p>
              <Link to="/landingpage">
                <button
                  className="btn btn-dark btn-lg btn-block button-primary"
                  style={{ marginBottom: "20px" }}
                >
                  Back to Home Page
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotSeller;
