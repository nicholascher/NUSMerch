import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";

function Profile() {
  const [basketListings, setBasketListings] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [email, setEmail] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [profileRef, setProfileRef] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        const ref = doc(db, "Profile", user.email);
        setProfileRef(ref)
      } else {
        alert("Not Logged in");
      }
    });

    unsubscribe();
  }, []);


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
      <Navbar/>
      <section className="container md-8">
      <div className="container mt-5 bottom">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Profile</h1>
                <div>
                  <p>Email: {email}</p>
                  <p>Name: {profileData?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-5 bottom">
          <div className="row justify-content-center md-3">
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
      </section>
    </>
  );
}

export default Profile;
