const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const apiUrl = "http://127.0.0.1:8000/api/";

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