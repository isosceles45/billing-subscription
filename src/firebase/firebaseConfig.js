import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0IYSi5JBwzNfQtP6zakMiaPas1EUxpEE",
  authDomain: "billing-subscription-2ef17.firebaseapp.com",
  projectId: "billing-subscription-2ef17",
  storageBucket: "billing-subscription-2ef17.appspot.com",
  messagingSenderId: "66814232867",
  appId: "1:66814232867:web:a2e211bf0672a8cac4e496"
};

if(!firebase.apps.length)
{
  firebase.initializeApp(firebaseConfig)
}

export default firebase;