const API_RESET_PASSWORD_URL = "http://127.0.0.1:8000/api/reset-password";

const resetPasswordForm = document.getElementById("resetPasswordForm");
const passwordInput = document.getElementById("PasswordInput");
const validatePasswordInput = document.getElementById("ValidatePasswordInput");
const resetPasswordMessage = document.getElementById("resetPasswordMessage");
const passwordMatchMessage = document.getElementById("passwordMatchMessage");


function checkPasswordsMatch() {
  const password = passwordInput?.value || "";
  const confirmPassword = validatePasswordInput?.value || "";

  if (!password && !confirmPassword) {
    passwordMatchMessage.textContent = "";
    return;
  }

  if (password === confirmPassword) {
    passwordMatchMessage.textContent = "Les mots de passe correspondent ✔️";
    passwordMatchMessage.classList.remove("text-danger");
    passwordMatchMessage.classList.add("text-success");

    validatePasswordInput.classList.remove("is-invalid");
    validatePasswordInput.classList.add("is-valid");
  } else {
    passwordMatchMessage.textContent = "Les mots de passe ne correspondent pas ❌";
    passwordMatchMessage.classList.remove("text-success");
    passwordMatchMessage.classList.add("text-danger");

    validatePasswordInput.classList.remove("is-valid");
    validatePasswordInput.classList.add("is-invalid");
  }
}

// Récupération du token
function getTokenFromUrl() {
  const hash = window.location.hash;
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);

  return params.get("token");
}


passwordInput?.addEventListener("input", checkPasswordsMatch);
validatePasswordInput?.addEventListener("input", checkPasswordsMatch);


resetPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = getTokenFromUrl();
  const password = passwordInput?.value.trim() || "";
  const confirmPassword = validatePasswordInput?.value.trim() || "";

  resetPasswordMessage.classList.remove("text-success", "text-danger");

  if (!token) {
    resetPasswordMessage.textContent = "Token de réinitialisation introuvable.";
    resetPasswordMessage.classList.add("text-danger");
    return;
  }

  if (!password || !confirmPassword) {
    resetPasswordMessage.textContent = "Veuillez renseigner les deux champs.";
    resetPasswordMessage.classList.add("text-danger");
    return;
  }

  if (password !== confirmPassword) {
    resetPasswordMessage.textContent = "Les mots de passe ne correspondent pas.";
    resetPasswordMessage.classList.add("text-danger");
    return;
  }

  try {
    const response = await fetch(API_RESET_PASSWORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        password
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      resetPasswordMessage.textContent =
        data?.message || "Erreur lors de la réinitialisation.";
      resetPasswordMessage.classList.add("text-danger");
      return;
    }

    resetPasswordMessage.textContent =
      "Mot de passe modifié avec succès. Redirection en cours...";
    resetPasswordMessage.classList.add("text-success");

    resetPasswordForm.reset();

    setTimeout(() => {
      window.location.hash = "#/signin";
    }, 2000);

  } catch (error) {
    console.error("Erreur reset-password :", error);
    resetPasswordMessage.textContent = "Erreur réseau.";
    resetPasswordMessage.classList.add("text-danger");
  }
});