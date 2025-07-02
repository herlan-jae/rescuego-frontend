document.addEventListener("DOMContentLoaded", function () {
  const addDriverOverlay = document.getElementById("addDriverOverlay");
  const addDriverForm = document.getElementById("addDriverForm");
  const cancelAddDriverBtn = document.getElementById("cancelAddDriver");
  const showAddDriverBtn = document.getElementById("showAddDriverForm");
  const driverTableBody = document.getElementById("driverTableBody");

  if (showAddDriverBtn) {
    showAddDriverBtn.addEventListener("click", () => {
      if (addDriverOverlay) {
        addDriverOverlay.style.display = "flex";
      }
    });
  }
  if (cancelAddDriverBtn) {
    cancelAddDriverBtn.addEventListener("click", () => {
      if (addDriverOverlay) {
        addDriverOverlay.style.display = "none";
      }
    });
  }
  if (addDriverOverlay) {
    addDriverOverlay.addEventListener("click", (e) => {
      if (e.target === addDriverOverlay) {
        addDriverOverlay.style.display = "none";
      }
    });
  }
  if (addDriverForm) {
    addDriverForm.addEventListener("submit", function (e) {
      e.preventDefault();

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