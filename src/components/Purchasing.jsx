import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import { Rate, Alert, Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,

} from "firebase/firestore";
import SellerCheck from "./SellerCheck";
import logo from "../../Images/Corner Logo.png";


function Purchasing() {
  const navigate = useNavigate();
  const location = useLocation();
  const seller = location.state;
  const storage = getStorage();
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [QRUrl, setQRUrl] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [paid, setPaid] = useState(null);
  const [profileDocRef, setProfileRef] = useState(null);
   
  
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
      const getQRUrl = async () => {
        if (seller && seller.QRpath) {
          try {
            const url = await getDownloadURL(ref(storage, seller?.QRpath));
            setQRUrl(url);
          } catch (error) {
            console.log(error);
            setQRUrl(null);
          }
        } else {
          setQRUrl(null);
        }
      };

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setEmail(user.email);
          const ref = doc(db, "Profile", user.email);
          setProfileRef(ref)
        } else {
          alert("Not Logged in");
        }
      });
  
      unsubscribe();
      setQuestions(seller.questions)
      getImageUrl();
      getQRUrl();
  
    }, [seller, storage]);

    function makeid() {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 14) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    const handleSubmit = async () => {
      if (answers.length !== questions.length) {
        alert("Please answer all the questions")
        return;
      } else if (!paid){
        alert("Please upload a screenshot to for payment validation")
      } else {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(paid.type)) {
          alert("Please upload a valid JPG or PNG image.");
          return;
        }

        const purcashedCollectionRef = collection(db, "Purchased")
        const paidPath = `Payment/${paid.name + makeid()}`;
        const paidRef = ref(storage, paidPath);

        const profileDocSnap = await getDoc(profileDocRef);
        const userData = profileDocSnap.data(); 
        console.log(seller.id)
        console.log(userData.name)
        await addDoc(purcashedCollectionRef, {
          name: userData.name, 
          email, 
          paidPath,
          price: seller.price,
          answers,
          postId: seller.id,

        });

        await uploadBytes(paidRef, paid);

        alert("Thanks for purchasing!")

        navigate("/landingpage")

      }
    }

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
            <button className="btn btn-success ms-2" onClick={SellerCheck()}>
              View your Listings
            </button>
            <button className="btn btn-primary ms-2" onClick={Signout()}>
              Sign Out
            </button>
            <Link className="btn btn-primary ms-2" to="/profile">
              Profile
            </Link>
          </div>
        </div>
      </nav>
          <div className="col-md-7" style={{ marginLeft: "20px" }}>
            {imageUrl ? (
              <img className="card-image" src={imageUrl} alt="Seller" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <form>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Questions:</strong>
              {questions.map((question, index) => (
                <div className="mb-3" key={index}>
                  <label htmlFor={`answer-${index}`} className="form-label">
                    {question}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`answer-${index}`}
                    name={`answer-${index}`}
                    value={answers[index] || ""}
                    onChange={(event) => {
                      const updatedAnswers = [...answers];
                      updatedAnswers[index] = event.target.value;
                      setAnswers(updatedAnswers);
                    }}
                  />
                </div>
              ))}
            </div>
          </form>

          <div className="col-md-7 text-center">
          
          <h2 className="text-center">Payment QR Code</h2>
          <span>{seller.paymentOption} :</span>
            {QRUrl ? (
              <img className="card-image" src={QRUrl} alt="Seller" stlye={{marginLeft: "100px"}}/>
            ) : (
              <p>No image available</p>
            )}
           <p>Phone Number: {seller.phoneNumber}</p>
          </div>
          <div className="mb-3">
              <label htmlFor="paidImage" className="form-label">
                Payment Verfication Screenshot
              </label>
              <input
                type="file"
                accept=".jpg, .png"
                className="form-control"
                id="paidImage"
                name="image"
                onChange={(event) => {
                  setPaid(event.target.files[0]);
                }}
              />
            </div>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Purchase!
          </button>
    </>
  );

  
}

export default Purchasing;