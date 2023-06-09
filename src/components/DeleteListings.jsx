import React, { useState } from 'react';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { Link, useParams, useNavigate } from 'react-router-dom';
import logo from '../../Images/New Logo.png';

function DeleteListings() {
  const navigate = useNavigate();
  const { id, imagePath } = useParams();
  console.log(id, imagePath);
  const post = doc(db, 'Sellers', id);
  console.log(decodeURIComponent(imagePath))
  const oldimageRef = ref(storage, decodeURIComponent(imagePath))

  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [imageUpload, setImageUpload] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    
    if (imageUpload) {
      const newimagePath = `images/${imageUpload.name + makeid()}`
      const newFields = { description: description, name: name, sellerType: sellerType, imagePath: newimagePath }
      const newimageRef = ref(storage, newimagePath);
      
      await updateDoc(post, newFields)
      await uploadBytes(newimageRef, imageUpload);
      await deleteObject(oldimageRef);
      
      alert('Updated!')
      navigate('/sellerslistings')
    }
    
  };

  const handleDelete = async () => {
    await deleteDoc(post);
    await deleteObject(oldimageRef);
    alert("Deleted!")
    navigate('/sellerslistings')
  }

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
          <form onSubmit={handleSubmit}>
            <select className="form-select" 
              aria-label="Default select example" 
              onChange={(event) => setSellerType(event.target.value)}>
              <option defaultValue>Who are you selling to?</option>
              <option value="Halls">Halls</option>
              <option value="RC">RC</option>
              <option value="Clubs">Clubs</option>
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
              <button type="submit" className="btn btn-primary me-2">
                Submit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(id)}>Delete Listing</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteListings;
