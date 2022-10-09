import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-wp5Tp9UyZtlV6nP4rKu8uMGuAFBuLtE",
  authDomain: "todo-db-86c21.firebaseapp.com",
  projectId: "todo-db-86c21",
  storageBucket: "todo-db-86c21.appspot.com",
  messagingSenderId: "540011153287",
  appId: "1:540011153287:web:e289b68c2fce885c7bf522",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
