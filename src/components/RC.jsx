import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebase";
import logo from "../../Images/Corner Logo.png";
import Signout from "./Signout";

function RC() {
  const [sellers, setSellers] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [search, setSearch] = useState("");
  const { rctype } = useParams();
  console.log(rctype);

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
        return seller.sellerSpecific === rctype;
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

  const searchSellers = sellers.filter((seller) => {
    return seller.name.toLowerCase().includes(search.toLowerCase());
  });

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
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search by name"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <button className="btn btn-primary ms-2" onClick={Signout()}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {sellers.length === 0 ? (
            <blockquote>This seller has no listings!</blockquote>
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

export default RC;
