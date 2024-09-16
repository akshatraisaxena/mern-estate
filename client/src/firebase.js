// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-26150.firebaseapp.com",
  projectId: "mern-estate-26150",
  storageBucket: "mern-estate-26150.appspot.com",
  messagingSenderId: "978794913573",
  appId: "1:978794913573:web:5a076f0cce3b059c46c4cc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);