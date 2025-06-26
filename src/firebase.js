import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHciObQbnsE5OWKVb4a-Ztn5Nr-GVLpKQ",
  authDomain: "services-auth-2ddfa.firebaseapp.com",
  projectId: "services-auth-2ddfa",
  storageBucket: "services-auth-2ddfa.firebasestorage.app",
  messagingSenderId: "234072438399",
  appId: "1:234072438399:web:126546816a1f394d4d314a",
  measurementId: "G-9YNB6RS2YC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
