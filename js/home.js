async function loadAvis() {
  const container = document.getElementById("avis-container");
  if (!container) return;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/avis");
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      container.innerHTML = "<p>Erreur lors du chargement des avis.</p>";
      return;
    }

    renderAvis(data);
  } catch (error) {
    console.error("Erreur chargement avis :", error);
    container.innerHTML = "<p>Erreur réseau.</p>";
  }
}

function renderAvis(avisList) {
  const container = document.getElementById("avis-container");
  if (!container) return;

  if (!avisList.length) {
    container.innerHTML = "<p>Aucun avis pour le moment.</p>";
    return;
  }

  const avisToShow = avisList.slice(0, 2);

  container.innerHTML = avisToShow.map((avis) => `
    <article class="avis-card">
      <div class="avis-header">
        <span class="avis-user">${avis.utilisateur?.firstname || "Client"}</span>
        <span class="avis-date">${formatDate(avis.date_creation)}</span>
      </div>

      <div class="avis-stars">
        ${renderStars(avis.note)}
      </div>

      <p class="avis-comment">${avis.description}</p>
    </article>
  `).join("");
}

function renderStars(note) {
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    stars += i <= note ? "⭐" : "☆";
  }

  return stars;
}

function formatDate(dateString) {
  if (!dateString) return "Date inconnue";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("fr-FR");
}

loadAvis();