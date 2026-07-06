/**
 * Application Entrypoint
 * Bootstraps the application state and initializes user interface triggers.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize State Persistence and User Session
  STATE.init();
  
  // 2. Initialize UI Rendering & Event Handling
  UI.init();

  console.log(`[CineTrack Engine] Initialized successfully. Logged In: ${STATE.currentUser ? STATE.currentUser.email : "none"}`);
});
