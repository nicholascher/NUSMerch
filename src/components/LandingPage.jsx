import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/firebase";
import Navbar from "./Navbar";

function LandingPage() {
  const [groups, setGroups] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const storage = getStorage();

  useEffect(() => {
    const fetchGroupsAndImages = async () => {
      const groupsCollectionRef = collection(db, "Groups");
      const data = await getDocs(groupsCollectionRef);
      const groupsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setGroups(groupsData);

      const imagePromises = groupsData.map(async (group) => {
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
      <Navbar/>
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

export default LandingPage;
