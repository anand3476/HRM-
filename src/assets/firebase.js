// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIHChZ9GTxUbxS4GJxBQd0uAQm9H2olso",
  authDomain: "trial-3476.firebaseapp.com",
  projectId: "trial-3476",
  storageBucket: "trial-3476.firebasestorage.app",
  messagingSenderId: "235751091424",
  appId: "1:235751091424:web:d472ffc563da5eea223485",
  measurementId: "G-GDVEEVX1SV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);