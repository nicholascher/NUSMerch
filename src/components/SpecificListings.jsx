import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebase";
import Navbar from "./Navbar";
import EmptyPage from "../../Images/Empty Page.jpg";

function SpecificListings() {
  const [sellers, setSellers] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const { type } = useParams();
  const storage = getStorage();

  useEffect(() => {
    const getSellers = async () => {
      const sellersCollectionRef = collection(db, "Sellers");
      const data = await getDocs(sellersCollectionRef);
      const sellersData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredSellers = sellersData.filter((seller) => {
        return seller.sellerSpecific === type;
      });

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
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5 bottom">
        <h1>{type + "'s Listings"}</h1>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {sellers.length === 0 ? (
            <div className="empty-page">
            <img className="empty-page-image" src={EmptyPage} alt="Empty Page" />
            <p className="no-img-text">Uh oh! It looks like this seller currently has no listings!</p>
            </div>
          ) : (
            sellers.map((seller, index) => (
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
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SpecificListings;
