/**
 * Application State Manager
 * Handles database operations, user sessions, tracking lists, achievements.
 */

const STATE = {
  currentUser: null,
  searchSource: "local", // "local" or "tmdb"
  tmdbApiKey: "",
  
  init() {
    this.searchSource = localStorage.getItem("tracker_search_source") || "local";
    this.tmdbApiKey = localStorage.getItem("tracker_tmdb_api_key") || "1f296c09b0b4decc46dbf784e1b8b2e3"; 
    
    if (!localStorage.getItem("tracker_users")) {
      const defaultUsers = [
        { 
          email: "admin@admin.ru", password: "admin", premium: true, points: 500, 
          level: 15, hoursWatched: 450, digitalCards: ['Одиннадцатая', 'Джон Сноу'], followers: 120, following: 15,
          achievements: ["collector_50"] 
        },
        { 
          email: "test@test.ru", password: "test", premium: false, points: 50, 
          level: 2, hoursWatched: 15, digitalCards: [], followers: 3, following: 5,
          achievements: [] 
        }
      ];
      localStorage.setItem("tracker_users", JSON.stringify(defaultUsers));
    }

    const session = localStorage.getItem("tracker_session");
    if (session) {
      this.currentUser = JSON.parse(session);
    } else {
      // Auto-login to skip auth screens
      this.currentUser = this.getUsers()[0];
      this.saveSession();
      this.seedDefaultUserItems();
    }
  },

  setSearchSource(source) {
    this.searchSource = source;
    localStorage.setItem("tracker_search_source", source);
  },

  setTmdbApiKey(key) {
    this.tmdbApiKey = key;
    localStorage.setItem("tracker_tmdb_api_key", key);
  },

  saveSession() {
    if (this.currentUser) {
      localStorage.setItem("tracker_session", JSON.stringify(this.currentUser));
      
      const users = this.getUsers();
      const index = users.findIndex(u => u.email === this.currentUser.email);
      if (index !== -1) {
        users[index] = { ...users[index], ...this.currentUser };
        localStorage.setItem("tracker_users", JSON.stringify(users));
      }
    } else {
      localStorage.removeItem("tracker_session");
    }
  },

  getUsers() {
    return JSON.parse(localStorage.getItem("tracker_users") || "[]");
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      this.currentUser = { ...user };
      this.saveSession();
      this.seedDefaultUserItems();
      return { success: true };
    }
    return { success: false, message: "Неверный e-mail или пароль" };
  },

  register(email, password) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Пользователь с таким e-mail уже зарегистрирован" };
    }
    
    const newUser = {
      email: email,
      password: password,
      premium: false,
      points: 100,
      level: 1,
      hoursWatched: 0,
      digitalCards: [],
      followers: 0,
      following: 0,
      achievements: []
    };
    
    users.push(newUser);
    localStorage.setItem("tracker_users", JSON.stringify(users));
    
    this.currentUser = newUser;
    this.saveSession();
    this.seedDefaultUserItems();
    return { success: true };
  },

  logout() {
    this.currentUser = null;
    this.saveSession();
  },

  togglePremium() {
    if (!this.currentUser) return;
    this.currentUser.premium = !this.currentUser.premium;
    this.saveSession();
    window.dispatchEvent(new CustomEvent("userUpdated"));
  },

  addPoints(amount) {
    if (!this.currentUser) return;
    this.currentUser.points += amount;
    // level up simple logic
    this.currentUser.level = 1 + Math.floor(this.currentUser.points / 100);
    this.saveSession();
    window.dispatchEvent(new CustomEvent("userUpdated"));
  },
  
  awardDigitalCard(cardName) {
    if (!this.currentUser) return;
    if (!this.currentUser.digitalCards.includes(cardName)) {
       this.currentUser.digitalCards.push(cardName);
       this.saveSession();
       window.dispatchEvent(new CustomEvent("cardAwarded", { detail: { cardName }}));
    }
  },

  getStorageKey() {
    const email = this.currentUser ? this.currentUser.email : "guest";
    return `tracker_items_${email}`;
  },

  getUserItems() {
    return JSON.parse(localStorage.getItem(this.getStorageKey()) || "[]");
  },

  saveUserItems(items) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("itemsUpdated"));
    this.checkAchievements();
  },

  seedDefaultUserItems() {
    const key = this.getStorageKey();
    if (!localStorage.getItem(key)) {
      const config = CONFIG;
      const initialItems = config.database.slice(0, 3).map((dbItem, idx) => ({
        id: Date.now() - (idx * 100000),
        title: dbItem.title,
        type: dbItem.type,
        creator: dbItem.creator,
        progress: dbItem.progress,
        progressValue: parseFloat(dbItem.progress) || 12,
        rating: dbItem.rating,
        expectedRating: idx === 2 ? 8 : null, // for want_to_watch
        status: idx === 0 ? "watching" : idx === 1 ? "completed" : "want_to_watch",
        notes: "Заметка к сериалу.",
        dateAdded: new Date(Date.now() - (idx * 86400000 * 3)).toISOString().split("T")[0]
      }));
      localStorage.setItem(key, JSON.stringify(initialItems));
    }
  },

  addTrackedItem(itemData) {
    const items = this.getUserItems();
    const newItem = {
      id: Date.now(),
      title: itemData.title,
      type: itemData.type || "Неизвестно",
      creator: itemData.creator || "Неизвестно",
      progress: itemData.progress || "0",
      progressValue: parseFloat(itemData.progress) || 0,
      rating: parseInt(itemData.rating) || 0,
      expectedRating: parseInt(itemData.expectedRating) || 0,
      status: itemData.status || "want_to_watch",
      notes: itemData.notes || "",
      dateAdded: new Date().toISOString().split("T")[0]
    };
    items.unshift(newItem);
    this.saveUserItems(items);
    this.addPoints(10);
    return newItem;
  },

  updateTrackedItem(id, itemData) {
    const items = this.getUserItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemData };
      this.saveUserItems(items);
      return true;
    }
    return false;
  },

  deleteTrackedItem(id) {
    let items = this.getUserItems();
    items = items.filter(i => i.id !== id);
    this.saveUserItems(items);
  },

  checkAchievements() {
    if (!this.currentUser) return;
    
    const items = this.getUserItems();
    const config = CONFIG;
    let updated = false;
    
    for (const ach of config.achievements) {
      if (!this.currentUser.achievements.includes(ach.id)) {
        if (ach.check(items)) {
          this.currentUser.achievements.push(ach.id);
          this.currentUser.points += ach.points;
          updated = true;
          
          window.dispatchEvent(new CustomEvent("achievementUnlocked", {
            detail: { id: ach.id, title: ach.title, desc: ach.desc, points: ach.points, icon: "A" }
          }));
        }
      }
    }
    
    if (updated) {
      this.saveSession();
      window.dispatchEvent(new CustomEvent("userUpdated"));
    }
  }
};
