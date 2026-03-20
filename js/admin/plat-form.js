function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return localStorage.getItem("token");
}

function getPlatIdFromUrl() {
  const hash = window.location.hash || "";
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  return params.get("id");
}

function isEditMode() {
  return getPlatIdFromUrl() !== null;
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

function fillForm(plat) {
  const titreInput = document.getElementById("titre");
  const imageInput = document.getElementById("image");
  const typeInput = document.getElementById("type");

  if (titreInput) titreInput.value = plat.titre_plat || "";
  if (imageInput) imageInput.value = plat.image_url || "";
  if (typeInput) typeInput.value = String(plat.type_plat || "1");

  updateImagePreview();
}

function updateFormTitle() {
  const title = document.getElementById("plat-form-title");
  if (!title) return;

  title.textContent = isEditMode() ? "Modifier un plat" : "Créer un plat";
}

async function loadPlat() {
  const platId = getPlatIdFromUrl();
  if (!platId) return;

  const token = getTokenSafe();

  if (!token) {
    window.location.hash = "#/signin";
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/plats/${platId}`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Erreur chargement plat :", data);
      alert(data?.message || "Impossible de charger le plat.");
      return;
    }

    fillForm(data);

  } catch (error) {
    console.error("Erreur loadPlat :", error);
    alert("Erreur réseau lors du chargement du plat.");
  }
}

async function submitForm(event) {
  event.preventDefault();

  const token = getTokenSafe();
  const platId = getPlatIdFromUrl();
  const isEdit = !!platId;

  if (!token) {
    window.location.hash = "#/signin";
    return;
  }

  const titre = document.getElementById("titre")?.value.trim();
  const image = document.getElementById("image")?.value.trim();
  const type = document.getElementById("type")?.value;

  if (!titre) {
    alert("Le titre est obligatoire.");
    return;
  }

  if (!type) {
    alert("Le type de plat est obligatoire.");
    return;
  }

  const payload = {
    titre_plat: titre,
    image_url: image || null,
    type_plat: type
  };

  const url = isEdit
    ? `http://127.0.0.1:8000/api/plats/${platId}`
    : "http://127.0.0.1:8000/api/plats";

  const method = isEdit ? "PUT" : "POST";

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
      alert(data?.message || "Erreur lors de l’enregistrement.");
      return;
    }

    window.location.hash = "#/gestion-plats";

  } catch (error) {
    console.error("Erreur submitForm :", error);
    alert("Erreur réseau.");
  }
}

function initImagePreview() {
  const input = document.getElementById("image");

  if (!input) return;

  input.addEventListener("input", updateImagePreview);

  updateImagePreview();
}

document.getElementById("plat-form")?.addEventListener("submit", submitForm);

updateFormTitle();
initImagePreview();
loadPlat();