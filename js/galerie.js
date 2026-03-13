const editModal = document.getElementById("EditionPhotoModal");
const deleteModal = document.getElementById("DeletePhotoModal");
const galerieImage = document.getElementById("allImages");

class Image {
  constructor(titre, url) {
    this.titre = titre;
    this.url = url;
  }
}

editModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const item = button?.closest(".galerie-items");

  const title = item?.dataset.title ?? "";

  const namePhotoInput = document.getElementById("NamePhotoInput");
  if (namePhotoInput) {
    namePhotoInput.value = title;
  }
});

deleteModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const item = button?.closest(".galerie-items");

  const title = item?.dataset.title ?? "";
  const src = item?.dataset.src ?? "";

  const deleteTitle = document.getElementById("DeleteTitle");
  const deleteImg = document.getElementById("DeleteImg");

  if (deleteTitle) {
    deleteTitle.textContent = title;
  }

  if (deleteImg) {
    deleteImg.src = src;
    deleteImg.alt = title;
  }
});

function getImage(titre, urlImage) {
  const safeTitre = typeof sanitizeHtml === "function" ? sanitizeHtml(titre) : titre;
  const safeUrlImage = typeof sanitizeHtml === "function" ? sanitizeHtml(urlImage) : urlImage;

  return `
    <div class="galerie-items" data-title="${safeTitre}" data-src="${safeUrlImage}">
      <img class="w-100 rounded" src="${safeUrlImage}" alt="${safeTitre}">
      <div class="action-image-buttons">
        <button type="button" class="btn btn-outline-light btn-edit" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button type="button" class="btn btn-outline-light btn-delete" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `;
}

function recupImages() {
  return [
    new Image("Asperges et canard", "../assets/asperges-galerie.jpg"),
    new Image("Burgers maison", "../assets/burgers-galerie.jpg"),
    new Image("Crevettes marinées", "../assets/crevettes-galerie.jpg"),
    new Image("Pâtes thaïlandaises", "../assets/thai-galerie.jpg"),
    new Image("Sushis", "../assets/sushi-galerie.jpg"),
    new Image("Truites aux herbes", "../assets/poisson-galerie.png"),
    new Image("Velouté de butternut", "../assets/veloute-galerie.jpg"),
    new Image("Tacos au poulet", "../assets/tacos-galerie.jpg"),
    new Image("Mousse à la framboise", "../assets/framboises-galerie.jpg"),
    new Image("Roulé à la fraise", "../assets/strawberry-roll-galerie.jpg"),
    new Image("Pancake", "../assets/pancake-galerie.jpg"),
    new Image("Mousse à la mangue", "../assets/mousse-mangue-galerie.jpg"),
  ];
}

if (galerieImage) {
  const mesImages = recupImages();
  galerieImage.innerHTML = mesImages.map((image) => getImage(image.titre, image.url)).join("");
}