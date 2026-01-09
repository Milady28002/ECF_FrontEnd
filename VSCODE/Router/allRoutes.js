import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html"),
  new Route("/decouvrir", "Découvrir", "./pages/decouvrir.html"),
];

export const websiteName = "Vite & Gourmand";