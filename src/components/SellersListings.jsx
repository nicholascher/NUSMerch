import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import logo from "../../Images/Corner Logo.png";
import Signout from "./Signout";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function SellersListings() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        alert("Not Logged in");
      }
      setLoading(false);
    });

    unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const getSellers = async () => {
        const sellersCollectionRef = collection(db, "Sellers");
        const data = await getDocs(sellersCollectionRef);
        const sellersData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const filteredSellers = sellersData.filter(
          (seller) => seller.createdBy === email
        );

        setSellers(filteredSellers);

        const imagePromises = filteredSellers.map(async (seller) => {
          if (seller.imagePath) {
            try {
              const url = await getDownloadURL(ref(storage, seller.imagePath));
              return url;
            } catch (error) {
              console.log(error);
              return null;
            }
          }
          return Promise.resolve(null);
        });

        Promise.all(imagePromises)
          .then((urls) => setNewImages(urls))
          .catch((error) => console.log(error));
      };

      getSellers();
    }
  }, [loading, email]);

  const handleEdit = (id, imagePath) => {
    navigate(`/deletelistings/${id}/${encodeURIComponent(imagePath)}`);
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
            <Link className="btn btn-primary ms-2" to="/addlistings">
              Add New Listing
            </Link>
            <button className="btn btn-primary ms-2" onClick={Signout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-5 bottom">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {sellers.map((seller, index) => (
            <div className="col" key={seller.id}>
              <div className="card product h-100">
                <img
                  src={newImages[index]}
                  className="card-img card-image"
                  alt="..."
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">{seller.name}</h5>
                    <p className="card-text">${seller.price}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(seller.id, seller.imagePath)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SellersListings;
