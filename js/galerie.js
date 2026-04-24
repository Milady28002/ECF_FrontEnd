const API_GALERIE_URL = "https://ecfbackendapi-production.up.railway.app/api/galerie";

const editModal = document.getElementById("EditionPhotoModal");
const deleteModal = document.getElementById("DeletePhotoModal");
const galerieImage = document.getElementById("allImages");
const filterButtons = document.querySelectorAll(".galerie-filter-btn");

const editModalTitle = document.getElementById("EditionPhotoModalLabel");
const openAddImageModalButton = document.getElementById("OpenAddImageModalButton");

const namePhotoInput = document.getElementById("NamePhotoInput");
const imageInput = document.getElementById("ImageInput");
const categorieInput = document.getElementById("CategorieInput");

const deleteTitle = document.getElementById("DeleteTitle");
const deleteImg = document.getElementById("DeleteImg");

const saveEditButton = document.getElementById("SaveImageButton");
const addImageButton = document.getElementById("AddImageButton");
const confirmDeleteButton = document.getElementById("ConfirmDeleteButton");

let galleryImages = [];
let currentFilter = "all";
let currentImageIdToEdit = null;
let currentImageIdToDelete = null;

function getCookie(name) {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return "";
}

function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return getCookie("accesstoken");
}

function userCanManageGallery() {
  if (
    typeof window.isConnected !== "function" ||
    typeof window.getRole !== "function"
  ) {
    return false;
  }

  if (!window.isConnected()) {
    return false;
  }

  const role = window.getRole();
  return role === "ROLE_ADMIN" || role === "ROLE_EMPLOYE";
}

function resetEditModalFields() {
  currentImageIdToEdit = null;

  if (namePhotoInput) namePhotoInput.value = "";
  if (imageInput) imageInput.value = "";
  if (categorieInput) categorieInput.value = "sale";
}

function updateEditModalMode(isEditMode) {
  if (editModalTitle) {
    editModalTitle.textContent = isEditMode ? "Édition photo" : "Ajouter une image";
  }

  if (saveEditButton) {
    saveEditButton.style.display = isEditMode ? "inline-block" : "none";
  }

  if (addImageButton) {
    addImageButton.style.display = isEditMode ? "none" : "inline-block";
  }
}

function getActionButtons(imageId) {
  if (!userCanManageGallery()) {
    return "";
  }

  return `
    <div class="action-image-buttons">
      <button
        type="button"
        class="btn btn-outline-light btn-edit"
        data-id="${imageId}"
        data-bs-toggle="modal"
        data-bs-target="#EditionPhotoModal"
      >
        <i class="bi bi-pencil-square"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline-light btn-delete"
        data-id="${imageId}"
        data-bs-toggle="modal"
        data-bs-target="#DeletePhotoModal"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;
}

function getImageCard(image) {
  const safeTitre = typeof sanitizeHtml === "function" ? sanitizeHtml(image.titre) : image.titre;
  const safeUrl = typeof sanitizeHtml === "function" ? sanitizeHtml(image.url) : image.url;
  const safeCategorie = typeof sanitizeHtml === "function" ? sanitizeHtml(image.categorie) : image.categorie;

  return `
    <div
      class="galerie-items"
      data-id="${image.id}"
      data-title="${safeTitre}"
      data-src="${safeUrl}"
      data-category="${safeCategorie}"
    >
      <img class="w-100 rounded" src="${safeUrl}" alt="${safeTitre}">
      <div class="galerie-caption">
        <span>${safeTitre}</span>
      </div>
      ${getActionButtons(image.id)}
    </div>
  `;
}

function renderImages(filter = "all") {
  if (!galerieImage) return;

  const imagesFiltrees =
    filter === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.categorie === filter);

  if (!imagesFiltrees.length) {
    galerieImage.innerHTML = `
      <div class="commande-empty">
        <p>Aucune image ne correspond à ce filtre.</p>
      </div>
    `;
    return;
  }

  galerieImage.innerHTML = imagesFiltrees
    .map((image) => getImageCard(image))
    .join("");
}

async function loadGalleryImages() {
  if (!galerieImage) return;

  try {
    const response = await fetch(API_GALERIE_URL);
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      galerieImage.innerHTML = "<p>Erreur lors du chargement de la galerie.</p>";
      return;
    }

    galleryImages = Array.isArray(data) ? data : [];
    renderImages(currentFilter);
  } catch (error) {
    console.error("Erreur chargement galerie :", error);
    galerieImage.innerHTML = "<p>Erreur réseau lors du chargement de la galerie.</p>";
  }
}

openAddImageModalButton?.addEventListener("click", () => {
  resetEditModalFields();
  updateEditModalMode(false);
});

editModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;

  if (button?.id === "OpenAddImageModalButton") {
    resetEditModalFields();
    updateEditModalMode(false);
    return;
  }

  const imageId = Number(button?.dataset.id);
  const image = galleryImages.find((item) => item.id === imageId);

  if (!image) return;

  currentImageIdToEdit = image.id;
  updateEditModalMode(true);

  if (namePhotoInput) {
    namePhotoInput.value = image.titre || "";
  }

  if (imageInput) {
    imageInput.value = image.url || "";
  }

  if (categorieInput) {
    categorieInput.value = image.categorie || "sale";
  }
});

deleteModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const imageId = Number(button?.dataset.id);

  const image = galleryImages.find((item) => item.id === imageId);
  if (!image) return;

  currentImageIdToDelete = image.id;

  if (deleteTitle) {
    deleteTitle.textContent = image.titre || "";
  }

  if (deleteImg) {
    deleteImg.src = image.url || "";
    deleteImg.alt = image.titre || "Image galerie";
  }
});

saveEditButton?.addEventListener("click", async () => {
  if (!currentImageIdToEdit) return;

  const token = getTokenSafe();
  if (!token) {
    alert("Vous devez être connecté pour modifier une image.");
    return;
  }

  const nouveauTitre = namePhotoInput?.value.trim() || "";
  const nouvelleUrl = imageInput?.value.trim() || "";
  const nouvelleCategorie = categorieInput?.value || "";

  if (!nouveauTitre || !nouvelleUrl || !nouvelleCategorie) {
    alert("Le titre, l’url et la catégorie sont obligatoires.");
    return;
  }

  try {
    const response = await fetch(`${API_GALERIE_URL}/${currentImageIdToEdit}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({
        titre: nouveauTitre,
        url: nouvelleUrl,
        categorie: nouvelleCategorie
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible de modifier l’image.");
      return;
    }

    const modalInstance = bootstrap.Modal.getInstance(editModal);
    modalInstance?.hide();

    resetEditModalFields();
    await loadGalleryImages();
  } catch (error) {
    console.error("Erreur modification image :", error);
    alert("Erreur réseau lors de la modification.");
  }
});

addImageButton?.addEventListener("click", async () => {
  const token = getTokenSafe();

  if (!token) {
    alert("Vous devez être connecté pour ajouter une image.");
    return;
  }

  const titre = namePhotoInput?.value.trim() || "";
  const url = imageInput?.value.trim() || "";
  const categorie = categorieInput?.value || "";

  if (!titre || !url || !categorie) {
    alert("Le titre, l’url et la catégorie sont obligatoires.");
    return;
  }

  try {
    const response = await fetch(API_GALERIE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({
        titre,
        url,
        categorie
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible d’ajouter l’image.");
      return;
    }

    const modalInstance = bootstrap.Modal.getInstance(editModal);
    modalInstance?.hide();

    resetEditModalFields();
    await loadGalleryImages();
  } catch (error) {
    console.error("Erreur ajout image :", error);
    alert("Erreur réseau lors de l’ajout.");
  }
});

confirmDeleteButton?.addEventListener("click", async () => {
  if (!currentImageIdToDelete) return;

  const token = getTokenSafe();
  if (!token) {
    alert("Vous devez être connecté pour supprimer une image.");
    return;
  }

  try {
    const response = await fetch(`${API_GALERIE_URL}/${currentImageIdToDelete}`, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      alert(data?.message || "Impossible de supprimer l’image.");
      return;
    }

    const modalInstance = bootstrap.Modal.getInstance(deleteModal);
    modalInstance?.hide();

    currentImageIdToDelete = null;
    await loadGalleryImages();
  } catch (error) {
    console.error("Erreur suppression image :", error);
    alert("Erreur réseau lors de la suppression.");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";
    currentFilter = filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    renderImages(currentFilter);
  });
});

if (!userCanManageGallery()) {
  const addImageWrapper = document.getElementById("add-image-wrapper");
  if (addImageWrapper) {
    addImageWrapper.style.display = "none";
  }
}

updateEditModalMode(true);
loadGalleryImages();