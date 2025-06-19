// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAg0PrvpdddksATTd0e8rc3q8yz2U1ranM",
  authDomain: "myhisaab-tv.firebaseapp.com",
  databaseURL: "https://myhisaab-tv-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myhisaab-tv",
  storageBucket: "myhisaab-tv.appspot.com",
  messagingSenderId: "689042873400",
  appId: "1:689042873400:web:80e2e01a94c5a589a01acd",
  measurementId: "G-FNMY483S6S"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Confetti class
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
      x,
      y,
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
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.angle += p.angularVelocity;
        p.life -= 0.01;
        p.size *= 0.98;
        if (p.life > 0) {
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.angle * Math.PI / 180);
          this.ctx.globalAlpha = p.life;
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
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

// Setup confetti
const confettiCanvas = document.getElementById('confetti-canvas');
const confetti = new Confetti(confettiCanvas);

// Enable sound on interaction
let userHasInteracted = false;
const enableAudio = () => {
  if (!userHasInteracted) {
    userHasInteracted = true;
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }
};
["click", "touchstart", "keydown", "mousemove"].forEach(event =>
  document.addEventListener(event, enableAudio, { once: true })
);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) enableAudio();
});

// Play payment sound
function playPaymentSound() {
  const sound = document.getElementById("payment_sound");
  sound.play().catch(error => {
    console.warn("Audio play failed:", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", playPaymentSound, { once: true });
});

// Load Firebase data
const rootRef = ref(db, '/');
onValue(rootRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const today_sale = data['today_sale'] || 0;
  document.getElementById("today_sale").textContent = `₹${today_sale.toLocaleString()}`;

  const sales = data['sales'];
  const teamSection = document.getElementById("team-section");
  const totalRow = document.getElementById("total-row");
  teamSection.innerHTML = ""; // Clear previous rows
  teamSection.appendChild(totalRow); // Re-add total row

  let totalTarget = 0;
  let totalAchievement = 0;

  for (let tl in sales) {
    if (tl.toLowerCase() === "total") continue;

    const teamData = sales[tl];
  const name = teamData.tl || `Team ${parseInt(tl) + 1}`;
  const target = teamData.target ||0;
  const achievement = teamData.achievement ||0;
  const percentage = target > 0 ? ((achievement / target) * 100).toFixed(2) : "0.00";
  
  const row = document.createElement("tr");
  row.innerHTML = `
    <td class="name-font">${name.toUpperCase()}</td>
    <td class="number-font">₹${target.toLocaleString()}</td>
    <td class="number-font">₹${achievement.toLocaleString()}</td>
    <td class="number-font">${percentage}%</td>
  `;
    teamSection.insertBefore(row, totalRow);

    totalTarget += target;
    totalAchievement += achievement;
  }

  const totalPercentage = totalTarget > 0 ? ((totalAchievement / totalTarget) * 100).toFixed(2) : "0.00";
  document.getElementById("total-target").textContent = `₹${totalTarget.toLocaleString()}`;
  document.getElementById("total-achievement").textContent = `₹${totalAchievement.toLocaleString()}`;
  document.getElementById("total-percentage").textContent = `${totalPercentage}%`;

  console.log("🔥 Data loaded:", data);
});
