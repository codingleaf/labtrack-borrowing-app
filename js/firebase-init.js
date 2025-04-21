'use strict';

const firebaseConfig = {
    apiKey: "AIzaSyA7OS6hNcNY0bIZgoKs49f7GI3cqFJqshs",
    authDomain: "labtrack-bu.firebaseapp.com",
    projectId: "labtrack-bu",
    storageBucket: "labtrack-bu.appspot.com",  // Fixed the typo: should be .app**spot**.com
    messagingSenderId: "275439543543",
    appId: "1:275439543543:web:794705f68bd4f0f79f9ff2",
    measurementId: "G-3DYGRXLJDN"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
  