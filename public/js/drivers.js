async function loadDrivers(redirectUrl) {
  const driverTableBody = document.getElementById("driverTableBody");
  if (!driverTableBody) {
    console.error("Elemen #driverTableBody tidak ditemukan.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for drivers.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Memuat data supir...</td></tr>`;

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/api/drivers/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const driversData = await response.json();
      console.log("Drivers data fetched successfully:", driversData);
      showSnackbar("Data supir berhasil dimuat!", "success");

      driverTableBody.innerHTML = "";

      if (driversData.results && driversData.results.length === 0) {
        driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Tidak ada data supir.</td></tr>`;
        return;
      }

      driversData.results.forEach((driver) => {
        const driverIdForData = driver.id ? String(driver.id) : "";

        const row = `
                    <tr>
                        <td>${driver.id || "N/A"}</td>
                        <td>${driver.full_name || "N/A"}</td>
                        <td>${driver.driver_license_number || "N/A"}</td>
                        <td class="status-cell">${driver.status || "N/A"}</td>
                        <td>${driver.city || "N/A"}</td>
                        <td><span class="link-detail cursor-pointer" data-id="${driverIdForData}">Lihat</span></td>
                    </tr>
                `;
        driverTableBody.insertAdjacentHTML("beforeend", row);
      });
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for drivers. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch drivers.";
      console.error("Error fetching drivers:", response.status, errorData);
      showSnackbar(`Gagal memuat supir: ${errorMessage}`, "error");
      driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Gagal memuat data: ${errorMessage}</td></tr>`;
    }
  } catch (error) {
    console.error("Network error or server unavailable for drivers:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    driverTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Kesalahan koneksi: ${error.message}</td></tr>`;
  }
}

async function showDriverDetailPopup(driverId, redirectUrl) {
  const popupOverlay = document.getElementById("popupOverlay");
  const detailDriverName = document.getElementById("detailDriverName");
  const detailDriverEmail = document.getElementById("detailDriverEmail");
  const detailDriverPhone = document.getElementById("detailDriverPhone");
  const detailDriverBirthdate = document.getElementById("detailDriverBirthdate");
  const detailDriverSIM = document.getElementById("detailDriverSIM");
  const detailDriverStatus = document.getElementById("detailDriverStatus");
  const detailDriverCity = document.getElementById("detailDriverCity");
  const detailDriverHireDate = document.getElementById("detailDriverHireDate");

  if (!popupOverlay || !detailDriverName || !detailDriverEmail || !detailDriverPhone || !detailDriverBirthdate || !detailDriverSIM || !detailDriverStatus || !detailDriverCity || !detailDriverHireDate) {
    console.error("One or more elements for Driver Detail popup are missing. Check IDs in driver_screen.html.");
    showSnackbar("Gagal menampilkan detail: Beberapa elemen tidak ditemukan.", "error");
    return;
  }

  detailDriverName.textContent = "Memuat...";
  detailDriverEmail.textContent = "Memuat...";
  detailDriverPhone.textContent = "Memuat...";
  detailDriverBirthdate.textContent = "Memuat...";
  detailDriverSIM.textContent = "Memuat...";
  detailDriverStatus.textContent = "Memuat...";
  detailDriverCity.textContent = "Memuat...";
  detailDriverHireDate.textContent = "Memuat...";

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/api/drivers/${driverId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const driverDetail = await response.json();
      console.log("Driver detail fetched successfully:", driverDetail);
      showSnackbar("Detail driver berhasil dimuat!", "success");

      detailDriverName.textContent = driverDetail.full_name || "N/A";
      detailDriverEmail.textContent = driverDetail.email || "N/A";
      detailDriverPhone.textContent = driverDetail.phone_number || "N/A";
      detailDriverBirthdate.textContent = driverDetail.date_of_birth || "N/A";
      detailDriverSIM.textContent = driverDetail.driver_license_number || "N/A";
      detailDriverStatus.textContent = driverDetail.status || "N/A";
      detailDriverCity.textContent = driverDetail.city || "N/A";
      detailDriverHireDate.textContent = driverDetail.hire_date || "N/A";
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for driver detail. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else if (response.status === 404) {
      console.error("Driver not found:", driverId);
      showSnackbar(`Driver dengan ID ${driverId} tidak ditemukan.`, "error");
      popupOverlay.classList.remove("show");
      popupOverlay.classList.add("hidden");
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch driver detail.";
      console.error("Error fetching driver detail:", response.status, errorData);
      showSnackbar(`Gagal memuat detail driver: ${errorMessage}`, "error");
      popupOverlay.classList.remove("show");
      popupOverlay.classList.add("hidden");
    }
  } catch (error) {
    console.error("Network error or server unavailable for driver detail:", error);
    showSnackbar(`Kesalahan koneksi saat memuat detail driver: ${error.message}`, "error");
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
  }
}
