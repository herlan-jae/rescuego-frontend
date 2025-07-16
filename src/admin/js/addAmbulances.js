document.addEventListener("DOMContentLoaded", function () {
  const showAddAmbulanceBtn = document.getElementById("showAddAmbulanceForm");
  const addAmbulanceOverlay = document.getElementById("addAmbulanceOverlay");
  const addAmbulanceForm = document.getElementById("addAmbulanceForm");
  const cancelAddAmbulanceBtn = document.getElementById("cancelAddAmbulance");

  if (!showAddAmbulanceBtn || !addAmbulanceOverlay || !addAmbulanceForm || !cancelAddAmbulanceBtn) {
    console.error("One or more elements for 'Add Ambulance' popup are missing. Check IDs in ambulance_screen.html.");
    return;
  }

  function showAddAmbulancePopup() {
    addAmbulanceOverlay.classList.remove("hidden");
    addAmbulanceOverlay.classList.add("show");
    addAmbulanceForm.reset();
    document.body.classList.add("no-scroll");
  }

  function hideAddAmbulancePopup() {
    addAmbulanceOverlay.classList.remove("show");
    addAmbulanceOverlay.classList.add("hidden");
    addAmbulanceForm.reset();
    document.body.classList.remove("no-scroll");
  }

  if (showAddAmbulanceBtn) {
    showAddAmbulanceBtn.addEventListener("click", function () {
      showAddAmbulancePopup();
    });
  }

  if (cancelAddAmbulanceBtn) {
    cancelAddAmbulanceBtn.addEventListener("click", function () {
      hideAddAmbulancePopup();
    });
  }

  if (addAmbulanceOverlay) {
    addAmbulanceOverlay.addEventListener("click", function (e) {
      if (e.target === addAmbulanceOverlay) {
        hideAddAmbulancePopup();
      }
    });
  }

  if (addAmbulanceForm) {
    addAmbulanceForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(addAmbulanceForm);
      const ambulanceData = Object.fromEntries(formData.entries());

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }

      let method = "POST";
      let url = `${API_BASE_URL}/ambulances/api/`;

      if (currentAmbulanceId) {
        method = "PATCH";
        url = `${API_BASE_URL}/ambulances/api/${currentAmbulanceId}/`;
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
          hideAddAmbulancePopup();
          loadAmbulances("login_screen.html");
          currentAmbulanceId = null;
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
