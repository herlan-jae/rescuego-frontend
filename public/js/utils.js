const API_BASE_URL = "http://localhost:8000";

// Fungsi untuk menangani submit formulir login (MODIFIKASI INI)
function showSnackbar(message, type = "info") {
  const snackbar = document.getElementById("snackbar");
  const snackbarMessage = document.getElementById("snackbarMessage");

  if (!snackbar || !snackbarMessage) {
    console.warn("Snackbar elements not found.");
    return;
  }

  snackbarMessage.textContent = message;

  snackbar.classList.remove("success", "error", "info"); // Hapus kelas type sebelumnya
  snackbar.classList.add(type); // Tambahkan kelas type baru

  // Atur display flex sebelum menampilkan untuk memastikan layoutnya benar
  snackbar.style.display = "flex"; // Menggunakan style property langsung

  // Beri sedikit waktu untuk browser merender display:flex sebelum memulai transisi
  setTimeout(() => {
    snackbar.classList.add("show");
  }, 10);

  // Sembunyikan snackbar setelah 3 detik
  setTimeout(function () {
    snackbar.classList.remove("show");
    // Setelah transisi selesai, sembunyikan sepenuhnya dengan display:none
    setTimeout(() => {
      snackbar.style.display = "none"; // Sembunyikan dengan display:none
    }, 400); // Sesuaikan dengan durasi transisi opacity/transform
  }, 3000);
}
