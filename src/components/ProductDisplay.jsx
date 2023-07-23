import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import { Rate, Alert, Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";
import insta from "../../Images/Instagram Icon.png"
import tele from "../../Images/Telegram Icon.png"
import "./Styles.css";


function ProductDisplay() {
  const location = useLocation();
  const seller = location.state;

  const [imageUrl, setImageUrl] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const storage = getStorage();
  const reviewRef = collection(db, "Sellers", seller.id, "Review")
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [favourite, setFavourite] = useState(false);

  const [profileDocRef, setProfileRef] = useState(null);
  const [email, setEmail] = useState("");

  const additionalPaths = seller.additionalPaths;

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
  }, [update]);


  useEffect(() => {
    const getImageUrl = async () => {
      if (seller && seller.imagePath) {
        try {
          const url = await getDownloadURL(ref(storage, seller?.imagePath));
          setImageUrl(url);
        } catch (error) {
          console.log(error);
          setImageUrl(null);
        }
      } else {
        setImageUrl(null);
      }
    };

    const getReviews = async () => {
      const data = await getDocs(reviewRef);
      const reviewsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllReviews(reviewsData)

      if (reviewsData.length > 0) {
        const sumRating = reviewsData.reduce(
          (total, review) => total + review.rating, 0
        )

        setAverageRating(Math.round(sumRating / reviewsData.length))
      }

    };

    const checkFavouriteStatus = async () => {

      if (profileDocRef) {
        const profileDocSnap = await getDoc(profileDocRef);
        const userData = await profileDocSnap.data();
        const favouriteProducts = userData.basket;
        if (favouriteProducts.includes(seller.id)) {
          setFavourite(true);
        }

      }

    };

    const getAdditionalImages = async () => {
      const addrefs = additionalPaths.map((path) => ref(storage, path))
      let addImages = [];
      for (let i = 0; i < addrefs.length; i++) {
        const oldAddUrl = await getDownloadURL(addrefs[i]);
        addImages.push(oldAddUrl);
      }
  
      setAdditionalImages(addImages);
    }


    
    getImageUrl();
    getReviews();
    checkFavouriteStatus();
    getAdditionalImages();
  }, [seller, storage, profileDocRef, update]);

  const handleSaveReview = async () => {

    if (reviewText === "") {
      alert('Please provide a review for the product')
      return;
    }
    await addDoc(reviewRef, {
      review: reviewText,
      rating: rating,
      createdBy: email,
    })
    setRating(0);
    setReviewText("");
    setUpdate(!update);
    alert("Review added!!");
  };

  const handleDeleteReview = async (reviewId) => {
    const reviewRef = doc(db, "Sellers", seller.id, "Review", reviewId);
    await deleteDoc(reviewRef);
    setUpdate(!update);
    alert("Review Deleted!")
  }

  const handleCreateRoom = async () => {
    const ref = doc(db, "Profile", seller.createdBy);
    const docRef = await getDoc(ref);
    const docData = docRef.data();
    const roomRef = doc(db, "Rooms", `${email}_${seller.createdBy}`);
    const userRef = await getDoc(profileDocRef);
    const userData = userRef.data();

    const newRoom = {
      participants: [email, seller.createdBy],
      username: [userData.name, docData.name]
    };
    await setDoc(roomRef, newRoom, `${email}_${seller.createdBy}`);
  }

  const handleAddToFavourites = () => {
    setFavourite(!favourite);

    if (!favourite) {
      updateDoc(profileDocRef, {
        basket: arrayUnion(seller.id),
      });
    } else {
      updateDoc(profileDocRef, {
        basket: arrayRemove(seller.id),
      });
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="card mx-auto"
        style={{ marginTop: "20px", marginBottom: "20px", width: "1300px" }}
      >
        <div className="row" style={{ marginTop: "20px" }}>
        {additionalImages.length === 0 ? (
          <div id="carouselExampleFade" className="carousel slide" style={{ width: '35%', height: 'auto', marginLeft: '20px', marginRight: '300px'}}>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={imageUrl} className="d-block w-100" alt="product image" />
              </div>
            </div>
          </div>
        ) : (
          <div id="carouselExampleFade" className="carousel slide col-md-7" style={{ width: '35%', height: 'auto', marginLeft: '20px', marginRight: '300px'}}>
            <div className="carousel-inner" >
              <div className="carousel-item active">
                <img src={imageUrl} className="d-block w-100" alt="product image" />
              </div>
              {additionalImages.map((image, index) => (
                <div className="carousel-item" key={index} >
                  <img src={image} className="d-block w-100" alt="..." />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}

          <div className="col-md-4">
            <h1>{seller.name}</h1>
            <p>Price: ${seller.price}</p>
            <p>
              Average Rating: <Rate value={averageRating} disabled />
            </p>
            <Button
              type="text"
              icon={favourite ? <HeartFilled style={{ display: 'inline-flex', alignItems: 'center' }} /> :
                <HeartOutlined style={{ display: 'inline-flex', alignItems: 'center' }} />}
              onClick={handleAddToFavourites}
            >
              Add to Favourites
            </Button>
            <p></p>
            {seller.instagram && <img src={insta} style={{ width: "30px", height: "auto" }}></img>}
            <span className="ms-2">{seller.instagram}</span>
            <p></p>
            {seller.telegram && <img src={tele} style={{ width: "30px", height: "auto" }}></img>}
            <span className="ms-2">{seller.telegram}</span>
            <p></p>
            <Link
              className="btn btn-primary"
              to={`/purchasing/${seller.id}`}
              state={seller}
            >
              Buy Now!
            </Link>
            <Link className="btn btn-primary ms-2"
              to={`/chatwindow`}
              state={seller}
              onClick={handleCreateRoom}
            >
              Chat With
            </Link>
          </div>
        </div>
        <p
          style={{ marginTop: "50px", marginLeft: "20px", marginRight: "20px" }}
        >
          <strong style={{ fontSize: "1.2rem" }}>Product Description</strong>
          <br />
          {seller.description}
        </p>
      </div>
      <div
        className="card mx-auto"
        style={{ marginTop: "20px", marginBottom: "20px", width: "1300px" }}
      >
        <div className="row" style={{ marginTop: "20px" }}>
          <div className="col-md-7" style={{ marginLeft: "20px" }}>
            <p>
              {" "}
              <strong style={{ fontSize: "1.2rem" }}>
                Rating and reviews{" "}
              </strong>
            </p>

            <Rate value={rating} onChange={(value) => setRating(value)} />

            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Leave a Review!
              </label>
              <textarea
                className="form-control"
                id="productDescription"
                rows="3"
                name="description"
                value={reviewText}
                onChange={(event) => {
                  setReviewText(event.target.value);
                }}
              ></textarea>
            </div>
            <button
              className="btn btn-primary rounded"
              onClick={handleSaveReview}
            >
              Save Review
            </button>

            <blockquote className="blockquote mt-4">
              {allReviews.length === 0 ? (
                <div>No reviews available! Liked the product? Leave a review now!</div>
              ) : (
                allReviews.map((review) => (
                  <div key={review.id} className="review-container">
                    <div className="review-content">
                      <Rate value={review.rating} disabled />
                      <p>{review.review}</p>
                    </div>
                    {review.createdBy === email && (
                      <button
                        className="btn btn-danger delete-review-button"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete Review
                      </button>
                    )}
                  </div>
                ))
              )}
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDisplay;
