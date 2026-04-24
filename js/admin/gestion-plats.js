function getTokenSafe() {
  if (window.getToken && typeof window.getToken === "function") {
    return window.getToken();
  }

  return localStorage.getItem("token");
}

function formatTypePlat(type) {
  const labels = {
    "1": "Entrée",
    "2": "Plat",
    "3": "Dessert"
  };

  return labels[String(type)] || "Non renseigné";
}

async function loadPlats() {
  const container = document.getElementById("plats-container");
  if (!container) return;

  try {
    const token = getTokenSafe();
    console.log("token gestion-plats =", token);

    if (!token) {
      container.innerHTML = "<p>Utilisateur non authentifié.</p>";
      return;
    }

    const response = await fetch("https://ecfbackendapi-production.up.railway.app/api/plats", {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const plats = await response.json().catch(() => []);

    if (!response.ok) {
      console.error("Erreur API plats :", response.status, plats);
      container.innerHTML = "<p>Erreur de chargement des plats.</p>";
      return;
    }

    renderPlats(plats);

  } catch (error) {
    console.error("Erreur loadPlats :", error);
    container.innerHTML = "<p>Erreur de chargement</p>";
  }
}

function renderPlats(plats) {
  const container = document.getElementById("plats-container");
  if (!container) return;

  if (!plats.length) {
    container.innerHTML = "<p>Aucun plat trouvé.</p>";
    return;
  }

  container.innerHTML = `
    <div class="plats-admin-grid">
      ${plats.map(plat => `
        <article class="plat-admin-card">
          <div class="plat-admin-card_image">
            <img src="${plat.image_url || "/assets/images/default.jpg"}" alt="${plat.titre_plat}">
          </div>

          <div class="plat-admin-card_content">
            <h2>${plat.titre_plat}</h2>
            <p class="plat-admin-card_type">${formatTypePlat(plat.type_plat)}</p>

            <div class="plat-admin-card_actions">
              <button
                class="btn btn-outline-primary btn-sm"
                onclick="editPlat(${plat.id})"
              >
                Modifier
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                onclick="deletePlat(${plat.id})"
              >
                Supprimer
              </button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function editPlat(id) {
  window.location.hash = `#/edit-plat?id=${id}`;
}

async function deletePlat(id) {
  const confirmed = window.confirm("Voulez-vous vraiment supprimer ce plat ?");
  if (!confirmed) return;

  const token = getTokenSafe();

  if (!token) {
    alert("Utilisateur non authentifié.");
    return;
  }

  try {
    const response = await fetch(`https://ecfbackendapi-production.up.railway.app/api/plats/${id}`, {
      method: "DELETE",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      alert(data?.message || "Impossible de supprimer le plat.");
      return;
    }

    loadPlats();
  } catch (error) {
    console.error("Erreur suppression plat :", error);
    alert("Erreur réseau.");
  }
}

window.deletePlat = deletePlat;
window.editPlat = editPlat;

loadPlats();