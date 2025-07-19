// public/js/apiHelper.js

/**
 * Fungsi pembantu terpusat untuk melakukan panggilan API.
 * Secara otomatis menambahkan Authorization header dan menangani error umum.
 *
 * @param {string} url - URL endpoint API.
 * @param {object} options - Opsi untuk fetch (method, body, dll.).
 * @param {string} redirectUrl - URL untuk redirect jika token tidak valid (401).
 * @returns {Promise<object>} - Data JSON dari respons API.
 * @throws {Error} - Melempar error jika respons tidak ok.
 */
async function apiFetch(url, options = {}, redirectUrl = "login_screen.html") {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    showSnackbar("Sesi Anda telah berakhir. Silakan login kembali.", "error");
    setTimeout(() => (window.location.href = redirectUrl), 1000);
    // Melempar error untuk menghentikan eksekusi selanjutnya
    throw new Error("No access token found.");
  }

  // Gabungkan header default dengan header kustom dari options
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      showSnackbar("Sesi Anda tidak valid. Silakan login kembali.", "error");
      setTimeout(() => (window.location.href = redirectUrl), 1000);
      throw new Error("Unauthorized");
    }

    // Coba parse JSON bahkan jika response tidak 'ok' untuk mendapatkan detail error dari body
    const data = await response.json();

    if (!response.ok) {
      // Ambil pesan error dari backend jika ada, jika tidak gunakan status teks
      const errorMessage = data.detail || Object.values(data).flat().join("; ") || response.statusText;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Tangkap error jaringan atau error yang sudah kita lempar sebelumnya
    console.error(`API Fetch Error to ${url}:`, error);
    // Lempar kembali error agar bisa ditangani oleh fungsi pemanggil
    throw error;
  }
}
