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
      localStorage.removeItem("refreshToken");
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
  if (!popupOverlay) {
    console.error("Elemen pop-up detail reservasi tidak ditemukan.");
    return;
  }

  if (!reservationId) {
    showSnackbar("Tidak dapat memuat detail: ID reservasi tidak valid.", "error");
    return;
  }

  popupOverlay.classList.remove("hidden");
  popupOverlay.classList.add("show");
  document.body.classList.add("no-scroll");

  document.getElementById("detailPatientName").textContent = "Memuat...";
  document.getElementById("detailPatientAge").textContent = "Memuat...";
  document.getElementById("detailPatientGender").textContent = "Memuat...";
  document.getElementById("detailPatientNotes").textContent = "Memuat...";
  document.getElementById("detailDriverName").textContent = "Memuat...";
  document.getElementById("detailAmbulancePlate").textContent = "Memuat...";
  document.getElementById("detailStatusText").textContent = "Memuat...";
  document.getElementById("detailTimestamp").textContent = "Memuat...";
  document.getElementById("status").value = "pending";

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
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

      document.getElementById("detailPatientName").textContent = detailData.patient_name || "N/A";
      document.getElementById("detailPatientAge").textContent = detailData.patient_age || "N/A";
      document.getElementById("detailPatientGender").textContent = detailData.patient_gender || "N/A";
      document.getElementById("detailPatientNotes").textContent = detailData.patient_condition || detailData.notes || "N/A";
      document.getElementById("detailDriverName").textContent = detailData.assigned_driver_details?.full_name || "Belum Ditugaskan";
      document.getElementById("detailAmbulancePlate").textContent = detailData.assigned_ambulance_details?.license_plate || "Belum Ditugaskan";
      document.getElementById("detailStatusText").textContent = detailData.status_display || "N/A";
      document.getElementById("detailTimestamp").textContent = detailData.requested_at ? new Date(detailData.requested_at).toLocaleString("id-ID") : "N/A";

      const statusSelect = document.getElementById("status");
      if (statusSelect) {
        statusSelect.value = detailData.status;
      }
    } else if (response.status === 401) {
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      setTimeout(() => (window.location.href = redirectUrl), 1500);
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
  if (!reservationId || !newStatus) {
    showSnackbar("ID reservasi atau status baru tidak valid.", "error");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => (window.location.href = redirectUrl), 1500);
    return;
  }

  showSnackbar("Mengupdate status reservasi...", "info");

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/update-status/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      const updatedData = await response.json();
      showSnackbar(`Status reservasi berhasil diupdate menjadi '${updatedData.status_display}'!`, "success");

      const detailStatusText = document.getElementById("detailStatusText");
      if (detailStatusText) {
        detailStatusText.textContent = updatedData.status_display || newStatus;
      }

      loadReservations(redirectUrl);
    } else if (response.status === 401) {
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      setTimeout(() => (window.location.href = redirectUrl), 1500);
    } else {
      const errorData = await response.json().catch(() => ({ detail: "Gagal mengupdate status." }));
      showSnackbar(`Gagal: ${errorData.detail}`, "error");
    }
  } catch (error) {
    console.error("Kesalahan jaringan saat update status:", error);
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
  }
}

async function showAssignReservationPopup(reservationId, redirectUrl) {
  const assignReservationOverlay = document.getElementById("assignReservationOverlay");
  const assignDriverSelect = document.getElementById("assignDriverSelect");
  const assignAmbulanceSelect = document.getElementById("assignAmbulanceSelect");
  const assignReservationForm = document.getElementById("assignReservationForm");

  if (!assignReservationOverlay || !assignDriverSelect || !assignAmbulanceSelect || !assignReservationForm) {
    showSnackbar("Gagal menyiapkan form penugasan.", "error");
    return;
  }

  assignDriverSelect.innerHTML = '<option value="">Memuat Supir...</option>';
  assignAmbulanceSelect.innerHTML = '<option value="">Memuat Ambulans...</option>';
  assignReservationForm.reset();

  assignReservationOverlay.classList.remove("hidden");
  assignReservationOverlay.classList.add("show");
  document.body.classList.add("no-scroll");

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir.", "error");
    setTimeout(() => (window.location.href = redirectUrl), 1500);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reservations/api/resources/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const resources = await response.json();

      assignDriverSelect.innerHTML = '<option value="">-- Pilih Supir --</option>';
      if (resources.available_drivers && resources.available_drivers.length > 0) {
        resources.available_drivers.forEach((driver) => {
          assignDriverSelect.innerHTML += `<option value="${driver.id}">${driver.full_name} (${driver.status_display})</option>`;
        });
      } else {
        assignDriverSelect.innerHTML = '<option value="">Tidak ada Supir Tersedia</option>';
      }

      assignAmbulanceSelect.innerHTML = '<option value="">-- Pilih Ambulans --</option>';
      if (resources.available_ambulances && resources.available_ambulances.length > 0) {
        resources.available_ambulances.forEach((ambulance) => {
          assignAmbulanceSelect.innerHTML += `<option value="${ambulance.id}">${ambulance.license_plate} (${ambulance.type})</option>`;
        });
      } else {
        assignAmbulanceSelect.innerHTML = '<option value="">Tidak ada Ambulans Tersedia</option>';
      }
    } else {
      showSnackbar("Gagal memuat sumber daya.", "error");
    }
  } catch (error) {
    showSnackbar(`Kesalahan koneksi: ${error.message}`, "error");
  }

  assignReservationForm.onsubmit = async (e) => {
    e.preventDefault();
    const driverIdStr = assignDriverSelect.value;
    const ambulanceIdStr = assignAmbulanceSelect.value;

    if (!driverIdStr || !ambulanceIdStr) {
      showSnackbar("Pilih supir dan ambulans untuk penugasan.", "error");
      return;
    }

    const driverId = parseInt(driverIdStr, 10);
    const ambulanceId = parseInt(ambulanceIdStr, 10);

    if (isNaN(driverId) || isNaN(ambulanceId)) {
      showSnackbar("ID Supir atau Ambulans tidak valid. Silakan pilih lagi.", "error");
      return;
    }

    const payload = {
      driver_id: driverId,
      ambulance_id: ambulanceId,
    };

    console.log("Mengirim payload penugasan:", JSON.stringify(payload));
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
        assignReservationOverlay.classList.add("hidden");
        document.getElementById("popupOverlay").classList.add("hidden");
        document.body.classList.remove("no-scroll");
        loadReservations(redirectUrl);
      } else {
        console.error("Error dari server:", assignData);

        let errorMessage = "Gagal menugaskan reservasi.";
        if (assignData) {
          if (assignData.detail) {
            errorMessage = assignData.detail;
          } else if (typeof assignData === "object") {
            const fieldErrors = Object.entries(assignData)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
              .join("; ");
            if (fieldErrors) errorMessage = fieldErrors;
          }
        }

        showSnackbar(errorMessage, "error");
      }
    } catch (assignError) {
      console.error("Kesalahan koneksi saat menugaskan:", assignError);
      showSnackbar(`Kesalahan koneksi saat menugaskan: ${assignError.message}`, "error");
    }
  };
}

async function cancelReservation(reservationId, redirectUrl) {
  if (!confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) {
    return;
  }
  await updateReservationStatus(reservationId, "cancelled", redirectUrl);

  const popupOverlay = document.getElementById("popupOverlay");
  if (popupOverlay) {
    popupOverlay.classList.remove("show");
    popupOverlay.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }
}
