const API_BASE_URL = "http://127.0.0.1:8000";
const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");

if (signoutBtn) {
    signoutBtn.addEventListener("click", signout);
}

function getRole() {
    return getCookie(roleCookieName);
}

function signout() {
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.reload();
}

function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

function getToken() {
    return getCookie(tokenCookieName);
}

window.getToken = getToken;
window.setToken = setToken;

function setCookie(name, value, days) {
    let expires = "";

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];

        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1, cookie.length);
        }

        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }

    return null;
}

function eraseCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function isConnected() {
    return getToken() !== null && getToken() !== undefined;
}

function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();

    const allElementsToEdit = document.querySelectorAll("[data-show]");

    allElementsToEdit.forEach((element) => {
        switch (element.dataset.show) {
            case "disconnected":
                if (userConnected) {
                    element.classList.add("d-none");
                }
                break;

            case "connected":
                if (!userConnected) {
                    element.classList.add("d-none");
                }
                break;

            case "admin":
                if (!userConnected || role !== "ROLE_ADMIN") {
                    element.classList.add("d-none");
                }
                break;

            case "employe":
                if (!userConnected || (role !== "ROLE_EMPLOYE" && role !== "ROLE_ADMIN")) {
                    element.classList.add("d-none");
                }
                break;

            case "client":
                if (!userConnected || role !== "ROLE_USER") {
                    element.classList.add("d-none");
                }
                break;
        }
    });

    const roleOnlyElements = document.querySelectorAll("[data-role-only]");

    roleOnlyElements.forEach((element) => {
        const requiredRole = element.dataset.roleOnly;

        if (role !== requiredRole) {
            element.remove();
        }
    });
}

function sanitizeHtml(text) {
    const tempHtml = document.createElement("div");
    tempHtml.textContent = text;
    return tempHtml.innerHTML;
}

showAndHideElementsForRoles();

async function loadFooterHoraires() {
    const horairesList = document.getElementById("footer-horaires-list");

    if (!horairesList) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/horaires`);

        if (!response.ok) {
            throw new Error("Erreur lors du chargement des horaires");
        }

        const horaires = await response.json();

        if (!Array.isArray(horaires) || horaires.length === 0) {
            horairesList.innerHTML = "<li>Aucun horaire disponible.</li>";
            return;
        }

        const joursOrdre = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche"
        ];

        const horairesTries = [...horaires].sort(
            (a, b) => joursOrdre.indexOf(a.jour) - joursOrdre.indexOf(b.jour)
        );

        const groupes = [];
        let groupeCourant = null;

        horairesTries.forEach((horaire) => {
            const ouverture = horaire.heure_ouverture;
            const fermeture = horaire.heure_fermeture;

            const texteHoraire =
                ouverture.toLowerCase() === "fermé" || fermeture.toLowerCase() === "fermé"
                    ? "Fermé"
                    : `${ouverture} - ${fermeture}`;

            if (
                groupeCourant &&
                groupeCourant.texteHoraire === texteHoraire &&
                joursOrdre.indexOf(horaire.jour) === joursOrdre.indexOf(groupeCourant.fin) + 1
            ) {
                groupeCourant.fin = horaire.jour;
            } else {
                if (groupeCourant) {
                    groupes.push(groupeCourant);
                }

                groupeCourant = {
                    debut: horaire.jour,
                    fin: horaire.jour,
                    texteHoraire
                };
            }
        });

        if (groupeCourant) {
            groupes.push(groupeCourant);
        }

        horairesList.innerHTML = groupes.map((groupe) => {
            const libelleJour =
                groupe.debut === groupe.fin
                    ? groupe.debut
                    : `${groupe.debut} au ${groupe.fin}`;

            return `
                <li>
                    <strong>${sanitizeHtml(libelleJour)} :</strong> ${sanitizeHtml(groupe.texteHoraire)}
                </li>
            `;
        }).join("");
    } catch (error) {
        console.error("Erreur footer horaires :", error);
        horairesList.innerHTML = "<li>Impossible de charger les horaires.</li>";
    }
}

loadFooterHoraires();
window.loadFooterHoraires = loadFooterHoraires;

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = "flex";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}