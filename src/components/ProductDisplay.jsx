import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/firebase';
import Signout from './Signout';

function ProductDisplay(props) {
  const location = useLocation();
  const seller = location.state
  console.log(seller)
  const [imageUrl, setImageUrl] = useState(null);
  const storage = getStorage();

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

    getImageUrl();
  }, [seller, storage]);

  if (!seller) {
    return <p>Loading seller data...</p>;
  }

  return (
    <>      
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/landingpage">
            NUSMerch
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
      <h1>Product Display</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {imageUrl ? (
          <img src={imageUrl} alt="Seller" style={{ width: '200px', marginRight: '20px' }} />
        ) : (
          <p>No image available</p>
        )}
        <div>
          <h2>{seller.name}</h2>
          <p>Price: {seller.price}</p>
        </div>
      </div>
      <p>Description: {seller.description}</p>
    </>
  );
}

export default ProductDisplay;
