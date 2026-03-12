function getMenuIdFromUrl() {
  const hash = window.location.hash;
  const queryString = hash.split("?")[1];
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

async function loadMenuDetail() {
  const menuId = getMenuIdFromUrl();
  const container = document.getElementById("menu-detail-container");

  if (!container) return;

  if (!menuId) {
    container.innerHTML = "<p>Menu introuvable.</p>";
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/menus/${menuId}`);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement du menu");
    }

    const menu = await response.json();

    renderMenuDetail(menu);
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Impossible de charger le détail du menu.</p>";
  }
}

function renderMenuDetail(menu) {
  const container = document.getElementById("menu-detail-container");
  if (!container) return;

  container.innerHTML = `
    <article class="menu-detail-card">
      ${menu.image ? `
        <div class="menu-detail-card_image">
          <img src="${menu.image}" alt="${menu.titre}">
        </div>
      ` : ""}

      <div class="menu-detail-card_content">
        <h1>${menu.titre}</h1>
        <p class="menu-detail-card_description">${menu.description ?? "Aucune description disponible."}</p>

        <div class="menu-detail-card_infos">
          <p><strong>Thème :</strong> ${menu.theme ? menu.theme.libelle : "Non renseigné"}</p>
          <p><strong>Régime :</strong> ${menu.regime ? menu.regime.libelle : "Non renseigné"}</p>
          <p><strong>Minimum :</strong> ${menu.nombre_personne_minimum} personnes</p>
          <p><strong>Prix :</strong> ${Number(menu.prix_par_personne).toFixed(2)} € / personne</p>
          <p><strong>Stock disponible :</strong> ${menu.quantite_restante}</p>
        </div>

        <div class="menu-detail-card_conditions">
          <h2>Conditions importantes</h2>
          <p>${menu.conditions_menu ?? "Aucune condition particulière pour ce menu."}</p>
        </div>


        <h2>Plats inclus</h2>
        <ul class="menu-detail-card_plats">
          ${
            menu.plats && menu.plats.length > 0
              ? menu.plats.map(plat => `<li>${plat.titre}</li>`).join("")
              : "<li>Aucun plat renseigné.</li>"
          }
        </ul>

        <div class="menu-detail-card_actions">
          <a href="#/commander?id=${menu.id}" class="btn btn-primary">Commander</a>
          <a href="#/catalogue-menus" class="btn btn-outline-success">← Retour aux menus</a>
        </div>
      </div>
    </article>
  `;
}

loadMenuDetail();