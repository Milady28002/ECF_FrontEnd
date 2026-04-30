const apiUrl = "https://ecfbackendapi-production.up.railway.app/api/";

async function loadEmployees() {
  const container = document.getElementById("employees-list");
  const token = getToken();

  try {
    const response = await fetch(`${apiUrl}admin/employees`, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    if (!response.ok) {
      throw new Error("Erreur chargement employés");
    }

    const employees = await response.json();

    if (employees.length === 0) {
      container.innerHTML = "<p>Aucun employé</p>";
      return;
    }

    container.innerHTML = employees.map(emp => `
      <div class="border p-3 mb-2 d-flex justify-content-between align-items-center">
        <div>
          <strong>${emp.email}</strong><br>
          Statut : ${emp.is_active ? "Actif" : "Inactif"}
        </div>

        <button 
          class="btn ${emp.is_active ? "btn-danger" : "btn-success"}"
          onclick="toggleEmployee(${emp.id})"
        >
          ${emp.is_active ? "Désactiver" : "Activer"}
        </button>
      </div>
    `).join("");

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erreur de chargement</p>";
  }
}

async function toggleEmployee(id) {
  const token = getToken();

  try {
    const response = await fetch(`${apiUrl}admin/employees/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "X-AUTH-TOKEN": token
      }
    });

    if (!response.ok) {
      throw new Error("Erreur toggle");
    }

    loadEmployees();

  } catch (error) {
    console.error(error);
    alert("Erreur lors de la modification");
  }
}
window.toggleEmployee = toggleEmployee;

const form = document.getElementById("create-employee-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const lastname = document.getElementById("employee-lastname").value.trim();
  const firstname = document.getElementById("employee-firstname").value.trim();
  const email = document.getElementById("employee-email").value.trim();
  const password = document.getElementById("employee-password").value;
  const feedback = document.getElementById("create-employee-feedback");

  const token = getToken();

  try {
    const response = await fetch(`${apiUrl}admin/employees`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token
      },
      body: JSON.stringify({ 
        lastName: lastname,
        firstName: firstname,
        email, 
        password })
    });

    const data = await response.json();

    if (!response.ok) {
      feedback.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
      return;
    }

    feedback.innerHTML = `<div class="alert alert-success">${data.message}</div>`;

    form.reset();
    loadEmployees();

  } catch (error) {
    feedback.innerHTML = `<div class="alert alert-danger">Erreur réseau</div>`;
  }
});

loadEmployees();