/**
 * UI Rendering and Event Controller for Series Universe
 */

const UI = {
  activeFilter: "all",
  activeTab: "tracker",
  searchQuery: "",
  calendarFilter: "all",

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

    // Handle all nav tabs (desktop and mobile)
    document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(tab => {
      tab.addEventListener("click", (e) => {
        const targetTab = e.currentTarget.getAttribute("data-tab");
        if (!targetTab) return;
        
        document.querySelectorAll(".nav-item, .bottom-nav-item").forEach(t => t.classList.remove("active"));
        
        // Activate matching tabs
        document.querySelectorAll(`.nav-item[data-tab="${targetTab}"], .bottom-nav-item[data-tab="${targetTab}"]`).forEach(t => t.classList.add("active"));
        
        this.activeTab = targetTab;
        this.render();
      });
    });

    const mobileAddBtn = document.getElementById("mobile-add-btn");
    if(mobileAddBtn) {
       mobileAddBtn.addEventListener("click", () => this.openAddModal());
    }
  },

  render() {
    this.updateHeader();
    
    const root = document.getElementById("app-root");
    const rightPanel = document.getElementById("right-panel");
    if (!root) return;

    if (this.activeTab === "tracker") {
      this.renderTracker(root);
      if(rightPanel) this.renderTrackerWidgets(rightPanel);
    } else if (this.activeTab === "profile") {
      this.renderProfile(root);
      if(rightPanel) rightPanel.innerHTML = ""; // clean or put something else
    } else if (this.activeTab === "encyclopedia") {
      this.renderEncyclopedia(root);
      if(rightPanel) rightPanel.innerHTML = "";
    }
  },

  updateHeader() {
    const user = STATE.currentUser;
    if (!user) return;

    // Mobile Header
    const mobileUser = document.getElementById("mobile-user-info");
    if (mobileUser) {
      mobileUser.innerHTML = `
        <div class="avatar">${user.email.charAt(0).toUpperCase()}</div>
        <div class="user-greeting">
          <span class="greeting">Привет, ${user.email.split('@')[0]}</span>
          <span class="subtext">Продолжай смотреть и зарабатывать XP</span>
        </div>
        <div class="level-badge" style="margin-left: auto;">${user.level || 0}</div>
      `;
    }

    // Desktop Sidebar Widget
    const sidebarUser = document.getElementById("sidebar-user-widget");
    if (sidebarUser) {
      sidebarUser.innerHTML = `
        <div class="user-widget-compact" style="margin-top: 20px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <div class="avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">${user.email.charAt(0).toUpperCase()}</div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 600;">${user.email.split('@')[0]}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Уровень ${user.level || 0}</div>
          </div>
        </div>
      `;
    }

    // Topbar Profile
    const topbarActions = document.getElementById("topbar-actions");
    if (topbarActions) {
      topbarActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
           <span style="font-weight: 500; font-size: 0.9rem;">${user.email.split('@')[0]}</span>
           <div class="avatar" style="width: 36px; height: 36px;">${user.email.charAt(0).toUpperCase()}</div>
        </div>
      `;
    }
  },

  renderTracker(root) {
    const user = STATE.currentUser;
    root.innerHTML = `
      <div style="margin-bottom: var(--spacing-xl);">
         <h1 style="margin-bottom: 8px;">Добро пожаловать, ${user.email.split('@')[0]} 👋</h1>
         <p style="color: var(--text-secondary);">Продолжай смотреть и зарабатывать XP</p>
      </div>

      <div class="hero-card">
         <div class="hero-poster">
            <div class="play-btn">
               <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
         </div>
         <div class="hero-info">
            <h2 class="hero-title">Продолжить просмотр</h2>
            <div class="hero-meta">Ваши любимые сериалы ждут</div>
            <div class="hero-progress-bar">
               <div class="hero-progress-fill" style="width: 45%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
               <span style="font-size: 0.8rem; color: var(--text-muted);">Осталось немного...</span>
               <button class="btn btn-primary">Продолжить</button>
            </div>
         </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
         <h2>Мои сериалы</h2>
         <div class="filter-tabs" id="status-filters"></div>
      </div>

      <div class="series-grid" id="items-list-container"></div>

      <div style="margin-top: var(--spacing-xl);">
         <h2 style="margin-bottom: 16px;">Недавно полученные карточки</h2>
         <div class="horizontal-scroll" id="recent-cards-container"></div>
      </div>
    `;

    this.renderStatusFilters();
    this.renderTrackedItems();
    this.renderRecentCards();
  },

  renderTrackerWidgets(panel) {
    const user = STATE.currentUser;
    const currentXp = user.points || 0;
    const nextLevelXp = (user.level || 1) * 1500;
    const progress = Math.min((currentXp / nextLevelXp) * 100, 100);

    panel.innerHTML = `
      <div class="next-level-box">
         <div class="widget-title">Следующий уровень</div>
         <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
            <div class="avatar" style="width: 48px; height: 48px; border: 2px solid var(--primary-color); background: transparent; color: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow);">
               ${(user.level || 0) + 1}
            </div>
            <div style="flex-grow: 1;">
               <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                  <span style="color: var(--primary-color); font-weight: 600;">${currentXp} XP</span>
                  <span style="color: var(--text-muted);">до ${nextLevelXp}</span>
               </div>
               <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                  <div style="height: 100%; width: ${progress}%; background: var(--primary-color); box-shadow: 0 0 8px var(--primary-glow);"></div>
               </div>
            </div>
         </div>
      </div>

      <div class="calendar-widget">
         <div class="widget-title" style="display: flex; justify-content: space-between;">
            <span>Календарь релизов</span>
            <span style="font-size: 0.8rem; color: var(--primary-color); cursor: pointer;">Все</span>
         </div>
         <div id="widget-calendar-container"></div>
      </div>
    `;

    this.renderCalendarWidget();
  },

  renderCalendarWidget() {
    const container = document.getElementById("widget-calendar-container");
    if (!container) return;

    let events = CONFIG.calendarEvents.slice(0, 4); // show just first 4
    let html = "";
    events.forEach((ev, i) => {
       const colors = [["#4f46e5", "#ec4899"], ["#f59e0b", "#ef4444"], ["#10b981", "#3b82f6"], ["#8b5cf6", "#d946ef"]];
       const c = colors[i % colors.length];
       const parts = ev.date.split("-");
       html += `
         <div class="release-item">
            <div class="release-thumb" style="background: linear-gradient(135deg, ${c[0]}, ${c[1]});"></div>
            <div class="release-info">
               <div class="release-title">${ev.title}</div>
               <div class="release-meta">${parts[2]} ${parts[1]}</div>
            </div>
         </div>
       `;
    });
    container.innerHTML = html;
  },

  renderStatusFilters() {
    const container = document.getElementById("status-filters");
    if (!container) return;
    
    let html = `<button class="filter-tab ${this.activeFilter === 'all' ? 'active' : ''}" data-status="all">Все</button>`;
    CONFIG.statuses.forEach(st => {
      html += `<button class="filter-tab ${this.activeFilter === st.id ? 'active' : ''}" data-status="${st.id}">${st.label}</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll(".filter-tab").forEach(btn => {
      btn.addEventListener("click", (e) => {
        this.activeFilter = e.target.getAttribute("data-status");
        this.renderStatusFilters(); 
        this.renderTrackedItems();
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
    
    if (items.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">Нет сериалов в этой категории. Добавьте новый!</div>`;
      return;
    }

    let html = "";
    items.forEach((item, index) => {
      const colors = [["#0f172a", "#334155"], ["#1e1b4b", "#312e81"], ["#171717", "#404040"], ["#064e3b", "#065f46"]];
      const bg = colors[index % colors.length];
      const rating = item.rating || item.expectedRating || (Math.random() * (9.8 - 7.5) + 7.5).toFixed(1);
      
      const parts = item.title.split(' ');
      const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].substring(0, 2);

      html += `
        <div class="v-card" data-id="${item.id}">
          <div class="v-poster" style="background: linear-gradient(135deg, ${bg[0]}, ${bg[1]});">
             <div class="v-poster-text">${initials.toUpperCase()}</div>
             <div class="v-rating">${rating}</div>
          </div>
          <div class="v-title" title="${item.title}">${item.title}</div>
          <div class="v-genre">${item.type}</div>
          <div class="v-progress">
             <span>${item.progressValue} серий</span>
             <div style="display: flex; gap: 5px;">
                <button class="btn-icon btn-progress-dec" data-id="${item.id}" style="width:24px; height:24px;">-</button>
                <button class="btn-icon btn-progress-inc" data-id="${item.id}" style="width:24px; height:24px;">+</button>
             </div>
          </div>
          <div class="v-progress-bar">
             <div class="v-progress-fill" style="width: ${Math.min((item.progressValue / 50) * 100, 100)}%;"></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll(".btn-progress-inc").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item) {
          STATE.updateTrackedItem(id, { progressValue: item.progressValue + 1 });
          this.renderTrackedItems();
        }
      });
    });

    container.querySelectorAll(".btn-progress-dec").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(e.currentTarget.getAttribute("data-id"));
        const item = STATE.getUserItems().find(i => i.id === id);
        if (item && item.progressValue > 0) {
          STATE.updateTrackedItem(id, { progressValue: item.progressValue - 1 });
          this.renderTrackedItems();
        }
      });
    });
  },

  renderRecentCards() {
    const container = document.getElementById("recent-cards-container");
    if (!container) return;

    const cards = STATE.currentUser?.digitalCards || ["Стартовая карта"];
    let html = "";
    cards.forEach((c, i) => {
      const rarities = ["COMMON", "RARE", "EPIC"];
      const rarity = rarities[i % rarities.length];
      const rColor = rarity === "EPIC" ? "#ec4899" : rarity === "RARE" ? "#3b82f6" : "#94a3b8";

      html += `
        <div class="digital-card-mini">
           <div style="position: absolute; top: 10px; right: 10px; font-size: 0.6rem; color: ${rColor}; border: 1px solid ${rColor}; padding: 2px 6px; border-radius: 4px;">${rarity}</div>
           <span>${c}</span>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  renderProfile(root) {
    const user = STATE.currentUser;
    if (!user) return;
    
    root.innerHTML = `
      <h1 style="margin-bottom: var(--spacing-xl);">Моя Вселенная</h1>
      <div class="card" style="display: flex; gap: var(--spacing-lg); align-items: center; margin-bottom: var(--spacing-xl);">
         <div class="avatar" style="width: 80px; height: 80px; font-size: 2.5rem; box-shadow: 0 0 20px var(--primary-glow);">${user.email.charAt(0).toUpperCase()}</div>
         <div>
            <h2 style="margin-bottom: 4px;">${user.email}</h2>
            <div style="color: var(--primary-color); font-weight: 600;">Уровень ${user.level || 0} (${user.points || 0} XP)</div>
         </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-lg);">
         <div class="card">
            <h3 style="margin-bottom: 16px;">Статистика</h3>
            <p style="color: var(--text-secondary); margin-bottom: 8px;">Подписчиков: <strong style="color: white;">${user.followers}</strong></p>
            <p style="color: var(--text-secondary);">Подписок: <strong style="color: white;">${user.following}</strong></p>
         </div>
         <div class="card">
            <h3 style="margin-bottom: 16px;">Коллекция</h3>
            <div class="horizontal-scroll" id="profile-cards-container"></div>
         </div>
      </div>
    `;

    const cardsContainer = document.getElementById("profile-cards-container");
    if (cardsContainer) {
       const cards = user.digitalCards || [];
       if(cards.length === 0) {
          cardsContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.9rem;">Нет карточек</span>`;
       } else {
          cardsContainer.innerHTML = cards.map(c => `<div class="digital-card-mini"><span>${c}</span></div>`).join("");
       }
    }
  },

  renderEncyclopedia(root) {
    let encHtml = "";
    CONFIG.encyclopedia.forEach((enc) => {
      encHtml += `
        <div class="card" style="margin-bottom: 20px;">
          <h2 style="color: var(--primary-color); margin-bottom: 16px;">${enc.title}</h2>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
             ${enc.characters.map(c => `<span style="background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; font-size: 0.85rem;">${c}</span>`).join("")}
          </div>
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">
             Теории: ${enc.theories.join(" • ")}
          </p>
        </div>
      `;
    });

    root.innerHTML = `
      <h1 style="margin-bottom: var(--spacing-xl);">Энциклопедия</h1>
      ${encHtml}
    `;
  },

  openAddModal() {
    const modal = document.getElementById("add-item-modal");
    modal.innerHTML = `
      <div class="modal-card">
        <button class="btn-close-modal">✕</button>
        <h2 style="margin-bottom: 24px;">Добавление сериала</h2>
        
        <div class="form-group">
          <label class="form-label">Название</label>
          <input type="text" id="modal-title" class="form-input" placeholder="Например: Разделение">
        </div>
        
        <div class="form-group">
          <label class="form-label">Статус</label>
          <select id="modal-status" class="form-input" style="background: var(--surface-color);">
            <option value="watching">Смотрю</option>
            <option value="want_to_watch">Хочу посмотреть</option>
            <option value="completed">Завершено</option>
          </select>
        </div>

        <button class="btn btn-primary" id="modal-btn-save" style="width: 100%; margin-top: 16px; padding: 12px;">Сохранить в трекер</button>
      </div>
    `;
    modal.classList.add("active");

    document.getElementById("modal-btn-save").addEventListener("click", () => {
      STATE.addTrackedItem({
        title: document.getElementById("modal-title").value || "Без названия",
        type: "Сериал",
        status: document.getElementById("modal-status").value,
        expectedRating: 8
      });
      modal.classList.remove("active");
      this.render();
    });
  },

  showAchievementToast(ach) {
    const toast = document.getElementById("achievement-toast");
    if (!toast) return;
    document.getElementById("toast-title").textContent = ach.title;
    document.getElementById("toast-desc").textContent = ach.desc;
    document.getElementById("toast-pts").textContent = `+${ach.points}`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
};
