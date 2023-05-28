import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCCUQ-bpcY4oVFC8rrAJfKr7ILFrWEXXqY",
  authDomain: "nusmerch-f8135.firebaseapp.com",
  databaseURL: "https://nusmerch-f8135-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nusmerch-f8135",
  storageBucket: "nusmerch-f8135.appspot.com",
  messagingSenderId: "300430560449",
  appId: "1:300430560449:web:da0c4b7d9b9686585a1840",
  measurementId: "G-6D6W0TTK8R"
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert('Logged in successfully!');
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-dark vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder='Email address'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder='Password'
              className='form-control rounded-0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='btn btn-primary w-100'>Log in</button>
          <p></p>
          <Link to="/signup" className='btn btn-success border w-100'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
