const horairesAdminContainer = document.getElementById("horaires-admin-list");
const horairesAdminFeedback = document.getElementById("horaires-admin-feedback");

function showHorairesAdminFeedback(message, isError = false) {
  if (!horairesAdminFeedback) return;

  horairesAdminFeedback.innerHTML = `
    <div class="alert ${isError ? "alert-danger" : "alert-success"}" role="alert">
      ${message}
    </div>
  `;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  return null;
}

function getToken() {
  return getCookie("accesstoken");
}

function sanitizeHtml(text) {
  const temp = document.createElement("div");
  temp.textContent = text ?? "";
  return temp.innerHTML;
}

async function loadHorairesAdmin() {
  if (!horairesAdminContainer) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/horaires/`);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des horaires.");
    }

    const horaires = await response.json();

    if (!Array.isArray(horaires) || horaires.length === 0) {
      horairesAdminContainer.innerHTML = "<p>Aucun horaire disponible.</p>";
      return;
    }

    horairesAdminContainer.innerHTML = horaires.map((horaire) => `
      <form class="card p-3 mb-3 horaire-admin-form" data-id="${horaire.id}">
        <div class="row g-3 align-items-end">
          <div class="col-12 col-md-4">
            <label class="form-label" for="jour-${horaire.id}">Jour</label>
            <input
              type="text"
              id="jour-${horaire.id}"
              name="jour"
              class="form-control"
              value="${sanitizeHtml(horaire.jour)}"
              required
            >
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label" for="ouverture-${horaire.id}">Ouverture</label>
            <input
              type="text"
              id="ouverture-${horaire.id}"
              name="heure_ouverture"
              class="form-control"
              value="${sanitizeHtml(horaire.heure_ouverture)}"
              required
            >
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label" for="fermeture-${horaire.id}">Fermeture</label>
            <input
              type="text"
              id="fermeture-${horaire.id}"
              name="heure_fermeture"
              class="form-control"
              value="${sanitizeHtml(horaire.heure_fermeture)}"
              required
            >
          </div>

          <div class="col-12 col-md-2">
            <button type="submit" class="btn btn-primary w-100">
              Enregistrer
            </button>
          </div>
        </div>
      </form>
    `).join("");

    initHorairesAdminForms();
  } catch (error) {
    console.error("Erreur chargement horaires admin :", error);
    horairesAdminContainer.innerHTML = "<p>Impossible de charger les horaires.</p>";
  }
}

function initHorairesAdminForms() {
  const forms = document.querySelectorAll(".horaire-admin-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = getToken();

      if (!token) {
        window.location.hash = "#/signin";
        return;
      }

      const horaireId = form.dataset.id;
      const jour = form.querySelector('[name="jour"]')?.value.trim();
      const heureOuverture = form.querySelector('[name="heure_ouverture"]')?.value.trim();
      const heureFermeture = form.querySelector('[name="heure_fermeture"]')?.value.trim();

      try {
        const response = await fetch(`${API_BASE_URL}/api/horaires/${horaireId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": token
          },
          body: JSON.stringify({
            jour,
            heure_ouverture: heureOuverture,
            heure_fermeture: heureFermeture
          })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          showHorairesAdminFeedback(
            data?.message || "Erreur lors de la mise à jour de l’horaire.",
            true
          );
          return;
        }

        showHorairesAdminFeedback("Horaire mis à jour avec succès.");
        loadHorairesAdmin();

        if (typeof loadFooterHoraires === "function") {
        loadFooterHoraires();
        }
            } catch (error) {
                console.error("Erreur mise à jour horaire :", error);
                showHorairesAdminFeedback("Une erreur réseau est survenue.", true);
            }
    });
  });
}

loadHorairesAdmin();