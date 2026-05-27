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

function isValidAdresseLivraison(adresse) {
  if (!adresse) return false;

  const adresseNettoyee = adresse.trim();
  const regex = /^\d+\s+.+,\s*\d{5}\s+.+$/i;

  return regex.test(adresseNettoyee);
}

function calculateLivraison(adresse) {
  if (!adresse) return 0;

  const a = adresse.toLowerCase();

  if (a.includes("bordeaux") || a.includes("33000")) return 0;

  let distanceKm = 10;

  if (a.includes("merignac") || a.includes("33700")) {
    distanceKm = 8;
  } else if (a.includes("pessac") || a.includes("33600")) {
    distanceKm = 7;
  } else if (a.includes("talence") || a.includes("33400")) {
    distanceKm = 6;
  } else if (a.includes("eysines") || a.includes("33320")) {
    distanceKm = 9;
  } else if (a.includes("blanquefort") || a.includes("33290")) {
    distanceKm = 12;
  } else if (a.includes("le bouscat") || a.includes("33110")) {
    distanceKm = 5;
  }

  return 5 + (distanceKm * 0.59);
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return "";
}

function getToken() {
  return getCookie("accesstoken");
}

function showAdresseFeedback(message = "") {
  const feedback = document.getElementById("adresse-feedback");
  if (!feedback) return;

  feedback.textContent = message;
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

async function loadCommandeMenu() {
  const menuId = getMenuIdFromUrl();
  const container = document.getElementById("commande-menu-container");

  if (!container) return;

  if (!menuId) {
    container.innerHTML = "<p>Aucun menu sélectionné.</p>";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${menuId}`);

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
            <div class="commande-client-infos mb-4">
              <h2>Informations client</h2>

              <div class="mb-3">
                <label for="client-nom" class="form-label">Nom</label>
                <input
                  type="text"
                  id="client-nom"
                  class="form-control"
                  readonly
                  placeholder="Nom"
                >
              </div>

              <div class="mb-3">
                <label for="client-prenom" class="form-label">Prénom</label>
                <input
                  type="text"
                  id="client-prenom"
                  class="form-control"
                  readonly
                  placeholder="Prénom"
                >
              </div>

              <div class="mb-3">
                <label for="client-email" class="form-label">Email</label>
                <input
                  type="email"
                  id="client-email"
                  class="form-control"
                  readonly
                  placeholder="Email"
                >
              </div>

              <div class="mb-3">
                <label for="client-telephone" class="form-label">Téléphone</label>
                <input
                  type="text"
                  id="client-telephone"
                  class="form-control"
                  readonly
                  placeholder="Téléphone"
                >
              </div>
            </div>

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
              <p><strong>Prix menu brut :</strong> <span id="resume-prix-menu-brut">${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}</span></p>
              <p id="resume-remise-ligne" style="display: none;">
                <strong>Remise 10 % :</strong> <span id="resume-remise">0,00 €</span>
              </p>
              <p id="resume-remise-info" class="text-muted small" style="display: none;">
                Remise de 10 % appliquée à partir de X personnes
              </p>
              <p><strong>Prix menu :</strong> <span id="resume-prix-menu">${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}</span></p>
              <p><strong>Prix livraison :</strong> <span id="resume-prix-livraison">0,00 €</span></p>
              <p><strong>Total :</strong> <span id="resume-total">${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}</span></p>
            </div>

            <div class="mb-3">
              <label for="adresse-prestation" class="form-label">Adresse de la prestation</label>
              <input
                type="text"
                id="adresse-prestation"
                class="form-control"
                placeholder="Ex. 18 rue Pompon, 33600 Pessac"
                required
              >
              <div id="adresse-feedback" class="form-text text-danger"></div>
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
    prefillUserInfos();
  }
}

function initCommandeTotal(prixParPersonne, minimum) {
  const input = document.getElementById("nb-personnes");
  const totalValue = document.getElementById("commande-total-value");
  const resumeNbPersonnes = document.getElementById("resume-nb-personnes");
  const resumePrixMenuBrut = document.getElementById("resume-prix-menu-brut");
  const resumeRemiseLigne = document.getElementById("resume-remise-ligne");
  const resumeRemise = document.getElementById("resume-remise");
  const resumePrixMenu = document.getElementById("resume-prix-menu");
  const resumePrixLivraison = document.getElementById("resume-prix-livraison");
  const resumeTotal = document.getElementById("resume-total");
  const adresseInput = document.getElementById("adresse-prestation");
  const resumeAdresse = document.getElementById("resume-adresse");
  const pretMaterielInput = document.getElementById("pret-materiel");
  const resumePretMateriel = document.getElementById("resume-pret-materiel");
  const resumeRemiseInfo = document.getElementById("resume-remise-info");

  if (!input || !totalValue || !resumeNbPersonnes || !resumeTotal) return;

  const updateTotal = () => {
    let nbPersonnes = Number(input.value);

    if (input.value === "") {
      totalValue.textContent = "0,00 €";
      resumeNbPersonnes.textContent = "Non renseigné";
      return;
    }


    if (Number.isNaN(nbPersonnes)) {
      return;
    }

    if (nbPersonnes < minimum) {
      nbPersonnes = minimum;
    }

    const prixMenuBrut = nbPersonnes * prixParPersonne;
    let montantRemise = 0;

    if (nbPersonnes >= minimum + 5) {
      montantRemise = prixMenuBrut * 0.10;
    }

    const prixMenu = prixMenuBrut - montantRemise;
    const adresse = adresseInput?.value.trim() || "";
    const prixLivraison = calculateLivraison(adresse);
    const totalFinal = prixMenu + prixLivraison;

    totalValue.textContent = formatTotal(totalFinal);
    resumeNbPersonnes.textContent = nbPersonnes;

    if (resumePrixMenuBrut) {
      resumePrixMenuBrut.textContent = formatTotal(prixMenuBrut);
    }

    
    if (resumeRemise && resumeRemiseLigne && resumeRemiseInfo) {
      if (montantRemise > 0) {
        resumeRemise.textContent = `- ${formatTotal(montantRemise)}`;
        resumeRemiseLigne.style.display = "block";
        resumeRemiseInfo.style.display = "block";
        resumeRemiseInfo.textContent = "Remise de 10 % appliquée ✔️";
      } else {
        resumeRemise.textContent = "0,00 €";
        resumeRemiseLigne.style.display = "none";
        resumeRemiseInfo.style.display = "none";
      }
    }

    if (resumePrixMenu) {
      resumePrixMenu.textContent = formatTotal(prixMenu);
    }

    if (resumePrixLivraison) {
      resumePrixLivraison.textContent = formatTotal(prixLivraison);
    }

    resumeTotal.textContent = formatTotal(totalFinal);
  };

  const updateAdresseResume = () => {
    if (!adresseInput || !resumeAdresse) return;

    const adresse = adresseInput.value.trim();
    resumeAdresse.textContent = adresse || "Non renseignée";

    if (adresse && !isValidAdresseLivraison(adresse)) {
      showAdresseFeedback("Veuillez saisir une adresse complète au format : numéro + voie, code postal ville.");
    } else {
      showAdresseFeedback("");
    }

    updateTotal();
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

async function prefillUserInfos() {
  const token = getToken();

  if (!token) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/account/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      }
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer les informations utilisateur");
    }

    const user = await response.json();

    const nomInput = document.getElementById("client-nom");
    const prenomInput = document.getElementById("client-prenom");
    const emailInput = document.getElementById("client-email");
    const telephoneInput = document.getElementById("client-telephone");

    if (nomInput) nomInput.value = user.name || "";
    if (prenomInput) prenomInput.value = user.firstname || "";
    if (emailInput) emailInput.value = user.email || "";
    if (telephoneInput) telephoneInput.value = user.telephone || "";
  } catch (error) {
    console.error("Erreur pré-remplissage utilisateur :", error);
  }
}

function getDelaiCommande(conditionsMenu) {
  if (!conditionsMenu) return 0;

  const condition = conditionsMenu.toLowerCase();

  if (condition.includes("7 jours")) {
    return 7;
  }

  if (condition.includes("24h")) {
    return 1;
  }

  return 0;
}
function initCommandeForm(menu) {
  const form = document.getElementById("commande-form");
  const dateInput = document.getElementById("date-evenement");

  const delaiJours = getDelaiCommande(menu.conditions_menu);

  const dateMinimum = new Date();
  dateMinimum.setDate(dateMinimum.getDate() + delaiJours);

  dateInput.min = dateMinimum.toISOString().split("T")[0];

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

    showAdresseFeedback("");

    try {
      const nombrePersonnes = Number(document.getElementById("nb-personnes")?.value);
      const dateEvenement = document.getElementById("date-evenement")?.value.trim();
      const heureLivraison = document.getElementById("heure-livraison")?.value.trim();
      const adresseLivraison = document.getElementById("adresse-prestation")?.value.trim();
      const messageClient = document.getElementById("message-client")?.value.trim();
      const pretMateriel = document.getElementById("pret-materiel")?.checked || false;

      if (!nombrePersonnes || nombrePersonnes < Number(menu.nombre_personne_minimum)) {
        showFeedback(`Le nombre de personnes doit être au minimum de ${menu.nombre_personne_minimum}.`);
        return;
      }

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

      if (!isValidAdresseLivraison(adresseLivraison)) {
        showAdresseFeedback("Veuillez saisir une adresse complète au format : numéro + voie, code postal ville.");
        showFeedback("L’adresse de la prestation doit être complète.");
        return;
      }

      const dateChoisie = new Date(dateInput.value);

      const dateMinimumVerification = new Date();
      dateMinimumVerification.setDate(
        dateMinimumVerification.getDate() + delaiJours
      );

      dateMinimumVerification.setHours(0, 0, 0, 0);

      if (dateChoisie < dateMinimumVerification) {
        showFeedback(
          `Ce menu doit être commandé au minimum ${menu.conditions_menu.toLowerCase()}.`
        );
        return;
      }

      const prixLivraison = calculateLivraison(adresseLivraison);

      const payload = {
        menu_id: Number(menu.id),
        nombre_personnes: nombrePersonnes,
        date_prestation: dateEvenement,
        heure_livraison: heureLivraison,
        prix_livraison: prixLivraison,
        pret_materiel: pretMateriel,
        restitution_materiel: false,
        adresse_livraison: adresseLivraison,
        message: messageClient || null
      };

      const response = await fetch(`${API_BASE_URL}/api/commandes`, {
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
        window.location.hash = `#/commande-detail?id=${data.numero_commande}`;
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