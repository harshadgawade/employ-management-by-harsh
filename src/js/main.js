/* =============================================
   HR & DEPARTMENT OWNER DASHBOARD
   File: src/js/main.js
   All interactivity & JavaScript logic
   ============================================= */
'use strict';

/* ─────────────────────────────────────────────
   1. GREETING — Dynamic time-based
   ───────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Good Morning';
  if (h >= 12 && h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function renderGreeting() {
  const el = document.getElementById('greetingText');
  if (!el) return;
  const name = Auth.currentUser?.name || 'User';
  el.innerHTML = `${getGreeting()}, <span>${name}</span>! Welcome back.`;
}

/* ─────────────────────────────────────────────
   2. LIVE CLOCK
   ───────────────────────────────────────────── */
function startClock() {
  function tick() {
    const now  = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const clockEl = document.getElementById('liveClock');
    const dateEl  = document.getElementById('liveDate');
    if (clockEl) clockEl.textContent = time;
    if (dateEl)  dateEl.textContent  = date;
  }
  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────────
   3. TOAST NOTIFICATIONS
   ───────────────────────────────────────────── */
const Toast = {
  show(msg, type = 'info', duration = 3200) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: '💡', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || '💡'}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }
};

/* ─────────────────────────────────────────────
   4. AUTH — Email + OTP flow
   ───────────────────────────────────────────── */
const Auth = {
  currentUser: JSON.parse(sessionStorage.getItem('ems_user') || 'null'),
  otpValue: null,
  otpTimer: null,
  timerInterval: null,

  /* Registered HR/Department Owner emails */
  validEmails: [
    'harsh@company.com',
    'hr@company.com',
    'admin@company.com',
    'manager@company.com',
    'priya@company.com',
    'rohan@company.com'
  ],

  users: {
    'harsh@company.com':   { name: 'Harsh Gawade',  role: 'HR Manager',      avatar: 'HG' },
    'hr@company.com':      { name: 'HR Admin',       role: 'Super Admin',     avatar: 'HA' },
    'admin@company.com':   { name: 'System Admin',   role: 'Super Admin',     avatar: 'SA' },
    'manager@company.com': { name: 'Dept Manager',   role: 'Department Head', avatar: 'DM' },
    'priya@company.com':   { name: 'Priya Sharma',   role: 'HR Executive',    avatar: 'PS' },
    'rohan@company.com':   { name: 'Rohan Verma',    role: 'Dept Owner',      avatar: 'RV' }
  },

  isLoggedIn() { return !!this.currentUser; },

  validateEmail(email) {
    const emailRx = /^[^\s@]+@company\.com$/;
    return emailRx.test(email) && this.validEmails.includes(email.toLowerCase());
  },

  sendOTP(email) {
    /* In production this would trigger a real email API.
       For demo, we generate a 6-digit code and show it in a toast. */
    this.otpValue = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`[DEV] OTP for ${email}: ${this.otpValue}`);
    Toast.show(`Demo OTP sent! Use: ${this.otpValue}`, 'info', 8000);
    this.startOTPTimer();
    return this.otpValue;
  },

  startOTPTimer(seconds = 60) {
    this.timerSeconds = seconds;
    clearInterval(this.timerInterval);
    const el      = document.getElementById('otpTimerVal');
    const resend  = document.getElementById('resendBtn');
    if (resend) resend.classList.remove('show');

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (el) el.textContent = this.timerSeconds;
      if (this.timerSeconds <= 0) {
        clearInterval(this.timerInterval);
        if (el) el.textContent = '0';
        if (resend) resend.classList.add('show');
      }
    }, 1000);
  },

  verifyOTP(entered) {
    return entered === this.otpValue;
  },

  login(email) {
    const user = this.users[email.toLowerCase()];
    if (!user) return false;
    this.currentUser = { email, ...user };
    sessionStorage.setItem('ems_user', JSON.stringify(this.currentUser));
    return true;
  },

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('ems_user');
    window.location.href = 'index.html';
  }
};

/* ─────────────────────────────────────────────
   5. LOGIN PAGE CONTROLLER
   ───────────────────────────────────────────── */
const LoginPage = {
  pendingEmail: '',

  init() {
    if (!document.getElementById('loginBox')) return;

    /* If already logged in, go to dashboard */
    if (Auth.isLoggedIn()) {
      window.location.href = 'dashboard.html';
      return;
    }

    document.getElementById('btnSendOTP')?.addEventListener('click', () => this.handleSendOTP());
    document.getElementById('btnVerifyOTP')?.addEventListener('click', () => this.handleVerifyOTP());
    document.getElementById('btnBack')?.addEventListener('click', () => this.showStep(1));
    document.getElementById('resendBtn')?.addEventListener('click', () => {
      Auth.sendOTP(this.pendingEmail);
      Toast.show('New OTP sent!', 'info');
    });

    /* OTP digit auto-advance */
    document.querySelectorAll('.otp-digit').forEach((input, i, arr) => {
      input.addEventListener('input', e => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val.slice(-1);
        if (val && i < arr.length - 1) arr[i + 1].focus();
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) arr[i - 1].focus();
      });
    });

    /* Enter key */
    document.getElementById('loginEmail')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.handleSendOTP();
    });
  },

  showStep(n) {
    document.querySelectorAll('.login-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${n}`)?.classList.add('active');
  },

  handleSendOTP() {
    const email  = document.getElementById('loginEmail')?.value.trim().toLowerCase();
    const errEl  = document.getElementById('emailError');

    if (!email) {
      this.showError(errEl, 'Please enter your email address.');
      return;
    }
    if (!Auth.validateEmail(email)) {
      this.showError(errEl, 'Only registered @company.com HR / Owner emails are allowed.');
      return;
    }
    this.hideError(errEl);
    this.pendingEmail = email;

    const emailDisplay = document.getElementById('otpEmailDisplay');
    if (emailDisplay) emailDisplay.textContent = email;

    Auth.sendOTP(email);
    this.showStep(2);
  },

  handleVerifyOTP() {
    const digits  = [...document.querySelectorAll('.otp-digit')].map(i => i.value).join('');
    const errEl   = document.getElementById('otpError');

    if (digits.length < 6) {
      this.showError(errEl, 'Please enter the complete 6-digit OTP.');
      return;
    }
    if (!Auth.verifyOTP(digits)) {
      this.showError(errEl, 'Invalid OTP. Please try again.');
      document.querySelectorAll('.otp-digit').forEach(i => { i.value = ''; i.classList.add('error'); });
      setTimeout(() => document.querySelectorAll('.otp-digit').forEach(i => i.classList.remove('error')), 1500);
      return;
    }

    this.hideError(errEl);
    clearInterval(Auth.timerInterval);
    Auth.login(this.pendingEmail);
    Toast.show('Login successful! Redirecting…', 'success', 1500);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  },

  showError(el, msg) { if (!el) return; el.textContent = msg; el.classList.add('show'); },
  hideError(el)      { if (!el) return; el.classList.remove('show'); }
};

/* ─────────────────────────────────────────────
   6. DASHBOARD DATA
   ───────────────────────────────────────────── */
const DB = {
  employees: [
    { id: 1, name: 'Harsh Gawade',   email: 'harsh@company.com',   dept: 'Engineering', role: 'HR Manager',      salary: 95000,  status: 'active' },
    { id: 2, name: 'Priya Sharma',   email: 'priya@company.com',   dept: 'Design',      role: 'UI/UX Designer',  salary: 82000,  status: 'active' },
    { id: 3, name: 'Rohan Verma',    email: 'rohan@company.com',   dept: 'Marketing',   role: 'Marketing Lead',  salary: 74000,  status: 'leave'  },
    { id: 4, name: 'Anjali Mehta',   email: 'anjali@company.com',  dept: 'HR',          role: 'HR Executive',    salary: 68000,  status: 'active' },
    { id: 5, name: 'Kiran Patil',    email: 'kiran@company.com',   dept: 'Engineering', role: 'Senior Dev',      salary: 110000, status: 'active' },
    { id: 6, name: 'Sneha Joshi',    email: 'sneha@company.com',   dept: 'Finance',     role: 'Finance Analyst', salary: 78000,  status: 'active' },
    { id: 7, name: 'Amit Kulkarni',  email: 'amit@company.com',    dept: 'Sales',       role: 'Sales Executive', salary: 62000,  status: 'inactive'},
    { id: 8, name: 'Neha Desai',     email: 'neha@company.com',    dept: 'Design',      role: 'Graphic Designer',salary: 72000,  status: 'active' },
  ],

  leaveRequests: [
    { id: 1, name: 'Rohan Verma',   initials: 'RV', type: 'Casual Leave',   dates: 'Aug 30 – Sep 1, 2026',  status: 'pending' },
    { id: 2, name: 'Sneha Joshi',   initials: 'SJ', type: 'Sick Leave',     dates: 'Aug 29, 2026',           status: 'pending' },
    { id: 3, name: 'Amit Kulkarni', initials: 'AK', type: 'Earned Leave',   dates: 'Sep 5 – Sep 7, 2026',   status: 'pending' },
  ],

  todos: [
    { id: 1, text: 'Review Q3 appraisal reports',    priority: 'high',   done: false, due: 'Aug 30' },
    { id: 2, text: 'Update payroll for September',   priority: 'high',   done: false, due: 'Sep 1'  },
    { id: 3, text: 'Schedule team-building event',   priority: 'medium', done: false, due: 'Sep 5'  },
    { id: 4, text: 'Onboard new Design intern',      priority: 'medium', done: true,  due: 'Aug 28' },
    { id: 5, text: 'Update employee handbook v2.0',  priority: 'low',    done: false, due: 'Sep 10' },
    { id: 6, text: 'Conduct monthly 1:1 check-ins',  priority: 'medium', done: true,  due: 'Aug 27' },
  ],

  activities: [
    { dot: 'emerald', text: '<strong>Rohan Verma</strong> submitted a leave request for Sep 5-7.',      time: '2 min ago'  },
    { dot: 'gold',    text: '<strong>Payroll</strong> for August has been processed successfully.',       time: '1 hr ago'   },
    { dot: 'blue',    text: '<strong>Anjali Mehta</strong> completed onboarding for new intern.',        time: '3 hrs ago'  },
    { dot: 'emerald', text: '<strong>Kiran Patil</strong> completed Sprint 14 tasks — 100%.',            time: '5 hrs ago'  },
    { dot: 'red',     text: '<strong>Amit Kulkarni</strong> was marked absent today.',                   time: '8 hrs ago'  },
    { dot: 'gold',    text: '<strong>Policy Update:</strong> New WFH guidelines effective Sep 1.',       time: 'Yesterday'  },
  ],

  payroll: [
    { name: 'Harsh Gawade',   dept: 'Engineering', amount: 95000,  status: 'paid'    },
    { name: 'Priya Sharma',   dept: 'Design',      amount: 82000,  status: 'paid'    },
    { name: 'Kiran Patil',    dept: 'Engineering', amount: 110000, status: 'paid'    },
    { name: 'Rohan Verma',    dept: 'Marketing',   amount: 74000,  status: 'pending' },
    { name: 'Anjali Mehta',   dept: 'HR',          amount: 68000,  status: 'paid'    },
    { name: 'Sneha Joshi',    dept: 'Finance',     amount: 78000,  status: 'pending' },
  ],

  salaryMonths: ['Mar','Apr','May','Jun','Jul','Aug'],
  salaryData:   [420000, 435000, 428000, 460000, 455000, 487000],
  expenseData:  [180000, 195000, 172000, 210000, 198000, 205000],

  deptProgress: [
    { name: 'Engineering', pct: 82 },
    { name: 'Design',      pct: 74 },
    { name: 'Marketing',   pct: 61 },
    { name: 'HR',          pct: 90 },
    { name: 'Finance',     pct: 78 },
  ],

  holidays: [
    { date: '2026-08-15', name: 'Independence Day' },
    { date: '2026-08-31', name: 'Ganesh Chaturthi' },
    { date: '2026-09-02', name: 'Ganesh Chaturthi (holiday)' },
    { date: '2026-10-02', name: 'Gandhi Jayanti' },
    { date: '2026-10-24', name: 'Diwali' },
  ]
};

/* ─────────────────────────────────────────────
   7. DASHBOARD CONTROLLER
   ───────────────────────────────────────────── */
const Dashboard = {
  currentSection: 'home',
  punchedIn: false,
  punchStart: null,

  init() {
    if (!document.getElementById('dashApp')) return;

    /* Auth guard */
    if (!Auth.isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    this.renderUserInfo();
    renderGreeting();
    startClock();
    this.bindNav();
    this.renderHome();
    this.renderAttendance();
    this.renderEmployees();
    this.renderTodo();
    this.renderLeave();
    this.renderPayroll();
    this.renderCalendar();
    this.renderActivity();
    this.renderCharts();
    this.renderRoles();
    this.bindPunch();
    this.bindTodoAdd();
    this.bindSearch();
    this.bindLogout();
    this.bindMobileMenu();
    this.bindLanguage();
  },

  /* ── User info ────────────────────────────── */
  renderUserInfo() {
    const u = Auth.currentUser;
    if (!u) return;
    const els = {
      sidebarName:   document.getElementById('sidebarName'),
      sidebarRole:   document.getElementById('sidebarRole'),
      sidebarAvatar: document.getElementById('sidebarAvatar'),
    };
    if (els.sidebarName)   els.sidebarName.textContent   = u.name;
    if (els.sidebarRole)   els.sidebarRole.textContent   = u.role;
    if (els.sidebarAvatar) els.sidebarAvatar.textContent = u.avatar;
  },

  /* ── Navigation ───────────────────────────── */
  bindNav() {
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.addEventListener('click', () => {
        const s = item.dataset.section;
        this.showSection(s);
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        /* Close mobile sidebar */
        document.querySelector('.sidebar')?.classList.remove('open');
      });
    });
  },

  showSection(id) {
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`sec-${id}`);
    if (target) target.classList.add('active');
    this.currentSection = id;
  },

  /* ── Home KPIs ────────────────────────────── */
  renderHome() {
    const total     = DB.employees.length;
    const present   = DB.employees.filter(e => e.status === 'active').length;
    const onLeave   = DB.employees.filter(e => e.status === 'leave').length;
    const totalPay  = DB.employees.reduce((s, e) => s + e.salary, 0);

    this.setEl('kpiTotal',   total);
    this.setEl('kpiPresent', present);
    this.setEl('kpiLeave',   onLeave);
    this.setEl('kpiPayroll', '₹' + (totalPay / 100000).toFixed(1) + 'L');

    /* Dept progress bars */
    const container = document.getElementById('deptProgress');
    if (container) {
      container.innerHTML = DB.deptProgress.map(d => `
        <div>
          <div class="progress-label"><span>${d.name}</span><span>${d.pct}%</span></div>
          <div class="progress-track">
            <div class="progress-fill" style="width:0%" data-target="${d.pct}"></div>
          </div>
        </div>
      `).join('');
      /* Animate bars */
      setTimeout(() => {
        container.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.target + '%';
        });
      }, 300);
    }
  },

  /* ── Attendance Grid ──────────────────────── */
  renderAttendance() {
    const grid = document.getElementById('attendanceGrid');
    if (!grid) return;
    const now   = new Date();
    const year  = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const days  = new Date(year, month + 1, 0).getDate();

    /* Random demo data */
    const patterns = {};
    for (let d = 1; d <= today; d++) {
      const r = Math.random();
      patterns[d] = r > 0.85 ? 'absent' : r > 0.75 ? 'late' : r > 0.65 ? 'half' : 'present';
    }
    /* Mark holidays */
    DB.holidays.forEach(h => {
      const hd = new Date(h.date);
      if (hd.getMonth() === month && hd.getFullYear() === year) {
        patterns[hd.getDate()] = 'holiday';
      }
    });

    grid.innerHTML = Array.from({ length: days }, (_, i) => {
      const d   = i + 1;
      const cls = d > today ? 'future' : (patterns[d] || 'present');
      const label = d === today ? '•' : d;
      return `<div class="att-day ${cls}" title="Day ${d}: ${cls}">${label}</div>`;
    }).join('');
  },

  /* ── Employee Table ───────────────────────── */
  renderEmployees(filter = '') {
    const tbody = document.getElementById('empTableBody');
    if (!tbody) return;
    const data = filter
      ? DB.employees.filter(e =>
          e.name.toLowerCase().includes(filter.toLowerCase()) ||
          e.dept.toLowerCase().includes(filter.toLowerCase()) ||
          e.role.toLowerCase().includes(filter.toLowerCase()))
      : DB.employees;

    tbody.innerHTML = data.map(e => `
      <tr>
        <td>#${e.id}</td>
        <td>
          <div class="emp-avatar-cell">
            <div class="emp-avatar">${e.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
            <div>
              <div style="font-weight:600">${e.name}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${e.email}</div>
            </div>
          </div>
        </td>
        <td>${e.dept}</td>
        <td>${e.role}</td>
        <td style="color:var(--gold);font-weight:700">₹${e.salary.toLocaleString('en-IN')}</td>
        <td><span class="status-badge ${e.status}">${e.status}</span></td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="Dashboard.editEmployee(${e.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="Dashboard.deleteEmployee(${e.id})">🗑</button>
        </td>
      </tr>
    `).join('');
  },

  editEmployee(id) {
    Toast.show(`Edit employee #${id} — feature coming soon!`, 'info');
  },

  deleteEmployee(id) {
    if (!confirm('Remove this employee from the directory?')) return;
    const idx = DB.employees.findIndex(e => e.id === id);
    if (idx > -1) {
      const name = DB.employees[idx].name;
      DB.employees.splice(idx, 1);
      this.renderEmployees();
      this.renderHome();
      Toast.show(`${name} removed.`, 'success');
    }
  },

  /* ── To-Do List ───────────────────────────── */
  renderTodo() {
    const list = document.getElementById('todoList');
    if (!list) return;
    list.innerHTML = DB.todos.map(t => `
      <div class="todo-item ${t.done ? 'done' : ''}" onclick="Dashboard.toggleTodo(${t.id})">
        <div class="todo-check">${t.done ? '✓' : ''}</div>
        <span class="todo-text">${t.text}</span>
        <span class="todo-badge ${t.priority}">${t.priority}</span>
        <span style="font-size:0.68rem;color:var(--text-muted);margin-left:6px">${t.due}</span>
      </div>
    `).join('');
  },

  toggleTodo(id) {
    const t = DB.todos.find(t => t.id === id);
    if (t) { t.done = !t.done; this.renderTodo(); }
  },

  bindTodoAdd() {
    const btn   = document.getElementById('btnAddTodo');
    const input = document.getElementById('todoInput');
    if (!btn || !input) return;
    const add = () => {
      const text = input.value.trim();
      if (!text) return;
      DB.todos.unshift({ id: Date.now(), text, priority: 'medium', done: false, due: 'Soon' });
      input.value = '';
      this.renderTodo();
      Toast.show('Task added!', 'success', 2000);
    };
    btn.addEventListener('click', add);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  },

  /* ── Leave Requests ───────────────────────── */
  renderLeave() {
    const list = document.getElementById('leaveList');
    if (!list) return;
    list.innerHTML = DB.leaveRequests.filter(l => l.status === 'pending').map(l => `
      <div class="leave-item" id="leave-${l.id}">
        <div class="leave-avatar">${l.initials}</div>
        <div>
          <div class="leave-name">${l.name}</div>
          <div class="leave-dates">${l.type} &nbsp;|&nbsp; ${l.dates}</div>
        </div>
        <div class="leave-actions">
          <button class="btn-approve" onclick="Dashboard.approveLeave(${l.id})">✓ Approve</button>
          <button class="btn-reject"  onclick="Dashboard.rejectLeave(${l.id})">✕ Reject</button>
        </div>
      </div>
    `).join('') || '<p class="text-muted fs-sm" style="padding:16px 0">No pending leave requests.</p>';
  },

  approveLeave(id) {
    const l = DB.leaveRequests.find(l => l.id === id);
    if (l) { l.status = 'approved'; this.renderLeave(); Toast.show(`${l.name}'s leave approved.`, 'success'); }
  },
  rejectLeave(id) {
    const l = DB.leaveRequests.find(l => l.id === id);
    if (l) { l.status = 'rejected'; this.renderLeave(); Toast.show(`${l.name}'s leave rejected.`, 'warning'); }
  },

  /* ── Payroll ──────────────────────────────── */
  renderPayroll() {
    const list = document.getElementById('payrollList');
    if (!list) return;
    list.innerHTML = DB.payroll.map(p => `
      <div class="payroll-row">
        <div>
          <div class="payroll-name">${p.name}</div>
          <div class="payroll-dept">${p.dept}</div>
        </div>
        <span class="payroll-amount">₹${p.amount.toLocaleString('en-IN')}</span>
        <span class="payroll-status ${p.status}">${p.status}</span>
        <button class="btn btn-ghost btn-sm" onclick="Dashboard.downloadSlip('${p.name}')">📄 Slip</button>
      </div>
    `).join('');

    /* Total */
    const total = DB.payroll.reduce((s, p) => s + p.amount, 0);
    this.setEl('payrollTotal', '₹' + total.toLocaleString('en-IN'));
  },

  downloadSlip(name) {
    Toast.show(`Generating payslip for ${name}…`, 'info', 2000);
  },

  /* ── Calendar ─────────────────────────────── */
  calYear:  new Date().getFullYear(),
  calMonth: new Date().getMonth(),

  renderCalendar() {
    const grid   = document.getElementById('calGrid');
    const title  = document.getElementById('calMonthTitle');
    if (!grid || !title) return;

    const year  = this.calYear;
    const month = this.calMonth;
    const today = new Date();
    const monthNames = ['January','February','March','April','May','June',
                        'July','August','September','October','November','December'];
    title.textContent = `${monthNames[month]} ${year}`;

    const firstDay  = new Date(year, month, 1).getDay();
    const daysTotal = new Date(year, month + 1, 0).getDate();
    const prevDays  = new Date(year, month, 0).getDate();

    /* Holiday lookup */
    const holidayDays = new Set(
      DB.holidays
        .filter(h => { const d = new Date(h.date); return d.getMonth() === month && d.getFullYear() === year; })
        .map(h => new Date(h.date).getDate())
    );

    /* Events (demo) */
    const eventDays = new Set([5, 12, 18, 25]);

    let html = '';
    /* Day name headers */
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
      html += `<div class="cal-day-name">${d}</div>`;
    });
    /* Prev month filler */
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-day other-month">${prevDays - i}</div>`;
    }
    /* Current month days */
    for (let d = 1; d <= daysTotal; d++) {
      const isToday   = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isHoliday = holidayDays.has(d);
      const hasEvent  = eventDays.has(d);
      const cls = [
        'cal-day',
        isToday   ? 'today'       : '',
        isHoliday ? 'holiday-day' : '',
        hasEvent  ? 'has-event'   : ''
      ].join(' ').trim();

      const holiday = [...DB.holidays].find(h => {
        const hd = new Date(h.date);
        return hd.getDate() === d && hd.getMonth() === month && hd.getFullYear() === year;
      });
      const title_attr = holiday ? `title="${holiday.name}"` : '';

      html += `<div class="${cls}" ${title_attr}>${d}</div>`;
    }
    /* Next month filler */
    const remaining = 42 - firstDay - daysTotal;
    for (let d = 1; d <= remaining; d++) {
      html += `<div class="cal-day other-month">${d}</div>`;
    }
    grid.innerHTML = html;
  },

  /* ── Activity Stream ──────────────────────── */
  renderActivity() {
    const list = document.getElementById('activityList');
    if (!list) return;
    list.innerHTML = DB.activities.map(a => `
      <div class="activity-item">
        <div class="activity-dot ${a.dot}"></div>
        <div>
          <div class="activity-text">${a.text}</div>
          <div class="activity-time">${a.time}</div>
        </div>
      </div>
    `).join('');
  },

  /* ── Charts (CSS bar charts) ──────────────── */
  renderCharts() {
    const salaryChart = document.getElementById('salaryChart');
    if (salaryChart) {
      const max = Math.max(...DB.salaryData);
      salaryChart.innerHTML = DB.salaryMonths.map((m, i) => {
        const pct = Math.round((DB.salaryData[i] / max) * 100);
        return `
          <div class="bar-item">
            <div class="bar-fill" style="height:0%" data-h="${pct}%"
                 title="${m}: ₹${DB.salaryData[i].toLocaleString('en-IN')}"></div>
            <div class="bar-label">${m}</div>
          </div>`;
      }).join('');
      setTimeout(() => {
        salaryChart.querySelectorAll('.bar-fill').forEach(b => { b.style.height = b.dataset.h; });
      }, 400);
    }

    const expenseChart = document.getElementById('expenseChart');
    if (expenseChart) {
      const max = Math.max(...DB.expenseData);
      expenseChart.innerHTML = DB.salaryMonths.map((m, i) => {
        const pct = Math.round((DB.expenseData[i] / max) * 100);
        return `
          <div class="bar-item">
            <div class="bar-fill em" style="height:0%" data-h="${pct}%"
                 title="${m}: ₹${DB.expenseData[i].toLocaleString('en-IN')}"></div>
            <div class="bar-label">${m}</div>
          </div>`;
      }).join('');
      setTimeout(() => {
        expenseChart.querySelectorAll('.bar-fill').forEach(b => { b.style.height = b.dataset.h; });
      }, 500);
    }
  },

  /* ── RBAC Roles ───────────────────────────── */
  renderRoles() {
    const grid = document.getElementById('rolesGrid');
    if (!grid) return;
    const roles = [
      { name: 'Super Admin',     perms: ['All Access','System Config','User Mgmt','Reports','Payroll'] },
      { name: 'HR Manager',      perms: ['Employee CRUD','Payroll View','Attendance','Leave Approval','Reports'] },
      { name: 'Department Head', perms: ['Team View','Leave Approval','Task Mgmt','Attendance View'] },
      { name: 'Staff',           perms: ['Own Profile','Leave Request','Attendance View','Todo'] },
    ];
    grid.innerHTML = roles.map(r => `
      <div class="role-card">
        <div class="role-name">${r.name}</div>
        <div class="role-perms">
          ${r.perms.map(p => `<span class="perm-tag">${p}</span>`).join('')}
        </div>
      </div>
    `).join('');
  },

  /* ── Punch In/Out ─────────────────────────── */
  bindPunch() {
    const btn  = document.getElementById('punchBtn');
    const stat = document.getElementById('punchStatus');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.punchedIn = !this.punchedIn;
      if (this.punchedIn) {
        this.punchStart = new Date();
        btn.className = 'punch-btn out';
        btn.textContent = '🔴 Punch Out';
        if (stat) stat.innerHTML = `Punched in at <strong>${this.punchStart.toLocaleTimeString('en-IN')}</strong>`;
        Toast.show('Punch-in recorded!', 'success');
      } else {
        const duration = this.punchStart
          ? Math.round((Date.now() - this.punchStart) / 60000) + ' mins'
          : '-';
        btn.className = 'punch-btn in';
        btn.textContent = '🟢 Punch In';
        if (stat) stat.innerHTML = `Session: <strong>${duration}</strong> — See you tomorrow!`;
        Toast.show('Punch-out recorded. Have a great day!', 'success');
      }
    });
  },

  /* ── Search employees ─────────────────────── */
  bindSearch() {
    const input = document.getElementById('empSearch');
    if (input) input.addEventListener('input', e => this.renderEmployees(e.target.value));
  },

  /* ── Logout ───────────────────────────────── */
  bindLogout() {
    document.getElementById('btnLogout')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out?')) Auth.logout();
    });
  },

  /* ── Mobile menu ──────────────────────────── */
  bindMobileMenu() {
    document.getElementById('btnMenu')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
    });
  },

  /* ── Language selector ────────────────────── */
  bindLanguage() {
    document.getElementById('langSelect')?.addEventListener('change', e => {
      const labels = {
        en: 'English selected.',
        hi: 'Hindi support — coming soon!',
        mr: 'Marathi support — coming soon!'
      };
      Toast.show(labels[e.target.value] || 'Language changed.', 'info');
    });
  },

  /* ── Calendar navigation ──────────────────── */
  calPrev() {
    this.calMonth--;
    if (this.calMonth < 0) { this.calMonth = 11; this.calYear--; }
    this.renderCalendar();
  },
  calNext() {
    this.calMonth++;
    if (this.calMonth > 11) { this.calMonth = 0; this.calYear++; }
    this.renderCalendar();
  },

  /* ── Utility ──────────────────────────────── */
  setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
};

/* ─────────────────────────────────────────────
   8. KEYBOARD SHORTCUTS
   ───────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('empSearch')?.focus();
  }
});

/* ─────────────────────────────────────────────
   9. BOOTSTRAP
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  LoginPage.init();
  Dashboard.init();
});
