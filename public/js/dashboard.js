// public/js/dashboard.js

/**
 * Mengambil data dashboard dari API dan menampilkannya.
 * @param {string} role - Peran pengguna (misal: 'admin', 'driver', 'user') untuk menentukan logika tampilan.
 * @param {string} redirectUrl - URL untuk redirect jika terjadi masalah otentikasi.
 */
async function fetchDashboardData(role, redirectUrl) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. Redirecting to login.");
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/api/dashboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json(); // Menggunakan nama variabel berbeda agar tidak bentrok
      console.log("Dashboard data fetched successfully:", responseData);
      showSnackbar("Data dashboard berhasil dimuat!", "success");

      // --- BAGIAN INI UNTUK MENAMPILKAN DATA DI DASHBOARD ADMIN ---
      if (role === "admin" && responseData.stats) {
        // Pastikan 'stats' ada di respons
        document.getElementById("totalReservations").textContent = responseData.stats.total_reservations || "0";
        document.getElementById("activeReservations").textContent = responseData.stats.active_reservations || "0";
        document.getElementById("availableAmbulances").textContent = responseData.stats.available_ambulances || "0";
        document.getElementById("pendingMaintenance").textContent = responseData.stats.pending_maintenance || "0";

        // Jika ada data lain yang ingin ditampilkan (misal, tabel reservasi aktif terbaru)
        // Anda bisa tambahkan logika di sini.
      }
      // --- AKHIR BAGIAN UNTUK DASHBOARD ADMIN ---

      // Anda bisa tambahkan else if (role === 'driver') dan else if (role === 'user')
      // untuk logika tampilan dashboard peran lainnya, jika endpoint Anda sama untuk semua peran.
      // Namun, jika endpointnya berbeda per peran, maka file JS dashboard per peran mungkin lebih baik.
    } else if (response.status === 401) {
      console.error("Unauthorized: Token invalid or expired. Redirecting to login.");
      showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.detail || "Failed to fetch dashboard data.";
      console.error("Error fetching dashboard data:", response.status, errorData);
      showSnackbar(`Gagal memuat data dashboard: ${errorMessage}`, "error");
    }
  } catch (error) {
    console.error("Network error or server unavailable:", error);
    showSnackbar(`Kesalahan jaringan: ${error.message}`, "error");
  }
}
