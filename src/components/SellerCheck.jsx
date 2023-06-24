import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

function SellerCheck() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [approvedList, setApprovedList] = useState([]);

  useEffect(() => {
    const getApproved = async () => {
      const approvedCollectionRef = collection(db, 'Approved');
      const data = await getDocs(approvedCollectionRef);
      const approvedData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setApprovedList(approvedData);
    };

    getApproved();
  }, []);

  const handleSellerCheck = () => {
    if (user != null) {
      const isApprovedSeller = approvedList.some((approved) => approved.email === user.email);
      if (isApprovedSeller) {
        navigate('/sellerslistings');
      } else {
        navigate('/notseller');
      }
    }
  };

  return handleSellerCheck;
}

export default SellerCheck;
