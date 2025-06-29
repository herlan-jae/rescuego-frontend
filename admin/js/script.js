document.addEventListener("DOMContentLoaded", () => {
    // === Login Toggle Password ===
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");

    if (passwordInput && toggleIcon) {
        toggleIcon.addEventListener("click", () => {
            const isVisible = passwordInput.type === "text";
            passwordInput.type = isVisible ? "password" : "text";
            toggleIcon.src = isVisible
                ? "assets/images/eye.svg"
                : "assets/images/eye-off.svg";
        });
    }

    // === Reservation Popup ===
    const popupOverlay = document.getElementById("popupOverlay");
    const closeBtn = document.getElementById("closePopupBtn");
    const lihatLinks = document.querySelectorAll(".link-detail");
    const statusSelect = document.getElementById("status");
    const statusText = document.getElementById("statusText");

    let currentStatusCell = null;

    lihatLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            popupOverlay.style.display = "flex";

            const row = e.target.closest("tr");
            currentStatusCell = row.querySelector(".status-cell");

            if (currentStatusCell) {
                const currentStatus = currentStatusCell.textContent.trim();
                statusSelect.value = currentStatus;
                statusText.textContent = currentStatus;
            }
        });
    });

    closeBtn.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });

    if (statusSelect && statusText) {
        statusSelect.addEventListener("change", () => {
            const newStatus = statusSelect.value;
            statusText.textContent = newStatus;

            if (currentStatusCell) {
                currentStatusCell.textContent = newStatus;
            }
        });
    }
});

// === Hamburger ===
document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("burgerMenu");
    const sidebar = document.querySelector(".sidebar-white");
    const overlay = document.getElementById("sidebarOverlay");

    if (burger && sidebar && overlay) {
        burger.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    document.getElementById("logoutModal").classList.add("show");

    document.querySelector(".sidebar-white")?.classList.remove("active");
    document.getElementById("sidebarOverlay")?.classList.remove("active");
});