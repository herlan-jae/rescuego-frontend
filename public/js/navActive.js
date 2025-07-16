// public/js/navActive.js

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.pathname.split("/").pop(); // Mengambil nama file dari URL saat ini

  document.querySelectorAll(".nav-link").forEach((link) => {
    // Membandingkan href tautan dengan nama file halaman saat ini
    if (link.getAttribute("href") === currentPage) {
      // Menambahkan kelas untuk tautan aktif
      link.classList.add("text-[#5B2EFF]", "font-semibold");

      // Menambahkan kelas untuk ikon navigasi yang aktif (parent dari .nav-icon)
      const navIconParent = link.querySelector(".nav-icon")?.parentElement;
      if (navIconParent) {
        navIconParent.classList.add("bg-[#EFE8FF]", "p-2", "rounded-full");
      }
    } else {
      // Menambahkan kelas untuk tautan non-aktif
      link.classList.add("text-gray-500");
    }
  });
});
