// public/js/profileToast.js

document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const toast = document.getElementById("toastSuccess");

  // Pastikan semua elemen yang dibutuhkan ada
  if (!saveBtn || !cancelBtn || !toast) {
    console.warn("One or more profile toast elements not found. Skipping toast setup.");
    return;
  }

  // Menampilkan toast ketika tombol 'Simpan' diklik
  saveBtn.addEventListener("click", () => {
    toast.classList.remove("hidden");
    // Sembunyikan toast setelah 2.5 detik
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
  });

  // Mereload halaman ketika tombol 'Batal' diklik
  cancelBtn.addEventListener("click", () => {
    location.reload(); // Reset semua field ke kondisi awal
  });
});
