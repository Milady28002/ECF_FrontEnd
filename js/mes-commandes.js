function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return localStorage.getItem("token");
}

function formatDate(dateString) {
  if (!dateString) return "Non renseignée";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("fr-FR");
}

function formatPrice(amount) {
  return `${Number(amount).toFixed(2).replace(".", ",")} €`;
}

function formatStatusLabel(status) {
  const labels = {
    en_attente: "En attente",
    acceptee: "Acceptée",
    en_preparation: "En préparation",
    en_livraison: "En livraison",
    livree: "Livrée",
    retour_materiel: "Retour matériel",
    terminee: "Terminée",
    annulee: "Annulée"
  };

  return labels[status] || status;
}

function getStatusClass(status) {
  const classes = {
    en_attente: "badge-status badge-pending",
    acceptee: "badge-status badge-accepted",
    en_preparation: "badge-status badge-preparing",
    en_livraison: "badge-status badge-delivery",
    livree: "badge-status badge-delivered",
    retour_materiel: "badge-status badge-warning",
    terminee: "badge-status badge-finished",
    annulee: "badge-status badge-cancelled"
  };

  return classes[status] || "badge-status";
}

function getMenuTitle(commande) {
  if (commande.menus && commande.menus.length > 0) {
    return commande.menus[0].titre;
  }

  return "Menu non renseigné";
}

function renderEmptyState(container) {
  container.innerHTML = `
    <div class="commande-empty-state text-center">
      <h2>Aucune commande pour le moment</h2>
      <p>Vous n’avez pas encore passé de commande.</p>
      <a href="#/catalogue-menus" class="btn btn-primary mt-2" onclick="route()">
        Découvrir nos menus
      </a>
    </div>
  `;
}

function renderOrders(commandes) {
  const container = document.getElementById("orders-container");
  if (!container) return;

  if (!commandes.length) {
    renderEmptyState(container);
    return;
  }

  container.innerHTML = commandes.map((commande) => {
    const canEdit = commande.statut === "en_attente";
    const canCancel = commande.statut === "en_attente";

    return `
      <article class="commande-user-card">
        <div class="commande-user-card_top">
          <div>
            <p class="commande-user-card_label">Commande</p>
            <h2 class="commande-user-card_title">${commande.numero_commande}</h2>
          </div>

          <span class="${getStatusClass(commande.statut)}">
            ${formatStatusLabel(commande.statut)}
          </span>
        </div>

        <div class="commande-user-card_body">
          <div class="commande-user-card_grid">
            <div class="commande-info-item">
              <span class="commande-info-label">Menu</span>
              <span class="commande-info-value">${getMenuTitle(commande)}</span>
            </div>

            <div class="commande-info-item">
              <span class="commande-info-label">Date de commande</span>
              <span class="commande-info-value">${formatDate(commande.date_commande)}</span>
            </div>

            <div class="commande-info-item">
              <span class="commande-info-label">Date de prestation</span>
              <span class="commande-info-value">${formatDate(commande.date_prestation)}</span>
            </div>

            <div class="commande-info-item">
              <span class="commande-info-label">Heure de livraison</span>
              <span class="commande-info-value">${commande.heure_livraison || "Non renseignée"}</span>
            </div>

            <div class="commande-info-item">
              <span class="commande-info-label">Nombre de personnes</span>
              <span class="commande-info-value">${commande.nombre_personnes}</span>
            </div>

            <div class="commande-info-item">
              <span class="commande-info-label">Total</span>
              <span class="commande-info-value commande-info-price">${formatPrice(commande.prix_total)}</span>
            </div>
          </div>
        </div>

        <div class="commande-user-card_actions">
          <a
            href="#/commande-detail?id=${commande.numero_commande}"
            class="btn btn-outline-success"
            onclick="route()"
          >
            Voir le détail
          </a>

          ${
            canEdit
              ? `
                <a
                  href="#/commande-detail?id=${commande.numero_commande}&mode=edit"
                  class="btn btn-outline-primary"
                  onclick="route()"
                >
                  Modifier
                </a>
              `
              : ""
          }

          ${
            canCancel
              ? `
                <button
                  class="btn btn-outline-danger cancel-order-btn"
                  data-id="${commande.numero_commande}"
                >
                  Annuler
                </button>
              `
              : ""
          }
        </div>
      </article>
    `;
  }).join("");

  initCancelButtons();
}

async function cancelOrder(orderId) {
  const token = getTokenSafe();

  if (!token) {
    window.location.hash = "#/signin";
    return;
  }

  const confirmed = window.confirm(
    "Voulez-vous vraiment annuler cette commande ?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/commandes/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible d’annuler la commande.");
      return;
    }

    await loadMesCommandes();
  } catch (error) {
    console.error("Erreur annulation commande :", error);
    alert("Une erreur réseau est survenue.");
  }
}

function initCancelButtons() {
  const buttons = document.querySelectorAll(".cancel-order-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.id;
      if (!orderId) return;

      cancelOrder(orderId);
    });
  });
}

async function loadMesCommandes() {
  const container = document.getElementById("orders-container");
  if (!container) return;

  const token = getTokenSafe();

  if (!token) {
    container.innerHTML = `
      <div class="commande-empty-state text-center">
        <h2>Connexion requise</h2>
        <p>Vous devez être connecté pour accéder à vos commandes.</p>
        <a href="#/signin" class="btn btn-primary mt-2" onclick="route()">
          Se connecter
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `<p class="text-center">Chargement de vos commandes...</p>`;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/commandes/me", {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      container.innerHTML = `
        <div class="commande-empty-state text-center">
          <h2>Session expirée</h2>
          <p>Veuillez vous reconnecter.</p>
          <a href="#/signin" class="btn btn-primary mt-2" onclick="route()">
            Se connecter
          </a>
        </div>
      `;
      return;
    }

    if (response.status === 403) {
      container.innerHTML = `<p class="text-center">Accès interdit.</p>`;
      return;
    }

    if (!response.ok) {
      container.innerHTML = `<p class="text-center">Erreur lors du chargement des commandes.</p>`;
      return;
    }

    const commandes = await response.json();
    renderOrders(commandes);

  } catch (error) {
    console.error("Erreur mes commandes :", error);
    container.innerHTML = `<p class="text-center">Une erreur est survenue.</p>`;
  }
}

loadMesCommandes();