// src/admin/js/script.js

document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.getElementById("burgerMenu");
  const sidebar = document.querySelector(".sidebar-white");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // PASTIKAN SIDEBAR OVERLAY TERSEMBUNYI SAAT START
  if (sidebarOverlay) {
    sidebarOverlay.classList.add("hidden"); // Tambahkan hidden class saat init
    sidebarOverlay.classList.remove("active"); // Pastikan active dihapus
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
        // Tambahan: Pastikan hidden/show juga dikelola saat toggle
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
      sidebarOverlay.classList.add("hidden"); // Pastikan hidden ditambahkan saat klik overlay
    });
  } else {
    console.warn("Sidebar overlay with ID 'sidebarOverlay' not found in script.js (click).");
  }
});
