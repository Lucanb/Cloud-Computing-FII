// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBwqdnq-a3q982EgeVYa3GokqoREvj3kOc",
    authDomain: "myapp-dc3c4.firebaseapp.com",
    projectId: "myapp-dc3c4",
    storageBucket: "myapp-dc3c4.appspot.com",
    messagingSenderId: "480286110842",
    appId: "1:480286110842:web:21caa168549cac151b37c3",
    measurementId: "G-EXDTXJ48P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);