import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../Images/Logo.png';

function AddListings() {
  function makeid() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 14) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const navigate = useNavigate();
  const sellersCollectionRef = collection(db, 'Sellers');

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [dependentOptions, setDependentOptions] = useState([]);
  const [sellerSpecific, setSellerSpecific] = useState('');

  const handleSellerTypeChange = (event) => {
    const selectedSellerType = event.target.value;
    setSellerType(selectedSellerType);

    // Update dependent options based on selected seller type
    if (selectedSellerType === 'Halls') {
      setDependentOptions(['Eusoff', 'Temasek', 'Kent Ridge', 'Sheares', 'Raffles']);
    } else if (selectedSellerType === 'RC') {
      setDependentOptions(['CAPT', 'RC4', 'Ridge View', 'Tembusu']);
    } else if (selectedSellerType === 'Clubs') {
      setDependentOptions(['Club 1', 'Club 2', 'Club 3']);
    } else {
      setDependentOptions([]);
    }

    setSellerSpecific('');
  };

  const handleSellerSpecificChange = (event) => {
    setSellerSpecific(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (imageUpload) {
      const imagePath = `images/${imageUpload.name + makeid()}`;
      const imageRef = ref(storage, imagePath);
      await addDoc(sellersCollectionRef, { description, name, imagePath, sellerType, sellerSpecific });
      await uploadBytes(imageRef, imageUpload);
    }
    alert('Listing added!');
    setDescription('');
    setName('');
    setImageUpload(null);
    navigate('/addlistings');
    window.location.reload()
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <img src={logo} alt="Logo" className="rounded" style={{ width: '100px', height: 'auto' }} />
        </div>
        <div>
          <Link to="/sellerslistings" className="btn btn-primary">
            Back to Listing
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
            <select className="form-select" 
              aria-label="Default select example" 
              disabled={!sellerType} 
              onChange={handleSellerSpecificChange} 
              value={sellerSpecific}>
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
              <button type="submit" className="btn btn-primary">
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
