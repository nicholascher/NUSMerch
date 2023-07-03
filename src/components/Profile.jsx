import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import SellerCheck from "./SellerCheck";
import logo from "../../Images/Corner Logo.png";

function Profile() {
  const [basketListings, setBasketListings] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const user = auth.currentUser;
  const profileRef = doc(db, "Profile", user.email);
  const sellerCollectionRef = collection(db, "Sellers");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const getBasketListings = async () => {
      const profileDoc = await getDoc(profileRef);
      const profileData = profileDoc.data();
      setProfileData(profileData);
    
      if (profileData && profileData.basket) {
        const basketIds = profileData.basket;
        const basketListings = [];
    
        for (const id of basketIds) {
          const sellerDocRef = doc(db, "Sellers", id);
          const sellerDoc = await getDoc(sellerDocRef);
          const sellerData = sellerDoc.data();
    
          if (sellerData) {
            basketListings.push({
              id: sellerDoc.id,
              ...sellerData,
            });
          }
        }
    
        setBasketListings(basketListings);
        loadImages(basketListings);
      } else {
        setBasketListings([]);
        setNewImages([]);
      }
    };
    

    getBasketListings();
  }, [profileRef]);

  const loadImages = async (listings) => {
    const storage = getStorage();
    const imagePromises = listings.map((seller) =>
      getDownloadURL(ref(storage, seller.imagePath))
    );

    try {
      const imageUrls = await Promise.all(imagePromises);
      setNewImages(imageUrls);
    } catch (error) {
      console.log(error);
      setNewImages([]);
    }
  };

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
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Profile</h1>
                <div>
                  <p>Email: {user.email}</p>
                  <p>Name: {profileData?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2>Favourites</h2>
                <div className="row">
                  {basketListings.map((seller, index) => (
                    <div className="col" key={seller.id}>
                      <Link
                        to={`/productdisplay/${seller.id}`}
                        state={seller}
                        className="card-link"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="card product h-100">
                          <img
                            src={newImages[index]}
                            className="card-img card-image"
                            alt="Product Image"
                          />
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start">
                              <h5 className="card-title">{seller.name}</h5>
                              <p className="card-text">${seller.price}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
