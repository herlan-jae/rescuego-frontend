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

  logoutBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    setTimeout(() => {
      modalContent.classList.remove("opacity-0", "scale-95");
      modalContent.classList.add("opacity-100", "scale-100");
    }, 50);
  });

  cancelBtn.addEventListener("click", () => {
    modalContent.classList.remove("opacity-100", "scale-100");
    modalContent.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  });

  confirmBtn.addEventListener("click", () => {
    window.location.href = "home.html";
  });
});
