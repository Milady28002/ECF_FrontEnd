function getMenuIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function formatPrice(price) {
  return `${Number(price).toFixed(2).replace(".", ",")} € / personne`;
}

function getPlatsByType(plats, type) {
  return plats.filter((plat) => Number(plat.type_plat) === type);
}

function renderAllergenes(plat) {
  if (!plat) {
    return "Allergènes : aucun";
  }

  if (Array.isArray(plat.allergenes) && plat.allergenes.length > 0) {
    return `Allergènes : ${plat.allergenes.map((a) => a.libelle).join(", ")}`;
  }

  return "Allergènes : aucun";
}

function renderPlatItem(plat, fallbackImage) {
  const imageSrc = plat.image_url || fallbackImage || "";

  return `
    <div class="menu-plat-item">
      ${
        imageSrc
          ? `
            <div class="menu-plat-image">
              <img src="${imageSrc}" alt="${plat.titre}">
            </div>
          `
          : ""
      }

      <div class="menu-plat-content">
        <p class="menu-plat-title">${plat.titre}</p>
        <p class="menu-plat-allergenes">${renderAllergenes(plat)}</p>
      </div>
    </div>
  `;
}

function renderPlatSection(title, plats, fallbackImage) {
  if (!plats.length) {
    return `
      <div class="menu-plat-block">
        <h3>${title}</h3>
        <p>Aucun ${title.toLowerCase()} renseigné.</p>
      </div>
    `;
  }

  return `
    <div class="menu-plat-block">
      <h3>${title}</h3>
      <div class="menu-plat-list">
        ${plats.map((plat) => renderPlatItem(plat, fallbackImage)).join("")}
      </div>
    </div>
  `;
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
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/menus/${menuId}`);
    const menu = await response.json().catch(() => null);

    if (!response.ok || !menu) {
      throw new Error("Erreur lors du chargement du menu");
    }

    renderMenuDetail(menu);
  } catch (error) {
    console.error("Erreur chargement détail menu :", error);
    container.innerHTML = "<p>Impossible de charger le détail du menu.</p>";
  }
}

function renderMenuDetail(menu) {
  const container = document.getElementById("menu-detail-container");
  if (!container) return;

  const plats = Array.isArray(menu.plats) ? menu.plats : [];

  const entrees = getPlatsByType(plats, 1);
  const platsPrincipaux = getPlatsByType(plats, 2);
  const desserts = getPlatsByType(plats, 3);

  container.innerHTML = `
    <article class="menu-detail-card">
      ${
        menu.image
          ? `
            <div class="menu-detail-card_image">
              <img src="${menu.image}" alt="${menu.titre}">
            </div>
          `
          : ""
      }

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

        <div class="menu-detail-card_plats-section">
          <h2>Plats inclus</h2>

          <div class="menu-detail-card_plats-grid">
            ${renderPlatSection("Entrées", entrees, menu.image)}
            ${renderPlatSection("Plats", platsPrincipaux, menu.image)}
            ${renderPlatSection("Desserts", desserts, menu.image)}
          </div>
        </div>

        <div class="menu-detail-card_actions">
          <a href="#/commander?id=${menu.id}" class="btn btn-primary">
            Commander
          </a>
          <a href="#/catalogue-menus" class="btn btn-outline-success">
            ← Retour aux menus
          </a>
        </div>
      </div>
    </article>
  `;
}

loadMenuDetail();