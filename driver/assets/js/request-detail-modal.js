document.addEventListener("DOMContentLoaded", function () {
  const detailButtons = document.querySelectorAll(".open-detail");
  const modal = document.getElementById("requestDetailModal");
  const modalBox = document.getElementById("modalBox");
  const closeBtn = document.getElementById("closeDetail");

  // Tampilkan modal
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modalBox.classList.remove("opacity-0", "scale-95");
        modalBox.classList.add("opacity-100", "scale-100");
      }, 10);
    });
  });

  // Tutup modal saat klik tombol ✕
  closeBtn.addEventListener("click", () => {
    modalBox.classList.remove("opacity-100", "scale-100");
    modalBox.classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);
  });

  // Tutup modal saat klik di luar modalBox
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modalBox.classList.remove("opacity-100", "scale-100");
      modalBox.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        modal.classList.add("hidden");
      }, 200);
    }
  });
});
