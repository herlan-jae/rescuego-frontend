function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  eyeIcon.src = isPassword
    ? "assets/img/eye-pass-off-button.svg"
    : "assets/img/eye-pass-button.svg";
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
    // Simulasi login berhasil, redirect ke dashboard
    window.location.href = "dashboard.html";
  }
});
