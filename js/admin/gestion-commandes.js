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

async function loadAllCommandes() {
  const container = document.getElementById("commandes-container");
  const statut = document.getElementById("filter-statut")?.value || "";

  if (!container) return;

  const token = getTokenSafe();

  if (!token) {
    container.innerHTML = "<p>Accès refusé</p>";
    return;
  }

  try {
    const url = statut
      ? `http://127.0.0.1:8000/api/commandes?statut=${encodeURIComponent(statut)}`
      : "http://127.0.0.1:8000/api/commandes";

    console.log("token gestion-commandes =", token);

    const response = await fetch(url, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      container.innerHTML = `<p>${data?.message || "Erreur chargement commandes"}</p>`;
      return;
    }

    renderCommandes(data);

  } catch (error) {
    console.error("Erreur chargement commandes :", error);
    container.innerHTML = "<p>Erreur réseau</p>";
  }
}

function getStatusBadgeClass(status) {
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

function renderCommandes(commandes) {
  const container = document.getElementById("commandes-container");
  if (!container) return;

  if (!commandes.length) {
    container.innerHTML = `
      <div class="commande-empty">
        <p>Aucune commande ne correspond au filtre sélectionné.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = commandes.map(cmd => `
    <article class="commande-admin-card">
      <div class="commande-admin-card_top">
        <div>
          <p class="commande-admin-card_label">Commande</p>
          <h2>${cmd.numero_commande}</h2>
        </div>

        <span class="${getStatusBadgeClass(cmd.statut)}">
          ${formatStatusLabel(cmd.statut)}
        </span>
      </div>

      <div class="commande-admin-card_grid">
        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Client</span>
          <span class="commande-admin-info_value">${cmd.utilisateur?.name || "Non renseigné"}</span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Menu</span>
          <span class="commande-admin-info_value">${cmd.menus?.[0]?.titre || "Non renseigné"}</span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Date de prestation</span>
          <span class="commande-admin-info_value">${formatDate(cmd.date_prestation)}</span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Adresse</span>
          <span class="commande-admin-info_value">${cmd.adresse_livraison || "Non renseignée"}</span>
        </div>
      </div>

      <div class="commande-admin-card_actions">
        ${
          cmd.statut !== "annulee" && cmd.statut !== "terminee"
            ? `
              <div class="commande-admin-action-group">
                <label class="form-label">Mettre à jour le statut</label>
                <select class="form-select" onchange="updateStatus('${cmd.numero_commande}', this.value)">
                  ${getStatusOptions(cmd.statut)}
                </select>
              </div>

              <button class="btn btn-outline-danger" onclick="cancelCommande('${cmd.numero_commande}')">
                Annuler
              </button>
            `
            : `
              <p class="commande-admin-no-action">Aucune action disponible</p>
            `
        }
      </div>
    </article>
  `).join("");
}

function getStatusOptions(current) {
  const transitions = {
    en_attente: ["en_attente", "acceptee"],
    acceptee: ["acceptee", "en_preparation"],
    en_preparation: ["en_preparation", "en_livraison"],
    en_livraison: ["en_livraison", "livree"],
    livree: ["livree", "retour_materiel", "terminee"],
    retour_materiel: ["retour_materiel", "terminee"],
    terminee: ["terminee"],
    annulee: ["annulee"]
  };

  const allowed = transitions[current] || [current];

  return allowed.map(status => `
    <option value="${status}" ${status === current ? "selected" : ""}>
      ${formatStatusLabel(status)}
    </option>
  `).join("");
}

async function updateStatus(id, statut) {
  const token = getTokenSafe();

  console.log("updateStatus appelé :", id, statut);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/commandes/employe/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({ statut })
    });

    const data = await response.json().catch(() => null);

    console.log("réponse updateStatus :", response.status, data);

    if (!response.ok) {
      alert(data?.message || "Impossible de mettre à jour le statut.");
      return;
    }

    alert("Statut mis à jour avec succès.");
    loadAllCommandes();

  } catch (error) {
    console.error("Erreur updateStatus :", error);
    alert("Erreur réseau lors de la mise à jour du statut.");
  }
}

async function cancelCommande(id) {
  const motif = prompt("Motif d'annulation ?");
  if (!motif) return;

  const modeContact = prompt("Mode de contact utilisé ? (mail ou téléphone)");
  if (!modeContact) return;

  const token = getTokenSafe();

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/commandes/employe/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({
        motif_annulation: motif,
        mode_contact_annulation: modeContact
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible d’annuler la commande.");
      return;
    }

    loadAllCommandes();

  } catch (error) {
    console.error("Erreur cancelCommande :", error);
    alert("Erreur réseau lors de l’annulation.");
  }
}

document.getElementById("filter-statut")?.addEventListener("change", loadAllCommandes);

window.updateStatus = updateStatus;
window.cancelCommande = cancelCommande;

loadAllCommandes();