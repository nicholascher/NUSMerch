import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "@firebase/firestore"
import { getStorage } from 'firebase/storage'

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword };

export default firebaseConfig;
