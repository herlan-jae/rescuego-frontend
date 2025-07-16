document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.getElementById("burgerMenu");
  const sidebar = document.querySelector(".sidebar-white");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (sidebarOverlay) {
    sidebarOverlay.classList.add("hidden");
    sidebarOverlay.classList.remove("active");
  } else {
    console.warn("Sidebar overlay with ID 'sidebarOverlay' not found in script.js (init).");
  }

  if (burgerMenu) {
    burgerMenu.addEventListener("click", function () {
      if (sidebar) {
        sidebar.classList.toggle("active");
      }
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle("active");
        if (sidebar.classList.contains("active")) {
          sidebarOverlay.classList.remove("hidden");
        } else {
          sidebarOverlay.classList.add("hidden");
        }
      }
    });
  } else {
    console.warn("Burger menu button with ID 'burgerMenu' not found in script.js.");
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", function () {
      if (sidebar) {
        sidebar.classList.remove("active");
      }
      sidebarOverlay.classList.add("hidden");
    });
  } else {
    console.warn("Sidebar overlay with ID 'sidebarOverlay' not found in script.js (click).");
  }
});
