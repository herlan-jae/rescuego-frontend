document.addEventListener("DOMContentLoaded", function () {
  const addAmbulanceOverlay = document.getElementById("addAmbulanceOverlay");
  const addAmbulanceForm = document.getElementById("addAmbulanceForm");
  const cancelAddAmbulanceBtn = document.getElementById("cancelAddAmbulance");
  const showAddAmbulanceBtn = document.getElementById("showAddAmbulanceForm");
  const ambulanceTableBody = document.getElementById("ambulanceTableBody");

  if (showAddAmbulanceBtn) {
    showAddAmbulanceBtn.addEventListener("click", () => {
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "flex";
      }
    });
  }

  if (cancelAddAmbulanceBtn) {
    cancelAddAmbulanceBtn.addEventListener("click", () => {
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }
    });
  }

  if (addAmbulanceOverlay) {
    addAmbulanceOverlay.addEventListener("click", (e) => {
      if (e.target === addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }
    });
  }

  if (addAmbulanceForm) {
    addAmbulanceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(addAmbulanceForm);
      const data = Object.fromEntries(formData.entries());
      const lastRow = ambulanceTableBody.lastElementChild;
      const newId = lastRow ? parseInt(lastRow.cells[0].textContent) + 1 : 1;
      const newRow = ambulanceTableBody.insertRow();

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
      addAmbulanceForm.reset();
      if (addAmbulanceOverlay) {
        addAmbulanceOverlay.style.display = "none";
      }
    });
  }
});