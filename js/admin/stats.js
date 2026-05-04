const table = document.getElementById("statsTable");
const statutFilter = document.getElementById("statutFilter");
const menuFilter = document.getElementById("menuFilter");
const dateDebut = document.getElementById("dateDebut");
const dateFin = document.getElementById("dateFin");
const btnLoadStats = document.getElementById("btnLoadStats");

const chartCanvas = document.getElementById("statsChart");
const countChartCanvas = document.getElementById("statsCountChart");
const evolutionChartCanvas = document.getElementById("statsEvolutionChart");

let statsChart = null;
let statsCountChart = null;
let statsEvolutionChart = null;

function getToken() {
  return getCookie("accesstoken");
}

async function loadMenusForFilter() {
  if (!menuFilter) return;

  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/menus`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const menus = await response.json().catch(() => []);

    if (!response.ok || !Array.isArray(menus)) {
      throw new Error("Erreur chargement menus");
    }

    menuFilter.innerHTML = `
      <option value="">Tous les menus</option>
      ${menus.map(menu => `
        <option value="${menu.id}">${menu.titre}</option>
      `).join("")}
    `;
  } catch (error) {
    console.error("Erreur chargement filtre menus :", error);
    menuFilter.innerHTML = `<option value="">Tous les menus</option>`;
  }
}

async function loadStats() {
  if (!table || !statutFilter) return;

  const token = getToken();

  const params = new URLSearchParams();
  params.append("statut", statutFilter.value);

  if (menuFilter?.value) {
    params.append("menu_id", menuFilter.value);
  }

  if (dateDebut?.value) {
    params.append("date_debut", dateDebut.value);
  }

  if (dateFin?.value) {
    params.append("date_fin", dateFin.value);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats?${params.toString()}`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Erreur chargement statistiques");
    }

    renderStats(data);
    renderRevenueChart(data);
    renderCountChart(data);
    await loadEvolutionChart();
  } catch (error) {
    console.error("Erreur chargement stats :", error);

    table.innerHTML = `
      <tr>
        <td colspan="3">Erreur lors du chargement des statistiques.</td>
      </tr>
    `;

    destroyRevenueChart();
    destroyCountChart();
    destroyEvolutionChart();
  }
}

async function loadEvolutionChart() {
  if (!evolutionChartCanvas || !statutFilter) return;

  const token = getToken();

  const params = new URLSearchParams();
  params.append("statut", statutFilter.value);

  if (dateDebut?.value) {
    params.append("date_debut", dateDebut.value);
  }

  if (dateFin?.value) {
    params.append("date_fin", dateFin.value);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats/evolution?${params.toString()}`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Erreur chargement évolution");
    }

    renderEvolutionChart(data);
  } catch (error) {
    console.error("Erreur chargement évolution :", error);
    destroyEvolutionChart();
  }
}

function renderStats(stats) {
  if (!table) return;

  if (!Array.isArray(stats) || stats.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="3">Aucune donnée disponible pour ces filtres.</td>
      </tr>
    `;
    return;
  }

  const totalCommandes = stats.reduce(
    (sum, stat) => sum + Number(stat.nombre_commandes || 0),
    0
  );

  const totalCA = stats.reduce(
    (sum, stat) => sum + Number(stat.chiffre_affaire_total || 0),
    0
  );

  table.innerHTML = `
    ${stats.map(stat => `
      <tr>
        <td>${stat.menu_titre}</td>
        <td>${stat.nombre_commandes}</td>
        <td>${Number(stat.chiffre_affaire_total).toFixed(2)} €</td>
      </tr>
    `).join("")}
    <tr class="fw-bold">
      <td>Total</td>
      <td>${totalCommandes}</td>
      <td>${totalCA.toFixed(2)} €</td>
    </tr>
  `;
}

function renderRevenueChart(stats) {
  if (!chartCanvas) return;

  if (!Array.isArray(stats) || stats.length === 0) {
    destroyRevenueChart();
    return;
  }

  const labels = stats.map(stat => stat.menu_titre);
  const dataValues = stats.map(stat => Number(stat.chiffre_affaire_total || 0));

  destroyRevenueChart();

  statsChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Chiffre d'affaires (€)",
          data: dataValues,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderCountChart(stats) {
  if (!countChartCanvas) return;

  if (!Array.isArray(stats) || stats.length === 0) {
    destroyCountChart();
    return;
  }

  const labels = stats.map(stat => stat.menu_titre);
  const dataValues = stats.map(stat => Number(stat.nombre_commandes || 0));

  destroyCountChart();

  statsCountChart = new Chart(countChartCanvas, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Répartition des commandes",
          data: dataValues,
          backgroundColor: [
            "#008cff",
            "#6f00ff",
            "#7bbd2f",
            "#ff9800",
            "#e91e63",
            "#00bcd4"
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function renderEvolutionChart(stats) {
  if (!evolutionChartCanvas) return;

  if (!Array.isArray(stats) || stats.length === 0) {
    destroyEvolutionChart();
    return;
  }

  const labels = stats.map(stat => stat.date_commande);
  const dataValues = stats.map(stat => Number(stat.chiffre_affaire_total || 0));

  destroyEvolutionChart();

  statsEvolutionChart = new Chart(evolutionChartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Évolution du chiffre d'affaires (€)",
          data: dataValues,
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function destroyRevenueChart() {
  if (statsChart) {
    statsChart.destroy();
    statsChart = null;
  }
}

function destroyCountChart() {
  if (statsCountChart) {
    statsCountChart.destroy();
    statsCountChart = null;
  }
}

function destroyEvolutionChart() {
  if (statsEvolutionChart) {
    statsEvolutionChart.destroy();
    statsEvolutionChart = null;
  }
}

btnLoadStats?.addEventListener("click", loadStats);
statutFilter?.addEventListener("change", loadStats);

async function initStatsPage() {
  await loadMenusForFilter();
  await loadStats();
}

if (table && statutFilter) {
  initStatsPage();
}