// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6ZRwu1ONB_zsGYP11Z7SeacbRoJ1zbjs",
  authDomain: "pacific-vault-470814-s5.firebaseapp.com",
  projectId: "pacific-vault-470814-s5",
  storageBucket: "pacific-vault-470814-s5.firebasestorage.app",
  messagingSenderId: "906897078440",
  appId: "1:906897078440:web:dfb9b23ca6c4a2097bea9d",
  measurementId: "G-PDG9K4D34C",
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// exporting funtions for backend
export const auth = getAuth(app);
export const db = getFirestore(app);
