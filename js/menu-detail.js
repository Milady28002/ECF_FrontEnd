function getMenuIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function formatPrice(price) {
  return `${Number(price).toFixed(2).replace(".", ",")} € / personne`;
}

function renderPlatList(plats) {
  if (!plats || plats.length === 0) {
    return "<li>Aucun plat renseigné.</li>";
  }

  return plats.map((plat) => `
    <li class="plat_item">
      <div class="plat_title">
        ${plat.titre}
        ${plat.type_plat ? `<span class="plat-type"> (${plat.type_plat})</span>` : ""}
      </div>

      <div class="plat_allergenes">
        ${
          plat.allergenes && plat.allergenes.length > 0
            ? `Allergènes : ${plat.allergenes.map((a) => a.libelle).join(", ")}`
            : "Allergènes : aucun"
        }
      </div>
    </li>
  `).join("");
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
    console.error("Erreur chargement détail menu :", error);
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

        <p class="menu-detail-card_description">
          ${menu.description || "Aucune description disponible."}
        </p>

        <div class="menu-detail-card_infos">
          <p><strong>Thème :</strong> ${menu.theme ? menu.theme.libelle : "Non renseigné"}</p>
          <p><strong>Régime :</strong> ${menu.regime ? menu.regime.libelle : "Non renseigné"}</p>
          <p><strong>Minimum :</strong> ${menu.nombre_personne_minimum} personnes</p>
          <p><strong>Prix :</strong> ${formatPrice(menu.prix_par_personne)}</p>
          <p><strong>Stock disponible :</strong> ${menu.quantite_restante}</p>
        </div>

        <div class="menu-detail-card_conditions">
          <h2>Conditions importantes</h2>
          <p>${menu.conditions_menu || "Aucune condition particulière pour ce menu."}</p>
        </div>

        <h2>Plats inclus</h2>
        <ul class="menu-detail-card_plats">
          ${renderPlatList(menu.plats)}
        </ul>

        <div class="menu-detail-card_actions">
          <a href="#/commander?id=${menu.id}" class="btn btn-primary">
            Commander
          </a>
          <a href="#/catalogue-menus" class="btn btn-outline-success">
            ← Retour aux menus
          </a>
        </div>
    </article>
  `;
}

loadMenuDetail();