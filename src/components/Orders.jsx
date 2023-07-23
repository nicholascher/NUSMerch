import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import { Pagination } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  CloudServerOutlined,
} from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "./Navbar";
import { message } from "antd";

function Orders() {
  const location = useLocation();
  const seller = location.state;
  const storage = getStorage();
  const navigate = useNavigate();

  const [totalOrders, setTotalOrders] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [orderDeleted, setOrderDeleted] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      const purchasesCollectionRef = collection(db, "Purchased");
      const purchasedData = await getDocs(purchasesCollectionRef);
      const purchasesTotal = purchasedData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const purchasesSpecific = purchasesTotal.filter((purchase) => {
        return purchase.postId === seller.id;
      });

      const imagePromises = purchasesSpecific.map(async (purchase) => {
        if (purchase.paidPath) {
          try {
            const url = await getDownloadURL(ref(storage, purchase.paidPath));
            return url;
          } catch (error) {
            return null;
          }
        }
        return Promise.resolve(null);
      });

      Promise.all(imagePromises)
        .then((urls) => setNewImages(urls))
        .catch((error) => console.log(error));

      setTotalOrders(purchasesSpecific.length);
      setPurchases(purchasesSpecific);
      setCurrentItem(purchasesSpecific[0]);
      setQuestions(seller.questions);

      const url = await getDownloadURL(
        ref(storage, purchasesSpecific[0]?.paidPath)
      );
      setCurrentImage(url);
    };

    fetchPurchases();
  }, [orderDeleted]);

  const handleFullfilled = async () => {
    const paidRef = ref(storage, currentItem?.paidPath);
    const purchaseRef = doc(db, "Purchased", currentItem?.id);
    await deleteObject(paidRef);
    await deleteDoc(purchaseRef);
    setOrderDeleted(!orderDeleted);
    message.success("Order Fulfilled!");
  };

  const pageChange = async (current) => {
    setCurrentItem(purchases[current - 1]);
    setCurrentImage(newImages[current - 1]);
  };

  return (
    <>
      <Navbar />
      {totalOrders === 0 ? (
        <div>This order has no purchases!</div>
      ) : (
        <div className="container">
          <div>
            <div>
              <strong>Email:</strong> <p>{currentItem.email}</p>
              <strong>Buyer name:</strong> <p>{currentItem.name}</p>
              <strong>Price:</strong> <p>{currentItem.price}</p>
            </div>
          </div>
          <strong>Payment Confirmation</strong>
          <div
            className="col-md-7"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            {currentImage ? (
              <img
                className="order-image"
                src={currentImage}
                alt="Paid Image"
              />
            ) : (
              <div>No image available</div>
            )}
          </div>
          <div className="mb-3">
            {questions.map((question, index) => (
              <div className="mb-3" key={index}>
                <strong>{question}</strong>
                <p>{currentItem.answers[index]}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-primary mb-3" onClick={handleFullfilled}>
            Remove Order
          </button>
          <Pagination
            total={totalOrders}
            pageSize={1}
            defaultCurrent={1}
            showSizeChanger={false}
            onChange={pageChange}
          />
        </div>
      )}
    </>
  );
}

export default Orders;
