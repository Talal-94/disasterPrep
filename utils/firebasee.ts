// // src/services/firebase.ts
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyBlsRKIyHKNpaBOU1kmsLX9cxckIZl2x50",
//     authDomain: "disaster-prep-push.firebaseapp.com",
//     projectId: "disaster-prep-push",
//     storageBucket: "disaster-prep-push.firebasestorage.app",
//     messagingSenderId: "442243330288",
//     appId: "1:442243330288:web:1ccd389a154de0e73d9235"
// };


// const app = initializeApp(firebaseConfig);
// const firestore = getFirestore(app);
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });


// export { app, firestore, auth };


// utils/firebasee.ts

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const auth = getAuth();
export const firestore = getFirestore();
