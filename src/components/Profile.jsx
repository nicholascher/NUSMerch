import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { collection, getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { db, auth, storage } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import "./Styles.css";
import ProfileDefault from "../../Images/Profile Default.png"
import UploadIcon from "../../Images/Upload Icon.png"
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

function Profile() {
  const [basketListings, setBasketListings] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [email, setEmail] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [profileRef, setProfileRef] = useState(null);
  const [update, setUpdate] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


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

      if(profileData?.profilePic) {
        const url = await getDownloadURL(ref(storage, profileData?.profilePic))
        setProfileUrl(url)  
      }

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

  }, [profileRef, update]);

  const loadImages = async (listings) => {
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

  const handleUpload = async (file) => {
    function makeid() {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 14) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    if(profileData?.profilePic) {
      await deleteObject(ref(storage, profileData?.profilePic));
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid JPG or PNG image.");
        return false;
      }

      const imagePath = `Profile/${file.name + makeid()}`;
      const imageRef = ref(storage, imagePath);

      updateDoc(profileRef, {
        profilePic: imagePath,
      })
      await uploadBytes(imageRef, file);

      setUpdate(!update);
      alert("Profile updated Added!")
      navigate('/profile');
      
    }
  }


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
                  {profileData?.profilePic ? 
                    <img src={profileUrl} alt="profile" className="avatar"/>
                  : <img src={ProfileDefault} alt="profile" className="avatar"/>}
                </div>
                <label for="file-upload" class="custom-file-upload mt-2">
                      <img src={UploadIcon} alt={".."} className="upload-icon" /> 
                      Upload profile picture
                  </label>
                  <input id="file-upload" 
                    type="file"
                    onChange={(event) => {
                      event.preventDefault();
                      let files = event.target.files[0];
                      console.log(files)
                      handleUpload(files);
                    }}
                    />
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
