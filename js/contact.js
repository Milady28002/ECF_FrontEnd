const apiUrl = "http://127.0.0.1:8000/api/";
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    contactMessage.textContent = "";
    contactMessage.className = "mt-3";

    const titre = document.getElementById("titre").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!titre || !email || !message) {
      contactMessage.textContent = "Tous les champs sont obligatoires.";
      contactMessage.classList.add("text-danger");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titre,
          email,
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message.");
      }

      contactMessage.textContent = data.message || "Votre message a bien été envoyé.";
      contactMessage.classList.add("text-success");
      contactForm.reset();

    } catch (error) {
      contactMessage.textContent = error.message || "Une erreur est survenue.";
      contactMessage.classList.add("text-danger");
    }
  });
}