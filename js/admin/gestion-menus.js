function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }
  return localStorage.getItem("token");
}

async function loadAllMenus() {
  const container = document.getElementById("menus-admin-container");
  if (!container) return;

  try {
    const response = await fetch("https://ecfbackendapi-production.up.railway.app/api/menus");
    const data = await response.json();

    if (!response.ok) {
      container.innerHTML = "<p>Erreur chargement menus</p>";
      return;
    }

    renderMenusAdmin(data);

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erreur réseau</p>";
  }
}

function renderMenusAdmin(menus) {
  const container = document.getElementById("menus-admin-container");
  if (!container) return;

  if (!menus.length) {
    container.innerHTML = "<p>Aucun menu</p>";
    return;
  }

  container.innerHTML = menus.map(menu => `
    <article class="menu-admin-card">
      <div class="menu-admin-card_top">
        <h2>${menu.titre}</h2>
        <span class="menu-admin-badge">${menu.theme?.libelle || ""}</span>
      </div>

      <div class="menu-admin-grid">
        <div>
          <strong>Régime :</strong> ${menu.regime?.libelle || "Non renseigné"}
        </div>

        <div>
          <strong>Minimum :</strong> ${menu.nombre_personne_minimum} pers.
        </div>

        <div>
          <strong>Prix :</strong> ${menu.prix_par_personne} €
        </div>

        <div>
          <strong>Stock :</strong> ${menu.quantite_restante}
        </div>
      </div>

      <div class="menu-admin-actions">
        <button class="btn btn-outline-primary" onclick="editMenu(${menu.id})">
          Modifier
        </button>

        <button class="btn btn-outline-danger" onclick="deleteMenu(${menu.id})">
          Supprimer
        </button>
      </div>
    </article>
  `).join("");
}

async function deleteMenu(id) {
  const confirmDelete = confirm("Supprimer ce menu ?");
  if (!confirmDelete) return;

  const token = getTokenSafe();

  try {
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/menus/${id}`, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    if (!response.ok) {
      alert("Erreur suppression menu");
      return;
    }

    alert("Menu supprimé");
    loadAllMenus();

  } catch (error) {
    console.error(error);
    alert("Erreur réseau");
  }
}

function editMenu(id) {
  window.location.hash = `#/edit-menu?id=${id}`;
}

function createMenu() {
  window.location.hash = "#/create-menu";
}

window.deleteMenu = deleteMenu;
window.editMenu = editMenu;
window.createMenu = createMenu;

loadAllMenus();