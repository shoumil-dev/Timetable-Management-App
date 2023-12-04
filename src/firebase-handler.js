import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3UBNxm9hSsdoVvzkSoqEpXMyG3mW5cfs",
    authDomain: "time-table-management-app-fit.firebaseapp.com",
    projectId: "time-table-management-app-fit",
    storageBucket: "time-table-management-app-fit.appspot.com",
    messagingSenderId: "1079882485915",
    appId: "1:1079882485915:web:bc37c88f05d47fe57f363e"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);