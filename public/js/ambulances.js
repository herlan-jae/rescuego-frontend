document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://127.0.0.1:8000/ambulances/api/";

  // === HELPER FUNCTIONS ===
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie("csrftoken");

  function showSnackbar(message, type = "success") {
    const snackbar = document.getElementById("snackbar");
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.className = `snackbar show ${type}`;
    setTimeout(() => {
      snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
  }

  // PERBAIKAN: Fungsi pembantu terpusat untuk fetch API
  async function apiFetch(url, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      ...options.headers,
    };

    const config = {
      credentials: "include", // Selalu sertakan kredensial (cookie)
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      // PERBAIKAN: Ubah error JSON menjadi string yang mudah dibaca
      const errorMessage = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${value.join(", ")}`)
        .join("\n");
      throw new Error(errorMessage || "Terjadi kesalahan pada server.");
    }

    // Untuk method DELETE, response body bisa kosong
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // === API CALLS ===
  async function fetchAmbulances() {
    const tableBody = document.getElementById("ambulanceTableBody");
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Memuat data ambulans...</td></tr>`;

    try {
      const ambulances = await apiFetch(API_BASE_URL); // Menggunakan helper
      tableBody.innerHTML = "";

      if (!ambulances || ambulances.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Belum ada data ambulans.</td></tr>`;
        return;
      }

      ambulances.forEach((ambulance) => {
        const row = `
          <tr>
            <td>${ambulance.id}</td>
            <td>${ambulance.license_plate}</td>
            <td>${ambulance.type || "-"}</td>
            <td>${ambulance.brand || ""} ${ambulance.model || ""}</td>
            <td><span class="status ${ambulance.status}">${ambulance.status.charAt(0).toUpperCase() + ambulance.status.slice(1)}</span></td>
            <td>${ambulance.city || "-"}</td>
            <td><span class="link-detail cursor-pointer" data-id="${ambulance.id}">Lihat</span></td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      });
    } catch (error) {
      console.error("Error fetching ambulances:", error);
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Gagal memuat data.</td></tr>`;
      showSnackbar(error.message, "error");
    }
  }

  async function saveAmbulance(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const isEditMode = formMode === "edit";
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `${API_BASE_URL}${currentAmbulanceId}/` : API_BASE_URL;

    try {
      await apiFetch(url, { method: method, body: JSON.stringify(data) });
      hidePopup(elements.formPopup);
      showSnackbar(`Data ambulans berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}.`);
      fetchAmbulances();
    } catch (error) {
      console.error("Error saving ambulance:", error);
      showSnackbar(error.message, "error");
    }
  }

  async function deleteAmbulance() {
    if (!currentAmbulanceId) return;

    if (confirm("Apakah Anda yakin ingin menghapus data ambulans ini?")) {
      try {
        await apiFetch(`${API_BASE_URL}${currentAmbulanceId}/`, { method: "DELETE" });
        hidePopup(elements.detailPopup);
        showSnackbar("Data ambulans berhasil dihapus.");
        fetchAmbulances();
      } catch (error) {
        console.error("Error deleting ambulance:", error);
        showSnackbar(error.message, "error");
      }
    }
  }

  // === POPUP & FORM LOGIC ===

  const elements = {
    tableBody: document.getElementById("ambulanceTableBody"),
    detailPopup: document.getElementById("popupOverlay"),
    formPopup: document.getElementById("addAmbulanceOverlay"),
    addAmbulanceForm: document.getElementById("addAmbulanceForm"),
    showAddButton: document.getElementById("showAddAmbulanceForm"),
    closePopupBtn: document.getElementById("closePopupBtn"),
    cancelAddButton: document.getElementById("cancelAddAmbulance"),
    editButton: document.getElementById("editAmbulanceBtn"),
    deleteButton: document.getElementById("deleteAmbulanceBtn"),
  };

  let currentAmbulanceId = null;
  let formMode = "add"; // 'add' or 'edit'

  function showPopup(popupElement) {
    popupElement.classList.remove("hidden");
    setTimeout(() => popupElement.classList.add("show"), 10);
    document.body.classList.add("no-scroll");
  }

  function hidePopup(popupElement) {
    popupElement.classList.remove("show");
    setTimeout(() => {
      popupElement.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    }, 300);
  }

  async function showFormPopup(id = null) {
    const { formPopup, addAmbulanceForm: form } = elements;
    const formTitle = formPopup.querySelector(".popup-title");
    form.reset();

    if (id) {
      formMode = "edit";
      currentAmbulanceId = id;
      formTitle.textContent = "Edit Ambulans";
      try {
        const data = await apiFetch(`${API_BASE_URL}${id}/`);
        for (const key in data) {
          if (form.elements[key]) {
            form.elements[key].value = data[key];
          }
        }
      } catch (error) {
        showSnackbar(error.message, "error");
        return;
      }
    } else {
      formMode = "add";
      currentAmbulanceId = null;
      formTitle.textContent = "Tambah Baru";
    }
    showPopup(formPopup);
  }

  async function showDetailPopup(id) {
    currentAmbulanceId = id;
    try {
      const data = await apiFetch(`${API_BASE_URL}${id}/`);
      document.getElementById("detailAmbulancePlate").textContent = data.license_plate || "-";
      document.getElementById("detailAmbulanceType").textContent = data.type || "-";
      document.getElementById("detailAmbulanceBrand").textContent = data.brand || "-";
      document.getElementById("detailAmbulanceModel").textContent = data.model || "-";
      document.getElementById("detailAmbulanceYear").textContent = data.year || "-";
      document.getElementById("detailAmbulanceCapacity").textContent = data.capacity || "-";
      document.getElementById("detailAmbulanceCity").textContent = data.city || "-";
      document.getElementById("detailAmbulanceFacilities").textContent = data.facilities || "-";
      showPopup(elements.detailPopup);
    } catch (error) {
      console.error("Error showing detail:", error);
      showSnackbar(error.message, "error");
    }
  }

  // === EVENT LISTENERS ===

  elements.showAddButton?.addEventListener("click", () => showFormPopup());
  elements.addAmbulanceForm?.addEventListener("submit", saveAmbulance);
  elements.deleteButton?.addEventListener("click", deleteAmbulance);

  elements.editButton?.addEventListener("click", () => {
    hidePopup(elements.detailPopup);
    setTimeout(() => showFormPopup(currentAmbulanceId), 300);
  });

  elements.tableBody?.addEventListener("click", (e) => {
    if (e.target.classList.contains("link-detail")) {
      const id = e.target.dataset.id;
      showDetailPopup(id);
    }
  });

  elements.closePopupBtn?.addEventListener("click", () => hidePopup(elements.detailPopup));
  elements.cancelAddButton?.addEventListener("click", () => hidePopup(elements.formPopup));
  elements.detailPopup?.addEventListener("click", (e) => e.target === elements.detailPopup && hidePopup(elements.detailPopup));
  elements.formPopup?.addEventListener("click", (e) => e.target === elements.formPopup && hidePopup(elements.formPopup));

  // Inisialisasi
  fetchAmbulances();
});
