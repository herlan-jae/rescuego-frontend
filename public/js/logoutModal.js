// public/js/logoutModal.js

// Pastikan API_BASE_URL didefinisikan jika ada backend logout endpoint
// const API_BASE_URL = 'http://localhost:8000'; // Sesuaikan jika Anda punya logout API
function setupLogoutModal(redirectUrl) {
  document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    const modal = document.getElementById("logoutModal");
    const modalContent = document.getElementById("logoutModalContent");
    const cancelBtn = document.getElementById("cancelLogout");
    const confirmBtn = document.getElementById("confirmLogout");

    if (!logoutBtn || !modal || !modalContent || !cancelBtn || !confirmBtn) {
      console.error("One or more logout modal elements not found. Skipping modal setup.");
      return;
    }

    function showModal() {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modalContent.classList.remove("opacity-0", "scale-95");
        modalContent.classList.add("opacity-100", "scale-100");
        modal.classList.add("show");
      }, 50);
    }

    function hideModal() {
      modalContent.classList.remove("opacity-100", "scale-100");
      modalContent.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("show");
      }, 300);
    }

    async function handleLogout() {
      // Hapus token dari localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("Tokens removed from localStorage. Redirecting...");

      // Tampilkan snackbar sukses logout
      showSnackbar("Anda telah berhasil logout!", "success"); // Panggil dari utils.js

      // Beri sedikit waktu untuk snackbar terlihat sebelum redirect
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000); // Redirect setelah 1 detik
    }

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showModal();
    });

    cancelBtn.addEventListener("click", () => {
      hideModal();
    });

    confirmBtn.addEventListener("click", () => {
      hideModal(); // Sembunyikan modal sebelum memproses logout
      handleLogout();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        hideModal();
      }
    });
  });
}
