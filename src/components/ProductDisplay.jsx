import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebase";
import Signout from "./Signout";
import { Rate, Input } from "antd";
import { addDoc, collection, getDocs } from "firebase/firestore";
import logo from "../../Images/Corner Logo.png";

function ProductDisplay(props) {
  const location = useLocation();
  const seller = location.state;
  const [imageUrl, setImageUrl] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const storage = getStorage();
  const reviewCollectionRef = collection(db, "Reviews");

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
      const data = await getDocs(reviewCollectionRef);
      const reviewsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredReviews = reviewsData.filter(
        (review) => review.postId === seller.id
      );
      setAllReviews(filteredReviews);

      if (filteredReviews.length > 0) {
        const sumRating = filteredReviews.reduce(
          (total, review) => total + review.rating,
          0
        );
        const averageRating = sumRating / filteredReviews.length;
        setAverageRating(averageRating);
      } else {
        setAverageRating(0);
      }
    };

    getImageUrl();
    getReviews();
  }, [seller, storage]);


  const handleSaveReview = async () => {
    await addDoc(reviewCollectionRef, {
      postId: seller.id,
      rating: rating,
      review: reviewText,
    });
    setRating(0);
    setReviewText("");
    alert("Review added!!");
    window.location.reload();
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
            <button className="btn btn-primary ms-2" onClick={Signout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div
        className="card mx-auto"
        style={{ marginTop: "20px", marginBottom: "20px", width: "1300px" }}
      >
        <div className="row" style={{ marginTop: "20px" }}>
          <div className="col-md-7" style={{ marginLeft: "20px" }}>
            {imageUrl ? (
              <img className="card-image" src={imageUrl} alt="Seller" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <div className="col-md-4">
            <h1>{seller.name}</h1>
            <p>Price: ${seller.price}</p>
            <p>
              Average Rating: <Rate value={averageRating} disabled />
            </p>
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

            {/* Star component for the reviews I used antd but idt need change much looks okay */}
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

            {/*This part renders all the reviews can make them stack nicer or smth*/}
            <blockquote className="blockquote mt-4">
              {allReviews.length === 0 ? (
                <p>
                  No reviews available! Liked the product? Leave a review now!
                </p>
              ) : (
                allReviews.map((review) => (
                  <blockquote key={review.id} className="blockquote">
                    <Rate value={review.rating} disabled />
                    <p>{review.review}</p>
                  </blockquote>
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
