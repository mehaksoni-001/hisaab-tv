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

// Track if user has interacted with the page
let userHasInteracted = false;

// Set up multiple interaction listeners for better autoplay support
const enableAudio = () => {
    userHasInteracted = true;
    // Try to play a silent sound to enable audio context
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
};

// Listen for any user interaction
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });
document.addEventListener('keydown', enableAudio, { once: true });
document.addEventListener('mousemove', enableAudio, { once: true });

// Also try to enable audio on visibility change (when tab becomes active)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !userHasInteracted) {
        enableAudio();
    }
});

// Confetti animation class
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#f7b510', '#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3'];
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10 - 5,
            size: Math.random() * 8 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            angle: Math.random() * 360,
            angularVelocity: (Math.random() - 0.5) * 10,
            life: 1
        };
    }

    explode() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < 150; i++) {
            this.particles.push(this.createParticle(centerX, centerY));
        }
        
        this.animate();
    }

    animate() {
        const animationFrame = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles = this.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.3; // gravity
                particle.angle += particle.angularVelocity;
                particle.life -= 0.01;
                particle.size *= 0.98;
                
                if (particle.life > 0) {
                    this.ctx.save();
                    this.ctx.translate(particle.x, particle.y);
                    this.ctx.rotate(particle.angle * Math.PI / 180);
                    this.ctx.globalAlpha = particle.life;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                    this.ctx.restore();
                    return true;
                }
                return false;
            });
            
            if (this.particles.length > 0) {
                requestAnimationFrame(animationFrame);
            }
        };
        
        animationFrame();
    }
}

// Initialize confetti
const confettiCanvas = document.getElementById('confetti-canvas');
const confetti = new Confetti(confettiCanvas);

onValue(rootRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data['overview']);
    //var overview_value = data['overview'];
   // const overviewHTML = window.document.getElementById('overview_value')
   // overviewHTML.textContent = `${overview_value.toLocaleString()}`

   // var active_users = data['active_users'];
   // const activeHTML = window.document.getElementById('active_user_value')
   // activeHTML.textContent = active_users;
     
   // window.onload = function () {
      //  document.getElementById('overview')?.remove();
      //  document.getElementById('active-users')?.remove();
     // };
      
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
// setTimeout(() => {
//     window.location.reload();
// }, 30 * 60 * 1000);

function playPaymentSound(){
    const sound = document.getElementById("payment_sound");
    sound.play().catch(errror => {
        console.log("Audio play failed:", errror);

    })
}

document.addEventListener("DOMContentLoaded",function(){
    document.body.addEventListener("click",function (){
        playPaymentSound();
    },{ once:true});

});