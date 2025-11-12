// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0DKRpF1INxWNHQIK5_EF0x-bXHph5pMQ",
  authDomain: "deviceprogramming-19cf6.firebaseapp.com",
  projectId: "deviceprogramming-19cf6",
  storageBucket: "deviceprogramming-19cf6.appspot.com",
  messagingSenderId: "546756336696",
  appId: "1:546756336696:web:a4b77d65b436290b895acd",
  measurementId: "G-PF89ML68JE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
