import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0IYSi5JBwzNfQtP6zakMiaPas1EUxpEE",
  authDomain: "billing-subscription-2ef17.firebaseapp.com",
  projectId: "billing-subscription-2ef17",
  storageBucket: "billing-subscription-2ef17.appspot.com",
  messagingSenderId: "66814232867",
  appId: "1:66814232867:web:a2e211bf0672a8cac4e496"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export {fireDB, auth};