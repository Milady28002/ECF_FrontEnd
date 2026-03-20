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

async function loadAccountInfos() {
  const token = getTokenSafe();
  const role = getRoleSafe();

  console.log("token account =", token);
  console.log("role account =", role);

  renderAccountActions(role);

  const roleEl = document.getElementById("account-role");
  if (roleEl) {
    roleEl.textContent = formatRoleLabel(role);
  }

  if (!token) {
    console.error("Aucun token trouvé");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/account/me", {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    console.log("response account/me =", response.status, data);

    if (!response.ok || !data) {
      console.error("Erreur récupération compte");
      return;
    }

    const name = document.getElementById("account-name");
    const firstname = document.getElementById("account-firstname");
    const email = document.getElementById("account-email");
    const phone = document.getElementById("account-phone");

    if (name) name.textContent = data.name || "Non renseigné";
    if (firstname) firstname.textContent = data.firstname || "Non renseigné";
    if (email) email.textContent = data.email || "Non renseigné";
    if (phone) phone.textContent = data.telephone || "Non renseigné";

  } catch (error) {
    console.error("Erreur loadAccountInfos :", error);
  }
}

loadAccountInfos();