import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html"),
  new Route("/formules", "Nos formules", "./pages/formules.html"),
  new Route("/galerie", "La galerie", "./pages/galerie.html"),
  new Route("/contact", "Nous contacter", "./pages/contact.html"),
  new Route("/menus", "Nos menus", "./pages/menus.html"), 
  new Route("/signin", "Se connecter", "./pages/auth/signin.html"), 
  new Route("/signup", "S'inscrire", "./pages/auth/signup.html"),
  ];

export const websiteName = "Vite & Gourmand";