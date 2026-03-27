const API_FORGOT_PASSWORD_URL = "http://127.0.0.1:8000/api/forgot-password";

const form = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("ForgotEmailInput");
const message = document.getElementById("forgotPasswordMessage");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim() || "";

  if (!email) {
    message.textContent = "Veuillez renseigner votre adresse email.";
    return;
  }

  try {
    const response = await fetch(API_FORGOT_PASSWORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      message.textContent = data?.message || "Une erreur est survenue.";
      return;
    }

    message.textContent =
      data?.message ||
      "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.";

    form.reset();
  } catch (error) {
    console.error("Erreur forgot-password :", error);
    message.textContent = "Erreur réseau.";
  }
});