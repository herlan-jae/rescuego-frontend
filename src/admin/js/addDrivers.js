// src/admin/js/add-driver.js

// Asumsi API_BASE_URL tersedia dari public/js/utils.js
// Asumsi showSnackbar tersedia dari public/js/utils.js
// Asumsi loadDrivers tersedia dari public/js/drivers.js (untuk reload tabel setelah tambah)

document.addEventListener("DOMContentLoaded", function () {
  const showAddDriverBtn = document.getElementById("showAddDriverForm");
  const addDriverOverlay = document.getElementById("addDriverOverlay");
  const addDriverForm = document.getElementById("addDriverForm");
  const cancelAddDriverBtn = document.getElementById("cancelAddDriver");

  // PERBAIKAN: Tambahkan null check di awal
  if (!showAddDriverBtn || !addDriverOverlay || !addDriverForm || !cancelAddDriverBtn) {
    console.error("One or more elements for 'Add Driver' popup are missing. Check IDs in driver_screen.html.");
    return; // Hentikan eksekusi jika ada elemen yang tidak ditemukan
  }

  function showAddDriverPopup() {
    // Debugging logs
    console.log("DEBUG: showAddDriverPopup dipanggil.");
    console.log("DEBUG: addDriverOverlay sebelum perubahan:", addDriverOverlay);
    console.log("DEBUG: addDriverOverlay.classList sebelum remove hidden:", Array.from(addDriverOverlay.classList));

    addDriverOverlay.classList.remove("hidden"); // (1)

    console.log("DEBUG: addDriverOverlay.classList setelah remove hidden:", Array.from(addDriverOverlay.classList));

    addDriverOverlay.classList.add("show"); // (2)

    console.log("DEBUG: addDriverOverlay.classList setelah add show:", Array.from(addDriverOverlay.classList));

    addDriverForm.reset();
    console.log("DEBUG: Form direset. Popup seharusnya terlihat.");
  }

  function hideAddDriverPopup() {
    addDriverOverlay.classList.remove("show");
    addDriverOverlay.classList.add("hidden");
    addDriverForm.reset();
  }

  showAddDriverBtn.addEventListener("click", function () {
    console.log("Tombol '+ Tambah' diklik!");
    showAddDriverPopup();
  });

  cancelAddDriverBtn.addEventListener("click", function () {
    hideAddDriverPopup();
  });

  addDriverOverlay.addEventListener("click", function (event) {
    if (event.target === addDriverOverlay) {
      hideAddDriverPopup();
    }
  });

  addDriverForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(addDriverForm);
    const driverData = {};
    for (let [key, value] of formData.entries()) {
      driverData[key] = value;
    }

    // Contoh: Konversi status dari string ke boolean jika API mengharapkan
    // driverData.is_active = driverData.is_active === 'on' ? true : false;

    console.log("Mengirim data driver baru:", driverData);
    showSnackbar("Menambahkan driver...", "info");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showSnackbar("Sesi Anda berakhir. Silakan login kembali.", "error");
      setTimeout(() => {
        window.location.href = "login_screen.html";
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/api/drivers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(driverData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Driver berhasil ditambahkan:", data);
        showSnackbar("Driver berhasil ditambahkan!", "success");
        hideAddDriverPopup();
        loadDrivers("login_screen.html"); // Muat ulang daftar driver
      } else {
        let errorMessage = "Gagal menambahkan driver. Silakan coba lagi.";
        if (data && data.detail) {
          errorMessage = data.detail;
        } else if (data && typeof data === "object") {
          const fieldErrors = Object.values(data).flat().join("; ");
          errorMessage = `Validasi gagal: ${fieldErrors}` || errorMessage;
        }
        console.error("Gagal menambahkan driver:", response.status, data);
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error("Error jaringan saat menambahkan driver:", error);
      showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    }
  });
});
