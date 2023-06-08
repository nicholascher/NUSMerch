import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from '../../firebase/firebase';
import logo from '../../Images/Logo.png';
import Signout from './Signout';
import { Link } from 'react-router-dom';

function SellersListings() {
  const [sellers, setSellers] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const getSellers = async () => {
      const sellersCollectionRef = collection(db, 'Sellers');
      const data = await getDocs(sellersCollectionRef);
      const sellersData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSellers(sellersData);

      const imagePromises = sellersData.map(async (seller) => {
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
      <div className="container mt-5">
        <div className="row mb-3">
          <div className="col text-start">
            <Link to="/addlistings" className="btn btn-primary">Add Listing</Link>
          </div>
          <div className="col text-end">
            <button className="btn btn-primary" onClick={Signout}>Sign Out</button>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {sellers.map((seller, index) => (
            <div className="col" key={seller.id}>
              <div className="card">
                <img src={newImages[index]} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{seller.name}</h5>
                  <p className="card-text">{seller.description}</p>
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
