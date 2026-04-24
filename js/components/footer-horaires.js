async function loadFooterHoraires() {
  const horairesList = document.getElementById("footer-horaires-list");
  if (!horairesList) return;

  try {
    const response = await fetch("https://ecfbackendapi-production.up.railway.app/api/horaires");

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des horaires");
    }

    const horaires = await response.json();

    if (!Array.isArray(horaires) || horaires.length === 0) {
      horairesList.innerHTML = "<li>Aucun horaire disponible.</li>";
      return;
    }

    horairesList.innerHTML = horaires.map((horaire) => {
      const ouverture = horaire.heure_ouverture;
      const fermeture = horaire.heure_fermeture;

      const texteHoraire =
        ouverture.toLowerCase() === "fermé" || fermeture.toLowerCase() === "fermé"
          ? "Fermé"
          : `${ouverture} - ${fermeture}`;

      return `
        <li>
          <strong>${horaire.jour} :</strong> ${texteHoraire}
        </li>
      `;
    }).join("");
  } catch (error) {
    console.error("Erreur footer horaires :", error);
    horairesList.innerHTML = "<li>Impossible de charger les horaires.</li>";
  }
}

loadFooterHoraires();