const API_BASE_URL = "http://localhost:8000";

function showSnackbar(message, type = "info") {
  const snackbar = document.getElementById("snackbar");
  const snackbarMessage = document.getElementById("snackbarMessage");

  if (!snackbar || !snackbarMessage) {
    console.warn("Snackbar elements not found.");
    return;
  }

  snackbarMessage.textContent = message;

  snackbar.classList.remove("success", "error", "info");
  snackbar.classList.add(type);
  snackbar.style.display = "flex";

  setTimeout(() => {
    snackbar.classList.add("show");
  }, 10);

  setTimeout(function () {
    snackbar.classList.remove("show");
    setTimeout(() => {
      snackbar.style.display = "none";
    }, 400);
  }, 3000);
}
