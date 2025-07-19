// addDrivers.js
document.addEventListener("DOMContentLoaded", function () {
  const showAddDriverBtn = document.getElementById("showAddDriverForm");
  const addDriverOverlay = document.getElementById("addDriverOverlay");
  const addDriverForm = document.getElementById("addDriverForm");
  const cancelAddDriverBtn = document.getElementById("cancelAddDriver");

  if (!showAddDriverBtn || !addDriverOverlay || !addDriverForm || !cancelAddDriverBtn) {
    console.error("One or more elements for 'Add Driver' popup are missing.");
    return;
  }

  function showAddDriverPopup() {
    addDriverForm.reset();
    addDriverOverlay.classList.remove("hidden");
    addDriverOverlay.classList.add("show");
  }

  function hideAddDriverPopup() {
    addDriverOverlay.classList.remove("show");
    addDriverOverlay.classList.add("hidden");
  }

  // UX Improvement: Tutup popup dengan tombol Escape
  function handleKeydown(event) {
    if (event.key === "Escape") {
      hideAddDriverPopup();
    }
  }

  showAddDriverBtn.addEventListener("click", () => {
    showAddDriverPopup();
    document.addEventListener("keydown", handleKeydown); // Tambahkan listener saat popup terbuka
  });

  cancelAddDriverBtn.addEventListener("click", () => {
    hideAddDriverPopup();
    document.removeEventListener("keydown", handleKeydown); // Hapus listener saat popup tertutup
  });

  addDriverOverlay.addEventListener("click", (event) => {
    if (event.target === addDriverOverlay) {
      hideAddDriverPopup();
      document.removeEventListener("keydown", handleKeydown); // Hapus listener saat popup tertutup
    }
  });

  addDriverForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(addDriverForm);
    const driverData = Object.fromEntries(formData.entries());

    console.log("Mengirim data driver baru:", driverData);
    showSnackbar("Menambahkan driver...", "info");

    try {
      const data = await apiFetch(`${API_BASE_URL}/accounts/api/drivers/`, {
        method: "POST",
        body: JSON.stringify(driverData),
      });

      console.log("Driver berhasil ditambahkan:", data);
      showSnackbar("Driver berhasil ditambahkan!", "success");
      hideAddDriverPopup();
      loadDrivers(); // Muat ulang daftar driver
    } catch (error) {
      console.error("Gagal menambahkan driver:", error);
      showSnackbar(`Gagal menambahkan driver: ${error.message}`, "error");
    }
  });
});
