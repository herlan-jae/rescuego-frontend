document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("text-[#5B2EFF]", "font-semibold");
      link
        .querySelector(".nav-icon")
        .parentElement.classList.add("bg-[#EFE8FF]", "p-2", "rounded-full");
    } else {
      link.classList.add("text-gray-500");
    }
  });
});
