document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil semua elemen dari DOM
  const licensePlateInput = document.getElementById("license_plate");
  const yearInput = document.getElementById("year");
  const typeInput = document.getElementById("type");
  const capacityInput = document.getElementById("capacity");
  const brandInput = document.getElementById("brand");
  const cityInput = document.getElementById("city");
  const modelInput = document.getElementById("model");
  const equipmentInput = document.getElementById("equipment");
  const statusSelect = document.getElementById("status");
  const vehicleDetailsContainer = document.getElementById("vehicle-details");

  // 2. Definisikan alamat API
  const PROFILE_API_ENDPOINT = "http://127.0.0.1:8000/accounts/api/driver/profile/";
  const AMBULANCE_API_BASE_URL = "http://127.0.0.1:8000/ambulances/api/";

  // **BARU**: Variabel untuk menyimpan ID ambulans saat ini
  let currentAmbulanceId = null;

  /**
   * Fungsi untuk memuat data kendaraan
   */
  const loadVehicleData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const profileResponse = await fetch(PROFILE_API_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileResponse.ok) throw new Error("Gagal memuat profil driver.");

      const profileData = await profileResponse.json();
      const ambulanceId = profileData.assigned_vehicle;

      // **BARU**: Simpan ID ambulans ke variabel global
      currentAmbulanceId = ambulanceId;

      if (!currentAmbulanceId) {
        vehicleDetailsContainer.innerHTML = `<p class="text-center col-span-2">Tidak ada ambulans yang ditugaskan untuk Anda.</p>`;
        statusSelect.disabled = true; // Nonaktifkan dropdown jika tidak ada ambulans
        return;
      }

      const ambulanceResponse = await fetch(`${AMBULANCE_API_BASE_URL}${currentAmbulanceId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!ambulanceResponse.ok) throw new Error("Gagal memuat data ambulans.");

      const ambulanceData = await ambulanceResponse.json();

      licensePlateInput.value = ambulanceData.license_plate || "-";
      yearInput.value = ambulanceData.year || "-";
      typeInput.value = ambulanceData.type || "-";
      capacityInput.value = ambulanceData.capacity || "-";
      brandInput.value = ambulanceData.brand || "-";
      cityInput.value = ambulanceData.city || "-";
      modelInput.value = ambulanceData.model || "-";
      equipmentInput.value = ambulanceData.equipment || "-";
      statusSelect.value = ambulanceData.status || "under_maintenance";
      statusSelect.disabled = false; // Pastikan dropdown aktif
    } catch (error) {
      console.error("Error:", error);
      vehicleDetailsContainer.innerHTML = `<p class="text-center text-red-500 col-span-2">${error.message}</p>`;
      statusSelect.disabled = true;
    }
  };

  /**
   * **BARU**: Fungsi untuk menangani perubahan status
   */
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (!currentAmbulanceId) return; // Jangan lakukan apa-apa jika tidak ada ID

    // Nonaktifkan dropdown sementara untuk mencegah perubahan ganda
    statusSelect.disabled = true;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${AMBULANCE_API_BASE_URL}${currentAmbulanceId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }), // Kirim status baru
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      // Beri notifikasi sukses (jika Anda punya fungsi snackbar)
      // showSnackbar("Status ambulans berhasil diperbarui!", "success");
      console.log("Status berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal memperbarui status:", error.message);
      // Kembalikan ke status awal jika gagal (opsional)
      // loadVehicleData();
      // showSnackbar("Gagal memperbarui status. Cek konsol.", "error");
    } finally {
      // Aktifkan kembali dropdown setelah selesai
      statusSelect.disabled = false;
    }
  };

  // **BARU**: Tambahkan event listener ke dropdown status
  statusSelect.addEventListener("change", handleStatusChange);

  // Panggil fungsi utama saat halaman dimuat
  loadVehicleData();
});
