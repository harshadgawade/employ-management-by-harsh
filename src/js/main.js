/* =============================================
   EMPLOYEE MANAGEMENT SYSTEM
   File: src/js/main.js
   All interactivity & JavaScript logic
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   1. EMPLOYEE DATA STORE
   ───────────────────────────────────────────── */
const EMS = {
  employees: JSON.parse(localStorage.getItem('ems_employees') || '[]'),

  save() {
    localStorage.setItem('ems_employees', JSON.stringify(this.employees));
  },

  add(emp) {
    emp.id = Date.now();
    emp.createdAt = new Date().toISOString();
    this.employees.push(emp);
    this.save();
    return emp;
  },

  delete(id) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.save();
  },

  getAll() {
    return [...this.employees];
  },

  search(query) {
    const q = query.toLowerCase();
    return this.employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  },

  sortBy(field, asc = true) {
    return [...this.employees].sort((a, b) => {
      let va = a[field], vb = b[field];
      if (field === 'salary') { va = parseFloat(va); vb = parseFloat(vb); }
      else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
  }
};

/* ─────────────────────────────────────────────
   2. TOAST NOTIFICATIONS
   ───────────────────────────────────────────── */
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3200) {
    const icons = { success: '✅', error: '❌', info: '💡' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '💡'}</span>
      <span>${message}</span>
    `;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 320);
    }, duration);
  }
};

/* ─────────────────────────────────────────────
   3. MODAL (Confirm Delete)
   ───────────────────────────────────────────── */
const Modal = {
  overlay: null,
  _resolve: null,

  init() {
    this.overlay = document.getElementById('modalOverlay');
    document.getElementById('modalCancel')?.addEventListener('click', () => this._close(false));
    document.getElementById('modalConfirm')?.addEventListener('click', () => this._close(true));
    this.overlay?.addEventListener('click', e => {
      if (e.target === this.overlay) this._close(false);
    });
  },

  confirm(title, message) {
    return new Promise(resolve => {
      this._resolve = resolve;
      document.getElementById('modalTitle').textContent  = title;
      document.getElementById('modalBody').textContent   = message;
      this.overlay.classList.add('active');
    });
  },

  _close(result) {
    this.overlay.classList.remove('active');
    if (this._resolve) { this._resolve(result); this._resolve = null; }
  }
};

/* ─────────────────────────────────────────────
   4. TABLE RENDERER
   ───────────────────────────────────────────── */
const Table = {
  sortField: 'id',
  sortAsc:   true,
  searchQuery: '',

  init() {
    // Sort headers
    document.querySelectorAll('.ems-table thead th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.sortField === field) {
          this.sortAsc = !this.sortAsc;
        } else {
          this.sortField = field;
          this.sortAsc = true;
        }
        this.render();
      });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        this.searchQuery = e.target.value.trim();
        this.render();
      });
    }
  },

  getInitials(name) {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  },

  formatSalary(val) {
    return '₹ ' + parseFloat(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  render() {
    const tbody   = document.getElementById('employeeTableBody');
    const countEl = document.getElementById('employeeCount');
    const empty   = document.getElementById('emptyState');
    const table   = document.getElementById('tableWrapper');
    if (!tbody) return;

    // Get filtered + sorted data
    let data = this.searchQuery
      ? EMS.search(this.searchQuery)
      : EMS.sortBy(this.sortField, this.sortAsc);

    if (this.searchQuery) {
      data = data.sort((a, b) => {
        let va = a[this.sortField], vb = b[this.sortField];
        if (this.sortField === 'salary') { va = parseFloat(va); vb = parseFloat(vb); }
        else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
        if (va < vb) return this.sortAsc ? -1 : 1;
        if (va > vb) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    // Update count
    if (countEl) countEl.textContent = data.length;

    // Update stat card
    const statTotal = document.getElementById('statTotal');
    if (statTotal) statTotal.textContent = EMS.employees.length;

    // Sort icons
    document.querySelectorAll('.ems-table thead th[data-sort]').forEach(th => {
      const icon = th.querySelector('.sort-icon');
      th.classList.remove('sorted');
      if (icon) {
        icon.textContent = '↕';
        if (th.dataset.sort === this.sortField) {
          th.classList.add('sorted');
          icon.textContent = this.sortAsc ? '↑' : '↓';
        }
      }
    });

    // Empty state
    if (data.length === 0) {
      if (table)  table.classList.add('hidden');
      if (empty)  empty.classList.remove('hidden');
      return;
    }
    if (table)  table.classList.remove('hidden');
    if (empty)  empty.classList.add('hidden');

    // Render rows
    tbody.innerHTML = data.map(emp => `
      <tr data-id="${emp.id}">
        <td>${emp.id}</td>
        <td>
          <div class="avatar-cell">
            <div class="avatar">${this.getInitials(emp.name)}</div>
            <span>${this.escapeHtml(emp.name)}</span>
          </div>
        </td>
        <td>${this.escapeHtml(emp.email)}</td>
        <td><span class="dept-badge">${this.escapeHtml(emp.department)}</span></td>
        <td class="salary-cell">${this.formatSalary(emp.salary)}</td>
        <td>
          <button class="btn-neon btn-danger-neon delete-btn" data-id="${emp.id}">
            🗑 Delete
          </button>
        </td>
      </tr>
    `).join('');

    // Bind delete buttons
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => UI.deleteEmployee(Number(btn.dataset.id)));
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
};

/* ─────────────────────────────────────────────
   5. FORM HANDLER
   ───────────────────────────────────────────── */
const Form = {
  init() {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit(form);
    });

    // Live validation
    form.querySelectorAll('.field-input').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) this.validateField(input);
      });
    });
  },

  validateField(input) {
    const val = input.value.trim();
    let valid = true;
    let msg   = '';

    if (!val) {
      valid = false; msg = 'This field is required.';
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      valid = false; msg = 'Enter a valid email address.';
    } else if (input.type === 'number' && parseFloat(val) < 0) {
      valid = false; msg = 'Salary must be a positive number.';
    }

    input.classList.toggle('error', !valid);
    let errEl = input.parentNode.querySelector('.field-error');
    if (!valid) {
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error';
        input.parentNode.appendChild(errEl);
      }
      errEl.textContent = msg;
    } else {
      errEl?.remove();
    }
    return valid;
  },

  handleSubmit(form) {
    const inputs  = form.querySelectorAll('.field-input');
    let allValid  = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) allValid = false;
    });

    if (!allValid) {
      Toast.show('Please fix the errors before saving.', 'error');
      return;
    }

    const emp = {
      name:       form.querySelector('[name="name"]').value.trim(),
      email:      form.querySelector('[name="email"]').value.trim(),
      department: form.querySelector('[name="department"]').value.trim(),
      salary:     parseFloat(form.querySelector('[name="salary"]').value)
    };

    EMS.add(emp);
    Toast.show(`${emp.name} added successfully!`, 'success');
    form.reset();
    Table.render();
    UI.showPage('list');
  }
};

/* ─────────────────────────────────────────────
   6. UI CONTROLLER
   ───────────────────────────────────────────── */
const UI = {
  init() {
    Toast.init();
    Modal.init();
    Table.init();
    Form.init();
    this.bindNav();
    Table.render();

    // Animate stat cards on load
    document.querySelectorAll('.stat-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100 + i * 100);
    });

    // Counter animation for stat values
    this.animateCounters();
  },

  bindNav() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.showPage(el.dataset.page);
      });
    });
  },

  showPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`page-${page}`);
    if (target) {
      target.classList.remove('hidden');
      target.style.animation = 'none';
      target.offsetHeight; // reflow
      target.style.animation = 'fadeInUp 0.4s ease forwards';
    }
    // Active nav link
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === page);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async deleteEmployee(id) {
    const emp = EMS.employees.find(e => e.id === id);
    if (!emp) return;

    const confirmed = await Modal.confirm(
      'Delete Employee',
      `Are you sure you want to remove "${emp.name}" from the system? This cannot be undone.`
    );

    if (confirmed) {
      EMS.delete(id);
      Table.render();
      Toast.show(`${emp.name} has been removed.`, 'success');
    }
  },

  animateCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseInt(el.dataset.counter, 10);
      if (isNaN(target)) return;
      let current = 0;
      const step  = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
    });
  }
};

/* ─────────────────────────────────────────────
   7. KEYBOARD SHORTCUTS
   ───────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  // Ctrl/Cmd + K → focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('searchInput')?.focus();
  }
  // Escape → close modal
  if (e.key === 'Escape') {
    document.getElementById('modalOverlay')?.classList.remove('active');
  }
  // Ctrl/Cmd + N → go to add form
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    UI.showPage('add');
  }
});

/* ─────────────────────────────────────────────
   8. SEED DEMO DATA (first visit only)
   ───────────────────────────────────────────── */
function seedDemoData() {
  if (EMS.employees.length > 0) return;
  const demo = [
    { name: 'Harsh Gawade',    email: 'harsh@company.com',    department: 'Engineering',  salary: 95000 },
    { name: 'Priya Sharma',    email: 'priya@company.com',    department: 'Design',       salary: 82000 },
    { name: 'Rohan Verma',     email: 'rohan@company.com',    department: 'Marketing',    salary: 74000 },
    { name: 'Anjali Mehta',    email: 'anjali@company.com',   department: 'HR',           salary: 68000 },
    { name: 'Kiran Patil',     email: 'kiran@company.com',    department: 'Engineering',  salary: 110000 },
  ];
  demo.forEach(e => EMS.add(e));
}

/* ─────────────────────────────────────────────
   9. BOOTSTRAP
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  UI.init();
  UI.showPage('list');
});
