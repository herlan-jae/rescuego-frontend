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
      const responseData = await response.json();
      console.log("Dashboard data fetched successfully:", responseData);
      showSnackbar("Data dashboard berhasil dimuat!", "success");

      if (role === "admin" && responseData.stats) {
        document.getElementById("totalReservations").textContent = responseData.stats.total_reservations || "0";
        document.getElementById("activeReservations").textContent = responseData.stats.active_reservations || "0";
        document.getElementById("availableAmbulances").textContent = responseData.stats.available_ambulances || "0";
        document.getElementById("pendingMaintenance").textContent = responseData.stats.pending_maintenance || "0";
      }
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
