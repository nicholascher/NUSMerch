import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../../firebase/firebase';
import logo from '../../Images/Logo.png';
import Signout from './Signout';
import logo from '../../Images/Corner Logo.png';

function RCLanding() {
  const [groups, setGroups] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const { hall } = useParams();
  console.log(hall);
  const storage = getStorage();

  useEffect(() => {
    const fetchGroupsAndImages = async () => {
      const groupsCollectionRef = collection(db, 'Groups');
      const data = await getDocs(groupsCollectionRef);
      const groupsData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const filteredGroups = groupsData.filter((group) => {
        return group.type === "RC";
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
  }, []);



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
            <button className="btn btn-primary ms-2" onClick={Signout}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {groups.map((group, index) => (
            <div className="col" key={group.id}>
              <Link to={`/halls/${group.name}`} className="card-link">
                <div className="card text-bg-light h-100">
                  <img src={newImages[index]} className="card-img" alt="Group Image" />
                  <div className="card-img-overlay">
                    <h5 className="card-title">{group.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RCLanding;
