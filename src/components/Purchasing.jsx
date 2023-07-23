import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import { Rate, Alert, Button } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, getDocs, getDoc, doc } from "firebase/firestore";
import Navbar from "./Navbar";
import { message } from "antd";

function Purchasing() {
  const navigate = useNavigate();
  const location = useLocation();
  const seller = location.state;
  const storage = getStorage();
  const [email, setEmail] = useState("");
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
        setProfileRef(ref);
      } else {
        message.error("Not Logged in");
      }
    });

    unsubscribe();
    setQuestions(seller.questions);
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
      message.error("Please answer all the questions");
      return;
    } else if (!paid) {
      message.error("Please upload a screenshot to for payment validation");
    } else {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(paid.type)) {
        message.error("Please upload a valid JPG or PNG image.");
        return;
      }

      const purcashedCollectionRef = collection(db, "Purchased");
      const paidPath = `Payment/${paid.name + makeid()}`;
      const paidRef = ref(storage, paidPath);

      const profileDocSnap = await getDoc(profileDocRef);
      const userData = profileDocSnap.data();
      await addDoc(purcashedCollectionRef, {
        name: userData.name,
        email,
        paidPath,
        price: seller.price,
        answers,
        postId: seller.id,
      });

      await uploadBytes(paidRef, paid);

      message.success("Thanks for purchasing!");

      navigate("/landingpage");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="image-container">
          <div>
            {imageUrl ? (
              <img className="order-image" src={imageUrl} alt="Seller" />
            ) : (
              <p>No image available</p>
            )}
          </div>
        </div>
        <form className="questions-section">
          <div className="mb-3 question-input">
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
        <div className="payment-qr-section">
          <h2 className="text-center">Payment QR Code</h2>
          <div className="image-container">
            {QRUrl ? (
              <img className="order-image" src={QRUrl} alt="Seller" />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <p>
            {seller.paymentOption}: {seller.phoneNumber}
          </p>
        </div>
        <div className="mb-3 paid-image-input">
          <label htmlFor="paidImage" className="form-label">
            Payment Verification Screenshot
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
        <button
          className="btn btn-primary purchase-button"
          onClick={handleSubmit}
        >
          Purchase!
        </button>
      </div>
    </>
  );
}

export default Purchasing;
