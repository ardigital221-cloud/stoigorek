/**
 * UI Rendering and Event Controller
 * Dynamically renders the CineTrack interface based on configuration and state.
 */

const UI = {
  // Current active filter for tracked items
  activeFilter: "all",
  searchQuery: "",

  init() {
    this.bindGlobalEvents();
    this.render();
  },

  // Global events bound once
  bindGlobalEvents() {
    // Listen for user state changes
    window.addEventListener("userUpdated", () => {
      this.updateHeader();
      this.renderStats();
      this.renderAchievements();
    });

    // Listen for item list changes
    window.addEventListener("itemsUpdated", () => {
      this.renderStats();
      this.renderTrackedItems();
      this.renderAchievements();
    });

    // Listen for achievement unlocks
    window.addEventListener("achievementUnlocked", (e) => {
      this.showAchievementToast(e.detail);
    });

    // Close modals on clicking overlay or close btn
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.closest(".btn-close-modal")) {
          overlay.classList.remove("active");
        }
      });
    });
  },

  render() {
    this.updateHeader();
    
    const root = document.getElementById("app-root");
    if (!root) return;

    if (!STATE.currentUser) {
      this.renderAuthScreen(root);
      return;
    }

    const config = CONFIG;
    
    // Main App Layout
    root.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-tag">
            <span>✨ ${config.name} Engine</span>
            <span class="premium-tag" id="premium-banner-tag" style="display: ${STATE.currentUser.premium ? 'inline-block' : 'none'}">Premium</span>
          </div>
          <h1 class="hero-title">${config.heroTitle}</h1>
          <p class="hero-subtitle">${config.heroDesc}</p>
        </div>
      </section>

      <div class="container">
        <!-- Stats Dashboard Row -->
        <div class="stats-grid" id="stats-dashboard"></div>

        <!-- Ad Banner for Free users -->
        <div id="ad-banner-placement"></div>

        <!-- Main Content Split -->
        <div class="dashboard-grid">
          <!-- Left: Personal list manager -->
          <div class="card">
            <div class="card-title-row">
              <h2>Ваш список ${config.itemLabelPlural}</h2>
              <button class="btn btn-primary" id="btn-add-item-modal">
                <span>➕</span> ${config.actionButtonText}
              </button>
            </div>
            
            <div class="items-list-header">
              <div class="search-filter-wrap">
                <input type="text" id="search-input" class="form-input" placeholder="Поиск по названию..." value="${this.searchQuery}">
              </div>
              <div class="filters-pills" id="status-filters"></div>
            </div>

            <div class="items-grid" id="items-list-container">
              <!-- Rendered items go here -->
            </div>
          </div>

          <!-- Right Sidebar: Upcoming Releases, Achievements, Admin panel -->
          <div class="sidebar-panel">
            <!-- Calendar Releases -->
            <div class="card">
              <div class="card-title-row">
                <h2>Календарь релизов</h2>
                <span>📅</span>
              </div>
              <div class="calendar-list" id="calendar-container"></div>
            </div>

            <!-- Achievements -->
            <div class="card">
              <div class="card-title-row">
                <h2>Ваши награды</h2>
                <span style="color: var(--color-accent)">🏆</span>
              </div>
              <div class="achievements-list" id="achievements-container"></div>
            </div>

            <!-- Feedback Request Form -->
            <div class="card">
              <div class="card-title-row">
                <h2>${config.feedbackLabel}</h2>
                <span>📩</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                ${config.feedbackPrompt}
              </p>
              <form id="feedback-form" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group" style="margin-bottom: 0;">
                  <input type="text" id="fb-title" class="form-input" placeholder="Название (${config.itemLabel.toLowerCase()})" required autocomplete="off">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <input type="text" id="fb-creator" class="form-input" placeholder="${config.creatorLabel}" required autocomplete="off">
                </div>
                <button type="submit" class="btn btn-secondary" style="width: 100%;">Отправить запрос</button>
              </form>
            </div>

            <!-- Admin Simulation View -->
            <div class="card" id="admin-panel-card" style="display: ${STATE.currentUser.email === 'admin@admin.ru' ? 'block' : 'none'}; border-color: var(--color-danger);">
              <div class="card-title-row">
                <h2>Панель админа <span class="admin-badge">Simulation</span></h2>
                <span>🔑</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
                Здесь вы можете одобрять запросы пользователей на добавление контента. Одобрение начислит пользователю 50 очков и добавит позицию в базу.
              </p>
              <div class="feedback-requests-list" id="admin-requests-container">
                <!-- Rendered requests -->
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Quick Action FAB (Floating Button) -->
      <div class="fab-quick-log" id="fab-quick-log" title="Быстро добавить в список">
        <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </div>
    `;

    // Bind event listeners for the newly injected templates
    this.bindDashboardEvents();
    
    // Render parts
    this.renderStats();
    this.renderAdPlacement();
    this.renderStatusFilters();
    this.renderTrackedItems();
    this.renderCalendar();
    this.renderAchievements();
    this.renderAdminRequests();
  },

  // Header render (Reactive profile updates)
  updateHeader() {
    const user = STATE.currentUser;
    const headerRight = document.getElementById("header-right");
    if (!headerRight) return;

    if (user) {
      headerRight.innerHTML = `
        <div class="user-profile-menu">
          <div class="points-pill" title="Очки достижений">
            🪙 <span id="user-points">${user.points}</span>
          </div>
          ${user.premium ? '<span class="premium-tag">PREMIUM</span>' : ''}
          <button class="btn btn-premium-toggle" id="btn-toggle-premium">
            ${user.premium ? "Отключить Премиум" : "Купить Премиум (100 руб)"}
          </button>
          <button class="btn btn-secondary" id="btn-logout">Выйти</button>
        </div>
      `;

      // Event: Logout
      document.getElementById("btn-logout").addEventListener("click", () => {
        STATE.logout();
        this.render();
      });

      // Event: Premium toggle
      document.getElementById("btn-toggle-premium").addEventListener("click", () => {
        STATE.togglePremium();
        this.renderAdPlacement();
        
        const text = STATE.currentUser.premium 
          ? "Премиум подписка активирована! Реклама скрыта, разблокирована статистика."
          : "Премиум подписка отключена. Показ рекламы возобновлен.";
        alert(text);
      });
    } else {
      headerRight.innerHTML = `<button class="btn btn-primary" id="btn-login-redirect">Войти</button>`;
      document.getElementById("btn-login-redirect").addEventListener("click", () => {
        this.render();
      });
    }
  },

  // Render Authentication View (Includes Guest/Test login)
  renderAuthScreen(container) {
    container.innerHTML = `
      <div class="auth-page">
        <div class="card auth-card">
          <div class="auth-header">
            <h2>Вход в аккаунт</h2>
            <p>Управляйте своими списками, получайте ачивки и ведите личную статистику.</p>
          </div>

          <div class="auth-error" id="auth-error-block"></div>

          <form id="auth-form" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="form-group">
              <label class="form-label" for="auth-email">E-mail адрес</label>
              <input type="email" id="auth-email" class="form-input" placeholder="developer@domain.com" required autocomplete="off">
            </div>

            <div class="form-group">
              <label class="form-label" for="auth-password">Пароль</label>
              <input type="password" id="auth-password" class="form-input" placeholder="Введите ваш пароль" required autocomplete="off">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Войти</button>
            <button type="button" class="btn btn-secondary" id="btn-switch-register" style="width: 100%;">Регистрация нового аккаунта</button>
          </form>

          <div class="test-login-divider">
            <span>Или для быстрой проверки</span>
          </div>

          <button class="btn btn-test-login" id="btn-test-auth">
            ⚡ Тестовый быстрый вход
          </button>
        </div>
      </div>
    `;

    const form = document.getElementById("auth-form");
    const emailInput = document.getElementById("auth-email");
    const passwordInput = document.getElementById("auth-password");
    const errorBlock = document.getElementById("auth-error-block");
    const testAuthBtn = document.getElementById("btn-test-auth");
    const switchRegBtn = document.getElementById("btn-switch-register");

    let isRegisterMode = false;

    // Toggle Registration vs Login
    switchRegBtn.addEventListener("click", () => {
      isRegisterMode = !isRegisterMode;
      if (isRegisterMode) {
        form.querySelector('button[type="submit"]').textContent = "Зарегистрироваться";
        switchRegBtn.textContent = "Уже есть аккаунт? Войти";
        form.parentElement.querySelector("h2").textContent = "Регистрация";
      } else {
        form.querySelector('button[type="submit"]').textContent = "Войти";
        switchRegBtn.textContent = "Регистрация нового аккаунта";
        form.parentElement.querySelector("h2").textContent = "Вход в аккаунт";
      }
    });

    // Form Submit
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      errorBlock.style.display = "none";

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      let res;
      if (isRegisterMode) {
        res = STATE.register(email, password);
      } else {
        res = STATE.login(email, password);
      }

      if (res.success) {
        this.render();
      } else {
        errorBlock.textContent = res.message;
        errorBlock.style.display = "block";
      }
    });

    // Test Quick Auth click (One click prefill & login)
    testAuthBtn.addEventListener("click", () => {
      emailInput.value = "test@test.ru";
      passwordInput.value = "test";
      
      const res = STATE.login("test@test.ru", "test");
      if (res.success) {
        this.render();
      }
    });
  },

  // Bind interactions inside dashboard
  bindDashboardEvents() {
    const config = CONFIG;

    // Open add item modal
    const openAddBtn = document.getElementById("btn-add-item-modal");
    if (openAddBtn) {
      openAddBtn.addEventListener("click", () => this.openAddModal());
    }

    const fabBtn = document.getElementById("fab-quick-log");
    if (fabBtn) {
      fabBtn.addEventListener("click", () => this.openAddModal());
    }

    // Search bar typing
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderTrackedItems();
      });
    }

    // Feedback submission
    const fbForm = document.getElementById("feedback-form");
    if (fbForm) {
      fbForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleVal = document.getElementById("fb-title").value.trim();
        const creatorVal = document.getElementById("fb-creator").value.trim();
        
        STATE.submitFeedback({
          title: titleVal,
          creator: creatorVal,
          type: "Новый жанр",
          progress: "1 серия"
        });

        document.getElementById("fb-title").value = "";
        document.getElementById("fb-creator").value = "";

        alert(`Запрос на добавление «${titleVal}» отправлен! Вам начислено 15 очков. Запрос появится в симуляции админ-панели (доступна под аккаунтом admin@admin.ru).`);
        this.renderAdminRequests();
      });
    }
  },

  // Render Stats & Charts
  renderStats() {
    const container = document.getElementById("stats-dashboard");
    if (!container) return;

    const items = STATE.getUserItems();
    const config = CONFIG;

    // Compute widget counts
    let widgetHTML = "";
    config.stats.forEach(st => {
      const val = st.calc(items);
      widgetHTML += `
        <div class="card stat-card">
          <div class="stat-title">${st.title}</div>
          <div class="stat-value">${val} <span class="stat-unit">${st.unit}</span></div>
        </div>
      `;
    });
    
    // Add SVG Genre Distribution Chart
    let chartHTML = "";
    if (items.length > 0) {
      const typeCounts = {};
      items.forEach(i => {
        if (!i.type) return;
        const mainType = i.type.split(",")[0].trim();
        typeCounts[mainType] = (typeCounts[mainType] || 0) + 1;
      });

      const sortedTypes = Object.entries(typeCounts).sort((a,b) => b[1] - a[1]).slice(0, 3);
      const maxVal = sortedTypes.length > 0 ? sortedTypes[0][1] : 1;

      chartHTML = `
        <div class="card" style="grid-column: span 3;">
          <div class="card-title-row">
            <h2>Аналитическое распределение по ${config.typeLabel.toLowerCase() + "ам"}</h2>
            <span style="font-size: 0.8rem; color: var(--color-secondary); font-family: var(--font-display);">
              ${STATE.currentUser.premium ? "🟢 Расширенная PRO аналитика" : "🔒 PRO аналитика доступна в Premium"}
            </span>
          </div>
          <div class="chart-container">
            ${sortedTypes.map(([type, count]) => {
              const pct = (count / maxVal) * 100;
              return `
                <div class="chart-bar-row">
                  <div class="chart-bar-label" title="${type}">${type}</div>
                  <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${pct}%"></div>
                  </div>
                  <div class="chart-bar-val">${count}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    container.innerHTML = widgetHTML + chartHTML;
  },

  // Render Ads banners if Free
  renderAdPlacement() {
    const container = document.getElementById("ad-banner-placement");
    if (!container) return;

    if (STATE.currentUser && STATE.currentUser.premium) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="ad-banner-container">
        <span class="ad-banner-pill">Реклама (Отключается в Premium за 100₽)</span>
        <div class="ad-banner-info">
          <div class="ad-banner-title">⚡ Изучайте ИИ с Hexa-Studio Academy</div>
          <div class="ad-banner-desc">Практические курсы по разработке нейросетей, агентных систем и генеративного веб-дизайна. Получите скидку 20% по промокоду TRACKER!</div>
        </div>
        <button class="btn btn-primary" onclick="alert('Спасибо за переход! В Premium тарифе этот баннер будет полностью скрыт.')">Узнать больше</button>
      </div>
    `;
  },

  // Render Filter pills
  renderStatusFilters() {
    const container = document.getElementById("status-filters");
    if (!container) return;

    const config = CONFIG;
    
    let html = `<div class="filter-pill ${this.activeFilter === 'all' ? 'active' : ''}" data-status="all">Все</div>`;
    
    config.statuses.forEach(st => {
      html += `
        <div class="filter-pill ${this.activeFilter === st.id ? 'active' : ''}" data-status="${st.id}">
          ${st.icon} ${st.label}
        </div>
      `;
    });

    container.innerHTML = html;

    // Click events
    container.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        this.activeFilter = e.target.getAttribute("data-status");
        container.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
        e.target.classList.add("active");
        this.renderTrackedItems();
      });
    });
  },

  // Render main tracker items list
  renderTrackedItems() {
    const container = document.getElementById("items-list-container");
    if (!container) return;

    const items = STATE.getUserItems();
    const config = CONFIG;

    // Filter items
    let filtered = items;
    if (this.activeFilter !== "all") {
      filtered = filtered.filter(i => i.status === this.activeFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.creator.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <span style="font-size: 2.5rem;">📂</span>
          <p style="margin-top: 10px;">Список пуст или ничего не найдено по запросу.</p>
        </div>
      `;
      return;
    }

    let html = "";
    filtered.forEach(item => {
      const statusObj = config.statuses.find(s => s.id === item.status) || config.statuses[0];

      html += `
        <div class="item-row" data-id="${item.id}">
          <div class="item-status-icon" title="${statusObj.label}" style="border: 1px solid ${statusObj.color}">
            ${statusObj.icon}
          </div>
          
          <div class="item-info">
            <div class="item-title">
              ${item.title}
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${item.dateAdded})</span>
            </div>
            <div class="item-meta">
              <strong>${config.creatorLabel}:</strong> ${item.creator} | 
              <strong>${config.typeLabel}:</strong> ${item.type}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; font-style: italic;">
              ${item.notes ? `Заметка: ${item.notes}` : ''}
            </div>
          </div>

          <!-- Progress control -->
          <div class="item-progress-control">
            <button class="progress-btn btn-progress-dec" data-id="${item.id}">−</button>
            <span class="item-progress-val" id="progress-val-${item.id}">${item.progressValue} ${config.progressUnit}</span>
            <button class="progress-btn btn-progress-inc" data-id="${item.id}">+</button>
          </div>

          <!-- Right: Rating and Delete / Partner action -->
          <div class="item-right-actions">
            <div class="item-rating" title="Ваша оценка: ${item.rating || 'нет'}">
              ⭐ <span>${item.rating || '0'}/10</span>
            </div>
            
            <button class="btn btn-secondary btn-cpa-redirect" data-title="${item.title}" style="padding: 6px 12px; font-size: 0.8rem;">
              🔍 ${config.cpaLabel}
            </button>

            <button class="btn-item-action btn-item-delete" data-id="${item.id}" title="Удалить">
              🗑️
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind row controls
    container.querySelectorAll(".btn-progress-inc").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item) {
          const newVal = item.progressValue + 1;
          STATE.updateTrackedItem(id, { progressValue: newVal, progress: `${newVal} ${config.progressUnit}` });
        }
      });
    });

    container.querySelectorAll(".btn-progress-dec").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item && item.progressValue > 0) {
          const newVal = item.progressValue - 1;
          STATE.updateTrackedItem(id, { progressValue: newVal, progress: `${newVal} ${config.progressUnit}` });
        }
      });
    });

    container.querySelectorAll(".btn-item-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.closest("button").getAttribute("data-id"));
        if (confirm("Вы уверены, что хотите удалить эту запись?")) {
          STATE.deleteTrackedItem(id);
        }
      });
    });

    // CPA referral redirect simulation
    container.querySelectorAll(".btn-cpa-redirect").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const title = e.target.closest("button").getAttribute("data-title");
        this.simulateCpaRedirect(title);
      });
    });
  },

  // Render Calendar Widget
  renderCalendar() {
    const container = document.getElementById("calendar-container");
    if (!container) return;

    const config = CONFIG;
    
    let html = "";
    config.calendarEvents.forEach(ev => {
      const parts = ev.date.split("-");
      const day = parts[2];
      const monthNames = { "07": "Июл", "08": "Авг", "09": "Сен" };
      const month = monthNames[parts[1]] || parts[1];

      html += `
        <div class="calendar-item">
          <div class="calendar-date-box">
            <span class="calendar-date-day">${day}</span>
            <span class="calendar-date-month">${month}</span>
          </div>
          <div class="calendar-info">
            <span class="calendar-event-title">${ev.title}</span>
            <span class="calendar-event-sub">${ev.subtitle}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // Render Achievements Widget
  renderAchievements() {
    const container = document.getElementById("achievements-container");
    if (!container) return;

    const config = CONFIG;
    const user = STATE.currentUser;
    if (!user) return;

    let html = "";
    config.achievements.forEach(ach => {
      const isUnlocked = user.achievements.includes(ach.id);
      
      html += `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${ach.icon}</div>
          <div class="achievement-info">
            <span class="achievement-name">${ach.title}</span>
            <span class="achievement-desc">${ach.desc}</span>
          </div>
          <div class="achievement-pts">+${ach.points} очков</div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // Render Admin simulation request queue
  renderAdminRequests() {
    const container = document.getElementById("admin-requests-container");
    if (!container) return;

    const requests = STATE.getFeedbackRequests().filter(r => !r.approved);
    
    if (requests.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 15px; color: var(--text-muted); font-size: 0.85rem;">
          Нет активных запросов на модерацию.
        </div>
      `;
      return;
    }

    let html = "";
    requests.forEach(req => {
      html += `
        <div class="feedback-request-card">
          <div class="feedback-request-header">
            <span>От: ${req.userEmail}</span>
            <span>Запрос</span>
          </div>
          <div class="feedback-request-title">${req.title}</div>
          <div class="feedback-request-meta">
            Студия/Режиссер: ${req.creator}
          </div>
          <div class="feedback-request-actions">
            <button class="btn btn-primary btn-approve-fb" data-id="${req.id}" style="padding: 4px 10px; font-size: 0.75rem;">
              Одобрить и добавить
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind approve action
    container.querySelectorAll(".btn-approve-fb").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        if (STATE.approveFeedback(id)) {
          alert("Запрос успешно одобрен! Кинокарточка добавлена в общий поиск, пользователю начислено 50 очков.");
          this.renderAdminRequests();
          this.renderStats();
        }
      });
    });
  },

  // Show floating achievements toast
  showAchievementToast(detail) {
    const toast = document.getElementById("achievement-toast");
    if (!toast) return;

    toast.querySelector(".toast-icon").textContent = detail.icon;
    toast.querySelector(".toast-info h4").textContent = `Достижение: ${detail.title}!`;
    toast.querySelector(".toast-info p").textContent = detail.desc;
    toast.querySelector(".toast-pts").textContent = `+${detail.points} очков`;

    toast.classList.add("active");
    
    setTimeout(() => {
      toast.classList.remove("active");
    }, 4500);
  },

  // Full screen CPA redirect simulation
  simulateCpaRedirect(title) {
    const overlay = document.getElementById("cpa-overlay");
    const partner = CONFIG.cpaPartner;
    const links = CONFIG.cpaLinks;
    const randomLink = links[Math.floor(Math.random() * links.length)];

    if (!overlay) return;

    overlay.querySelector(".cpa-overlay-text").innerHTML = `
      Переходим к партнеру <strong>${partner}</strong> для поиска «${title}»...<br><br>
      <span style="font-size: 0.85rem; color: var(--text-muted);">
        Генерируется реферальная ссылка: <code style="color: var(--color-primary);">${randomLink.url}</code><br>
        Интеграция приносит сервису комиссию за переходы (CPA монетизация).
      </span>
    `;

    overlay.style.display = "flex";

    setTimeout(() => {
      overlay.style.display = "none";
      window.open(randomLink.url, "_blank");
    }, 2000);
  },

  // Open dynamic popup modal to add element
  openAddModal() {
    const overlay = document.getElementById("add-item-modal");
    if (!overlay) return;

    const config = CONFIG;

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Добавить в список</h3>
          <button class="btn-close-modal">×</button>
        </div>

        <form id="modal-add-form" style="display: flex; flex-direction: column; gap: 15px;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Название (${config.itemLabel.toLowerCase()})</label>
            <input type="text" id="modal-title" class="form-input" placeholder="Введите название..." required autocomplete="off">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${config.creatorLabel}</label>
            <input type="text" id="modal-creator" class="form-input" placeholder="${config.creatorPlaceholder}" required autocomplete="off">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${config.typeLabel}</label>
            <input type="text" id="modal-type" class="form-input" placeholder="${config.typePlaceholder}" required autocomplete="off">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">${config.progressLabel}</label>
            <input type="number" id="modal-progress" class="form-input" placeholder="Значение, например 10" required autocomplete="off">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Статус отслеживания</label>
            <select id="modal-status" class="form-input" style="background: #1f1f2e;">
              ${config.statuses.map(st => `<option value="${st.id}">${st.icon} ${st.label}</option>`).join("")}
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Оценка (от 1 до 10)</label>
            <div class="rating-select-group" id="modal-rating-selector">
              ${[1,2,3,4,5,6,7,8,9,10].map(num => `
                <button type="button" class="rating-select-btn" data-val="${num}">${num}</button>
              `).join("")}
            </div>
            <input type="hidden" id="modal-rating-val" value="0">
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Личные заметки</label>
            <input type="text" id="modal-notes" class="form-input" placeholder="Любые мысли или комментарии..." autocomplete="off">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Добавить</button>
        </form>
      </div>
    `;

    overlay.classList.add("active");

    overlay.querySelector(".btn-close-modal").addEventListener("click", () => {
      overlay.classList.remove("active");
    });

    let selectedRating = 0;
    const ratingSelector = overlay.querySelector("#modal-rating-selector");
    ratingSelector.querySelectorAll(".rating-select-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        ratingSelector.querySelectorAll(".rating-select-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        selectedRating = parseInt(e.target.getAttribute("data-val"));
        overlay.querySelector("#modal-rating-val").value = selectedRating;
      });
    });

    overlay.querySelector("#modal-add-form").addEventListener("submit", (e) => {
      e.preventDefault();
      
      const title = overlay.querySelector("#modal-title").value.trim();
      const creator = overlay.querySelector("#modal-creator").value.trim();
      const type = overlay.querySelector("#modal-type").value.trim();
      const progressValue = parseFloat(overlay.querySelector("#modal-progress").value) || 0;
      const status = overlay.querySelector("#modal-status").value;
      const rating = parseInt(overlay.querySelector("#modal-rating-val").value) || 0;
      const notes = overlay.querySelector("#modal-notes").value.trim();

      STATE.addTrackedItem({
        title,
        creator,
        type,
        progress: `${progressValue} ${config.progressUnit}`,
        progressValue,
        status,
        rating,
        notes
      });

      overlay.classList.remove("active");
      alert(`«${title}» добавлен в список! Вам начислено 10 очков.`);
    });
  }
};
