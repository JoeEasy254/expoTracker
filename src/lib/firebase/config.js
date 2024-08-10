import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBx1-hTl6jDSHLZXbbBdHkIQI7GcNZTT2A",
  authDomain: "expensetracker-eb677.firebaseapp.com",
  projectId: "expensetracker-eb677",
  storageBucket: "expensetracker-eb677.appspot.com",
  messagingSenderId: "370075962631",
  appId: "1:370075962631:web:112c144822d55bd34d49a2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
