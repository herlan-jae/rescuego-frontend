async function loadReservations(redirectUrl) {
  const reservationTableBody = document.getElementById("reservationTableBody");
  if (!reservationTableBody) {
    console.error("Elemen #reservationTableBody tidak ditemukan.");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
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
      const reservationsData = await response.json();
      reservationTableBody.innerHTML = "";

      if (!reservationsData.results || reservationsData.results.length === 0) {
        reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Tidak ada data reservasi.</td></tr>`;
        return;
      }

      reservationsData.results.forEach((reservation) => {
        const row = `
          <tr>
            <td>${reservation.id || "N/A"}</td>
            <td>${reservation.patient_name || "N/A"}</td>
            <td>${reservation.notes || "N/A"}</td>
            <td class="status-cell">${reservation.status_display || "N/A"}</td>
            <td>${reservation.assigned_driver_details?.full_name || "Belum Ditugaskan"}</td>
            <td>${reservation.assigned_ambulance_details?.license_plate || "Belum Ditugaskan"}</td>
            <td>
              <span class="link-detail cursor-pointer" data-id="${reservation.id}">Lihat</span>
            </td>
          </tr>
        `;
        reservationTableBody.insertAdjacentHTML("beforeend", row);
      });
    } else if (response.status === 401) {
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    } else {
      const errorData = await response.json().catch(() => ({ detail: `Server merespons dengan status ${response.status}` }));
      const errorMessage = errorData.detail || "Gagal memuat reservasi.";
      showSnackbar(`Gagal memuat reservasi: ${errorMessage}`, "error");
      reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Gagal memuat data: ${errorMessage}</td></tr>`;
    }
  } catch (error) {
    console.error("Kesalahan jaringan atau server tidak tersedia:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    reservationTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Kesalahan koneksi: ${error.message}</td></tr>`;
  }
}

async function showReservationDetailPopup(reservationId, redirectUrl) {
  const popupOverlay = document.getElementById("popupOverlay");
  if (!popupOverlay || !reservationId) return;

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");
  document.body.classList.add("no-scroll");

  // Reset tampilan popup
  document.getElementById("detailPatientName").textContent = "Memuat...";
  document.getElementById("detailPatientAge").textContent = "Memuat...";
  document.getElementById("detailPatientGender").textContent = "Memuat...";
  document.getElementById("detailPatientNotes").textContent = "Memuat...";
  document.getElementById("detailDriverName").textContent = "Memuat...";
  document.getElementById("detailAmbulancePlate").textContent = "Memuat...";
  document.getElementById("detailStatusText").textContent = "Memuat...";
  document.getElementById("detailTimestamp").textContent = "Memuat...";

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    /* ... error handling ... */ return;
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
      document.getElementById("detailPatientName").textContent = detailData.patient_name || "N/A";
      document.getElementById("detailPatientAge").textContent = detailData.patient_age || "N/A";
      document.getElementById("detailPatientGender").textContent = detailData.patient_gender_display || "N/A";
      document.getElementById("detailPatientNotes").textContent = detailData.notes || "N/A";
      document.getElementById("detailDriverName").textContent = detailData.assigned_driver_details?.full_name || "Belum Ditugaskan";
      document.getElementById("detailAmbulancePlate").textContent = detailData.assigned_ambulance_details?.license_plate || "Belum Ditugaskan";
      document.getElementById("detailStatusText").textContent = detailData.status_display || "N/A";
      document.getElementById("detailTimestamp").textContent = detailData.requested_at ? new Date(detailData.requested_at).toLocaleString("id-ID") : "N/A";
      document.getElementById("status").value = detailData.status;
    } else {
      const errorText = await response.text();
      showSnackbar(`Gagal memuat detail: ${errorText}`, "error");
      popupOverlay.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    }
  } catch (error) {
    console.error("Kesalahan jaringan saat memuat detail:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
    popupOverlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }
}

async function updateReservationStatus(reservationId, newStatus, redirectUrl) {
  if (!reservationId || !newStatus) return;
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    /* ... error handling ... */ return;
  }

  showSnackbar("Mengupdate status reservasi...", "info");

  try {
    // **FIXED**: Menggunakan URL dan method yang benar
    const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/status/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      const updatedData = await response.json();
      showSnackbar(`Status berhasil diupdate menjadi '${updatedData.status_display}'!`, "success");
      document.getElementById("detailStatusText").textContent = updatedData.status_display || newStatus;
      loadReservations(redirectUrl);
    } else {
      const errorData = await response.json().catch(() => ({ detail: "Gagal mengupdate status." }));
      showSnackbar(`Gagal: ${errorData.detail || "Terjadi kesalahan"}`, "error");
    }
  } catch (error) {
    console.error("Kesalahan jaringan saat update status:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
  }
}

async function showAssignReservationPopup(reservationId, redirectUrl) {
  const assignOverlay = document.getElementById("assignReservationOverlay");
  const driverSelect = document.getElementById("assignDriverSelect");
  const ambulanceSelect = document.getElementById("assignAmbulanceSelect");
  const assignForm = document.getElementById("assignReservationForm");

  if (!assignOverlay || !driverSelect || !ambulanceSelect || !assignForm) return;

  driverSelect.innerHTML = '<option value="">Memuat Supir...</option>';
  ambulanceSelect.innerHTML = '<option value="">Memuat Ambulans...</option>';
  assignForm.reset();

  assignOverlay.classList.remove("hidden");
  assignOverlay.classList.add("show");
  document.body.classList.add("no-scroll");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    /* ... error handling ... */ return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/api/resources/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const { available_drivers, available_ambulances } = await response.json();
      driverSelect.innerHTML = '<option value="">-- Pilih Supir --</option>';
      available_drivers.forEach((driver) => {
        driverSelect.innerHTML += `<option value="${driver.id}">${driver.full_name}</option>`;
      });
      ambulanceSelect.innerHTML = '<option value="">-- Pilih Ambulans --</option>';
      available_ambulances.forEach((ambulance) => {
        ambulanceSelect.innerHTML += `<option value="${ambulance.id}">${ambulance.license_plate}</option>`;
      });
    } else {
      showSnackbar("Gagal memuat sumber daya.", "error");
    }
  } catch (error) {
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
  }

  assignForm.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      driver_id: parseInt(driverSelect.value, 10),
      ambulance_id: parseInt(ambulanceSelect.value, 10),
    };

    if (!payload.driver_id || !payload.ambulance_id) {
      showSnackbar("Pilih supir dan ambulans untuk penugasan.", "error");
      return;
    }

    showSnackbar("Menugaskan reservasi...", "info");

    try {
      const assignResponse = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/assign/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      });

      const assignData = await assignResponse.json().catch(() => null);

      if (assignResponse.ok) {
        showSnackbar("Reservasi berhasil ditugaskan!", "success");
        assignOverlay.classList.add("hidden");
        document.getElementById("popupOverlay").classList.add("hidden");
        document.body.classList.remove("no-scroll");
        loadReservations(redirectUrl);
      } else {
        const errorMessage = assignData?.detail || "Gagal menugaskan reservasi.";
        showSnackbar(errorMessage, "error");
      }
    } catch (assignError) {
      showSnackbar(`Kesalahan koneksi saat menugaskan: ${assignError.message}`, "error");
    }
  };
}

async function cancelReservation(reservationId, redirectUrl) {
  if (!confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) return;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    /* ... error handling ... */ return;
  }

  showSnackbar("Membatalkan reservasi...", "info");

  try {
    // **FIXED**: Menggunakan endpoint cancel yang spesifik
    const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/cancel/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      showSnackbar("Reservasi berhasil dibatalkan.", "success");
      document.getElementById("popupOverlay").classList.add("hidden");
      document.body.classList.remove("no-scroll");
      loadReservations(redirectUrl);
    } else {
      const errorData = await response.json().catch(() => ({ detail: "Gagal membatalkan reservasi." }));
      showSnackbar(`Gagal: ${errorData.detail || "Terjadi kesalahan"}`, "error");
    }
  } catch (error) {
    console.error("Kesalahan jaringan saat membatalkan:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
  }
}
