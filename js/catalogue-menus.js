console.log("catalogue-menus.js chargé");

async function loadMenus() {
  console.log("loadMenus lancé");

  const prixMin = document.getElementById("prixMin")?.value || "";
  const prixMax = document.getElementById("prixMax")?.value || "";
  const theme = document.getElementById("theme")?.value || "";
  const regime = document.getElementById("regime")?.value || "";
  const personnesMin = document.getElementById("personnesMin")?.value || "";

  const params = new URLSearchParams();

  if (prixMin) params.append("prixMin", prixMin);
  if (prixMax) params.append("prixMax", prixMax);
  if (theme) params.append("theme", theme);
  if (regime) params.append("regime", regime);
  if (personnesMin) params.append("personnesMin", personnesMin);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/menus?${params.toString()}`);
    console.log("response reçue", response);

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des menus");
    }

    const menus = await response.json();
    console.log("menus JSON", menus);

    renderMenus(menus);
  } catch (error) {
    console.error("Erreur loadMenus :", error);
    const container = document.getElementById("menus-container");

    if (container) {
      container.innerHTML = "<p>Impossible de charger les menus pour le moment.</p>";
    }
  }
}

function renderMenus(menus) {
  const container = document.getElementById("menus-container");
  if (!container) return;

  if (!menus.length) {
    container.innerHTML = "<p>Aucun menu ne correspond aux filtres sélectionnés.</p>";
    return;
  }

  container.innerHTML = menus.map(menu => `
    <article class="menu-card">
      ${menu.image ? `
        <div class="menu-card_image">
          <img src="${menu.image}" alt="${menu.titre}">
        </div>
      ` : ""}

      <div class="menu-card_content">
        <h2>${menu.titre}</h2>

        <p class="menu-card_description">${menu.description}</p>

        <p><strong>Thème :</strong> ${menu.theme ? menu.theme.libelle : "Non renseigné"}</p>
        <p><strong>Régime :</strong> ${menu.regime ? menu.regime.libelle : "Non renseigné"}</p>
        <p><strong>Minimum :</strong> ${menu.nombre_personne_minimum} personnes</p>
        <p><strong>Stock disponible :</strong> ${menu.quantite_restante}</p>

        <p class="menu-card_price">${menu.prix_par_personne.toFixed(2).replace(".", ",")} € / personne</p>

        <a href="#/menu-detail?id=${menu.id}" class="btn btn-primary menu-card_btn">Voir le détail</a>
      </div>
    </article>
  `).join("");
}


function resetFilters() {
  const prixMin = document.getElementById("prixMin");
  const prixMax = document.getElementById("prixMax");
  const theme = document.getElementById("theme");
  const regime = document.getElementById("regime");
  const personnesMin = document.getElementById("personnesMin");

  if (prixMin) prixMin.value = "";
  if (prixMax) prixMax.value = "";
  if (theme) theme.value = "";
  if (regime) regime.value = "";
  if (personnesMin) personnesMin.value = "";

  loadMenus();
}

function initCatalogueMenus() {
  console.log("initCatalogueMenus lancé");

  const container = document.getElementById("menus-container");
  if (!container) return;

  loadMenus();

  document.getElementById("prixMin")?.addEventListener("input", loadMenus);
  document.getElementById("prixMax")?.addEventListener("input", loadMenus);
  document.getElementById("theme")?.addEventListener("change", loadMenus);
  document.getElementById("regime")?.addEventListener("change", loadMenus);
  document.getElementById("personnesMin")?.addEventListener("input", loadMenus);
  document.getElementById("resetFilters")?.addEventListener("click", resetFilters);
}

initCatalogueMenus();