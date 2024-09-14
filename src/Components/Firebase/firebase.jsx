// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD685LqgDRaqNx2gy7wQ4BqRz7G6XHR7No",
  authDomain: "social-media-670d5.firebaseapp.com",
  projectId: "social-media-670d5",
  storageBucket: "social-media-670d5.appspot.com",
  messagingSenderId: "459927751278",
  appId: "1:459927751278:web:4f580d44816e513563b47f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db, onAuthStateChanged};