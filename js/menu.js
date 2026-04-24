async function loadMenu() {
  const container = document.getElementById("menu-container");

  if (!container) return;

  const themeRecherche = container.dataset.theme;

  try {
    const response = await fetch("https://ecfbackendapi-production.up.railway.app/api/menus");
    const menus = await response.json();

   const normalize = (str) =>
    str
        ?.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const menu = menus.find(
    (item) =>
        item.theme &&
        normalize(item.theme.libelle) === normalize(themeRecherche)
);

    if (!menu) {
      container.innerHTML = "<p>Aucun menu disponible.</p>";
      return;
    }

    const entree = menu.plats[0];
    const plat = menu.plats[1];
    const dessert = menu.plats[2];

    container.innerHTML = `
      <div class="menu-block">
        <h2>Description</h2>
        <p>${menu.description}</p>
      </div>

      <div class="menu-block">
        <h2>Plats inclus</h2>

        <div class="menu-line">
          <span class="menu-label">Entrée :</span>
          <span class="menu-value">${entree ? entree.titre : "Non défini"}</span>
        </div>

        <div class="menu-line">
          <span class="menu-label">Plat :</span>
          <span class="menu-value">${plat ? plat.titre : "Non défini"}</span>
        </div>

        <div class="menu-line">
          <span class="menu-label">Dessert :</span>
          <span class="menu-value">${dessert ? dessert.titre : "Non défini"}</span>
        </div>
      </div>

      <div class="menu-block">
        <h2>Prix</h2>
        <p class="menu-price">${Number(menu.prix_par_personne).toFixed(2)} € / personne</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erreur lors du chargement du menu.</p>";
  }
}

loadMenu();