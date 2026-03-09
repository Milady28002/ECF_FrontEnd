import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

const route404 = new Route("404", "Page introuvable", "./pages/404.html", []);

const getRouteByUrl = (url) => {
  let currentRoute = null;

  allRoutes.forEach((element) => {
    if (element.url === url) {
      currentRoute = element;
    }
  });

  return currentRoute ?? route404;
};

const getCurrentPath = () => {
  let path = window.location.hash.replace("#", "");

  if (!path || path === "/index.html") {
    path = "/";
  }

  return path;
};

const LoadContentPage = async () => {
  const path = getCurrentPath();
  const actualRoute = getRouteByUrl(path);

  const allRolesArray = actualRoute.authorize;

  if (allRolesArray.length > 0) {
    if (allRolesArray.includes("disconnected")) {
      if (isConnected()) {
        window.location.hash = "/";
        return;
      }
    } else {
      const roleUser = getRole();
      if (!allRolesArray.includes(roleUser)) {
        window.location.hash = "/";
        return;
      }
    }
  }

  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  if (actualRoute.pathJS !== "") {
    const oldScript = document.getElementById("page-script");
    if (oldScript) {
      oldScript.remove();
    }

    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);
    scriptTag.setAttribute("id", "page-script");
    document.querySelector("body").appendChild(scriptTag);
  }

  document.title = `${actualRoute.title} - ${websiteName}`;
  showAndHideElementsForRoles();
};

const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();

  const href = event.currentTarget.getAttribute("href");
  window.location.hash = href;
};

window.addEventListener("hashchange", LoadContentPage);
window.route = routeEvent;
LoadContentPage();