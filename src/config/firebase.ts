import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpzLYGHRmQU5wicgmNcqN41nitJKDctZY",
  authDomain: "saferoute-490bc.firebaseapp.com",
  projectId: "saferoute-490bc",
  storageBucket: "saferoute-490bc.firebasestorage.app",
  messagingSenderId: "1011281889217",
  appId: "1:1011281889217:web:6f878ed51d76f36ab21140",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;