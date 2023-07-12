import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Images/Corner Logo.png";
import SellerCheck from "./SellerCheck";
import Signout from "./Signout";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/landingpage">
          <img src={logo} alt="Logo" className="logo smaller" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/filteredsellers/Hall">
                Halls
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/filteredsellers/RC">
                RC
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/filteredsellers/Club">
                Clubs
              </Link>
            </li>
          </ul>
          <button className="btn btn-success ms-2" onClick={SellerCheck()}>
            View your Listings
          </button>
          <button className="btn btn-primary ms-2" onClick={Signout()}>
            Sign Out
          </button>
          <Link className="btn btn-primary ms-2" to="/profile">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
