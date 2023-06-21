import React from 'react';
import { Link } from 'react-router-dom';
import Signout from './Signout';
import logo from '../../Images/Corner Logo.png';

function HallsLanding() {
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
                <Link className="nav-link" to="/clubs">
                  Clubs
                </Link>
              </li>
            </ul>
            <button className="btn btn-primary ms-2" onClick={Signout}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="card text-bg-light h-100">
              <Link
                to={`/halls/Kent Ridge`}
                activeClassName="active-nav"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src='../Images/KR Hall.png' className="card-img" alt="logo" />
                <div className="card-img-overlay">
                  <h5 className="card-title">KR</h5>
                </div>
              </Link>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <Link
                to={`/halls/Temasek`}
                activeClassName="active-nav"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src='../Images/Temasek Hall.png' className="card-img" alt="logo" />
                <div className="card-img-overlay">
                  <h5 className="card-title">Temasek</h5>
                </div>
              </Link>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <Link
                to={`/halls/Sheares`}
                activeClassName="active-nav"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src='../Images/Sheares Hall.png' className="card-img" alt="logo" />
                <div className="card-img-overlay">
                  <h5 className="card-title">Sheares</h5>
                </div>
              </Link>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <Link
                to={`/halls/Raffles`}
                activeClassName="active-nav"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src='../Images/Raffles Hall.png' className="card-img" alt="logo" />
                <div className="card-img-overlay">
                  <h5 className="card-title">Raffles</h5>
                </div>
              </Link>
            </div>
          </div>
          <div className="col">
            <div className="card text-bg-light h-100">
              <Link
                to={`/halls/Eusoff`}
                activeClassName="active-nav"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src='../Images/Eusoff Hall.png' className="card-img" alt="logo" />
                <div className="card-img-overlay">
                  <h5 className="card-title">Eusoff</h5>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HallsLanding;
