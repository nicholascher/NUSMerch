import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { Link } from 'react-router-dom';
import logo from '../../Images/Logo.jpg';

function AddListings() {
  const sellersCollectionRef = collection(db, 'Sellers');

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [imageUpload, setImageUpload] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (imageUpload) {
      const imagePath = `images/${imageUpload.name}`
      const imageRef = ref(storage, imagePath);
      await addDoc(sellersCollectionRef, { description, name, imagePath });
      uploadBytes(imageRef, imageUpload);
    }
    alert('Listing added!');
    setDescription('');
    setName('');
    setImageUpload(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <img src={logo} alt="Logo" className="rounded" style={{ width: '100px', height: 'auto' }} />
        </div>
        <div>
          <Link to="/sellerslistings" className="btn btn-primary">Back to Listing</Link>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
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
              />
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
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Product Image
              </label>
              <input
                type="file"
                className="form-control"
                id="productImage"
                name="image"
                onChange={(event) => {
                  setImageUpload(event.target.files[0]);
                }}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddListings;