import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc,getDoc, } from "firebase/firestore";
import { db, storage, auth } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import logo from "../../Images/Corner Logo.png";
import SellerCheck from "./SellerCheck";
import Signout from "./Signout";
import ProfileDefault from "../../Images/Profile Default.png"
import "./Styles.css";
import { onAuthStateChanged } from "firebase/auth";

function Navbar() {
  const [profilePic, setProfilePic] = useState("");
  const [profileDocRef, setProfileRef] = useState(null);
  const [email, setEmail] = useState("");

  useEffect (() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        const profileRef = doc(db, "Profile", user.email);
        const profileDoc = await getDoc(profileRef);
        const profileData = profileDoc.data();
        const imageUrl = await getDownloadURL(ref(storage, profileData.profilePic))
        setProfilePic(imageUrl);
      } else {
        alert("Not Logged in");
      }
    })

    unsubscribe()
  }, []);


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
            Seller Center
          </button>
          <button className="btn btn-primary ms-2" onClick={Signout()}>
            Sign Out
          </button>
          <Link className="btn ms-2" to='/profile'>
            {profilePic ? 
              <img src={profilePic} alt="profile" className="avatar"/>
            : <img src={ProfileDefault} alt="profile" className="avatar"/>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
