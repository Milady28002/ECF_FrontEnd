async function loadMesCommandes() {
  const container = document.getElementById("orders-container");

  if (!container) return;

  const token = window.getToken();
  console.log("token mes-commandes =", token);

  if (!token) {
    container.innerHTML = "<p>Vous devez être connecté pour voir vos commandes.</p>";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/commandes/mes-commandes", {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      container.innerHTML = "<p>Utilisateur non authentifié.</p>";
      return;
    }

    if (response.status === 403) {
      container.innerHTML = "<p>Accès interdit.</p>";
      return;
    }

    if (!response.ok) {
      container.innerHTML = "<p>Erreur lors du chargement des commandes.</p>";
      return;
    }

    const commandes = await response.json();

    if (!commandes.length) {
      container.innerHTML = "<p>Vous n’avez encore aucune commande.</p>";
      return;
    }

    container.innerHTML = commandes.map(commande => `
      <div class="allorders">
        <a href="#/commande-detail?id=${commande.numero_commande}">
          <span class="order-date">${commande.date_commande}</span> |
          <span class="order-time">${commande.heure_livraison}</span> |
          <span class="order-menu">Commande ${commande.numero_commande}</span> |
          <span class="order-status">${commande.statut}</span> |
          <span class="order-total">${commande.prix_total} €</span>
        </a>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Une erreur est survenue.</p>";
  }
}

loadMesCommandes();