async function loadReservations(redirectUrl) {
  const reservationTableBody = document.getElementById("reservationTableBody");
  if (!reservationTableBody) {
    console.error("Elemen #reservationTableBody tidak ditemukan.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for reservations.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Memuat data reservasi...</td></tr>`;

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/api/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const reservations = await response.json();
      console.log("Reservations data fetched successfully:", reservations);
      showSnackbar("Data reservasi berhasil dimuat!", "success");

      reservationTableBody.innerHTML = "";

      if (reservations.results && reservations.results.length === 0) {
        reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Tidak ada data reservasi.</td></tr>`;
        return;
      }

      reservations.results.forEach((reservation) => {
        const reservationIdForData = reservation.id ? String(reservation.id) : "";

        const row = `
                    <tr>
                        <td>${reservation.id || "N/A"}</td>
                        <td>${reservation.patient_name || "N/A"}</td>
                        <td>${reservation.details || "N/A"}</td>
                        <td class="status-cell">${reservation.status_display || "N/A"}</td> <td>${reservation.assigned_driver_details?.name || "Belum Ditugaskan"}</td> <td>${
          reservation.assigned_ambulance_details?.license_plate || "Belum Ditugaskan"
        }</td> <td>
                            <span class="link-detail cursor-pointer" data-id="${reservationIdForData}">Lihat</span>
                        </td>
                    </tr>
                `;
        reservationTableBody.insertAdjacentHTML("beforeend", row);
      });
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for reservations. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch reservations.";
      console.error("Error fetching reservations:", response.status, errorData);
      showSnackbar(`Gagal memuat reservasi: ${errorMessage}`, "error");
      reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Gagal memuat data: ${errorMessage}</td></tr>`;
    }
  } catch (error) {
    console.error("Network error or server unavailable for reservations:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Kesalahan koneksi: ${error.message}</td></tr>`;
  }
}

async function showReservationDetailPopup(reservationId, redirectUrl) {
  const popupOverlay = document.getElementById("popupOverlay");
  const detailPatientName = document.getElementById("detailPatientName");
  const detailPatientAge = document.getElementById("detailPatientAge");
  const detailPatientGender = document.getElementById("detailPatientGender");
  const detailPatientNotes = document.getElementById("detailPatientNotes");
  const detailDriverName = document.getElementById("detailDriverName");
  const detailAmbulancePlate = document.getElementById("detailAmbulancePlate");
  const detailStatusText = document.getElementById("detailStatusText");
  const detailTimestamp = document.getElementById("detailTimestamp");
  const detailStatusSelect = document.getElementById("status");

  console.log("DEBUG: Memulai showReservationDetailPopup untuk ID:", reservationId);
  const potentialStatusSelect = document.getElementById("status");
  console.log("DEBUG: Hasil document.getElementById('status'):", potentialStatusSelect);
  console.log("DEBUG: Nilai detailStatusSelect setelah deklarasi:", detailStatusSelect);

  if (!reservationId || reservationId === "null" || reservationId === "undefined" || reservationId === "") {
    console.error("Invalid reservationId provided for detail popup:", reservationId);
    showSnackbar("Tidak dapat memuat detail: ID reservasi tidak valid.", "error");
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
    return;
  }

  detailPatientName.textContent = "Memuat...";
  detailPatientAge.textContent = "Memuat...";
  detailPatientGender.textContent = "Memuat...";
  detailPatientNotes.textContent = "Memuat...";
  detailDriverName.textContent = "Memuat...";
  detailAmbulancePlate.textContent = "Memuat...";
  detailStatusText.textContent = "Memuat...";
  detailTimestamp.textContent = "Memuat...";

  if (detailStatusSelect) {
    detailStatusSelect.value = "pending";
  } else {
    console.error("ERROR KRITIS: Elemen SELECT dengan ID 'status' TIDAK DITEMUKAN PADA SAAT INI. Popup mungkin tidak berfungsi penuh.");
  }

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. Redirecting to login for detail.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const detailData = await response.json();
      console.log("Reservation detail fetched successfully:", detailData);
      showSnackbar("Detail reservasi berhasil dimuat!", "success");

      detailPatientName.textContent = detailData.patient_name || "N/A";
      detailPatientAge.textContent = detailData.patient_age || "N/A";
      detailPatientGender.textContent = detailData.patient_gender || "N/A";
      detailPatientNotes.textContent = detailData.patient_condition || detailData.current_symptoms || "N/A";

      detailDriverName.textContent = detailData.assigned_driver_details?.name || "Belum Ditugaskan";

      detailAmbulancePlate.textContent = detailData.assigned_ambulance_details?.license_plate || "Belum Ditugaskan";

      detailStatusText.textContent = detailData.status_display || "N/A";

      detailTimestamp.textContent = detailData.requested_at ? new Date(detailData.requested_at).toLocaleString() : "N/A";

      if (detailStatusSelect) {
        detailStatusSelect.value = detailData.status || "pending";
      }
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired for detail. Redirecting.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else if (response.status === 404) {
      console.error("Reservation detail not found:", reservationId);
      showSnackbar(`Detail reservasi dengan ID ${reservationId} tidak ditemukan.`, "error");
      popupOverlay.classList.remove("show");
      popupOverlay.classList.add("hidden");
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server responded with status ${response.status}` }));
      const errorMessage = errorData.detail || "Failed to fetch reservation detail.";
      console.error("Error fetching reservation detail:", response.status, errorData);
      showSnackbar(`Gagal memuat detail reservasi: ${errorMessage}`, "error");
      popupOverlay.classList.remove("show");
      popupOverlay.classList.add("hidden");
    }
  } catch (error) {
    console.error("Network error or server unavailable for detail:", error);
    showSnackbar(`Kesalahan koneksi saat memuat detail: ${error.message}`, "error");
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
  }
}
