document.addEventListener("DOMContentLoaded", function () {
  // Ambil elemen-elemen yang diperlukan dari DOM
  const addDriverOverlay = document.getElementById("addDriverOverlay");
  const addDriverForm = document.getElementById("addDriverForm");
  const cancelAddDriverBtn = document.getElementById("cancelAddDriver");
  const showAddDriverBtn = document.getElementById("showAddDriverForm");
  const driverTableBody = document.getElementById("driverTableBody");

  // --- Logika untuk Menampilkan/Menyembunyikan Popup ---
  // Tampilkan popup saat tombol "+ Tambah" diklik
  if (showAddDriverBtn) {
    showAddDriverBtn.addEventListener("click", () => {
      if (addDriverOverlay) {
        addDriverOverlay.style.display = "flex";
      }
    });
  }

  // Sembunyikan popup saat tombol "Batal" diklik
  if (cancelAddDriverBtn) {
    cancelAddDriverBtn.addEventListener("click", () => {
      if (addDriverOverlay) {
        addDriverOverlay.style.display = "none";
      }
    });
  }

  // Sembunyikan popup saat area di luar popup diklik
  if (addDriverOverlay) {
    addDriverOverlay.addEventListener("click", (e) => {
      if (e.target === addDriverOverlay) {
        addDriverOverlay.style.display = "none";
      }
    });
  }

  // --- Logika untuk Menangani Pengiriman Formulir ---
  if (addDriverForm) {
    addDriverForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Mencegah form dari pengiriman standar

      const formData = new FormData(addDriverForm);
      const data = Object.fromEntries(formData.entries());

      const lastRow = driverTableBody.lastElementChild;
      const newId = lastRow ? parseInt(lastRow.cells[0].textContent) + 1 : 1;

      const newRow = driverTableBody.insertRow();
      newRow.innerHTML = `
        <td>${newId}</td>
        <td>${data.fullname}</td>
        <td>${data.sim}</td>
        <td class="status-cell">${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</td>
        <td>${data.city}</td>
        <td><span class="link-detail">Lihat</span></td>
      `;

      addDriverForm.reset();
      addDriverOverlay.style.display = "none";
    });
  }
});