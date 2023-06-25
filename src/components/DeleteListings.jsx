import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db, storage, auth } from "../../firebase/firebase";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../../Images/Corner Logo.png";

function DeleteListings() {
  const navigate = useNavigate();
  const { id, imagePath } = useParams();
  const post = doc(db, "Sellers", id);
  const oldimageRef = ref(storage, decodeURIComponent(imagePath));
  const user = auth.currentUser;

  const [halls, setHalls] = useState([]);
  const [RC, setRC] = useState([]);
  const [clubs, setClubs] = useState([]);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [sellerSpecific, setSellerSpecific] = useState("");
  const [dependentOptions, setDependentOptions] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchGroupsAndImages = async () => {
      const groupsCollectionRef = collection(db, "Groups");
      const data = await getDocs(groupsCollectionRef);
      const groupsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const hallsArray = groupsData
        .filter((group) => group.type === "Hall")
        .map((group) => group.name);
      const RCArray = groupsData
        .filter((group) => group.type === "RC")
        .map((group) => group.name);
      const clubsArray = groupsData
        .filter((group) => group.type === "Club")
        .map((group) => group.name);

      setHalls(hallsArray);
      setRC(RCArray);
      setClubs(clubsArray);
    };

    fetchGroupsAndImages();
  }, []);

  const handleSellerTypeChange = (event) => {
    const selectedSellerType = event.target.value;
    setSellerType(selectedSellerType);

    // Update dependent options based on selected seller type
    if (selectedSellerType === "Halls") {
      setDependentOptions(halls);
    } else if (selectedSellerType === "RC") {
      setDependentOptions(RC);
    } else if (selectedSellerType === "Clubs") {
      setDependentOptions(clubs);
    } else {
      setDependentOptions([]);
    }

    setSellerSpecific("");
  };

  const handleSellerSpecificChange = (event) => {
    setSellerSpecific(event.target.value);
  };

  const handlePriceChange = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setPrice(numericValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    function makeid() {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 14) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    }

    if (imageUpload) {
      const newimagePath = `images/${imageUpload.name + makeid()}`;
      const newFields = {
        description: description,
        name: name,
        sellerType: sellerType,
        imagePath: newimagePath,
        sellerSpecific: sellerSpecific,
        createdBy: user.email,
        price: price,
      };
      const newimageRef = ref(storage, newimagePath);

      await updateDoc(post, newFields);
      await uploadBytes(newimageRef, imageUpload);
      await deleteObject(oldimageRef);

      alert("Updated!");
      navigate("/sellerslistings");
    }
  };

  const handleDelete = async () => {
    await deleteDoc(post);
    await deleteObject(oldimageRef);
    alert("Deleted!");
    navigate("/sellerslistings");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <img
            src={logo}
            alt="Logo"
            className="rounded"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
        <div>
          <Link to="/sellerslistings" className="btn btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleSellerTypeChange}
              value={sellerType}
            >
              <option defaultValue>Who are you selling to?</option>
              <option value="RC">RC</option>
              <option value="Clubs">Clubs</option>
              <option value="Halls">Halls</option>
            </select>
            <p></p>
            <select
              className="form-select"
              aria-label="Default select example"
              disabled={!sellerType}
              onChange={handleSellerSpecificChange}
              value={sellerSpecific}
            >
              <option defaultValue>Select an option</option>
              {dependentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p></p>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                maxLength={30}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  className="form-control"
                  id="productPrice"
                  name="price"
                  value={price}
                  onChange={handlePriceChange}
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Product Description
              </label>
              <textarea
                className="form-control"
                id="productDescription"
                rows="3"
                name="description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                maxLength={2000}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Product Image
              </label>
              <input
                type="file"
                accept=".jpg, .png"
                className="form-control"
                id="productImage"
                name="image"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary ms-2">
                Edit Listing
              </button>
              <button className="btn btn-danger ms-2" onClick={handleDelete}>
                Delete Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteListings;
