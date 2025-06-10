// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";

import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBgw42QxAVC96nXyKMeEPRSGub1YeZziiY",
    authDomain: "hisaab-tv.firebaseapp.com",
    databaseURL: "https://hisaab-tv-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hisaab-tv",
    storageBucket: "hisaab-tv.firebasestorage.app",
    messagingSenderId: "1009690346881",
    appId: "1:1009690346881:web:dc5199311162232beb1480",
    measurementId: "G-Q85TWW2SNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const rootRef = ref(database, '/');
onValue(rootRef, (snapshot) => {
    const data = snapshot.val();
    console.log("🔥 Root Database Data:", JSON.stringify(data));
});