import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBqKvxFvmwfr_u2Bq9uS-qg-NGNGKkeCF0",
    authDomain: "medicai-2ab57.firebaseapp.com",
    projectId: "medicai-2ab57",
    storageBucket: "medicai-2ab57.appspot.com",
    messagingSenderId: "1010875331468",
    appId: "1:1010875331468:web:bed2564ccd919dd72edca9",
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);