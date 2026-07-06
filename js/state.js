/**
 * Application State Manager
 * Handles database operations, user sessions, tracking lists, achievements, and admin feedback queue.
 */

const STATE = {
  currentUser: null,
  
  // Initialize state from localStorage or load defaults
  init() {
    const session = localStorage.getItem("tracker_session");
    if (session) {
      this.currentUser = JSON.parse(session);
    }
    
    // Seed default users if empty
    if (!localStorage.getItem("tracker_users")) {
      const defaultUsers = [
        { email: "admin@admin.ru", password: "admin", premium: true, points: 500, achievements: ["collector_50"] },
        { email: "test@test.ru", password: "test", premium: false, points: 50, achievements: [] }
      ];
      localStorage.setItem("tracker_users", JSON.stringify(defaultUsers));
    }
    
    // Seed feedback database if empty
    if (!localStorage.getItem("tracker_feedback")) {
      const defaultFeedback = [
        { id: 1, userEmail: "user1@mail.ru", title: "Черное зеркало", type: "Фантастика", creator: "Netflix", progress: "6 сезонов", desc: "Антология о влиянии современных технологий на человеческие отношения.", approved: false }
      ];
      localStorage.setItem("tracker_feedback", JSON.stringify(defaultFeedback));
    }
  },

  // Save current session
  saveSession() {
    if (this.currentUser) {
      localStorage.setItem("tracker_session", JSON.stringify(this.currentUser));
      
      // Sync back to users database
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

  // Get user database
  getUsers() {
    return JSON.parse(localStorage.getItem("tracker_users") || "[]");
  },

  // User Actions
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
      points: 100, // starting gift
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
    this.saveSession();
    window.dispatchEvent(new CustomEvent("userUpdated"));
  },

  // Tracking List Operations (Per User)
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
        status: idx === 0 ? "watching" : idx === 1 ? "completed" : "planned",
        notes: "Тестовая запись для ознакомления.",
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
      status: itemData.status || "planned",
      notes: itemData.notes || "",
      dateAdded: new Date().toISOString().split("T")[0]
    };
    items.unshift(newItem);
    this.saveUserItems(items);
    this.addPoints(10); // Reward for tracking
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

  // Achievement Check Loop
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
            detail: { id: ach.id, title: ach.title, desc: ach.desc, points: ach.points, icon: ach.icon }
          }));
        }
      }
    }
    
    if (updated) {
      this.saveSession();
      window.dispatchEvent(new CustomEvent("userUpdated"));
    }
  },

  // Feedback Requests Queue
  getFeedbackRequests() {
    return JSON.parse(localStorage.getItem("tracker_feedback") || "[]");
  },

  submitFeedback(feedbackData) {
    const queue = this.getFeedbackRequests();
    const newRequest = {
      id: Date.now(),
      userEmail: this.currentUser ? this.currentUser.email : "гость",
      title: feedbackData.title,
      type: feedbackData.type,
      creator: feedbackData.creator,
      progress: feedbackData.progress,
      desc: feedbackData.desc || "Запрос от пользователя на добавление нового фильма/сериала.",
      approved: false
    };
    queue.unshift(newRequest);
    localStorage.setItem("tracker_feedback", JSON.stringify(queue));
    
    // Reward user for submission
    this.addPoints(15);
    window.dispatchEvent(new CustomEvent("feedbackSubmitted"));
    return newRequest;
  },

  approveFeedback(id) {
    const queue = this.getFeedbackRequests();
    const index = queue.findIndex(f => f.id === id);
    if (index !== -1 && !queue[index].approved) {
      queue[index].approved = true;
      localStorage.setItem("tracker_feedback", JSON.stringify(queue));
      
      const request = queue[index];
      
      // Add it to the configuration database dynamically
      CONFIG.database.unshift({
        id: Date.now(),
        title: request.title,
        type: request.type,
        creator: request.creator,
        progress: request.progress,
        desc: request.desc,
        rating: 8.0
      });
      
      // Award requesting user points
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.email === request.userEmail);
      if (userIndex !== -1) {
        users[userIndex].points += 50;
        localStorage.setItem("tracker_users", JSON.stringify(users));
        
        if (this.currentUser && this.currentUser.email === request.userEmail) {
          this.currentUser.points += 50;
          this.saveSession();
          window.dispatchEvent(new CustomEvent("userUpdated"));
        }
      }
      
      window.dispatchEvent(new CustomEvent("feedbackApproved", { detail: request }));
      return true;
    }
    return false;
  }
};
