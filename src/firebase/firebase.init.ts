// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQMeTIbce9fXkb_oR_0jIssRhhBf1wRZ8",
  authDomain: "pgphs-reunion.firebaseapp.com",
  projectId: "pgphs-reunion",
  storageBucket: "pgphs-reunion.firebasestorage.app",
  messagingSenderId: "515211028276",
  appId: "1:515211028276:web:3e53cb9fd09770ee592761",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export { db };
