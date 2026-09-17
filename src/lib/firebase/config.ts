// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDP1LdzefT7kAsje2TCHs53PYTWbS6-EI",
  authDomain: "tirsit-pms.firebaseapp.com",
  projectId: "tirsit-pms",
  storageBucket: "tirsit-pms.firebasestorage.app",
  messagingSenderId: "670056025393",
  appId: "1:670056025393:web:b252a058a41091908a3410",
  measurementId: "G-CW38LH4T5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);