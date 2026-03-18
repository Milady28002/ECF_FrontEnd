function getMenuIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function formatPrice(price) {
  return `${Number(price).toFixed(2).replace(".", ",")} € / personne`;
}

function formatTotal(amount) {
  return `${Number(amount).toFixed(2).replace(".", ",")} €`;
}

function getToken() {
  return localStorage.getItem("token");
}

async function loadCommandeMenu() {
  const menuId = getMenuIdFromUrl();
  const container = document.getElementById("commande-menu-container");

  if (!container) return;

  if (!menuId) {
    container.innerHTML = "<p>Aucun menu sélectionné.</p>";
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/menus/${menuId}`);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement du menu");
    }

    const menu = await response.json();
    renderCommandeMenu(menu);
  } catch (error) {
    console.error("Erreur chargement commande :", error);
    container.innerHTML = "<p>Impossible de charger le menu sélectionné.</p>";
  }
}

function renderCommandeMenu(menu) {
  const container = document.getElementById("commande-menu-container");
  if (!container) return;

  const stockDisponible = Number(menu.quantite_restante) > 0;

  container.innerHTML = `
    <article class="commande-card">
      <h1>Commander ce menu</h1>

      <div class="commande-card_resume">
        <h2>${menu.titre}</h2>
        <p>${menu.description ?? "Aucune description disponible."}</p>
        <p><strong>Prix :</strong> ${formatPrice(menu.prix_par_personne)}</p>
        <p><strong>Minimum :</strong> ${menu.nombre_personne_minimum} personnes</p>
        <p><strong>Stock disponible :</strong> ${menu.quantite_restante}</p>
      </div>

      ${
        stockDisponible
          ? `
          <form class="commande-form" id="commande-form">
            <div class="mb-3">
              <label for="nb-personnes" class="form-label">Nombre de personnes</label>
              <input
                type="number"
                id="nb-personnes"
                class="form-control"
                min="${menu.nombre_personne_minimum}"
                max="${menu.quantite_restante}"
                value="${menu.nombre_personne_minimum}"
                required
              >
            </div>

            <p class="commande-total">
              Total estimé :
              <span id="commande-total-value">
                ${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}
              </span>
            </p>

            <div class="commande-resume">
              <h2>Résumé de la commande</h2>
              <p><strong>Menu :</strong> ${menu.titre}</p>
              <p><strong>Prix par personne :</strong> ${formatPrice(menu.prix_par_personne)}</p>
              <p><strong>Nombre de personnes :</strong> <span id="resume-nb-personnes">${menu.nombre_personne_minimum}</span></p>
              <p><strong>Adresse :</strong> <span id="resume-adresse">Non renseignée</span></p>
              <p><strong>Prêt de matériel :</strong> <span id="resume-pret-materiel">Non</span></p>
              <p><strong>Total :</strong> <span id="resume-total">${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}</span></p>
            </div>

            <div class="mb-3">
              <label for="adresse-prestation" class="form-label">Adresse de la prestation</label>
              <input
                type="text"
                id="adresse-prestation"
                class="form-control"
                placeholder="Ex. 12 rue des Lilas, 33000 Bordeaux"
                required
              >
            </div>

            <div class="mb-3">
              <label for="date-evenement" class="form-label">Date de l’événement</label>
              <input type="date" id="date-evenement" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="heure-livraison" class="form-label">Heure de livraison souhaitée</label>
              <input type="time" id="heure-livraison" class="form-control" required>
            </div>

            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="pret-materiel">
              <label class="form-check-label" for="pret-materiel">
                Je souhaite une réservation / un prêt de matériel
              </label>
            </div>

            <div class="mb-3">
              <label for="message-client" class="form-label">Message</label>
              <textarea
                id="message-client"
                class="form-control"
                rows="4"
                placeholder="Précisez votre besoin, vos contraintes, vos préférences..."
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" id="submit-commande-btn">
              Valider la commande
            </button>

            <div id="commande-feedback" class="mt-3"></div>
          </form>
          `
          : `
            <div class="commande-stock-alert">
              Menu complet – contactez-nous.
            </div>
          `
      }

      <div class="commande-card_actions">
        <a href="#/menu-detail?id=${menu.id}" class="btn btn-outline-success">
          ← Retour au détail
        </a>
      </div>
    </article>
  `;

  if (stockDisponible) {
    initCommandeTotal(
      Number(menu.prix_par_personne),
      Number(menu.nombre_personne_minimum)
    );
    initCommandeForm(menu);
  }
}

function initCommandeTotal(prixParPersonne, minimum) {
  const input = document.getElementById("nb-personnes");
  const totalValue = document.getElementById("commande-total-value");
  const resumeNbPersonnes = document.getElementById("resume-nb-personnes");
  const resumeTotal = document.getElementById("resume-total");
  const adresseInput = document.getElementById("adresse-prestation");
  const resumeAdresse = document.getElementById("resume-adresse");
  const pretMaterielInput = document.getElementById("pret-materiel");
  const resumePretMateriel = document.getElementById("resume-pret-materiel");

  if (!input || !totalValue || !resumeNbPersonnes || !resumeTotal) return;

  const updateTotal = () => {
    let nbPersonnes = Number(input.value);

    if (Number.isNaN(nbPersonnes) || nbPersonnes < minimum) {
      nbPersonnes = minimum;
      input.value = minimum;
    }

    const total = nbPersonnes * prixParPersonne;

    totalValue.textContent = formatTotal(total);
    resumeNbPersonnes.textContent = nbPersonnes;
    resumeTotal.textContent = formatTotal(total);
  };

  const updateAdresseResume = () => {
    if (!adresseInput || !resumeAdresse) return;
    const adresse = adresseInput.value.trim();
    resumeAdresse.textContent = adresse || "Non renseignée";
  };

  const updatePretMaterielResume = () => {
    if (!pretMaterielInput || !resumePretMateriel) return;
    resumePretMateriel.textContent = pretMaterielInput.checked ? "Oui" : "Non";
  };

  input.addEventListener("input", updateTotal);
  adresseInput?.addEventListener("input", updateAdresseResume);
  pretMaterielInput?.addEventListener("change", updatePretMaterielResume);

  updateTotal();
  updateAdresseResume();
  updatePretMaterielResume();
}

function showFeedback(message, isError = true) {
  const feedback = document.getElementById("commande-feedback");
  if (!feedback) return;

  feedback.innerHTML = `
    <div class="alert ${isError ? "alert-danger" : "alert-success"}" role="alert">
      ${message}
    </div>
  `;
}

function getErrorMessageFromResponse(data, fallbackMessage) {
  if (data && typeof data === "object" && data.message) {
    return data.message;
  }
  return fallbackMessage;
}

function initCommandeForm(menu) {
  const form = document.getElementById("commande-form");
  if (!form) {
    console.error("Formulaire introuvable");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = window.getToken ? window.getToken() : getToken();

    if (!token) {
      window.location.hash = "#/signin";
      return;
    }

    const submitButton = document.getElementById("submit-commande-btn");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";
    }

    try {
      const nombrePersonnes = Number(document.getElementById("nb-personnes")?.value);
      const dateEvenement = document.getElementById("date-evenement")?.value.trim();
      const heureLivraison = document.getElementById("heure-livraison")?.value.trim();
      const adresseLivraison = document.getElementById("adresse-prestation")?.value.trim();
      const messageClient = document.getElementById("message-client")?.value.trim();
      const pretMateriel = document.getElementById("pret-materiel")?.checked || false;

      if (!dateEvenement) {
        showFeedback("La date de l’événement est obligatoire.");
        return;
      }

      if (!heureLivraison) {
        showFeedback("L’heure de livraison est obligatoire.");
        return;
      }

      if (!adresseLivraison) {
        showFeedback("L’adresse de la prestation est obligatoire.");
        return;
      }

      const payload = {
        menu_id: Number(menu.id),
        nombre_personnes: nombrePersonnes,
        date_prestation: dateEvenement,
        heure_livraison: heureLivraison,
        prix_livraison: 0,
        pret_materiel: pretMateriel,
        restitution_materiel: false,
        adresse_livraison: adresseLivraison,
        message: messageClient || null
      };

      const response = await fetch("http://127.0.0.1:8000/api/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": token
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          window.location.hash = "#/signin";
          return;
        }

        if (response.status === 403) {
          showFeedback("Accès refusé.");
          return;
        }

        if (response.status === 404) {
          showFeedback(getErrorMessageFromResponse(data, "Menu introuvable."));
          return;
        }

        if (response.status === 422) {
          showFeedback(getErrorMessageFromResponse(data, "Données invalides."));
          return;
        }

        showFeedback(getErrorMessageFromResponse(data, "Erreur lors de l’enregistrement de la commande."));
        return;
      }

      showFeedback("Commande enregistrée avec succès.", false);

      setTimeout(() => {
        window.location.hash = "#/mes-commandes";
      }, 1200);

    } catch (error) {
      console.error("Erreur envoi commande :", error);
      showFeedback("Une erreur réseau est survenue.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Valider la commande";
      }
    }
  });
}

loadCommandeMenu();