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
    console.log(data['overview']);
    var overview_value = data['overview'];
    const overviewHTML = window.document.getElementById('overview_value')
    overviewHTML.textContent = overview_value

    var active_users = data['active_users'];
    const activeHTML = window.document.getElementById('active_user_value')
    activeHTML.textContent = active_users;

    var today_sale = data['today_sale'];
    const todayHTML = window.document.getElementById('today_sale')
    todayHTML.textContent = today_sale;

    const sales = data['sales'];
    const teamSection = document.getElementById('team-section');
    const totalRow = document.getElementById('total-row');
    
    // Clear existing team member rows but keep total row structure
    const existingRows = teamSection.querySelectorAll('tr:not(#total-row)');
    existingRows.forEach(row => row.remove());
    
    let totalTarget = 0;
    let totalAchievement = 0;
    
    sales.forEach(sale => {
        if (sale) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="number-font">${sale.tl.toUpperCase()}</td>
                <td class="number-font">${sale.target.toLocaleString()}</td>
                <td class="number-font">${sale.achievement.toLocaleString()}</td>
            `;
            teamSection.insertBefore(row, totalRow);
            
            totalTarget += sale.target;
            totalAchievement += sale.achievement;
        }
    });
    
    document.getElementById('total-target').textContent = totalTarget.toLocaleString();
    document.getElementById('total-achievement').textContent = totalAchievement.toLocaleString();
    
    console.log("🔥 Root Database Data:", data);
});