function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }
  return localStorage.getItem("token");
}

function getMenuIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function getTypePlatLabel(type) {
  switch (String(type)) {
    case "1":
      return "Entrée";
    case "2":
      return "Plat";
    case "3":
      return "Dessert";
    default:
      return "Non renseigné";
  }
}

function updateImagePreview() {
  const input = document.getElementById("image");
  const preview = document.getElementById("preview-image");

  if (!input || !preview) return;

  const value = input.value.trim();

  if (!value) {
    preview.src = "";
    preview.style.display = "none";
    return;
  }

  preview.src = value;
  preview.style.display = "block";
}

function initImagePreview() {
  const input = document.getElementById("image");
  if (!input) return;

  input.addEventListener("input", updateImagePreview);
  updateImagePreview();
}

async function loadPlats() {
  const container = document.getElementById("plats-checkboxes");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/plats`);
    const plats = await response.json().catch(() => null);

    if (!response.ok || !Array.isArray(plats)) {
      container.innerHTML = "<p>Impossible de charger les plats.</p>";
      return;
    }

    plats.sort((a, b) => {
      return Number(a.type_plat) - Number(b.type_plat);
    });

    container.innerHTML = plats.map(plat => `
      <div class="form-check">
        <input
          class="form-check-input plat-checkbox"
          type="checkbox"
          value="${plat.id}"
          id="plat-${plat.id}"
        >
        <label class="form-check-label" for="plat-${plat.id}">
          ${plat.titre_plat} (${getTypePlatLabel(plat.type_plat)})
        </label>
      </div>
    `).join("");

  } catch (error) {
    console.error("Erreur loadPlats :", error);
    container.innerHTML = "<p>Erreur réseau lors du chargement des plats.</p>";
  }
}

function getSelectedPlatIds() {
  return Array.from(document.querySelectorAll(".plat-checkbox:checked"))
    .map(input => Number(input.value));
}

function setSelectedPlatIds(ids) {
  ids.forEach(id => {
    const checkbox = document.getElementById(`plat-${id}`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

async function loadMenuIfEdit() {
  const id = getMenuIdFromUrl();
  if (!id) return;

  const formTitle = document.getElementById("form-title");
  if (formTitle) {
    formTitle.textContent = "Modifier un menu";
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/menus/${id}`);
    const menu = await response.json().catch(() => null);

      if (!response.ok || !menu) {
        alert(menu?.message || "Impossible de charger le menu.");
        return;
      }

    document.getElementById("titre").value = menu.titre || "";
    document.getElementById("description").value = menu.description || "";
    document.getElementById("prix").value = menu.prix_par_personne ?? "";
    document.getElementById("min-personnes").value = menu.nombre_personne_minimum ?? "";
    document.getElementById("stock").value = menu.quantite_restante ?? "";
    document.getElementById("image").value = menu.image || "";
    document.getElementById("conditions").value = menu.conditions_menu || "";
    document.getElementById("regime").value = menu.regime?.id ?? "";
    document.getElementById("theme").value = menu.theme?.id ?? "";

    updateImagePreview();

    if (Array.isArray(menu.plats)) {
      setSelectedPlatIds(menu.plats.map(plat => plat.id));
    }

  } catch (error) {
    console.error("Erreur loadMenuIfEdit :", error);
    alert("Erreur réseau lors du chargement du menu.");
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const id = getMenuIdFromUrl();
  const token = getTokenSafe();

  if (!token) {
    window.location.hash = "#/signin";
    return;
  }

  const selectedPlats = getSelectedPlatIds();

  if (selectedPlats.length === 0) {
    alert("Veuillez sélectionner au moins un plat.");
    return;
  }

  const payload = {
    titre: document.getElementById("titre").value.trim(),
    description: document.getElementById("description").value.trim(),
    prix_par_personne: Number(document.getElementById("prix").value.replace(",", ".")),
    nombre_personne_minimum: Number(document.getElementById("min-personnes").value),
    quantite_restante: Number(document.getElementById("stock").value),
    image: document.getElementById("image").value.trim() || null,
    conditions_menu: document.getElementById("conditions").value.trim() || null,
    regime_id: Number(document.getElementById("regime").value),
    theme_id: Number(document.getElementById("theme").value),
    plats: selectedPlats
  };

  const url = id
    ? `${API_BASE_URL}/api/menus/${id}`
    : `${API_BASE_URL}/api/menus`;

  const method = id ? "PATCH" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Erreur lors de l'enregistrement.");
      return;
    }

    alert(id ? "Menu modifié avec succès." : "Menu créé avec succès.");
    window.location.hash = "#/gestion-menus";

  } catch (error) {
    console.error("Erreur handleSubmit :", error);
    alert("Erreur réseau.");
  }
}

document.getElementById("menu-form")?.addEventListener("submit", handleSubmit);

async function initMenuForm() {
  initImagePreview();
  await loadPlats();
  await loadMenuIfEdit();
}

initMenuForm();