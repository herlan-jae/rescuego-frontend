document.addEventListener("DOMContentLoaded", () => {
  if (typeof API_BASE_URL === "undefined") {
    console.error("API_BASE_URL tidak ditemukan. Pastikan utils.js sudah dimuat.");
    return;
  }

  const API_PROFILE_URL = `${API_BASE_URL}/accounts/api/profile/`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/src/auth/login.html";
    return;
  }

  const profileForm = document.getElementById("profileForm");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  let initialProfileData = {};

  const inputs = {
    phone_number: document.getElementById("phone_number"),
    date_of_birth: document.getElementById("date_of_birth"),
    city: document.getElementById("city"),
    address: document.getElementById("address"),
    emergency_contact_name: document.getElementById("emergency_contact_name"),
    emergency_contact_phone: document.getElementById("emergency_contact_phone"),
  };

  const getCurrentFormData = () => {
    return {
      phone_number: inputs.phone_number.value || "",
      date_of_birth: inputs.date_of_birth.value || null,
      city: inputs.city.value || "",
      address: inputs.address.value || "",
      emergency_contact_name: inputs.emergency_contact_name.value || "",
      emergency_contact_phone: inputs.emergency_contact_phone.value || "",
    };
  };

  const checkForChanges = () => {
    const currentData = getCurrentFormData();
    const hasChanged = JSON.stringify(initialProfileData) !== JSON.stringify(currentData);
    saveBtn.disabled = !hasChanged;
    cancelBtn.disabled = !hasChanged;
  };

  const populateForm = (data) => {
    document.getElementById("username").value = data.username || "";
    document.getElementById("full_name").value = data.full_name || "";
    document.getElementById("email").value = data.email || "";
    inputs.phone_number.value = data.phone_number || "";
    inputs.date_of_birth.value = data.date_of_birth || "";
    inputs.city.value = data.city || "";
    inputs.address.value = data.address || "";
    inputs.emergency_contact_name.value = data.emergency_contact_name || "";
    inputs.emergency_contact_phone.value = data.emergency_contact_phone || "";
  };

  const loadProfileData = async () => {
    saveBtn.disabled = true;
    cancelBtn.disabled = true;

    try {
      const response = await fetch(API_PROFILE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        window.location.href = "/src/auth/login.html";
        return;
      }
      if (!response.ok) {
        throw new Error("Gagal memuat data profil.");
      }

      const data = await response.json();
      populateForm(data);
      initialProfileData = getCurrentFormData();
      checkForChanges();
    } catch (error) {
      console.error("Error loading profile:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan...";

    const dataToUpdate = getCurrentFormData();

    try {
      const response = await fetch(API_PROFILE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).join("\n");
        throw new Error(errorMessage || "Gagal menyimpan perubahan.");
      }

      // Tampilkan notifikasi dan muat ulang data (hanya satu kali)
      showSnackbar("Data berhasil diperbarui!", "success");
      await loadProfileData();
    } catch (error) {
      console.error("Error saving profile:", error);
      showSnackbar(error.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Simpan Perubahan";
      checkForChanges();
    }
  };

  // --- Event Listeners ---
  profileForm.addEventListener("submit", handleSaveProfile);
  cancelBtn.addEventListener("click", loadProfileData);
  profileForm.addEventListener("input", checkForChanges);

  // --- Initial Setup ---
  loadProfileData();

  if (typeof setupLogoutModal === "function") {
    setupLogoutModal("/src/auth/login.html");
  } else {
    console.error("Fungsi setupLogoutModal tidak ditemukan. Pastikan logoutModal.js sudah dimuat dengan benar.");
  }
});
