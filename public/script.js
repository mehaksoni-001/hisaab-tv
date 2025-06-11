// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";

import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAg0PrvpdddksATTd0e8rc3q8yz2U1ranM",
  authDomain: "myhisaab-tv.firebaseapp.com",
  databaseURL: "https://myhisaab-tv-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myhisaab-tv",
  storageBucket: "myhisaab-tv.firebasestorage.app",
  messagingSenderId: "689042873400",
  appId: "1:689042873400:web:80e2e01a94c5a589a01acd",
  measurementId: "G-FNMY483S6S"
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
    overviewHTML.textContent = `${overview_value.toLocaleString()}`

    var active_users = data['active_users'];
    const activeHTML = window.document.getElementById('active_user_value')
    activeHTML.textContent = active_users;

    var today_sale = data['today_sale'];
    const todayHTML = window.document.getElementById('today_sale')
    todayHTML.textContent = `₹${today_sale.toLocaleString()}`;
     
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
                <td class="name-font">${sale.tl.toUpperCase()}</td>
                <td class="number-font">₹${sale.target.toLocaleString()}</td>
                <td class="number-font">₹${sale.achievement.toLocaleString()}</td>
            `;
            teamSection.insertBefore(row, totalRow);
            
            totalTarget += sale.target;
            totalAchievement += sale.achievement;
        }
    });
    
    document.getElementById('total-target').textContent = `₹${totalTarget.toLocaleString()}`;
    document.getElementById('total-achievement').textContent = `₹${totalAchievement.toLocaleString()}`;
    
    console.log("🔥 Root Database Data:", data);
});
 
// Auto refresh the page every 30 minutes (30 * 60 * 1000 milliseconds)
setTimeout(() => {
    window.location.reload();
}, 30 * 60 * 1000);
function playPaymentSound(){
    const sound = document.getElementById("payment_sound");
    sound.play().catch(errror => {
        console.log("Audio play failed:", error);

    })
}

document.addEventListener("DOMContentLoaded",function(){
    document.body.addEventListener("click",function (){
        playPaymentSound();
    },{ once:true});

});