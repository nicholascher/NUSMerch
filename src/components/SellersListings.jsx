import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import logo from "../../Images/Corner Logo.png";
import Signout from "./Signout";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import { message } from "antd";
import EmptyPage from "../../Images/Empty Page.jpg";

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
        message.error("Not Logged in");
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
      <Navbar />
      <div className="container mt-5 bottom">
        <h1 classname="mb-2">Your Listings</h1>
        <Link className="btn btn-primary mb-2" to="/addlistings">
          Add new Listing
        </Link>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {sellers.length === 0 ? (
            <div className="empty-page">
            <img className="empty-page-image" src={EmptyPage} alt="Empty Page" />
            <p className="no-img-text">Uh oh! It looks like this you currently have no listings! Add one now!</p>
            </div>
          ) : (
            sellers.map((seller, index) => (
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
                    <Link
                      className="btn btn-primary"
                      to={`/deletelistings/${seller.id}`}
                      state={seller}
                    >
                      Edit
                    </Link>
                    <Link
                      className="btn btn-success ms-2"
                      to={`/orders/${seller.id}`}
                      state={seller}
                    >
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SellersListings;
