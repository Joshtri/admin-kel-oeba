/* eslint-disable no-undef */
// firebaseAuth.js
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.FIREBASE_API_KEY;
const AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID
const APP_ID = process.env.FIREBASE_APP_ID


const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: SENDER_ID,
    appId: APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, storage };
