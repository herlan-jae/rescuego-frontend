document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const toast = document.getElementById("toastSuccess");

  saveBtn.addEventListener("click", () => {
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 2500);
  });

  cancelBtn.addEventListener("click", () => {
    location.reload(); // Reset semua field ke kondisi awal
  });
});
