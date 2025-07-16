/**
 * Mengambil daftar perbaikan dari API dan menampilkannya di tabel.
 * @param {string} redirectUrl - URL untuk redirect jika terjadi masalah otentikasi.
 */
async function loadMaintenance(redirectUrl) {
  const maintenanceTableBody = document.getElementById("maintenanceTableBody"); // ID baru untuk tbody
  if (!maintenanceTableBody) {
    console.error("Elemen #maintenanceTableBody tidak ditemukan.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for maintenance.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  maintenanceTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Memuat data perbaikan...</td></tr>`;

  try {
    const response = await fetch(`${API_BASE_URL}/maintenance/api/`, {
      // Endpoint GET List Maintenance
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const maintenanceData = await response.json(); // Data paginasi DRF
      console.log("Maintenance data fetched successfully:", maintenanceData);
      showSnackbar("Data perbaikan berhasil dimuat!", "success");

      maintenanceTableBody.innerHTML = "";

      if (maintenanceData.results && maintenanceData.results.length === 0) {
        maintenanceTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Tidak ada data perbaikan.</td></tr>`;
        return;
      }

      maintenanceData.results.forEach((record) => {
        const recordIdForData = record.id ? String(record.id) : "";

        // Pastikan properti JSON sesuai dengan yang dikembalikan API Anda
        const row = `
                    <tr>
                        <td>${record.id || "N/A"}</td>
                        <td>${record.ambulance_details ? record.ambulance_details.license_plate : "N/A"} (${record.ambulance_details ? record.ambulance_details.model : "N/A"})</td>
                        <td>${record.description || "N/A"}</td>
                        <td>${record.reported_date || "N/A"}</td>
                        <td class="status-cell">${record.status || "N/A"}</td>
                        <td><span class="link-detail cursor-pointer" data-id="${recordIdForData}">Lihat</span></td>
                    </tr>
                `;
        maintenanceTableBody.insertAdjacentHTML("beforeend", row);
      });
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for maintenance. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch maintenance records.";
      console.error("Error fetching maintenance records:", response.status, errorData);
      showSnackbar(`Gagal memuat perbaikan: ${errorMessage}`, "error");
      maintenanceTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Gagal memuat data: ${errorMessage}</td></tr>`;
    }
  } catch (error) {
    console.error("Network error or server unavailable for maintenance:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    maintenanceTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Kesalahan koneksi: ${error.message}</td></tr>`;
  }
}

// showMaintenanceDetailPopup akan dibuat nanti
// async function showMaintenanceDetailPopup(recordId, redirectUrl) { /* ... */ }
