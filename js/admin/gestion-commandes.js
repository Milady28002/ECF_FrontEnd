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

function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return getCookie("accesstoken");
}

function formatDate(dateString) {
  if (!dateString) return "Non renseignée";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("fr-FR");
}

function formatDateTime(dateString) {
  if (!dateString) return "Date inconnue";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString("fr-FR");
}

function formatStatusLabel(status) {
  const labels = {
    creation: "Création de la commande",
    en_attente: "En attente",
    acceptee: "Acceptée",
    en_preparation: "En préparation",
    en_livraison: "En livraison",
    livree: "Livrée",
    retour_materiel: "En attente du retour de matériel",
    terminee: "Terminée",
    annulee: "Annulée"
  };

  return labels[status] || status;
}

async function loadAllCommandes() {
  const container = document.getElementById("commandes-container");
  const statut = document.getElementById("filter-statut")?.value || "";
  const clientSearch = document.getElementById("filter-client")?.value.trim() || "";

  if (!container) return;

  const token = getTokenSafe();

  if (!token) {
    container.innerHTML = "<p>Accès refusé</p>";
    return;
  }

  try {
    const params = new URLSearchParams();

    if (statut) {
      params.append("statut", statut);
    }

    if (clientSearch) {
      params.append("client", clientSearch);
    }

    const url = `https://ecfbackendapi-production.up.railway.app/api/commandes${params.toString() ? `?${params.toString()}` : ""}`;

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

async function loadAvisModeration() {
  const container = document.getElementById("avis-container");
  if (!container) return;

  const token = getTokenSafe();

  if (!token) {
    container.innerHTML = "<p>Accès refusé</p>";
    return;
  }

  try {
    const response = await fetch("https://ecfbackendapi-production.up.railway.app/api/avis/moderation?statut=en_attente", {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      container.innerHTML = `<p>${data?.message || "Erreur chargement avis"}</p>`;
      return;
    }

    renderAvis(data);
  } catch (error) {
    console.error("Erreur chargement avis :", error);
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

function renderHistoriqueStatuts(historiqueStatuts = []) {
  if (!historiqueStatuts.length) {
    return `
      <div class="commande-historique">
        <h3>Historique des statuts</h3>
        <p class="commande-admin-no-action">Aucun historique disponible.</p>
      </div>
    `;
  }

  return `
    <div class="commande-historique">
      <h3>Historique des statuts</h3>
      <ul class="commande-historique-list">
        ${historiqueStatuts.map((item) => `
          <li class="commande-historique-item">
            <span>
              <strong>${formatStatusLabel(item.ancien_statut)}</strong>
              →
              <strong>${formatStatusLabel(item.nouveau_statut)}</strong>
            </span>
            <br>
            <small>
              ${formatDateTime(item.date_changement)}
              ${
                item.utilisateur
                  ? ` — par ${item.utilisateur.firstname || ""} ${item.utilisateur.name || ""}`.trim()
                  : ""
              }
            </small>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
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

  container.innerHTML = commandes.map(cmd => {
    return `
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
            <span class="commande-admin-info_value">
              ${cmd.utilisateur ? `${cmd.utilisateur.firstname || ""} ${cmd.utilisateur.name || ""}`.trim() : "Non renseigné"}
            </span>
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

        ${renderHistoriqueStatuts(cmd.historique_statuts)}

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
    `;
  }).join("");
}

function renderAvis(avisList) {
  const container = document.getElementById("avis-container");
  if (!container) return;

  if (!avisList.length) {
    container.innerHTML = `
      <div class="commande-empty">
        <p>Aucun avis en attente de modération.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = avisList.map((avis) => `
    <article class="commande-admin-card">
      <div class="commande-admin-card_top">
        <div>
          <p class="commande-admin-card_label">Avis</p>
          <h2>#${avis.id}</h2>
        </div>

        <span class="badge-status badge-pending">
          ${avis.statut}
        </span>
      </div>

      <div class="commande-admin-card_grid">
        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Client</span>
          <span class="commande-admin-info_value">
            ${avis.utilisateur ? `${avis.utilisateur.firstname || ""} ${avis.utilisateur.name || ""}`.trim() : "Non renseigné"}
          </span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Commande</span>
          <span class="commande-admin-info_value">
            ${avis.commande?.numero_commande || "Non renseignée"}
          </span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Note</span>
          <span class="commande-admin-info_value">${avis.note}/5</span>
        </div>

        <div class="commande-admin-info">
          <span class="commande-admin-info_label">Date</span>
          <span class="commande-admin-info_value">${formatDateTime(avis.date_creation)}</span>
        </div>
      </div>

      <div class="commande-historique">
        <h3>Commentaire</h3>
        <p>${avis.description}</p>
      </div>

      <div class="commande-admin-card_actions">
        <button class="btn btn-outline-success" onclick="validateAvis(${avis.id})">
          Valider
        </button>

        <button class="btn btn-outline-danger" onclick="rejectAvis(${avis.id})">
          Refuser
        </button>
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

  try {
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/commandes/employe/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({ statut })
    });

    const data = await response.json().catch(() => null);

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
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/commandes/employe/${id}/cancel`, {
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

async function validateAvis(id) {
  const token = getTokenSafe();

  try {
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/avis/${id}/validate`, {
      method: "PATCH",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible de valider l’avis.");
      return;
    }

    alert("Avis validé avec succès.");
    await loadAvisModeration();
  } catch (error) {
    console.error("Erreur validation avis :", error);
    alert("Erreur réseau lors de la validation.");
  }
}

async function rejectAvis(id) {
  const token = getTokenSafe();

  try {
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/avis/${id}/reject`, {
      method: "PATCH",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible de refuser l’avis.");
      return;
    }

    alert("Avis refusé avec succès.");
    await loadAvisModeration();
  } catch (error) {
    console.error("Erreur refus avis :", error);
    alert("Erreur réseau lors du refus.");
  }
}

document.getElementById("filter-statut")?.addEventListener("change", loadAllCommandes);
document.getElementById("filter-client")?.addEventListener("input", loadAllCommandes);

window.updateStatus = updateStatus;
window.cancelCommande = cancelCommande;
window.validateAvis = validateAvis;
window.rejectAvis = rejectAvis;

loadAllCommandes();
loadAvisModeration();