import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import { db, auth } from "../../firebase/firebase";
import Signout from "./Signout";
import { Pagination } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  connectFirestoreEmulator,

} from "firebase/firestore";
import SellerCheck from "./SellerCheck";
import logo from "../../Images/Corner Logo.png";



function Orders() {
  const location = useLocation();
  const seller = location.state;

  const [currentPageNum, setCurrentPageNum] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [paidUrl, setPaidUrl] = useState(null);
  const storage = getStorage();
  const [questions, setQuestions] = useState([]);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const purchasesCollectionRef = collection(db, "Purchased");
        const purchasedData = await getDocs(purchasesCollectionRef);
        const purchasesTotal = purchasedData.docs.map((doc) => doc.data());
        const purchases = purchasesTotal.filter((purchase) => {
          return purchase.postId === seller.id;
        })
        setTotalOrders(purchases.length);
        setPurchases(purchases);
        setCurrentItem(purchases[currentPageNum]);
        
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    const getPaidUrl = async () => {
      if (currentItem?.paidPath) {
        try {
          const url = await getDownloadURL(ref(storage, currentItem?.paidPath));
          setPaidUrl(url);
        } catch (error) {
          console.log(error);
          setPaidUrl(null);
        }
      } else {
        setPaidUrl(null);
      }
    };

    

    fetchPurchases();
    getPaidUrl();

    if (currentItem) {
      setAnswers(currentItem.answers);
      setName(currentItem.name);
      setEmail(currentItem.email);
      setPrice(currentItem.price);
      setQuestions(seller.questions);
    }


  }, [totalOrders, currentItem, currentPageNum]);

  const handleFullfilled = async () => {
    const profileDocRef = doc(db, "Profile", user.email);
    await deleteDoc(post);
    await deleteObject(oldimageRef);
    updateDoc(profileDocRef, {
      basket: arrayRemove(seller.id),
    });
    alert("Deleted!");
    navigate("/sellerslistings");
  }

  const pageChange = (current) => {
    setCurrentPageNum(current - 1);
  }


return (
  <>
  {totalOrders === 0 ? (
    <div>This order has no purchases!</div>
  ) : (
    <div className="justify-content-center">
      <div>
        <div>
          <p>email: {email}</p>
          <p>Buyer name: {name}</p>
          <p>price: {price}</p>
        </div>
      </div>
      <div className="col-md-7" style={{ marginLeft: "20px" }}>
        {paidUrl ? (
          <img className="card-image" src={paidUrl} alt="Seller" />
        ) : (
          <p>Choose an order to view</p>
        )}
      </div>
      <div className="mb-3">
        <strong style={{ fontSize: "1.2rem" }}>Questions:</strong>
        {questions.map((question, index) => (
          <div className="mb-3" key={index}>
            <strong>{question}</strong>
            <p>{answers[index]}</p>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mb-3" onClick={handleFullfilled}>
        Order fulfilled
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

  )
}

export default Orders;