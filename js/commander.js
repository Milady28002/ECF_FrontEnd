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
          <form class="commande-form">

            <div class="mb-3">
              <label for="nb-personnes" class="form-label">
                Nombre de personnes
              </label>

              <input
                type="number"
                id="nb-personnes"
                class="form-control"
                min="${menu.nombre_personne_minimum}"
                max="${menu.quantite_restante}"
                value="${menu.nombre_personne_minimum}"
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

              <p>
                <strong>Prix par personne :</strong>
                ${formatPrice(menu.prix_par_personne)}
              </p>

              <p>
                <strong>Nombre de personnes :</strong>
                <span id="resume-nb-personnes">
                  ${menu.nombre_personne_minimum}
                </span>
              </p>

              <p>
                <strong>Total :</strong>
                <span id="resume-total">
                  ${formatTotal(menu.prix_par_personne * menu.nombre_personne_minimum)}
                </span>
              </p>
            </div>

            <h2>Vos informations</h2>

            <div class="mb-3">
              <label for="nom-client" class="form-label">Nom</label>
              <input type="text" id="nom-client" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="prenom-client" class="form-label">Prénom</label>
              <input type="text" id="prenom-client" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="email-client" class="form-label">Email</label>
              <input type="email" id="email-client" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="telephone-client" class="form-label">Téléphone</label>
              <input type="tel" id="telephone-client" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="date-evenement" class="form-label">
                Date de l’événement
              </label>

              <input type="date" id="date-evenement" class="form-control" required>
            </div>

            <div class="mb-3">
              <label for="message-client" class="form-label">
                Message
              </label>

              <textarea
                id="message-client"
                class="form-control"
                rows="4"
                placeholder="Précisez votre besoin, vos contraintes, vos préférences..."
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              Valider la commande
            </button>

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

    initCommandeForm();
  }
}

function initCommandeTotal(prixParPersonne, minimum) {

  const input = document.getElementById("nb-personnes");
  const totalValue = document.getElementById("commande-total-value");
  const resumeNbPersonnes = document.getElementById("resume-nb-personnes");
  const resumeTotal = document.getElementById("resume-total");

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

  input.addEventListener("input", updateTotal);

  updateTotal();
}

function initCommandeForm() {

  const form = document.querySelector(".commande-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    alert("Commande enregistrée côté front pour démonstration.");
  });
}

loadCommandeMenu();