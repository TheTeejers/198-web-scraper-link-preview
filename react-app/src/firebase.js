import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';

const config = {
  apiKey: "AIzaSyDhmZwiWLGeJ84Am6E0IAEUUw9nX-_WTpk",
  authDomain: "k1data.firebaseapp.com",
  databaseURL: "https://k1data.firebaseio.com",
  projectId: "k1data",
  storageBucket: "k1data.appspot.com",
  messagingSenderId: "993629183798",
  appId: "1:993629183798:web:cc9215a5d402624b98dd97",
  measurementId: "G-Q8S3XSF932"
}

firebase.initializeApp(config);

export const app = firebase.app();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const functions = firebase.functions();

console.log(!!app.name ? 'Firebase Mode Activated!' : 'Firebase not working :(')
