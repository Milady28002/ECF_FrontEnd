import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html"),
  new Route("/formules", "Nos formules", "./pages/formules.html"),
  ];

export const websiteName = "Vite & Gourmand";