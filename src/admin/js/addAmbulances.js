// src/admin/js/addAmbulances.js

// Asumsi API_BASE_URL tersedia dari public/js/utils.js
// Asumsi showSnackbar tersedia dari public/js/utils.js
// Asumsi loadAmbulances tersedia dari public/js/ambulances.js (untuk reload tabel setelah tambah)

document.addEventListener("DOMContentLoaded", function () {
  const showAddAmbulanceBtn = document.getElementById("showAddAmbulanceForm");
  const addAmbulanceOverlay = document.getElementById("addAmbulanceOverlay");
  const addAmbulanceForm = document.getElementById("addAmbulanceForm");
  const cancelAddAmbulanceBtn = document.getElementById("cancelAddAmbulance");
  // const ambulanceTableBody = document.getElementById("ambulanceTableBody"); // Tidak diperlukan di sini lagi, loadAmbulances akan menanganinya

  // PERBAIKAN: Tambahkan null check di awal agar tidak ada error jika elemen tidak ditemukan
  if (!showAddAmbulanceBtn || !addAmbulanceOverlay || !addAmbulanceForm || !cancelAddAmbulanceBtn) {
    console.error("One or more elements for 'Add Ambulance' popup are missing. Check IDs in ambulance_screen.html.");
    return; // Hentikan eksekusi jika ada elemen yang tidak ditemukan
  }

  // Fungsi untuk menampilkan pop-up
  function showAddAmbulancePopup() {
    addAmbulanceOverlay.classList.remove("hidden"); // Hapus display:none
    addAmbulanceOverlay.classList.add("show"); // Tambahkan opacity:1
    addAmbulanceForm.reset(); // Kosongkan form setiap kali dibuka
    document.body.classList.add("no-scroll"); // Cegah scrolling body
  }

  // Fungsi untuk menyembunyikan pop-up
  function hideAddAmbulancePopup() {
    addAmbulanceOverlay.classList.remove("show"); // Hapus opacity:1
    addAmbulanceOverlay.classList.add("hidden"); // Tambahkan display:none
    addAmbulanceForm.reset(); // Reset form saat ditutup
    document.body.classList.remove("no-scroll"); // Aktifkan scrolling kembali
  }

  // Event Listener untuk tombol "+ Tambah"
  if (showAddAmbulanceBtn) {
    // Periksa lagi untuk memastikan
    showAddAmbulanceBtn.addEventListener("click", function () {
      showAddAmbulancePopup();
    });
  }

  // Event Listener untuk tombol "Batal" di dalam pop-up
  if (cancelAddAmbulanceBtn) {
    // Periksa lagi untuk memastikan
    cancelAddAmbulanceBtn.addEventListener("click", function () {
      hideAddAmbulancePopup();
    });
  }

  // Event Listener untuk klik di luar area pop-up (pada overlay)
  if (addAmbulanceOverlay) {
    // Periksa lagi untuk memastikan
    addAmbulanceOverlay.addEventListener("click", function (e) {
      if (e.target === addAmbulanceOverlay) {
        hideAddAmbulancePopup();
      }
    });
  }

  // Event Listener untuk SUBMIT FORM (MODIFIKASI INI)
  if (addAmbulanceForm) {
    addAmbulanceForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(addAmbulanceForm);
      const ambulanceData = Object.fromEntries(formData.entries());

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        /* ... handle unauthorized ... */ return;
      }

      let method = "POST";
      let url = `${API_BASE_URL}/ambulances/api/`; // URL default untuk POST

      if (currentAmbulanceId) {
        // Jika ada ID, berarti ini operasi EDIT
        method = "PATCH"; // Atau 'PUT' jika API Anda mengharapkan PUT
        url = `${API_BASE_URL}/ambulances/api/${currentAmbulanceId}/`; // URL untuk PATCH/PUT
        showSnackbar("Mengupdate ambulans...", "info");
      } else {
        showSnackbar("Menambahkan ambulans...", "info");
      }

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(ambulanceData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Operasi ambulans berhasil:", data);
          showSnackbar(`Ambulans berhasil di${currentAmbulanceId ? "update" : "tambahkan"}!`, "success");
          hideAddAmbulancePopup(); // Sembunyikan pop-up setelah sukses
          loadAmbulances("login_screen.html"); // Muat ulang daftar ambulans
          currentAmbulanceId = null; // Reset ID setelah operasi selesai
        } else {
          let errorMessage = `Gagal ${currentAmbulanceId ? "mengupdate" : "menambahkan"} ambulans. Silakan coba lagi.`;
          if (data && data.detail) {
            errorMessage = data.detail;
          } else if (data && typeof data === "object") {
            const fieldErrors = Object.values(data).flat().join("; ");
            errorMessage = `Validasi gagal: ${fieldErrors}` || errorMessage;
          }
          console.error(`Gagal ${currentAmbulanceId ? "mengupdate" : "menambahkan"} ambulans:`, response.status, data);
          showSnackbar(errorMessage, "error");
        }
      } catch (error) {
        console.error(`Error jaringan saat ${currentAmbulanceId ? "mengupdate" : "menambahkan"} ambulans:`, error);
        showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
      }
    });
  }
});
