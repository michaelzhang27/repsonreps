import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5S3ShY__nORpA_TrAeLny1V6WsSX0U7w",
  authDomain: "reps-on-reps.firebaseapp.com",
  projectId: "reps-on-reps",
  storageBucket: "reps-on-reps.appspot.com",
  messagingSenderId: "599837230976",
  appId: "1:599837230976:web:aad550b01edaf93a13e365",
  measurementId: "G-VX4VQW5LNM",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} else {
  app = firebase.app();
}
const db = app.firestore();
const auth = firebase.auth();
export { firebase, db, auth };
