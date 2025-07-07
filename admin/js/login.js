function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");

  eyeIcon.src = isPassword ? "assets/img/eye-off.svg" : "assets/img/eye.svg";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (!email || !password) {
    errorMsg.classList.remove("hidden");
  } else {
    errorMsg.classList.add("hidden");
    window.location.href = "dashboard_screen.html";
  }
});
