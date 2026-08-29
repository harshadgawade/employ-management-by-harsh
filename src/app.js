document.addEventListener("DOMContentLoaded", () => {
  initGreetingSystem();
  initCharts();
});

// Multi-language Translation Registry
const translations = {
  en: {
    welcome: "Good Day, User! Welcome back.",
    sub: "Here is your daily operational breakdown across departments.",
    punchIn: "Punch In",
    punchOut: "Punch Out"
  },
  hi: {
    welcome: "नमस्ते, उपयोगकर्ता! आपका स्वागत है।",
    sub: "यहाँ आपके विभागों का दैनिक कार्य विवरण है।",
    punchIn: "पंच इन करें",
    punchOut: "पंच आउट करें"
  },
  mr: {
    welcome: "नमस्कार, वापरकर्ता! आपले स्वागत आहे.",
    sub: "येथे आपल्या विभागांचा दैनिक अहवाल आहे.",
    punchIn: "पंच इन करा",
    punchOut: "पंच आउट करा"
  }
};

let currentLang = 'en';

// 1. Dynamic Time-Based Greeting Engine (Requirement 1)
function initGreetingSystem() {
  const greetingElement = document.getElementById("greeting-text");
  const currentHour = new Date().getHours();
  let timeOfDay = "";

  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = "Good Afternoon";
  } else {
    timeOfDay = "Good Evening";
  }

  const userName = "Rahul";
  if (greetingElement) {
    greetingElement.textContent = `${timeOfDay}, ${userName}! Welcome back.`;
  }
}

// Language Switcher Logic
function changeLanguage(lang) {
  currentLang = lang;
  const t = translations[lang] || translations.en;
  document.getElementById("greeting-text").textContent = t.welcome;
  document.getElementById("sub-greeting-text").textContent = t.sub;
}

// 2. Authentication & 2FA OTP Timer Flow (Requirement 2)
let timerInterval;

function handleSendOTP(event) {
  event.preventDefault();
  const emailInput = document.getElementById("user-email").value;
  const errorElement = document.getElementById("email-error");

  // Domain restriction check (*@company.com)
  if (!emailInput.endsWith("@company.com")) {
    errorElement.classList.remove("hidden");
    return;
  }

  errorElement.classList.add("hidden");
  document.getElementById("email-step-form").classList.add("hidden");
  document.getElementById("otp-step-form").classList.remove("hidden");

  // 60-second OTP countdown timer
  let timeLeft = 60;
  const timerDisplay = document.getElementById("timer-display");
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("OTP expired. Please try again.");
      document.getElementById("otp-step-form").classList.add("hidden");
      document.getElementById("email-step-form").classList.remove("hidden");
    }
  }, 1000);
}

function handleVerifyOTP(event) {
  event.preventDefault();
  const otp = document.getElementById("otp-input").value;
  
  if (otp.length === 6) {
    clearInterval(timerInterval);
    document.getElementById("auth-modal").classList.add("hidden");
    alert("Authentication Successful! JWT session token generated.");
  } else {
    alert("Invalid OTP! Please enter a 6-digit numeric code.");
  }
}

function logout() {
  document.getElementById("auth-modal").classList.remove("hidden");
  document.getElementById("otp-step-form").classList.add("hidden");
  document.getElementById("email-step-form").classList.remove("hidden");
}

// 3. Time Enroll & Exit Logger (Punch In / Punch Out)
let isPunchedIn = false;
let punchTimerInterval;
let secondsPunched = 0;

function togglePunch() {
  const punchBtn = document.getElementById("punch-btn");
  const punchStatus = document.getElementById("punch-status");
  const timerDisplay = document.getElementById("punch-timer");

  isPunchedIn = !isPunchedIn;

  if (isPunchedIn) {
    punchStatus.textContent = translations[currentLang].punchOut;
    punchBtn.classList.remove("bg-emerald-500", "hover:bg-emerald-600");
    punchBtn.classList.add("bg-red-500", "hover:bg-red-600");

    punchTimerInterval = setInterval(() => {
      secondsPunched++;
      const hrs = String(Math.floor(secondsPunched / 3600)).padStart(2, '0');
      const mins = String(Math.floor((secondsPunched % 3600) / 60)).padStart(2, '0');
      const secs = String(secondsPunched % 60).padStart(2, '0');
      timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  } else {
    punchStatus.textContent = translations[currentLang].punchIn;
    punchBtn.classList.remove("bg-red-500", "hover:bg-red-600");
    punchBtn.classList.add("bg-emerald-500", "hover:bg-emerald-600");
    clearInterval(punchTimerInterval);
  }
}

// 4. Smart Financial Analytics & Visual Attendance Charts
function initCharts() {
  // Financial Line Chart
  const ctxFin = document.getElementById("financialChart").getContext("2d");
  new Chart(ctxFin, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Budget Allocated (₹)",
          data: [3000000, 3000000, 3200000, 3200000, 3500000, 3500000],
          borderColor: "#94a3b8",
          borderDash: [4, 4],
          fill: false,
        },
        {
          label: "Actual Expenses (₹)",
          data: [2200000, 2400000, 2100000, 2800000, 2450000, 2600000],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });

  // Attendance Donut Chart
  const ctxAtt = document.getElementById("attendanceChart").getContext("2d");
  new Chart(ctxAtt, {
    type: "doughnut",
    data: {
      labels: ["Present", "Late", "On Leave", "Half-Day"],
      datasets: [
        {
          data: [88, 3, 4, 2],
          backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  });
}

// 5. Operations To-Do List Handler
function addNewTask() {
  const taskText = prompt("Enter new task title:");
  if (taskText) {
    const list = document.getElementById("todo-list");
    const li = document.createElement("li");
    li.className = "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100";
    li.innerHTML = `
      <div class="flex items-center gap-3">
        <input type="checkbox" class="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer">
        <span class="text-xs font-medium text-slate-700">${taskText}</span>
      </div>
      <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded">Normal</span>
    `;
    list.appendChild(li);
  }
}

// Export Engine Simulation
function exportData(format) {
  alert(`Generating & Downloading ${format} Statistical Report...`);
}

function switchTab(tabName) {
  console.log(`Switched view to ${tabName}`);
}
