const editModal = document.getElementById("EditionPhotoModal");

class Image {
    constructor(titre, url) {
      this.titre = titre;
      this.url = url;
    }
}

editModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;               // bouton cliqué
  const item = button.closest(".galerie-items");    // la photo associée

  const title = item?.dataset.title ?? "";

  document.getElementById("NamePhotoInput").value = title;
});

const deleteModal = document.getElementById("DeletePhotoModal");

deleteModal?.addEventListener("show.bs.modal", (event) => {
  const button = event.relatedTarget;
  const item = button.closest(".galerie-items");

  /*const title = item?.dataset.title ?? "";
  const src = item?.dataset.src ?? "";*/

  const img = item.querySelector("img");
  const title = item?.dataset.title || img?.alt || "";
  const src = item?.dataset.src || img?.getAttribute("src") || "";

  document.getElementById("DeleteTitle").textContent = title; // ✅ anti-XSS
  document.getElementById("DeleteImg").src = src;
  document.getElementById("DeleteImg").alt = title;
});

const galerieImage = document.getElementById("allImages"); 

let mesImages = recupImages();
mesImages.forEach(image => {
  galerieImage.innerHTML += getImage(image.titre,image.url);
});


function getImage(titre, urlImage){
  titre = sanitizeHtml(titre);
  urlImage = sanitizeHtml(urlImage);
  return `
            <div class="galerie-items" data-title="${titre}" data-src="${urlImage}">
                <img class="w-100 rounded" src="${urlImage}" alt="${titre}">
                <div class="action-image-buttons">
                    <button type="button" class="btn btn-outline-light btn-edit" data-bs-toggle="modal" data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-light btn-delete" data-bs-toggle="modal" data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>               
                </div>
            </div>`;
}

function recupImages() {
  const allImages = [
    new Image("Asperges et canard","../assets/asperges-galerie.jpg"),
    new Image("Burgers maison","../assets/burgers-galerie.jpg"),
    new Image("Crevettes marinées","../assets/crevettes-galerie.jpg"),
    new Image("Pâtes thaï","../assets/thai-galerie.jpg"),
    new Image("Sushis","../assets/sushi-galerie.jpg"),
    new Image("Truites aux herbes","../assets/poisson-galerie.png"),
    new Image("Velouté de butternut","../assets/veloute-galerie.jpg"),
    new Image("Tacos au poulet","../assets/tacos-galerie.jpg"),
    new Image("Mousse à la framboise","../assets/framboises-galerie.jpg"),
    new Image("Roulé à la farise","../assets/strawberry-roll-galerie.jpg"),
    new Image("Pancake","../assets/pancake-galerie.jpg"),
    new Image("Mousse à la mangue","../assets/mousse-mangue-galerie.jpg"),
  ];
  return allImages;
}