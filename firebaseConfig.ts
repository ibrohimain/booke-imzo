
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVEbWWqA1p6Cp0oQOesybbsxP-pGnM1SI",
  authDomain: "booksystem-4fe7b.firebaseapp.com",
  projectId: "booksystem-4fe7b",
  storageBucket: "booksystem-4fe7b.firebasestorage.app",
  messagingSenderId: "513801299152",
  appId: "1:513801299152:web:3096bafb013f0a65e36ad5",
  measurementId: "G-VWSSP6TYS5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
