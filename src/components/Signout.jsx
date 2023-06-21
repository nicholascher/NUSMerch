import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import firebaseConfig from "../../firebase/firebase"; 
import logo from "../../Images/Logo.png";


function Signout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return handleSignOut;
    
}

export default Signout;