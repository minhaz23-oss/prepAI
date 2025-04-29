
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYr3SjlNNuc31RFyXs88ae16n5ABPnOvM",
  authDomain: "prepai-9937d.firebaseapp.com",
  projectId: "prepai-9937d",
  storageBucket: "prepai-9937d.firebasestorage.app",
  messagingSenderId: "933275524271",
  appId: "1:933275524271:web:543b9aca01faad3f81485a",
  measurementId: "G-DS53TMH8KY"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);