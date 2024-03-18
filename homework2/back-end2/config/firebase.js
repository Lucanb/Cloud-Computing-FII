// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAKljfl7QAOHoyp5dxL69VYm80r_cuvG5g",
    authDomain: "homework2-c8e24.firebaseapp.com",
    projectId: "homework2-c8e24",
    storageBucket: "homework2-c8e24.appspot.com",
    messagingSenderId: "525749034713",
    appId: "1:525749034713:web:ddc4216b0bc897ac86a8c8",
    measurementId: "G-FLJNGSTKWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
