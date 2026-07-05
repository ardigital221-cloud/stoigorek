/**
 * Application Entrypoint
 * Bootstraps the application state, registers routing, and initializes user interface triggers.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize State Persistence and User Session
  STATE.init();
  
  // 2. Initialize UI Rendering & Event Handling
  UI.init();

  // 3. Optional: Print active debug variables for verification
  console.log(`[Dynamic Niche Engine] Active: ${STATE.activeNiche}`);
  console.log(`[User Session] Logged In: ${STATE.currentUser ? STATE.currentUser.email : "none"}`);
});
