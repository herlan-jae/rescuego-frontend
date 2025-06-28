document.addEventListener("DOMContentLoaded", function () {
  const openButtons = document.querySelectorAll(".open-detail");
  const modal = document.getElementById("requestDetailModal");
  const closeButton = document.getElementById("closeDetail");
  const mainContent = document.getElementById("mainContent");

  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.remove("hidden");
      setTimeout(() => {
        modal
          .querySelector("#modalBox")
          .classList.remove("opacity-0", "scale-95");
      }, 10);

      mainContent.classList.add(
        "blur-sm",
        "pointer-events-none",
        "select-none"
      );
    });
  });

  closeButton.addEventListener("click", () => {
    modal.querySelector("#modalBox").classList.add("opacity-0", "scale-95");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 200);

    mainContent.classList.remove(
      "blur-sm",
      "pointer-events-none",
      "select-none"
    );
  });
});
