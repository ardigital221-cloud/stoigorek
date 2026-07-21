/**
 * UI Rendering and Event Controller for Series Universe
 */

const UI = {
  activeFilter: "all",
  activeTab: "tracker",
  searchQuery: "",
  searchResults: [],
  debounceTimeout: null,
  calendarFilter: "all", // "all" or "my"

  init() {
    this.bindGlobalEvents();
    this.render();
  },

  bindGlobalEvents() {
    window.addEventListener("userUpdated", () => {
      this.updateHeader();
      this.render();
    });

    window.addEventListener("itemsUpdated", () => {
      this.renderTrackedItems();
      this.renderStats();
    });

    window.addEventListener("achievementUnlocked", (e) => {
      this.showAchievementToast(e.detail);
    });

    window.addEventListener("cardAwarded", (e) => {
      alert(`Вы получили новую цифровую карточку: ${e.detail.cardName}!`);
      this.renderProfile();
    });

    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (overlay.id === "settings-modal") return;
        if (e.target === overlay || e.target.closest(".btn-close-modal")) {
          overlay.classList.remove("active");
        }
      });
    });

    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        e.target.classList.add("active");
        this.activeTab = e.target.getAttribute("data-tab");
        this.render();
      });
    });
  },

  render() {
    this.updateHeader();
    
    const root = document.getElementById("app-root");
    if (!root) return;

    if (this.activeTab === "tracker") {
      this.renderTracker(root);
    } else if (this.activeTab === "profile") {
      this.renderProfile(root);
    } else if (this.activeTab === "encyclopedia") {
      this.renderEncyclopedia(root);
    }
  },

  updateHeader() {
    const user = STATE.currentUser;
    const headerRight = document.getElementById("header-right");
    if (!headerRight) return;

    if (user) {
      headerRight.innerHTML = `
        <div class="user-profile-menu" style="display: flex; align-items: center; gap: 15px;">
          <div style="display: flex; align-items: center; gap: 10px; background: var(--surface-hover); padding: 5px 15px; border-radius: 20px;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
              ${user.email.charAt(0).toUpperCase()}
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.8rem; font-weight: bold;">Уровень ${user.level || 0}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted);">${user.points || 0} XP</span>
            </div>
          </div>
        </div>
      `;
    }
  },



  renderTracker(root) {
    root.innerHTML = `
      <div class="container" style="padding-top: 30px;">
        <div class="main-content">
          <div class="card reveal-element delay-3">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h2>Ваши сериалы</h2>
              <button class="btn btn-primary" id="btn-add-item-modal">+ Добавить сериал</button>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
              <input type="text" id="search-input" class="form-input" style="max-width: 300px;" placeholder="Поиск по вашим сериалам..." value="${this.searchQuery}">
              <div id="status-filters" style="display: flex; gap: 10px; flex-wrap: wrap;"></div>
            </div>

            <div class="tracker-grid" id="items-list-container"></div>
          </div>
        </div>

        <div class="sidebar reveal-element delay-4">
          <div class="card">
            <h2 style="margin-bottom: 20px;">Календарь релизов</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <button class="btn ${this.calendarFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" id="cal-filter-all" style="flex: 1; font-size: 0.8rem;">Все</button>
              <button class="btn ${this.calendarFilter === 'my' ? 'btn-primary' : 'btn-secondary'}" id="cal-filter-my" style="flex: 1; font-size: 0.8rem;">Мои сериалы</button>
            </div>
            <div id="calendar-container" style="display: flex; flex-direction: column; gap: 15px;"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-add-item-modal").addEventListener("click", () => this.openAddModal());
    
    document.getElementById("search-input").addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.renderTrackedItems();
    });

    document.getElementById("cal-filter-all").addEventListener("click", () => {
      this.calendarFilter = "all";
      this.renderTracker(root);
    });

    document.getElementById("cal-filter-my").addEventListener("click", () => {
      this.calendarFilter = "my";
      this.renderTracker(root);
    });

    this.renderStatusFilters();
    this.renderTrackedItems();
    this.renderCalendar();
  },

  renderStatusFilters() {
    const container = document.getElementById("status-filters");
    if (!container) return;
    
    let html = `<button class="btn ${this.activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" data-status="all" style="font-size: 0.85rem; padding: 6px 14px;">Все</button>`;
    CONFIG.statuses.forEach(st => {
      html += `<button class="btn ${this.activeFilter === st.id ? 'btn-primary' : 'btn-secondary'}" data-status="${st.id}" style="font-size: 0.85rem; padding: 6px 14px;">${st.label}</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeFilter = e.target.getAttribute("data-status");
        this.renderTrackedItems();
        this.renderStatusFilters(); // re-render filters to update active button class
      });
    });
  },

  renderTrackedItems() {
    const container = document.getElementById("items-list-container");
    if (!container) return;

    let items = STATE.getUserItems();
    if (this.activeFilter !== "all") {
      items = items.filter(i => i.status === this.activeFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q));
    }

    if (this.activeFilter === "want_to_watch") {
      items.sort((a, b) => (b.expectedRating || 0) - (a.expectedRating || 0));
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">Список пуст.</div>`;
      return;
    }

    let html = "";
    items.forEach((item, index) => {
      const statusObj = CONFIG.statuses.find(s => s.id === item.status) || CONFIG.statuses[0];
      const delayClass = `delay-${(index % 5) + 1}`;
      
      let ratingInfo = item.status === "want_to_watch" 
        ? `<div class="item-rating" style="font-size: 0.85rem;">Ожидание: <span class="tabular font-bold text-white">${item.expectedRating || 0}/10</span></div>`
        : `<div class="item-rating" style="font-size: 0.85rem;">Рейтинг: <span class="tabular font-bold text-white">${item.rating || 0}/10</span></div>`;

      html += `
        <div class="series-card reveal-element ${delayClass}" data-id="${item.id}">
          <div class="series-card-content">
            <div class="series-card-header">
              <h3 class="series-card-title">${item.title}</h3>
              <span class="series-status-badge status-${item.status}">${statusObj.label}</span>
            </div>
            <div class="item-meta mb-4" style="color: var(--text-secondary); font-size: 0.9rem;"><strong>Жанр:</strong> ${item.type}</div>
            
            <div class="series-card-progress">
              <div class="flex items-center gap-2">
                <button class="btn-icon btn-progress-dec" data-id="${item.id}">−</button>
                <span class="progress-text tabular">${item.progressValue} серий</span>
                <button class="btn-icon btn-progress-inc" data-id="${item.id}">+</button>
              </div>
              <div class="flex items-center gap-4">
                ${ratingInfo}
                <button class="btn-icon btn-item-delete" data-id="${item.id}" style="color: #ef4444;">✕</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll(".btn-progress-inc").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item) {
          const newVal = item.progressValue + 1;
          STATE.updateTrackedItem(id, { progressValue: newVal });
          // Gamification: Award a card randomly when they watch episodes
          if (newVal % 5 === 0) {
             const cards = ["Джон Сноу", "Одиннадцатая", "Шерлок", "Уолтер Уайт", "Геральт"];
             const randomCard = cards[Math.floor(Math.random() * cards.length)];
             STATE.awardDigitalCard(randomCard);
          }
          this.renderTrackedItems();
        }
      });
    });

    container.querySelectorAll(".btn-progress-dec").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item && item.progressValue > 0) {
          STATE.updateTrackedItem(id, { progressValue: item.progressValue - 1 });
          this.renderTrackedItems();
        }
      });
    });

    container.querySelectorAll(".btn-item-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        STATE.deleteTrackedItem(parseInt(e.target.getAttribute("data-id")));
        this.renderTrackedItems();
      });
    });
  },

  renderCalendar() {
    const container = document.getElementById("calendar-container");
    if (!container) return;

    let events = CONFIG.calendarEvents;
    
    // Filter by my series if selected
    if (this.calendarFilter === "my") {
      const mySeriesNames = STATE.getUserItems().map(i => i.title.toLowerCase());
      events = events.filter(e => mySeriesNames.includes(e.title.toLowerCase()));
    }

    if (events.length === 0) {
      container.innerHTML = `<div style="padding: 10px; color: var(--text-muted); font-size: 0.8rem;">Нет релизов для отображения.</div>`;
      return;
    }

    let html = "";
    events.forEach(ev => {
      const parts = ev.date.split("-");
      html += `
        <div class="calendar-item">
          <div class="calendar-date-box">
            <span class="calendar-date-day">${parts[2]}</span>
            <span class="calendar-date-month">${parts[1]}</span>
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

  renderProfile(root = document.getElementById("app-root")) {
    const user = STATE.currentUser;
    if (!user) return;
    
    const items = STATE.getUserItems();
    const hoursWatched = (items.reduce((acc, item) => acc + item.progressValue, 0) * 0.75).toFixed(0);

    const cards = user.digitalCards || [];
    let cardsHtml = cards.length > 0 
      ? cards.map(c => `<div class="digital-card">${c}</div>`).join("")
      : `<div style="color: var(--text-muted);">У вас пока нет цифровых карточек. Смотрите сериалы, чтобы получить их!</div>`;

    root.innerHTML = `
      <div class="container" style="padding-top: 30px;">
        <div class="card" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: bold;">
              ${user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style="margin: 0; font-family: var(--font-family-display);">${user.email}</h1>
              <p style="margin: 5px 0 15px 0; color: var(--primary-color); font-weight: bold;">Уровень ${user.level || 0} (${user.points || 0} XP)</p>
              <div style="display: flex; gap: 20px; font-size: 0.9rem;">
                <div><strong>${user.followers}</strong> Подписчиков</div>
                <div><strong>${user.following}</strong> Подписок</div>
                <div><strong>${hoursWatched}</strong> Часов за просмотром</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card reveal-element delay-3">
            <h2>Ваша коллекция карточек</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
              ${cardsHtml}
            </div>
          </div>
          <div class="card reveal-element delay-4">
            <h2>Достижения</h2>
            <div id="achievements-container"></div>
          </div>
        </div>
      </div>
    `;

    // Render achievements inside profile
    const achContainer = document.getElementById("achievements-container");
    let achHtml = "";
    const userAchievements = user.achievements || [];
    CONFIG.achievements.forEach(ach => {
      const isUnlocked = userAchievements.includes(ach.id);
      achHtml += `
        <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon-placeholder">${isUnlocked ? '🏆' : '🔒'}</div>
          <div class="achievement-info">
            <span class="achievement-name">${ach.title}</span>
            <span class="achievement-desc">${ach.desc}</span>
          </div>
        </div>
      `;
    });
    achContainer.innerHTML = achHtml;
  },

  renderEncyclopedia(root = document.getElementById("app-root")) {
    let encHtml = "";
    CONFIG.encyclopedia.forEach((enc, index) => {
      const delayClass = `delay-${(index % 5) + 1}`;
      encHtml += `
        <div class="card reveal-element ${delayClass}" style="margin-bottom: 20px;">
          <h2 style="font-family: var(--font-family-display); color: var(--primary-color);">${enc.title}</h2>
          
          <div style="margin-top: 15px;">
            <h3 style="font-size: 1rem; margin-bottom: 5px;">Персонажи</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${enc.characters.map(c => `<span class="badge" style="background: var(--surface-hover); padding: 5px 10px; border-radius: 15px;">${c}</span>`).join("")}
            </div>
          </div>

          <div style="margin-top: 15px;">
            <h3 style="font-size: 1rem; margin-bottom: 5px;">Локации</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${enc.locations.map(c => `<span class="badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; padding: 5px 10px; border-radius: 15px;">${c}</span>`).join("")}
            </div>
          </div>

          <div style="margin-top: 15px;">
            <h3 style="font-size: 1rem; margin-bottom: 5px;">Теории фанатов</h3>
            <ul style="padding-left: 20px; color: var(--text-secondary); font-size: 0.9rem;">
              ${enc.theories.map(t => `<li>${t}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    });

    root.innerHTML = `
      <div class="container" style="padding-top: 30px;">
        <h1 style="margin-bottom: 20px; font-family: var(--font-family-display);">Миры сериалов (Энциклопедия)</h1>
        ${encHtml}
      </div>
    `;
  },

  openAddModal() {
    const modal = document.getElementById("add-item-modal");
    modal.innerHTML = `
      <div class="modal-card">
        <button class="btn-close-modal">✕</button>
        <h2>Добавление сериала</h2>
        
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" id="modal-title" class="form-input" placeholder="Название сериала">
        </div>
        
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select id="modal-status" class="form-input">
            <option value="want_to_watch">Хочу посмотреть</option>
            <option value="watching">Смотрю</option>
            <option value="completed">Завершено</option>
          </select>
        </div>

        <div class="form-group" id="rating-desc-group">
          <label class="form-label">Оценка описания (от 1 до 10)</label>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 5px;">Насколько вас заинтриговало описание?</p>
          <input type="number" id="modal-expected-rating" class="form-input" min="1" max="10" placeholder="10">
        </div>

        <button class="btn btn-primary" id="modal-btn-save" style="width: 100%; margin-top: 10px;">Сохранить в трекер</button>
      </div>
    `;
    modal.classList.add("active");

    const statusSel = document.getElementById("modal-status");
    const expectedGroup = document.getElementById("rating-desc-group");
    
    statusSel.addEventListener("change", (e) => {
      if (e.target.value === "want_to_watch") {
        expectedGroup.style.display = "block";
      } else {
        expectedGroup.style.display = "none";
      }
    });

    document.getElementById("modal-btn-save").addEventListener("click", () => {
      STATE.addTrackedItem({
        title: document.getElementById("modal-title").value || "Без названия",
        type: "Сериал",
        status: document.getElementById("modal-status").value,
        expectedRating: document.getElementById("modal-expected-rating") ? document.getElementById("modal-expected-rating").value : 0
      });
      modal.classList.remove("active");
      this.render();
    });
  },

  showAchievementToast(ach) {
    const toast = document.getElementById("achievement-toast");
    if (!toast) return;
    toast.querySelector("h4").textContent = ach.title;
    toast.querySelector("p").textContent = ach.desc;
    toast.querySelector(".toast-pts").textContent = `+${ach.points}`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
};
