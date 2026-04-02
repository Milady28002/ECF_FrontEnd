function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return localStorage.getItem("token");
}

function getCommandeIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function isEditMode() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("mode") === "edit";
}

function formatDate(dateString) {
  if (!dateString) return "Non renseignée";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("fr-FR");
}

function formatDateForInput(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
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

function showMessage(container, message, isError = true) {
  const messageHtml = `
    <div class="alert ${isError ? "alert-danger" : "alert-success"} mt-3" role="alert">
      ${message}
    </div>
  `;

  const existing = container.querySelector(".alert");
  if (existing) existing.remove();

  container.insertAdjacentHTML("beforeend", messageHtml);
}

function getStatusSteps() {
  return [
    "en_attente",
    "acceptee",
    "en_preparation",
    "en_livraison",
    "livree",
    "retour_materiel",
    "terminee"
  ];
}

function getStepLabel(step) {
  const labels = {
    en_attente: "Commande reçue",
    acceptee: "Commande acceptée",
    en_preparation: "En préparation",
    en_livraison: "En cours de livraison",
    livree: "Livrée",
    retour_materiel: "Retour matériel",
    terminee: "Terminée"
  };

  return labels[step] || step;
}

function renderStatusTimeline(currentStatus) {
  if (currentStatus === "annulee") {
    return `
      <div class="commande-timeline cancelled">
        <div class="timeline-step is-active is-cancelled">
          <div class="timeline-dot"></div>
          <div class="timeline-label">Commande annulée</div>
        </div>
      </div>
    `;
  }

  const steps = getStatusSteps();
  const currentIndex = steps.indexOf(currentStatus);

  return `
    <div class="commande-timeline">
      ${steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return `
          <div class="timeline-step ${isDone ? "is-done" : ""} ${isActive ? "is-active" : ""}">
            <div class="timeline-dot"></div>
            <div class="timeline-label">${getStepLabel(step)}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAvisForm() {
  return `
    <div class="commande-detail-section" id="avis-section">
      <h2>Laisser un avis</h2>

      <form id="avis-form" class="commande-edit-form">
        <div class="mb-3">
          <label for="avis-note" class="form-label">Note</label>
          <select id="avis-note" class="form-control" required>
            <option value="">Choisir une note</option>
            <option value="5">5 / 5</option>
            <option value="4">4 / 5</option>
            <option value="3">3 / 5</option>
            <option value="2">2 / 5</option>
            <option value="1">1 / 5</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="avis-commentaire" class="form-label">Commentaire</label>
          <textarea
            id="avis-commentaire"
            class="form-control"
            rows="5"
            placeholder="Partagez votre expérience..."
            required
          ></textarea>
        </div>

        <div class="commande-detail-actions mt-3">
          <button type="submit" class="btn btn-primary">Envoyer mon avis</button>
          <button type="button" class="btn btn-outline-secondary" id="cancel-avis-btn">Annuler</button>
        </div>

        <div id="avis-message" class="mt-3"></div>
      </form>
    </div>
  `;
}

function renderCommandeDetail(commande) {
  const container = document.getElementById("commande-detail-container");
  if (!container) return;

  const editable = commande.statut === "en_attente" && isEditMode();

  container.innerHTML = `
    <article class="commande-detail-card">
      <div class="commande-detail-top">
        <div>
          <p class="commande-detail-label">Commande</p>
          <h1 class="commande-detail-title">${commande.numero_commande}</h1>
        </div>

        <span class="${getStatusClass(commande.statut)}">
          ${formatStatusLabel(commande.statut)}
        </span>
      </div>

      <div class="commande-detail-section">
        <h2>Résumé</h2>
        <div class="commande-detail-grid">
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
            <span class="commande-info-label">Adresse de livraison</span>
            <span class="commande-info-value">${commande.adresse_livraison || "Non renseignée"}</span>
          </div>

          <div class="commande-info-item">
            <span class="commande-info-label">Prêt de matériel</span>
            <span class="commande-info-value">${commande.pret_materiel ? "Oui" : "Non"}</span>
          </div>

          <div class="commande-info-item">
            <span class="commande-info-label">Prix total</span>
            <span class="commande-info-value commande-info-price">${formatPrice(commande.prix_total)}</span>
          </div>
        </div>
      </div>

      <div class="commande-detail-section">
        <h2>Suivi de la commande</h2>
        ${renderStatusTimeline(commande.statut)}
      </div>

      <div class="commande-detail-section">
        <h2>Informations client</h2>
        <div class="commande-detail-grid">
          <div class="commande-info-item">
            <span class="commande-info-label">Nom</span>
            <span class="commande-info-value">${commande.utilisateur?.name || "Non renseigné"}</span>
          </div>

          <div class="commande-info-item">
            <span class="commande-info-label">Prénom</span>
            <span class="commande-info-value">${commande.utilisateur?.firstname || "Non renseigné"}</span>
          </div>

          <div class="commande-info-item">
            <span class="commande-info-label">Email</span>
            <span class="commande-info-value">${commande.utilisateur?.email || "Non renseigné"}</span>
          </div>

          <div class="commande-info-item">
            <span class="commande-info-label">Téléphone</span>
            <span class="commande-info-value">${commande.utilisateur?.telephone || "Non renseigné"}</span>
          </div>
        </div>
      </div>

      ${
        editable
          ? `
            <div class="commande-detail-section">
              <h2>Modifier la commande</h2>

              <form id="edit-commande-form" class="commande-edit-form">
                <div class="commande-detail-grid">
                  <div class="mb-3">
                    <label for="edit-nombre-personnes" class="form-label">Nombre de personnes</label>
                    <input
                      type="number"
                      id="edit-nombre-personnes"
                      class="form-control"
                      value="${commande.nombre_personnes}"
                      min="1"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="edit-date-prestation" class="form-label">Date de prestation</label>
                    <input
                      type="date"
                      id="edit-date-prestation"
                      class="form-control"
                      value="${formatDateForInput(commande.date_prestation)}"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="edit-heure-livraison" class="form-label">Heure de livraison</label>
                    <input
                      type="time"
                      id="edit-heure-livraison"
                      class="form-control"
                      value="${commande.heure_livraison || ""}"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="edit-adresse-livraison" class="form-label">Adresse de livraison</label>
                    <input
                      type="text"
                      id="edit-adresse-livraison"
                      class="form-control"
                      value="${commande.adresse_livraison || ""}"
                      required
                    >
                  </div>

                  <div class="mb-3 form-check align-self-end">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="edit-pret-materiel"
                      ${commande.pret_materiel ? "checked" : ""}
                    >
                    <label class="form-check-label" for="edit-pret-materiel">
                      Prêt de matériel demandé
                    </label>
                  </div>
                </div>

                <div class="commande-detail-actions mt-3">
                  <button type="submit" class="btn btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          `
          : ""
      }

      ${
        commande.statut === "terminee" && commande.avis_deja_laisse
          ? `
            <div class="commande-detail-section">
              <div class="alert alert-success mb-0" role="alert">
                Merci, vous avez déjà laissé un avis pour cette commande.
              </div>
            </div>
          `
          : ""
      }

      <div id="avis-form-wrapper"></div>

      <div class="commande-detail-actions">
        <a href="#/mes-commandes" class="btn btn-outline-success">
          ← Retour à mes commandes
        </a>

        ${
          commande.statut === "en_attente" && !editable
            ? `
              <a href="#/commande-detail?id=${commande.numero_commande}&mode=edit" class="btn btn-outline-primary">
                Modifier
              </a>
            `
            : ""
        }

        ${
          commande.statut === "en_attente"
            ? `
              <button class="btn btn-outline-danger" id="cancel-commande-btn">
                Annuler la commande
              </button>
            `
            : ""
        }

        ${
          commande.statut === "terminee" && !commande.avis_deja_laisse
            ? `
              <button class="btn btn-primary" id="leave-review-btn">
                Laisser un avis
              </button>
            `
            : ""
        }
      </div>
    </article>
  `;

  if (editable) {
    initEditForm(commande.numero_commande);
  }

  if (commande.statut === "en_attente") {
    initCancelButton(commande.numero_commande);
  }

  if (commande.statut === "terminee" && !commande.avis_deja_laisse) {
    initAvisButton(commande);
  }
}

function initAvisButton(commande) {
  const button = document.getElementById("leave-review-btn");
  const wrapper = document.getElementById("avis-form-wrapper");

  if (!button || !wrapper) return;

  button.addEventListener("click", () => {
    wrapper.innerHTML = renderAvisForm();
    button.remove();

    initAvisForm(commande.numero_commande);

    const avisSection = document.getElementById("avis-section");
    if (avisSection) {
      avisSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function initAvisForm(commandeId) {
  const form = document.getElementById("avis-form");
  const cancelButton = document.getElementById("cancel-avis-btn");
  const messageBox = document.getElementById("avis-message");
  const wrapper = document.getElementById("avis-form-wrapper");

  if (!form || !messageBox || !wrapper) return;

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      wrapper.innerHTML = "";
      loadCommandeDetail();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getTokenSafe();
    if (!token) {
      window.location.hash = "#/signin";
      return;
    }

    const note = Number(document.getElementById("avis-note")?.value);
    const commentaire = document.getElementById("avis-commentaire")?.value.trim();

    if (!note || !commentaire) {
      messageBox.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Tous les champs sont obligatoires.
        </div>
      `;
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/avis", {
        method: "POST",
        headers: {
          "X-AUTH-TOKEN": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        commande_numero: commandeId,
        note: note,
        description: commentaire
      })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        messageBox.innerHTML = `
          <div class="alert alert-danger" role="alert">
            ${data?.message || data?.error || "Impossible d'envoyer l'avis."}
          </div>
        `;
        return;
      }

      messageBox.innerHTML = `
        <div class="alert alert-success" role="alert">
          Merci, votre avis a bien été envoyé.
        </div>
      `;

      setTimeout(() => {
        loadCommandeDetail();
      }, 1200);

    } catch (error) {
      console.error("Erreur envoi avis :", error);

      messageBox.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Une erreur réseau est survenue.
        </div>
      `;
    }
  });
}

async function loadCommandeDetail() {
  const container = document.getElementById("commande-detail-container");
  if (!container) return;

  const token = getTokenSafe();
  const commandeId = getCommandeIdFromUrl();

  if (!token) {
    container.innerHTML = `<p>Vous devez être connecté pour voir cette commande.</p>`;
    return;
  }

  if (!commandeId) {
    container.innerHTML = `<p>Commande introuvable.</p>`;
    return;
  }

  container.innerHTML = `<p class="text-center">Chargement du détail de la commande...</p>`;

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/commandes/${commandeId}`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401) {
      window.location.hash = "#/signin";
      return;
    }

    if (response.status === 403) {
      container.innerHTML = `<p>Accès interdit.</p>`;
      return;
    }

    if (response.status === 404) {
      container.innerHTML = `<p>${data?.message || "Commande introuvable."}</p>`;
      return;
    }

    if (!response.ok) {
      container.innerHTML = `<p>Erreur lors du chargement de la commande.</p>`;
      return;
    }

    renderCommandeDetail(data);

  } catch (error) {
    console.error("Erreur détail commande :", error);
    container.innerHTML = `<p>Une erreur est survenue.</p>`;
  }
}

function initEditForm(commandeId) {
  const form = document.getElementById("edit-commande-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getTokenSafe();
    if (!token) {
      window.location.hash = "#/signin";
      return;
    }

    const payload = {
      nombre_personnes: Number(document.getElementById("edit-nombre-personnes")?.value),
      date_prestation: document.getElementById("edit-date-prestation")?.value,
      heure_livraison: document.getElementById("edit-heure-livraison")?.value,
      adresse_livraison: document.getElementById("edit-adresse-livraison")?.value.trim(),
      pret_materiel: document.getElementById("edit-pret-materiel")?.checked || false
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/commandes/${commandeId}`, {
        method: "PATCH",
        headers: {
          "X-AUTH-TOKEN": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);
      const container = document.getElementById("commande-detail-container");

      if (!response.ok) {
        showMessage(container, data?.message || "Impossible de modifier la commande.");
        return;
      }

      showMessage(container, "☑️ Commande modifiée avec succès.", false);

      setTimeout(() => {
        window.location.hash = `#/commande-detail?id=${commandeId}`;
      }, 1000);

    } catch (error) {
      console.error("Erreur modification commande :", error);
      const container = document.getElementById("commande-detail-container");
      showMessage(container, "Une erreur réseau est survenue.");
    }
  });
}

function initCancelButton(commandeId) {
  const button = document.getElementById("cancel-commande-btn");
  if (!button) return;

  button.addEventListener("click", async () => {
    const confirmed = window.confirm("Voulez-vous vraiment annuler cette commande ?");
    if (!confirmed) return;

    const token = getTokenSafe();
    if (!token) {
      window.location.hash = "#/signin";
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/commandes/${commandeId}/cancel`, {
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

      window.location.hash = "#/mes-commandes";

    } catch (error) {
      console.error("Erreur annulation commande :", error);
      alert("Une erreur réseau est survenue.");
    }
  });
}

loadCommandeDetail();