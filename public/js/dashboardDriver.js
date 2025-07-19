document.addEventListener("DOMContentLoaded", () => {
  // Elemen UI
  const driverNameSpan = document.getElementById("driverName");
  const requestsTodayCountP = document.getElementById("requestsTodayCount");
  const requestsCompletedCountP = document.getElementById("requestsCompletedCount");
  const currentRequestContainer = document.getElementById("currentRequestContainer");

  // Endpoint API
  const PROFILE_API = `${API_BASE_URL}/accounts/api/driver/profile/`;
  const RESERVATIONS_API = `${API_BASE_URL}/reservations/api/`;

  const loadDashboardData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "login_screen.html"; // Redirect jika tidak ada token
      return;
    }

    try {
      // Ambil data profil dan reservasi secara bersamaan
      const [profileRes, reservationsRes] = await Promise.all([fetch(PROFILE_API, { headers: { Authorization: `Bearer ${token}` } }), fetch(RESERVATIONS_API, { headers: { Authorization: `Bearer ${token}` } })]);

      if (!profileRes.ok || !reservationsRes.ok) {
        throw new Error("Gagal memuat data dashboard.");
      }

      const profileData = await profileRes.json();
      const reservationsData = await reservationsRes.json();

      // 1. Tampilkan nama driver
      driverNameSpan.textContent = profileData.full_name.split(" ")[0]; // Ambil nama pertama

      // 2. Hitung statistik dari data reservasi
      let todayCount = 0;
      let completedTodayCount = 0;
      const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

      reservationsData.results.forEach((req) => {
        const requestDate = req.requested_at.slice(0, 10);
        if (requestDate === today) {
          todayCount++;
          if (req.status === "completed") {
            completedTodayCount++;
          }
        }
      });

      requestsTodayCountP.textContent = todayCount;
      requestsCompletedCountP.textContent = completedTodayCount;

      // 3. Cari dan tampilkan permintaan aktif saat ini
      const activeRequest = reservationsData.results.find((req) => req.assigned_driver === profileData.id && !["completed", "cancelled"].includes(req.status));

      currentRequestContainer.innerHTML = ""; // Kosongkan container
      if (activeRequest) {
        const requestElement = document.createElement("button");
        requestElement.className = "open-detail bg-white rounded-xl shadow py-4 px-6 flex items-center justify-between w-full text-left transition hover:bg-gray-100 cursor-pointer";
        requestElement.dataset.id = activeRequest.id;

        requestElement.innerHTML = `
          <div class="flex items-center space-x-4">
            <span class="text-yellow-500 text-2xl">⚠️</span>
            <span class="text-md font-semibold text-gray-700">${activeRequest.patient_name} - ${activeRequest.notes || "N/A"} - ${activeRequest.destination || "N/A"}</span>
          </div>
          <span class="text-[#5B2EFF] text-2xl font-bold">›</span>
        `;
        currentRequestContainer.appendChild(requestElement);
      } else {
        currentRequestContainer.innerHTML = `<p class="text-center text-gray-500 p-4 bg-white rounded-xl shadow">Tidak ada permintaan aktif saat ini.</p>`;
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Tampilkan pesan error di UI
    }
  };

  // (Opsional) Tambahkan event listener untuk membuka modal jika ada permintaan aktif
  currentRequestContainer.addEventListener("click", (event) => {
    const requestButton = event.target.closest(".open-detail");
    if (requestButton) {
      // Anda perlu menyalin/mengimpor fungsi showDetailModal dari file request_driver.js
      // atau membuat file utilitas bersama untuk fungsi modal.
      alert(`Buka detail untuk reservasi ID: ${requestButton.dataset.id}`);
    }
  });

  // Muat data saat halaman dibuka
  loadDashboardData();
});
