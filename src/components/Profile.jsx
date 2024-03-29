import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { db, auth, storage } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import "./Styles.css";
import ProfileDefault from "../../Images/Profile Default.png";
import UploadIcon from "../../Images/Upload Icon.png";
import { message } from "antd";

function Profile() {
  const [basketListings, setBasketListings] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [email, setEmail] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [profileRef, setProfileRef] = useState(null);
  const [update, setUpdate] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        const ref = doc(db, "Profile", user.email);
        setProfileRef(ref);
      } else {
        message.error("Not Logged in");
      }
    });

    unsubscribe();
  }, []);

  useEffect(() => {
    const getBasketListings = async () => {
      const profileDoc = await getDoc(profileRef);
      const profileData = profileDoc.data();
      setProfileData(profileData);

      if (profileData?.profilePic) {
        const url = await getDownloadURL(ref(storage, profileData?.profilePic));
        setProfileUrl(url);
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
    console.log("here");
  }, [profileRef, update, editName]);

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

  const handleNameEdit = async () => {
    if (editName) {
      updateDoc(profileRef, {
        name: nameInput,
      });
      const roomsRef = collection(db, "Rooms");
      const roomQuery = query(
        roomsRef,
        where("participants", "array-contains", email)
      );
      const snapshot = await getDocs(roomQuery);
      snapshot.forEach((doc) => {
        const roomData = doc.data();
        const participants = roomData.participants;
        const index = participants.indexOf(email);
        if (index !== -1) {
          const updatedUsername = [...roomData.username];
          updatedUsername[index] = nameInput;

          updateDoc(doc.ref, { username: updatedUsername });
        }
      });

      setEditName(false);
    } else {
      setEditName(true);
      setNameInput(profileData?.name || "");
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
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    }

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        message.error("Please upload a valid JPG or PNG image.");
        return false;
      }

      const imagePath = `Profile/${file.name + makeid()}`;
      const imageRef = ref(storage, imagePath);

      updateDoc(profileRef, {
        profilePic: imagePath,
      });
      await uploadBytes(imageRef, file);

      setUpdate(!update);
      message.success("Profile updated Added!");
      navigate("/profile");
    }

    if (profileData?.profilePic) {
      await deleteObject(ref(storage, profileData?.profilePic));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">Profile</h1>
                <div>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Username:</strong>{" "}
                    {editName ? (
                      <input
                        className="form-control"
                        type="text"
                        value={nameInput}
                        maxLength={20}
                        onChange={(e) => setNameInput(e.target.value)}
                      />
                    ) : (
                      profileData?.name
                    )}
                  </p>
                  {profileData?.profilePic ? (
                    <img src={profileUrl} alt="profile" className="avatar" />
                  ) : (
                    <img
                      src={ProfileDefault}
                      alt="profile"
                      className="avatar"
                    />
                  )}
                </div>
                <button className="btn btn-primary" onClick={handleNameEdit}>
                  {editName ? "Save Name" : "Edit Name"}
                </button>
                <label
                  for="file-upload"
                  className="custom-file-upload mt-2 ms-2"
                >
                  <img src={UploadIcon} alt={".."} className="upload-icon" />
                  Upload profile picture
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(event) => {
                    event.preventDefault();
                    let files = event.target.files[0];
                    console.log(files);
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
                <div className="row row-cols-1 row-cols-md-3 g-4">
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
