// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZQZP5X2sGIxuZcO7SbmGiRvBH4_BoAPQ",
  authDomain: "sharp-oxide-323511.firebaseapp.com",
  projectId: "sharp-oxide-323511",
  storageBucket: "sharp-oxide-323511.appspot.com",
  messagingSenderId: "1098170970872",
  appId: "1:1098170970872:web:e7da586ae873fb8b75810d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { app, db };
