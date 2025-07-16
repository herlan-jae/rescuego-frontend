document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const toast = document.getElementById("toastSuccess");

  if (!saveBtn || !cancelBtn || !toast) {
    console.warn("One or more profile toast elements not found. Skipping toast setup.");
    return;
  }

  saveBtn.addEventListener("click", () => {
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
  });

  cancelBtn.addEventListener("click", () => {
    location.reload();
  });
});
