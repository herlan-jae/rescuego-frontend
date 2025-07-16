let currentAmbulanceId = null;

async function loadAmbulances(redirectUrl) {
  const ambulanceTableBody = document.getElementById("ambulanceTableBody");
  if (!ambulanceTableBody) {
    console.error("Elemen #ambulanceTableBody tidak ditemukan.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for ambulances.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  ambulanceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Memuat data ambulans...</td></tr>`;

  try {
    const response = await fetch(`${API_BASE_URL}/ambulances/api/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const ambulancesData = await response.json();
      console.log("Ambulances data fetched successfully:", ambulancesData);
      showSnackbar("Data ambulans berhasil dimuat!", "success");

      ambulanceTableBody.innerHTML = "";

      if (ambulancesData.results && ambulancesData.results.length === 0) {
        ambulanceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Tidak ada data ambulans.</td></tr>`;
        return;
      }

      ambulancesData.results.forEach((ambulance) => {
        const ambulanceIdForData = ambulance.id ? String(ambulance.id) : "";

        const row = `
                    <tr>
                        <td>${ambulance.id || "N/A"}</td>
                        <td>${ambulance.license_plate || "N/A"}</td>
                        <td>${ambulance.type || "N/A"}</td>
                        <td>${ambulance.brand || "N/A"}/${ambulance.model || "N/A"}</td>
                        <td class="status-cell">${ambulance.status || "N/A"}</td>
                        <td>${ambulance.city || "N/A"}</td>
                        <td><span class="link-detail cursor-pointer" data-id="${ambulanceIdForData}">Lihat</span></td>
                    </tr>
                `;
        ambulanceTableBody.insertAdjacentHTML("beforeend", row);
      });
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for ambulances. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch ambulances.";
      console.error("Error fetching ambulances:", response.status, errorData);
      showSnackbar(`Gagal memuat ambulans: ${errorMessage}`, "error");
      ambulanceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Gagal memuat data: ${errorMessage}</td></tr>`;
    }
  } catch (error) {
    console.error("Network error or server unavailable for ambulances:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    ambulanceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Kesalahan koneksi: ${error.message}</td></tr>`;
  }
}

function hideAmbulanceDetailPopup() {
  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    currentAmbulanceId = null;
  }
}

async function showAmbulanceDetailPopup(ambulanceId, redirectUrl) {
  const popupOverlay = document.getElementById("popupOverlay"); // Overlay untuk detail ambulans
  const detailAmbulancePlate = document.getElementById("detailAmbulancePlate");
  const detailAmbulanceType = document.getElementById("detailAmbulanceType");
  const detailAmbulanceBrand = document.getElementById("detailAmbulanceBrand");
  const detailAmbulanceModel = document.getElementById("detailAmbulanceModel");
  const detailAmbulanceYear = document.getElementById("detailAmbulanceYear");
  const detailAmbulanceCapacity = document.getElementById("detailAmbulanceCapacity");
  const detailAmbulanceCity = document.getElementById("detailAmbulanceCity");
  const detailAmbulanceFacilities = document.getElementById("detailAmbulanceFacilities");

  const editAmbulanceBtn = document.getElementById("editAmbulanceBtn");
  const deleteAmbulanceBtn = document.getElementById("deleteAmbulanceBtn");

  if (
    !popupOverlay ||
    !detailAmbulancePlate ||
    !detailAmbulanceType ||
    !detailAmbulanceBrand ||
    !detailAmbulanceModel ||
    !detailAmbulanceYear ||
    !detailAmbulanceCapacity ||
    !detailAmbulanceCity ||
    !detailAmbulanceFacilities ||
    !editAmbulanceBtn ||
    !deleteAmbulanceBtn
  ) {
    console.error("One or more elements for Ambulance Detail popup are missing. Check IDs in ambulance_screen.html.");
    showSnackbar("Gagal menampilkan detail: Beberapa elemen tidak ditemukan.", "error");
    return;
  }

  detailAmbulancePlate.textContent = "Memuat...";
  detailAmbulanceType.textContent = "Memuat...";
  detailAmbulanceBrand.textContent = "Memuat...";
  detailAmbulanceModel.textContent = "Memuat...";
  detailAmbulanceYear.textContent = "Memuat...";
  detailAmbulanceCapacity.textContent = "Memuat...";
  detailAmbulanceCity.textContent = "Memuat...";
  detailAmbulanceFacilities.textContent = "Memuat...";

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");
  document.body.classList.add("no-scroll");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for ambulance detail.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/ambulances/api/${ambulanceId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const ambulanceDetail = await response.json();
      console.log("Ambulance detail fetched successfully:", ambulanceDetail);
      showSnackbar("Detail ambulans berhasil dimuat!", "success");

      detailAmbulancePlate.textContent = ambulanceDetail.license_plate || "N/A";
      detailAmbulanceType.textContent = ambulanceDetail.type || "N/A";
      detailAmbulanceBrand.textContent = ambulanceDetail.brand || "N/A";
      detailAmbulanceModel.textContent = ambulanceDetail.model || "N/A";
      detailAmbulanceYear.textContent = ambulanceDetail.year || "N/A";
      detailAmbulanceCapacity.textContent = ambulanceDetail.capacity || "N/A";
      detailAmbulanceCity.textContent = ambulanceDetail.city || "N/A";
      detailAmbulanceFacilities.textContent = ambulanceDetail.facilities || "N/A";

      currentAmbulanceId = ambulanceDetail.id;

      editAmbulanceBtn.onclick = () => {
        hideAmbulanceDetailPopup();
        populateAmbulanceFormForEdit(ambulanceDetail);
      };

      deleteAmbulanceBtn.onclick = () => {
        deleteAmbulance(currentAmbulanceId, redirectUrl);
      };
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for ambulance detail. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else if (response.status === 404) {
      console.error("Ambulance not found:", ambulanceId);
      showSnackbar(`Ambulans dengan ID ${ambulanceId} tidak ditemukan.`, "error");
      hideAmbulanceDetailPopup();
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch ambulance detail.";
      console.error("Error fetching ambulance detail:", response.status, errorData);
      showSnackbar(`Gagal memuat detail ambulans: ${errorMessage}`, "error");
      hideAmbulanceDetailPopup();
    }
  } catch (error) {
    console.error("Network error or server unavailable for ambulance detail:", error);
    showSnackbar(`Kesalahan koneksi saat memuat detail ambulans: ${error.message}`, "error");
    hideAmbulanceDetailPopup();
  }

  function populateAmbulanceFormForEdit(ambulanceData) {
    const addAmbulanceOverlay = document.getElementById("addAmbulanceOverlay");
    const addAmbulanceForm = document.getElementById("addAmbulanceForm");
    const popupTitle = addAmbulanceForm.querySelector(".popup-title");

    if (!addAmbulanceOverlay || !addAmbulanceForm || !popupTitle) {
      console.error("Elements for Add/Edit Ambulance form not found.");
      showSnackbar("Gagal menyiapkan form edit ambulans.", "error");
      return;
    }

    popupTitle.textContent = "Edit Detail Ambulans";

    addAmbulanceForm.elements.license_plate.value = ambulanceData.license_plate || "";
    addAmbulanceForm.elements.year.value = ambulanceData.year || "";
    addAmbulanceForm.elements.type.value = ambulanceData.type || "";
    addAmbulanceForm.elements.capacity.value = ambulanceData.capacity || "";
    addAmbulanceForm.elements.brand.value = ambulanceData.brand || "";
    addAmbulanceForm.elements.city.value = ambulanceData.city || "";
    addAmbulanceForm.elements.model.value = ambulanceData.model || "";
    addAmbulanceForm.elements.facilities.value = ambulanceData.facilities || "";
    addAmbulanceForm.elements.status.value = ambulanceData.status || "aktif";

    addAmbulanceOverlay.classList.remove("hidden");
    addAmbulanceOverlay.classList.add("show");
    document.body.classList.add("no-scroll");
  }

  async function deleteAmbulance(ambulanceId, redirectUrl) {
    if (!ambulanceId) {
      showSnackbar("ID ambulans tidak valid untuk dihapus.", "error");
      return;
    }

    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus ambulans ini?");
    if (!confirmDelete) {
      return;
    }

    showSnackbar("Menghapus ambulans...", "info");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ambulances/api/${ambulanceId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        console.log("Ambulans berhasil dihapus:", ambulanceId);
        showSnackbar("Ambulans berhasil dihapus!", "success");

        const popupOverlay = document.getElementById("popupOverlay");
        if (popupOverlay) {
          popupOverlay.classList.remove("show");
          popupOverlay.classList.add("hidden");
          document.body.classList.remove("no-scroll");
        }

        loadAmbulances(redirectUrl);
        currentAmbulanceId = null;
      } else if (response.status === 401) {
        console.error("Unauthorized: Token invalid or expired for delete. Redirecting.");
        showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      } else if (response.status === 404) {
        console.error("Ambulans tidak ditemukan untuk dihapus:", ambulanceId);
        showSnackbar(`Ambulans dengan ID ${ambulanceId} tidak ditemukan.`, "error");
      } else {
        const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
        const errorMessage = errorData.detail || "Failed to delete ambulance.";
        console.error("Error deleting ambulance:", response.status, errorData);
        showSnackbar(`Gagal menghapus ambulans: ${errorMessage}`, "error");
      }
    } catch (error) {
      console.error("Network error or server unavailable for delete:", error);
      showSnackbar(`Kesalahan koneksi saat menghapus ambulans: ${error.message}`, "error");
    }
  }
}
