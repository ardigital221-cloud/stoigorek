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

    // Prevent copy and right-click
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("copy", (e) => {
      e.preventDefault();
      // Optional: alert("Копирование запрещено");
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
    if (!root) return;

    if (this.activeTab === "tracker" || this.activeTab === "tracker_list") {
      this.renderTracker(root);
    } else if (this.activeTab === "profile") {
      this.renderProfile(root);
    } else if (this.activeTab === "universe") {
      this.renderUniverse(root);
    } else if (this.activeTab === "encyclopedia") {
      this.renderEncyclopedia(root);
    }
  },

  updateHeader() {
    const user = STATE.currentUser;
    if (!user) return;

    // Topbar Profile
    const avatarSmall = document.getElementById("desktop-user-avatar");
    if (avatarSmall) {
      avatarSmall.innerHTML = `
        <img src="https://i.pravatar.cc/150?u=${user.email}" alt="user" onerror="this.style.display='none'">
        <div class="avatar-fallback" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
           ${user.email.charAt(0).toUpperCase()}
        </div>
      `;
    }
  },

  renderTracker(root) {
    const user = STATE.currentUser;
    const currentXp = user?.points || 1240;
    const nextLevelXp = (user?.level || 1) * 1500;
    const progress = Math.min((currentXp / nextLevelXp) * 100, 100);

    root.innerHTML = `
      <div class="mobile-only-block" style="margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="user-greeting">
            <span class="greeting" style="font-size: 1.5rem; font-weight: bold; display: block; margin-bottom: 4px;">Привет, ${user?.email?.split('@')[0] || 'Гость'}</span>
            <span class="subtext" style="color: var(--text-muted); font-size: 0.85rem;">Продолжай смотреть и<br>зарабатывать XP</span>
          </div>
          <div style="position: relative;">
            <div class="avatar" style="width: 60px; height: 60px; font-size: 1.5rem; background: rgba(255,255,255,0.05); border: 2px solid var(--primary-color); box-shadow: 0 0 20px var(--primary-glow);">${user?.email?.charAt(0).toUpperCase() || 'G'}</div>
            <div class="level-badge" style="position: absolute; bottom: -5px; right: -5px; background: var(--primary-color); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; border: 2px solid var(--bg-color);">${user?.level || 17}</div>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
           <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 10px; font-weight: 500;">
              <span>Уровень ${user?.level || 17}</span>
              <span style="color: var(--primary-color);">${currentXp} / <span style="color: var(--text-muted);">${nextLevelXp} XP</span></span>
           </div>
           <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
              <div style="height: 100%; width: ${progress}%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow);"></div>
           </div>
        </div>
      </div>

      <div style="display: flex; gap: 16px; overflow-x: auto; margin-bottom: 24px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); white-space: nowrap;" class="hide-scrollbar">
         <div style="padding-bottom: 8px; border-bottom: 2px solid var(--primary-color); color: white; font-weight: 600; cursor: pointer;">Сейчас смотрю</div>
         <div style="padding-bottom: 8px; color: var(--text-muted); cursor: pointer;">Буду смотреть</div>
         <div style="padding-bottom: 8px; color: var(--text-muted); cursor: pointer;">Заброшено</div>
         <div style="padding-bottom: 8px; color: var(--text-muted); cursor: pointer;">Избранное</div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 10px;">
         <h2 style="font-size: 1.1rem; font-weight: 600;">Мои сериалы</h2>
         <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; cursor: pointer;">Все <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
      </div>

      <div class="series-grid" id="items-list-container" style="display: flex; overflow-x: auto; gap: 16px; padding-bottom: 10px; scroll-snap-type: x mandatory;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 24px;">
         <h2 style="font-size: 1.1rem; font-weight: 600;">Достижения</h2>
         <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; cursor: pointer;">Все <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
      </div>
      <div class="horizontal-scroll" id="achievements-container" style="display: flex; overflow-x: auto; gap: 16px; padding-bottom: 20px; margin-bottom: 40px;"></div>
    `;

    this.renderTrackedItems();
    this.renderAchievements();
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

      const posterHtml = item.posterUrl 
        ? `<img src="${item.posterUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`
        : `<div class="v-poster-text">${initials.toUpperCase()}</div>`;

      html += `
        <div class="v-card" data-id="${item.id}" style="min-width: 140px; background: transparent; padding: 0; scroll-snap-align: start; display: flex; flex-direction: column; height: 100%;">
          <div class="v-poster" style="height: 200px; border-radius: 12px; margin-bottom: 12px; background: linear-gradient(135deg, ${bg[0]}, ${bg[1]}); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
             ${posterHtml}
             <div class="v-rating" style="position: absolute; top: 10px; right: 10px; z-index: 2; background: rgba(124, 58, 237, 0.9); padding: 2px 6px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; box-shadow: 0 4px 10px var(--primary-glow); border: 1px solid rgba(255,255,255,0.2);">${rating}</div>
          </div>
          <div class="v-title" title="${item.title}" style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
          <div class="v-genre" style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 16px;">${item.type === 'movie' ? 'Фильм' : 'Сериал'}</div>
          <div style="flex-grow: 1;"></div>
          <div class="v-progress" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px;">
             <span>${item.progressValue}/36 серий</span>
          </div>
          <div class="v-progress-bar" style="height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px;">
             <div class="v-progress-fill" style="width: ${Math.min((item.progressValue / 36) * 100, 100)}%; height: 100%; background: var(--primary-color); box-shadow: 0 0 8px var(--primary-glow);"></div>
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

  renderAchievements() {
    const container = document.getElementById("achievements-container");
    if (!container) return;

    const achs = [
      { id: 1, title: "Сериаломан", desc: "Посмотри 10 сериалов", progress: "7/10", pct: 70, icon: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M19.82 2H4.18C2.976 2 2 2.976 2 4.18v15.64C2 21.024 2.976 22 4.18 22h15.64c1.204 0 2.18-.976 2.18-2.18V4.18C22 2.976 21.024 2 19.82 2zM7.5 20H4V16.5h3.5V20zm0-5.75H4v-3.5h3.5v3.5zm0-5.75H4V5h3.5v3.5zm12.5 11.5H16.5V16.5H20V20zm0-5.75H16.5v-3.5H20v3.5zm0-5.75H16.5V5H20v3.5z"></path></svg>' },
      { id: 2, title: "Ночная сова", desc: "Посмотри серию после 00:00", progress: "3/5", pct: 60, icon: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M17.5 2.5c-4.136 0-7.5 3.364-7.5 7.5 0 1.258.32 2.438.878 3.47A9.97 9.97 0 0 1 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-.853-.106-1.68-.306-2.479A7.472 7.472 0 0 1 17.5 2.5z"></path></svg>' },
      { id: 3, title: "Коллекционер", desc: "Собери 50 карточек", progress: "32/50", pct: 64, icon: '<svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"></path></svg>' }
    ];

    let html = "";
    achs.forEach(ach => {
      html += `
        <div class="achievement-card" style="min-width: 160px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: var(--radius-lg); padding: 16px; scroll-snap-align: start;">
           <div class="ach-icon" style="width: 44px; height: 44px; background: var(--primary-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px var(--primary-glow); margin-bottom: 16px;">
              ${ach.icon}
           </div>
           <div class="ach-title" style="font-weight: 600; font-size: 0.95rem; margin-bottom: 6px;">${ach.title}</div>
           <div class="ach-desc" style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.3; margin-bottom: 12px;">${ach.desc}</div>
           <div class="ach-progress-text" style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">${ach.progress}</div>
           <div class="ach-progress-bar" style="height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px;">
              <div class="ach-progress-fill" style="width: ${ach.pct}%; height: 100%; background: var(--primary-color); box-shadow: 0 0 8px var(--primary-glow);"></div>
           </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  renderProfile(root) {
    const user = STATE.currentUser;
    if (!user) return;
    
    root.innerHTML = `
      <h1 style="margin-bottom: var(--spacing-xl); font-size: 1.5rem;">Профиль</h1>
      <div class="profile-header-card">
         <div class="profile-avatar-large">
            <img src="https://i.pravatar.cc/300?u=${user.email}" onerror="this.style.display='none'">
            <div class="avatar-fallback" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: var(--surface-color); border-radius: 50%;">
               ${user.email.charAt(0).toUpperCase()}
            </div>
            <div class="profile-level-badge">Уровень ${user.level || 17}</div>
         </div>
         <div class="profile-info">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
               <h2 style="font-size: 2rem; margin-bottom: 24px;">${user.email.split('@')[0]}</h2>
               <button class="btn btn-secondary" style="border-radius: 20px; font-size: 0.8rem;">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               </button>
            </div>
            <div style="margin-bottom: 20px;">
               <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
                  <span style="color: var(--primary-color); font-weight: bold;">1240 / <span style="color: var(--text-muted);">1500 XP</span></span>
               </div>
               <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: 82%; background: var(--primary-color); box-shadow: 0 0 10px var(--primary-glow);"></div>
               </div>
            </div>
         </div>
         <div class="profile-stats-grid" style="margin-left: auto;">
            <div class="stat-box">
               <span class="stat-label">Сериалы</span>
               <span class="stat-value">48</span>
            </div>
            <div class="stat-box">
               <span class="stat-label">Серии</span>
               <span class="stat-value">1246</span>
            </div>
            <div class="stat-box">
               <span class="stat-label">Дни в комьюнити</span>
               <span class="stat-value">86</span>
            </div>
            <div class="stat-box">
               <span class="stat-label">Карточки</span>
               <span class="stat-value">62</span>
            </div>
         </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
         <h2 style="font-size: 1.1rem; font-weight: 600;">Недавние достижения</h2>
         <div style="font-size: 0.85rem; color: var(--text-muted); cursor: pointer;">Все</div>
      </div>
      <div class="horizontal-scroll" id="achievements-container" style="margin-bottom: var(--spacing-xl);"></div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl);">
         <div class="dark-panel">
            <h3 style="margin-bottom: 24px;">Любимые жанры</h3>
            <div style="display: flex; align-items: center; gap: 32px;">
               <div class="donut-chart">
                  <div class="donut-text">
                     <div class="percent">47%</div>
                     <div class="label">Драма</div>
                  </div>
               </div>
               <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem; width: 100%;">
                  <div style="display: flex; justify-content: space-between;"><span style="color: #7c3aed;">● Драма</span><span>47%</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #3b82f6;">● Фантастика</span><span>22%</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #10b981;">● Триллер</span><span>15%</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #f59e0b;">● Криминал</span><span>10%</span></div>
                  <div style="display: flex; justify-content: space-between;"><span style="color: #ef4444;">● Комедия</span><span>6%</span></div>
               </div>
            </div>
         </div>
         <div class="dark-panel">
            <h3 style="margin-bottom: 24px;">Активность за неделю</h3>
            <div class="activity-grid">
               ${Array(140).fill(0).map(() => `<div class="activity-cell" data-level="${Math.floor(Math.random()*4)}"></div>`).join("")}
            </div>
         </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
         <h2 style="font-size: 1.1rem; font-weight: 600;">Коллекция карточек</h2>
         <div style="font-size: 0.85rem; color: var(--text-muted); cursor: pointer;">Все карточки</div>
      </div>
      <div class="horizontal-scroll" id="profile-cards-container">
         <div class="card" style="width: 140px; height: 200px; padding: 0; position: relative; overflow: hidden; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <img src="https://image.tmdb.org/t/p/w500/A31vW3O4B20uJ4v50j5mXy117W.jpg" style="width:100%; height:100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(0,0,0,0.9), transparent); padding: 12px;">
               <div style="font-weight: bold; font-size: 0.8rem;">Дейенерис</div><div style="font-size: 0.7rem; color: #ccc;">Таргариен</div>
            </div>
            <div style="position: absolute; top: 8px; right: 8px; font-size: 0.6rem; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; color: #a855f7;">RARE</div>
         </div>
         <div class="card" style="width: 140px; height: 200px; padding: 0; position: relative; overflow: hidden; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <img src="https://image.tmdb.org/t/p/w500/sX2e0lHh7yebZgV7d4E95fG6F8C.jpg" style="width:100%; height:100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(0,0,0,0.9), transparent); padding: 12px;">
               <div style="font-weight: bold; font-size: 0.8rem;">Шерлок</div><div style="font-size: 0.7rem; color: #ccc;">Холмс</div>
            </div>
            <div style="position: absolute; top: 8px; right: 8px; font-size: 0.6rem; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; color: #9ca3af;">COMMON</div>
         </div>
      </div>
    `;
    this.renderAchievements();
  },

  renderUniverse(root) {
    root.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
         <h1 style="font-size: 1.5rem;">Моя вселенная</h1>
         <button class="btn btn-secondary" style="border-radius: 20px; font-size: 0.85rem;">+ Добавить вселенную</button>
      </div>
      <p style="color: var(--text-muted); margin-bottom: 24px;">Все твои сериальные миры в одном месте</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
         <div class="dark-panel" style="background: url('https://image.tmdb.org/t/p/w500/suopoADq1hRVtxJZwI1uO8DPT55.jpg') center/cover; position: relative;">
            <div style="position: absolute; inset: 0; background: rgba(13,13,18,0.85); border-radius: inherit;"></div>
            <div style="position: relative; z-index: 2;">
               <div style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
               </div>
               <h3 style="margin-bottom: 8px; font-size: 1.2rem;">Игра престолов</h3>
               <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #ccc; margin-bottom: 12px;">
                  <span>73% просмотрено</span>
                  <span>8/11 сезонов</span>
               </div>
               <div style="height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                  <div style="width: 73%; height: 100%; background: #a855f7;"></div>
               </div>
            </div>
         </div>
         <div class="dark-panel" style="background: url('https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg') center/cover; position: relative;">
            <div style="position: absolute; inset: 0; background: rgba(13,13,18,0.85); border-radius: inherit;"></div>
            <div style="position: relative; z-index: 2;">
               <div style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                  <b style="font-size: 1.5rem; color: white;">A</b>
               </div>
               <h3 style="margin-bottom: 8px; font-size: 1.2rem;">Marvel</h3>
               <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #ccc; margin-bottom: 12px;">
                  <span>63% просмотрено</span>
                  <span>28/44 проектов</span>
               </div>
               <div style="height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px;">
                  <div style="width: 63%; height: 100%; background: #ef4444;"></div>
               </div>
            </div>
         </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl);">
         <div>
            <h2 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Связи между вселенными</h2>
            <div class="node-graph-container">
               <div class="node node-center" style="top: 50%; left: 50%;">
                  <img src="https://image.tmdb.org/t/p/w200/A31vW3O4B20uJ4v50j5mXy117W.jpg">
               </div>
               <div class="node node-edge" style="width: 120px; top: 50%; left: 50%; transform: rotate(45deg);"></div>
               <div class="node node-small" style="top: 20%; left: 80%;">
                  <img src="https://image.tmdb.org/t/p/w200/sX2e0lHh7yebZgV7d4E95fG6F8C.jpg">
               </div>
               <div class="node node-edge" style="width: 150px; top: 50%; left: 50%; transform: rotate(135deg);"></div>
               <div class="node node-small" style="top: 80%; left: 20%;">
                  <img src="https://image.tmdb.org/t/p/w200/hE31nPjvSMTfiTe0yQ3A2oem5tZ.jpg">
               </div>
            </div>
         </div>
         <div class="dark-panel">
            <h2 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 16px;">Интересные пересечения</h2>
            <div style="display: flex; flex-direction: column; gap: 20px;">
               <div style="display: flex; gap: 12px;">
                  <div style="display: flex;">
                     <img src="https://image.tmdb.org/t/p/w200/A31vW3O4B20uJ4v50j5mXy117W.jpg" style="width:40px; height:40px; border-radius:50%; object-fit: cover; border: 2px solid #000; z-index: 2;">
                     <img src="https://image.tmdb.org/t/p/w200/sX2e0lHh7yebZgV7d4E95fG6F8C.jpg" style="width:40px; height:40px; border-radius:50%; object-fit: cover; border: 2px solid #000; margin-left: -15px;">
                  </div>
                  <div>
                     <div style="font-weight: 600; font-size: 0.85rem;">Тирион и Тони Старк</div>
                     <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Оба гениальные, но недооцененные окружением.</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    `;
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
      <div class="modal-card" style="max-height: 90vh; display: flex; flex-direction: column;">
        <button class="btn-close-modal">✕</button>
        <h2 style="margin-bottom: 24px;">Поиск сериала</h2>
        
        <div class="form-group" style="display: flex; gap: 10px;">
          <input type="text" id="modal-search-query" class="form-input" placeholder="Введите название..." style="flex-grow: 1;">
          <button class="btn btn-primary" id="modal-btn-search">Найти</button>
        </div>
        
        <div id="modal-search-results" style="overflow-y: auto; max-height: 400px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px;">
          <div style="text-align: center; color: var(--text-muted); font-size: 0.9rem;">Введите название и нажмите "Найти"</div>
        </div>
        
        <div id="modal-selected-container" style="display: none;">
          <div style="margin-bottom: 16px; color: var(--primary-color);">Выбран: <span id="modal-selected-title" style="color: white; font-weight: bold;"></span></div>
          <div class="form-group">
            <label class="form-label">Статус</label>
            <select id="modal-status" class="form-input" style="background: var(--surface-color);">
              <option value="watching">Смотрю</option>
              <option value="want_to_watch">Хочу посмотреть</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
          <button class="btn btn-primary" id="modal-btn-save" style="width: 100%; padding: 12px;">Добавить в трекер</button>
        </div>
      </div>
    `;
    modal.classList.add("active");

    let selectedItem = null;

    document.getElementById("modal-btn-search").addEventListener("click", async () => {
      const query = document.getElementById("modal-search-query").value;
      if (!query) return;
      const resultsContainer = document.getElementById("modal-search-results");
      resultsContainer.innerHTML = `<div style="text-align: center;">Поиск...</div>`;
      
      const films = await API.searchSeries(query);
      if (films.length === 0) {
        resultsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted);">Ничего не найдено</div>`;
        return;
      }

      resultsContainer.innerHTML = films.map(f => `
        <div class="search-result-item" data-id="${f.filmId}" style="display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: var(--radius-md); cursor: pointer; align-items: center;">
          <img src="${f.posterUrlPreview || ''}" style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px; background: var(--surface-hover);">
          <div>
             <div style="font-weight: 600;">${f.nameRu || f.nameEn || 'Без названия'}</div>
             <div style="font-size: 0.8rem; color: var(--text-muted);">${f.year || ''} • Рейтинг: ${f.rating !== 'null' ? f.rating : 'N/A'}</div>
          </div>
        </div>
      `).join("");

      resultsContainer.querySelectorAll('.search-result-item').forEach(el => {
         el.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const film = films.find(f => f.filmId == id);
            selectedItem = film;
            
            resultsContainer.querySelectorAll('.search-result-item').forEach(r => r.style.border = 'none');
            e.currentTarget.style.border = '1px solid var(--primary-color)';
            
            document.getElementById("modal-selected-title").textContent = film.nameRu || film.nameEn;
            document.getElementById("modal-selected-container").style.display = 'block';
         });
      });
    });

    document.getElementById("modal-btn-save").addEventListener("click", () => {
      if (!selectedItem) return;
      STATE.addTrackedItem({
        title: selectedItem.nameRu || selectedItem.nameEn || "Без названия",
        type: "Сериал",
        status: document.getElementById("modal-status").value,
        expectedRating: (selectedItem.rating && selectedItem.rating !== 'null') ? selectedItem.rating : 8.0,
        posterUrl: selectedItem.posterUrl || selectedItem.posterUrlPreview
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
