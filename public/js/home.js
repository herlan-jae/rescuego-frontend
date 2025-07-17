document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "/src/auth/login.html";
    return;
  }

  const welcomeMessage = document.getElementById("welcome-message");
  const currentContainer = document.getElementById("current-reservations");
  const historyContainer = document.getElementById("history-reservations");

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/api/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Gagal memuat profil.");
      const profile = await response.json();
      welcomeMessage.textContent = `Halo, ${profile.full_name}!`;
    } catch (error) {
      console.error(error);
      welcomeMessage.textContent = "Halo, Pengguna!";
    }
  };

  const createReservationCard = (reservation) => {
    const isHistory = ["Selesai", "Dibatalkan", "Completed", "Cancelled", "Rejected"].includes(reservation.status_display);
    const icon = isHistory ? "✔️" : "⚠️";
    const iconColor = isHistory ? "text-green-500" : "text-yellow-500";

    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition";
    card.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="${iconColor} text-xl">${icon}</span>
                <span class="text-sm font-semibold text-[#5B2EFF]">${reservation.assigned_driver_name || "Menunggu Supir"} - ${reservation.assigned_ambulance_plate || "Belum ada kendaraan"}</span>
            </div>
            <span class="text-[#5B2EFF] text-xl font-bold">›</span>
        `;
    return card;
  };

  const fetchReservationsSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/api/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Gagal memuat reservasi.");
      const data = await response.json();

      currentContainer.innerHTML = "";
      historyContainer.innerHTML = "";

      const currentReservations = data.results.filter((r) => !["Selesai", "Dibatalkan", "Completed", "Cancelled", "Rejected"].includes(r.status_display));
      const historyReservations = data.results.filter((r) => ["Selesai", "Dibatalkan", "Completed", "Cancelled", "Rejected"].includes(r.status_display));

      if (currentReservations.length > 0) {
        currentContainer.appendChild(createReservationCard(currentReservations[0]));
      } else {
        currentContainer.innerHTML = '<p class="text-sm text-gray-500">Tidak ada reservasi aktif.</p>';
      }

      if (historyReservations.length > 0) {
        historyReservations.slice(0, 2).forEach((res) => {
          historyContainer.appendChild(createReservationCard(res));
        });
      } else {
        historyContainer.innerHTML = '<p class="text-sm text-gray-500">Belum ada riwayat reservasi.</p>';
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  fetchUserProfile();
  fetchReservationsSummary();
});
