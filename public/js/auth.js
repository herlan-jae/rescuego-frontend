function togglePassword(eyeIconId, passwordInputId, eyeOnSrc, eyeOffSrc) {
  const passwordInput = document.getElementById(passwordInputId);
  const eyeIcon = document.getElementById(eyeIconId);

  if (!passwordInput || !eyeIcon) {
    console.warn(`Element with ID '${passwordInputId}' or '${eyeIconId}' not found.`);
    return;
  }

  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");

  eyeIcon.src = isPassword ? eyeOffSrc : eyeOnSrc;
}

function handleLoginFormSubmit(loginFormId, emailInputId, passwordInputId, errorMsgId, redirectUrl) {
  const loginForm = document.getElementById(loginFormId);
  const loginButton = document.getElementById("loginButton");
  const buttonText = document.getElementById("buttonText");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const errorMsg = document.getElementById(errorMsgId);

  if (!loginForm || !loginButton || !buttonText || !loadingSpinner || !errorMsg) {
    console.warn("One or more login form elements (button, spinner, etc.) not found. Check IDs in HTML.");
    return;
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById(emailInputId)?.value.trim();
    const password = document.getElementById(passwordInputId)?.value.trim();

    errorMsg.classList.add("hidden");

    if (!email || !password) {
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = "Email and password are required.";
      showSnackbar("Email and password are required!", "error");
      return;
    }

    buttonText.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");
    loginButton.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        const accessToken = data.tokens.access;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          if (data.tokens && data.tokens.refresh) {
            localStorage.setItem("refreshToken", data.tokens.refresh);
          }
          console.log("Login successful! Access Token:", accessToken);
          showSnackbar("Login berhasil!", "success");

          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        } else {
          const msg = "Login successful, but no access token received (unexpected API response).";
          errorMsg.classList.remove("hidden");
          errorMsg.textContent = msg;
          showSnackbar(msg, "error");
          console.error("Login successful, but no access token received:", data);
        }
      } else {
        let errorMessage = "Login failed. Please check your credentials.";
        if (data && data.detail) {
          errorMessage = data.detail;
        } else if (data && typeof data === "object") {
          errorMessage = Object.values(data).flat().join(" ") || errorMessage;
        }

        errorMsg.classList.remove("hidden");
        errorMsg.textContent = errorMessage;
        showSnackbar(errorMessage, "error");
        console.error("Login failed:", response.status, data);
      }
    } catch (error) {
      const msg = `Network error or server unavailable: ${error.message}`;
      errorMsg.classList.remove("hidden");
      errorMsg.textContent = msg;
      showSnackbar(msg, "error");
      console.error("Network or server error during login:", error);
    } finally {
      buttonText.classList.remove("hidden");
      loadingSpinner.classList.add("hidden");
      loginButton.disabled = false;
    }
  });
}
