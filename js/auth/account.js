function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return localStorage.getItem("token");
}

function getRoleSafe() {
  if (window.getRole && typeof window.getRole === "function") {
    return window.getRole();
  }

  const roleFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1];

  return roleFromCookie || localStorage.getItem("role");
}

function formatRoleLabel(role) {
  const labels = {
    ROLE_USER: "Client",
    ROLE_EMPLOYE: "Employé",
    ROLE_ADMIN: "Administrateur"
  };

  return labels[role] || role || "Non renseigné";
}

function renderAccountActions(role) {
  const container = document.getElementById("account-actions");
  if (!container) return;

  const actions = [];

  if (role === "ROLE_USER") {
    actions.push(`
      <a href="#/mes-commandes" class="btn btn-outline-success account-action-btn">
        Mes commandes
      </a>
    `);
  }

  if (role === "ROLE_EMPLOYE" || role === "ROLE_ADMIN") {
    actions.push(`
      <a href="#/gestion-commandes" class="btn btn-success account-action-btn">
        Gérer les commandes
      </a>
    `);

    actions.push(`
      <a href="#/gestion-menus" class="btn btn-success account-action-btn">
        Gérer les menus
      </a>
    `);

    actions.push(`
      <a href="#/gestion-plats" class="btn btn-success account-action-btn">
        Gérer les plats
      </a>
    `);

    actions.push(`
      <a href="#/admin/horaires-admin" class="btn btn-success account-action-btn">
        Modifier les horaires
      </a>
    `);
  }

  if (role === "ROLE_ADMIN") {
    actions.push(`
      <a href="#/create-menu" class="btn btn-outline-primary account-action-btn">
        Créer un menu
      </a>
    `);

    actions.push(`
      <a href="#/create-plat" class="btn btn-outline-primary account-action-btn">
        Créer un plat
      </a>
    `);
  }

  if (!actions.length) {
    actions.push(`<p>Aucun accès spécifique disponible.</p>`);
  }

  container.innerHTML = actions.join("");
}

function showAccountMessage(message, isError = false) {
  const container = document.getElementById("account-message");
  if (!container) return;

  container.innerHTML = `
    <div class="alert ${isError ? "alert-danger" : "alert-success"} mt-3" role="alert">
      ${message}
    </div>
  `;
}

function clearAccountMessage() {
  const container = document.getElementById("account-message");
  if (!container) return;
  container.innerHTML = "";
}

function fillAccountInfos(data, role) {
  const name = document.getElementById("account-name");
  const firstname = document.getElementById("account-firstname");
  const email = document.getElementById("account-email");
  const phone = document.getElementById("account-phone");
  const roleEl = document.getElementById("account-role");

  if (name) name.textContent = data.name || "Non renseigné";
  if (firstname) firstname.textContent = data.firstname || "Non renseigné";
  if (email) email.textContent = data.email || "Non renseigné";
  if (phone) phone.textContent = data.telephone || "Non renseigné";
  if (roleEl) roleEl.textContent = formatRoleLabel(role);
}

function renderEditButton() {
  const container = document.getElementById("account-edit-action");
  if (!container) return;

  container.innerHTML = `
    <button id="edit-account-btn" class="btn btn-primary">
      Modifier mes informations
    </button>
  `;
}

function renderEditForm(data) {
  const container = document.getElementById("account-edit-form-container");
  if (!container) return;

  container.innerHTML = `
    <div class="account-edit-card mt-4">
      <h2>Modifier mes informations</h2>

      <form id="account-edit-form" class="mt-3">
        <div class="row g-3">
          <div class="col-md-6">
            <label for="edit-account-lastname" class="form-label">Nom</label>
            <input
              type="text"
              id="edit-account-lastname"
              class="form-control"
              value="${data.name || ""}"
              required
            >
          </div>

          <div class="col-md-6">
            <label for="edit-account-firstname" class="form-label">Prénom</label>
            <input
              type="text"
              id="edit-account-firstname"
              class="form-control"
              value="${data.firstname || ""}"
              required
            >
          </div>

          <div class="col-md-6">
            <label for="edit-account-email" class="form-label">Email</label>
            <input
              type="email"
              id="edit-account-email"
              class="form-control"
              value="${data.email || ""}"
              disabled
            >
            <small class="text-muted">L’email n’est pas modifiable ici.</small>
          </div>

          <div class="col-md-6">
            <label for="edit-account-phone" class="form-label">Téléphone</label>
            <input
              type="text"
              id="edit-account-phone"
              class="form-control"
              value="${data.telephone || ""}"
            >
          </div>

          <div class="col-md-12">
            <label for="edit-account-address" class="form-label">Adresse postale</label>
            <input
              type="text"
              id="edit-account-address"
              class="form-control"
              value="${data.adressePostale || ""}"
            >
          </div>

          <div class="col-md-6">
            <label for="edit-account-city" class="form-label">Ville</label>
            <input
              type="text"
              id="edit-account-city"
              class="form-control"
              value="${data.ville || ""}"
            >
          </div>

          <div class="col-md-6">
            <label for="edit-account-country" class="form-label">Pays</label>
            <input
              type="text"
              id="edit-account-country"
              class="form-control"
              value="${data.pays || ""}"
            >
          </div>

          <div class="col-md-12">
            <label for="edit-account-password" class="form-label">Nouveau mot de passe</label>
            <input
              type="password"
              id="edit-account-password"
              class="form-control"
              placeholder="Laisser vide pour ne pas modifier"
            >
          </div>
        </div>

        <div class="mt-4 d-flex gap-2">
          <button type="submit" class="btn btn-success" id="save-account-btn">
            Enregistrer
          </button>
          <button type="button" class="btn btn-outline-secondary" id="cancel-account-edit-btn">
            Annuler
          </button>
        </div>
      </form>
    </div>
  `;
}

function clearEditForm() {
  const container = document.getElementById("account-edit-form-container");
  if (!container) return;
  container.innerHTML = "";
}

async function loadAccountInfos() {
  const token = getTokenSafe();
  const role = getRoleSafe();

  renderAccountActions(role);

  if (!token) {
    console.error("Aucun token trouvé");
    showAccountMessage("Vous devez être connecté pour accéder à votre compte.", true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/account/me`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      console.error("Erreur récupération compte");
      showAccountMessage("Impossible de charger vos informations.", true);
      return;
    }

    fillAccountInfos(data, role);
    renderEditButton();
    initEditAccountButton(data);

  } catch (error) {
    console.error("Erreur loadAccountInfos :", error);
    showAccountMessage("Une erreur réseau est survenue.", true);
  }
}

function initEditAccountButton(accountData) {
  const button = document.getElementById("edit-account-btn");
  if (!button) return;

  button.addEventListener("click", () => {
    clearAccountMessage();
    renderEditForm(accountData);
    initAccountEditForm();
  });
}

function initAccountEditForm() {
  const form = document.getElementById("account-edit-form");
  const cancelBtn = document.getElementById("cancel-account-edit-btn");
  const saveBtn = document.getElementById("save-account-btn");

  if (!form) return;

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      clearEditForm();
      clearAccountMessage();
      loadAccountInfos();
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearAccountMessage();

    const token = getTokenSafe();
    if (!token) {
      showAccountMessage("Vous devez être connecté.", true);
      return;
    }

    const payload = {
      firstName: document.getElementById("edit-account-firstname")?.value.trim(),
      lastName: document.getElementById("edit-account-lastname")?.value.trim(),
      telephone: document.getElementById("edit-account-phone")?.value.trim(),
      adressePostale: document.getElementById("edit-account-address")?.value.trim(),
      ville: document.getElementById("edit-account-city")?.value.trim(),
      pays: document.getElementById("edit-account-country")?.value.trim(),
      password: document.getElementById("edit-account-password")?.value.trim()
    };

    if (!payload.firstName || !payload.lastName) {
      showAccountMessage("Nom et prénom sont obligatoires.", true);
      return;
    }

    if (!payload.password) {
      delete payload.password;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Enregistrement...";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/account/edit`, {
        method: "PUT",
        headers: {
          "X-AUTH-TOKEN": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data = null;
      if (response.status !== 204) {
        data = await response.json().catch(() => null);
      }

      if (!response.ok) {
        showAccountMessage(
          data?.message || "Impossible de modifier vos informations.",
          true
        );

        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Enregistrer";
        }
        return;
      }

      showAccountMessage("Vos informations ont bien été mises à jour.");
      clearEditForm();
      loadAccountInfos();

    } catch (error) {
      console.error("Erreur modification compte :", error);
      showAccountMessage("Une erreur réseau est survenue.", true);

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Enregistrer";
      }
    }
  });
}

const btnEmployes = document.getElementById("btn-employes");
const btnHoraires = document.getElementById("btn-horaires");

if (btnEmployes) {
  btnEmployes.addEventListener("click", () => {
    window.location.href = "#/admin/employes";
  });
}

if (btnHoraires) {
  btnHoraires.addEventListener("click", () => {
    window.location.href = "#/admin/horaires-admin";
  });
}

loadAccountInfos();