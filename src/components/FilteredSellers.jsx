import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebase";
import Signout from "./Signout";
import logo from "../../Images/Corner Logo.png";

function FilteredSellers() {

  const [groups, setGroups] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const storage = getStorage();
  const { type } = useParams();
  

  useEffect(() => {
    const fetchGroupsAndImages = async () => {
      const groupsCollectionRef = collection(db, "Groups");
      const data = await getDocs(groupsCollectionRef);
      const groupsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredGroups = groupsData.filter((group) => {
        return group.type === type;
      });
      setGroups(filteredGroups);

      const imagePromises = filteredGroups.map(async (group) => {
        if (group.imagePath) {
          try {
            const url = await getDownloadURL(ref(storage, group.imagePath));
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

    fetchGroupsAndImages();
  }, [type]);

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
                <Link className="nav-link" to="/filteredsellers/Hall">
                  Halls
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/filteredsellers/RC">
                  RC
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/filteredsellers/Club">
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
      <div className="container mt-5 bottom">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {groups.map((group, index) => (
            <div className="col" key={group.id}>
              <div className="card product text-bg-light h-100">
                <div className="card-body">
                  <h5 className="card-title">{group.name}</h5>
                  <Link to={`/specificlistings/${group.name}`} className="card-link">
                    <img
                      src={newImages[index]}
                      className="card-img card-image"
                      alt="Group Image"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FilteredSellers;