import React from 'react';
import { Link } from 'react-router-dom';
import Signout from './Signout';
import logo from '../../Images/Corner Logo.png';

function RCLanding() {
  return (
    <>
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
                <Link className="nav-link" to="/hallslanding">
                  Halls
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/rclanding">
                  RC
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/clubslanding">
                  Clubs
                </Link>
              </li>
            </ul>
            <button className="btn btn-primary ms-2" onClick={Signout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="card text-bg-light h-100">
              <div className="card-body">
                <Link
                  to={`/rc/Tembusu`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h5 className="card-title">Tembusu</h5>
                </Link>
                <Link
                  to={`/rc/Tembusu`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src="../Images/Tembusu.jpg" className="card-img" alt="logo" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <div className="card-body">
                <Link
                  to={`/rc/RC4`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h5 className="card-title">RC4</h5>
                </Link>
                <Link
                  to={`/rc/RC4`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src="../Images/RC4.jpg" className="card-img" alt="logo"/>
                </Link>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <div className="card-body">
                <Link
                  to={`/rc/Ridge View`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h5 className="card-title">Ridge View</h5>
                </Link>
                <Link
                  to={`/rc/Ridge View`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src="../Images/Ridge View.jpg" className="card-img" alt="logo" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <div className="card-body">
                <Link
                  to={`/rc/CAPT`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h5 className="card-title">CAPT</h5>
                </Link>
                <Link
                  to={`/rc/CAPT`}
                  activeClassName="active-nav"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src="../Images/CAPT.jpg" className="card-img object-fit: cover" alt="logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RCLanding;
