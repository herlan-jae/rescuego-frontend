document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "/src/auth/login.html";
    return;
  }

  const currentContainer = document.getElementById("current-reservations");
  const historyContainer = document.getElementById("history-reservations");
  const modal = document.getElementById("reservationModal");
  const modalContent = document.getElementById("modal-content");
  const closeModalBtn = document.getElementById("closeModal");
  const cancelButton = document.getElementById("cancelButton");
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmOkBtn = document.getElementById("confirm-ok-btn");
  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");

  const showModal = () => modal.classList.remove("hidden");
  const hideModal = () => modal.classList.add("hidden");

  const createReservationCard = (reservation) => {
    const isHistory = ["Selesai", "Dibatalkan"].includes(reservation.status_display);
    const icon = isHistory ? "✔️" : "⚠️";
    const iconColor = isHistory ? "text-green-500" : "text-yellow-500";

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition";
    card.dataset.id = reservation.id;

    card.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="${iconColor} text-xl">${icon}</span>
                <span class="text-sm font-semibold text-[#5B2EFF]">${reservation.assigned_driver_name || "Menunggu Supir"} - ${reservation.assigned_ambulance_plate || "Belum ada kendaraan"}</span>
            </div>
            <span class="text-[#5B2EFF] text-xl font-bold">›</span>
        `;

    card.addEventListener("click", () => handleCardClick(reservation.id));
    return card;
  };

  const fetchAndRenderReservations = async () => {
    console.log("1. Memulai fetchAndRenderReservations...");
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data reservasi.");

      const data = await response.json();
      console.log("2. Data diterima dari API:", data);

      const reservations = data.results;
      console.log("3. Array 'results' yang akan diproses:", reservations);

      currentContainer.innerHTML = "";
      historyContainer.innerHTML = "";

      if (!reservations || reservations.length === 0) {
        console.log("4. Tidak ada reservasi untuk ditampilkan.");
        currentContainer.innerHTML = '<p class="text-center text-gray-500 text-sm">Tidak ada reservasi saat ini.</p>';
      } else {
        console.log("5. Memulai loop untuk menampilkan reservasi...");
        reservations.forEach((res) => {
          console.log("6. Memproses reservasi ID:", res.id);
          const card = createReservationCard(res);
          const isHistory = ["Selesai", "Dibatalkan", "Completed", "Cancelled", "Rejected"].includes(res.status_display);

          if (isHistory) {
            historyContainer.appendChild(card);
          } else {
            currentContainer.appendChild(card);
          }
        });
      }
    } catch (error) {
      console.error("Error di fetchAndRenderReservations:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleCardClick = async (reservationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Gagal memuat detail reservasi.");

      const detail = await response.json();

      modalContent.innerHTML = `
            <div class="space-y-3">
                <h3 class="text-lg font-bold text-[#5B2EFF]">Pasien</h3>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Nama</span><span class="font-semibold text-gray-900 text-right">${detail.patient_name}</span></div>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Umur</span><span class="font-semibold text-gray-900">${detail.patient_age}</span></div>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Keterangan</span><span class="font-semibold text-gray-900 text-right">${detail.emergency_type}</span></div>
            </div>
            <div class="space-y-3">
                <h3 class="text-lg font-bold text-[#5B2EFF]">Reservasi</h3>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Supir</span><span class="font-semibold text-gray-900 text-right">${detail.assigned_driver_name || "-"}</span></div>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Kendaraan</span><span class="font-semibold text-gray-900 text-right">${detail.assigned_ambulance_plate || "-"}</span></div>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Status</span><span class="font-semibold text-gray-900">${detail.status_display}</span></div>
                <div class="flex justify-between border-b pb-2"><span class="text-gray-500">Waktu</span><span class="font-semibold text-gray-900">${new Date(detail.requested_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}</span></div>
            </div>
        `;

      const finalStatuses = ["Selesai", "Dibatalkan", "Completed", "Cancelled", "Rejected"];

      if (finalStatuses.includes(detail.status_display)) {
        cancelButton.classList.add("hidden");
      } else {
        cancelButton.classList.remove("hidden");
        cancelButton.dataset.id = reservationId;
      }

      showModal();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const showConfirmation = (title, message) => {
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-message").textContent = message;
    confirmationModal.classList.remove("hidden");

    return new Promise((resolve) => {
      confirmOkBtn.onclick = () => {
        confirmationModal.classList.add("hidden");
        resolve(true);
      };
      confirmCancelBtn.onclick = () => {
        confirmationModal.classList.add("hidden");
        resolve(false);
      };
    });
  };

  const handleCancelReservation = async (event) => {
    const reservationId = event.target.dataset.id;
    if (!reservationId) return;

    const confirmed = await showConfirmation("Batalkan Reservasi", "Apakah Anda yakin ingin membatalkan reservasi ini?");

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/${reservationId}/cancel/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Gagal membatalkan reservasi.");

      showSnackbar("Reservasi berhasil dibatalkan.", "success");
      hideModal();
      fetchAndRenderReservations();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  closeModalBtn.addEventListener("click", hideModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) hideModal();
  });
  cancelButton.addEventListener("click", handleCancelReservation);

  fetchAndRenderReservations();
});
