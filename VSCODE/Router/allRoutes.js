import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html"),
  new Route("/formules", "Nos formules", "./pages/formules.html"),
  new Route("/galerie", "La galerie", "./pages/galerie.html"),
  new Route("/contact", "Nous contacter", "./pages/contact.html"),
  ];

export const websiteName = "Vite & Gourmand";