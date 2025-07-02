document.addEventListener("DOMContentLoaded", function () {
  // Ambil elemen-elemen yang diperlukan dari DOM
  const addAmbulanceOverlay = document.getElementById("addAmbulanceOverlay");
  const addAmbulanceForm = document.getElementById("addAmbulanceForm");
  const cancelAddAmbulanceBtn = document.getElementById("cancelAddAmbulance");
  const showAddAmbulanceBtn = document.getElementById("showAddAmbulanceForm");
  const ambulanceTableBody = document.getElementById("ambulanceTableBody");

  // --- Logika untuk Menampilkan/Menyembunyikan Popup ---
  // Tampilkan popup saat tombol "+ Tambah" diklik
  if (showAddAmbulanceBtn) {
    showAddAmbulanceBtn.addEventListener("click", () => {
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "flex";
      }
    });
  }

  // Sembunyikan popup saat tombol "Batal" diklik
  if (cancelAddAmbulanceBtn) {
    cancelAddAmbulanceBtn.addEventListener("click", () => {
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }
    });
  }

  // Sembunyikan popup saat area di luar popup diklik
  if (addAmbulanceOverlay) {
    addAmbulanceOverlay.addEventListener("click", (e) => {
      if (e.target === addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }
    });
  }

  // --- Logika untuk Menangani Pengiriman Formulir ---
  if (addAmbulanceForm) {
    addAmbulanceForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Mencegah form dari pengiriman standar

      // Ambil data dari form
      const formData = new FormData(addAmbulanceForm);
      const data = Object.fromEntries(formData.entries());

      // Tentukan ID baru (berdasarkan baris terakhir + 1)
      const lastRow = ambulanceTableBody.lastElementChild;
      const newId = lastRow ? parseInt(lastRow.cells[0].textContent) + 1 : 1;

      // Buat baris tabel baru
      const newRow = ambulanceTableBody.insertRow();

      // Isi sel dengan data dari form
      newRow.innerHTML = `
        <td>${newId}</td>
        <td>${data.license_plate}</td>
        <td>${data.type}</td>
        <td>${data.brand} ${data.model}</td>
        <td class="status-cell">${
          data.status.charAt(0).toUpperCase() + data.status.slice(1)
        }</td>
        <td>${data.city}</td>
        <td><span class="link-detail">Lihat</span></td>
      `;

      // Reset form setelah data ditambahkan
      addAmbulanceForm.reset();

      // Sembunyikan popup
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }

      // TODO: Tambahkan event listener untuk tombol "Lihat" pada baris baru jika diperlukan
      // Anda mungkin perlu memfaktorkan ulang logika popup detail agar bisa diterapkan pada baris baru.
    });
  }
});