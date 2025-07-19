const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const requestListContainer = document.getElementById("requestListContainer");
  const modal = document.getElementById("requestDetailModal");
  const closeBtn = document.getElementById("closeDetail");
  const statusSelect = document.getElementById("statusSelect");
  const mainContent = document.getElementById("mainContent");

  let currentReservationId = null;

  const loadRequests = async () => {
    requestListContainer.innerHTML = `<p class="text-center text-gray-500">Memuat permintaan...</p>`;
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil data permintaan.");
      const data = await response.json();
      requestListContainer.innerHTML = "";

      if (!data.results || data.results.length === 0) {
        requestListContainer.innerHTML = `<p class="text-center text-gray-500">Tidak ada permintaan saat ini.</p>`;
        return;
      }

      data.results.forEach((req) => {
        const isCompleted = ["completed", "cancelled"].includes(req.status);
        const icon = isCompleted ? "✔️" : "⚠️";
        const iconColor = isCompleted ? "text-green-500" : "text-yellow-500";

        const requestElement = document.createElement("button");
        requestElement.className = "open-detail bg-white rounded-xl shadow py-4 px-6 flex items-center justify-between w-full text-left transition hover:bg-gray-100 cursor-pointer";
        requestElement.dataset.id = req.id;

        requestElement.innerHTML = `
          <div class="flex items-center space-x-4">
            <span class="${iconColor} text-2xl">${icon}</span>
            <span class="text-md font-semibold text-gray-700">${req.patient_name} - ${req.notes || "N/A"} - ${req.destination || "N/A"}</span>
          </div>
          <span class="text-[#5B2EFF] text-2xl font-bold">›</span>
        `;
        requestListContainer.appendChild(requestElement);
      });
    } catch (error) {
      console.error(error);
      requestListContainer.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
    }
  };

  const showDetailModal = async (reservationId) => {
    currentReservationId = reservationId;
    const token = localStorage.getItem("accessToken");

    modal.classList.remove("hidden");
    mainContent.style.filter;
    modal.classList.add("show"); // Memicu transisi dari CSS

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil detail.");
      const detail = await response.json();

      document.getElementById("patientName").textContent = detail.patient_name || "-";
      document.getElementById("patientAge").textContent = detail.patient_age || "-";
      document.getElementById("patientGender").textContent = detail.patient_gender_display || "-";
      document.getElementById("patientNotes").textContent = detail.notes || "-";
      document.getElementById("driverName").textContent = detail.assigned_driver_details?.full_name || "Belum Ditugaskan";
      document.getElementById("vehiclePlate").textContent = detail.assigned_ambulance_details?.license_plate || "-";
      document.getElementById("currentStatus").textContent = detail.status_display || "-";
      document.getElementById("timestamp").textContent = new Date(detail.requested_at).toLocaleString("id-ID");
      statusSelect.value = detail.status;
    } catch (error) {
      console.error(error);
      alert("Gagal memuat detail. Lihat konsol.");
    }
  };

  const closeModal = () => {
    modal.classList.remove("show");
    mainContent.style.filter = "none";
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
    currentReservationId = null;
  };

  const handleStatusUpdate = async () => {
    if (!currentReservationId) return;
    const newStatus = statusSelect.value;
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/${currentReservationId}/status/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Gagal memperbarui status.");

      closeModal();
      await loadRequests();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  requestListContainer.addEventListener("click", (event) => {
    const requestButton = event.target.closest(".open-detail");
    if (requestButton) {
      showDetailModal(requestButton.dataset.id);
    }
  });

  statusSelect.addEventListener("change", handleStatusUpdate);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  loadRequests();
});
