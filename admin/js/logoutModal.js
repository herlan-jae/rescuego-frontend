document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("logoutModal");
  const modalContent = document.getElementById("logoutModalContent");
  const cancelBtn = document.getElementById("cancelLogout");
  const confirmBtn = document.getElementById("confirmLogout");

  if (!logoutBtn || !modal || !modalContent || !cancelBtn || !confirmBtn) {
    console.error("Elemen logout modal tidak ditemukan.");
    return;
  }

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("show");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  confirmBtn.addEventListener("click", () => {
    window.location.href = "login_screen.html";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
});
