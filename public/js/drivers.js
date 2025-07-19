// drivers.js

async function loadDrivers(redirectUrl = "login_screen.html") {
  const driverTableBody = document.getElementById("driverTableBody");
  driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Memuat data supir...</td></tr>`;

  try {
    const driversData = await apiFetch(`${API_BASE_URL}/accounts/api/drivers/`, { method: "GET" }, redirectUrl);

    console.log("Drivers data fetched successfully:", driversData);
    showSnackbar("Data supir berhasil dimuat!", "success");
    driverTableBody.innerHTML = "";

    if (!driversData.results || driversData.results.length === 0) {
      driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Tidak ada data supir.</td></tr>`;
      return;
    }

    driversData.results.forEach((driver) => {
      const row = `
        <tr>
          <td>${driver.id || "N/A"}</td>
          <td>${driver.full_name || "N/A"}</td>
          <td>${driver.driver_license_number || "N/A"}</td>
          <td class="status-cell">${driver.status || "N/A"}</td>
          <td>${driver.city || "N/A"}</td>
          <td><span class="link-detail cursor-pointer" data-id="${driver.id}">Lihat</span></td>
        </tr>`;
      driverTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    showSnackbar(`Gagal memuat supir: ${error.message}`, "error");
    driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Gagal memuat data: ${error.message}</td></tr>`;
  }
}

async function showDriverDetailPopup(driverId, redirectUrl = "login_screen.html") {
  const popupOverlay = document.getElementById("popupOverlay");
  const fields = {
    detailDriverName: "Memuat...",
    detailDriverEmail: "Memuat...",
    detailDriverPhone: "Memuat...",
    detailDriverBirthdate: "Memuat...",
    detailDriverSIM: "Memuat...",
    detailDriverStatus: "Memuat...",
    detailDriverCity: "Memuat...",
    detailDriverHireDate: "Memuat...",
  };

  // Set loading text
  for (const id in fields) {
    document.getElementById(id).textContent = fields[id];
  }

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");

  try {
    const driverDetail = await apiFetch(`${API_BASE_URL}/accounts/api/drivers/${driverId}/`, { method: "GET" }, redirectUrl);

    console.log("Driver detail fetched successfully:", driverDetail);
    showSnackbar("Detail driver berhasil dimuat!", "success");

    document.getElementById("detailDriverName").textContent = driverDetail.full_name || "N/A";
    document.getElementById("detailDriverEmail").textContent = driverDetail.email || "N/A";
    document.getElementById("detailDriverPhone").textContent = driverDetail.phone_number || "N/A";
    document.getElementById("detailDriverBirthdate").textContent = driverDetail.date_of_birth || "N/A";
    document.getElementById("detailDriverSIM").textContent = driverDetail.driver_license_number || "N/A";
    document.getElementById("detailDriverStatus").textContent = driverDetail.status || "N/A";
    document.getElementById("detailDriverCity").textContent = driverDetail.city || "N/A";
    document.getElementById("detailDriverHireDate").textContent = driverDetail.hire_date || "N/A";

    // Simpan ID driver di tombol untuk aksi selanjutnya
    document.getElementById("editDriverBtn").dataset.id = driverId;
    document.getElementById("deleteDriverBtn").dataset.id = driverId;
  } catch (error) {
    console.error("Error fetching driver detail:", error);
    showSnackbar(`Gagal memuat detail: ${error.message}`, "error");
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
  }
}
