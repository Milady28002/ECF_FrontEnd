import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html"),
  new Route("/menus", "Nos Menus", "./pages/nos-menus/menus.html"),
  new Route("/galerie", "La galerie", "./pages/galerie.html"),
  new Route("/contact", "Nous contacter", "./pages/contact.html"),
  new Route("/signin", "Se connecter", "./pages/auth/signin.html", "/js/auth/signin.js"), 
  new Route("/signup", "S'inscrire", "./pages/auth/signup.html", "/js/auth/signup.js"),
  new Route("/commandes", "Mes commandes", "./pages/commandes.html"),
  new Route("/modifPassword","Mot de passe oublié","./pages/auth/modifPassword.html"),
  new Route("/classique", "Classique", "./pages/nos-menus/classique.html"),
  new Route("/commander", "Commander", "./pages/order/commander.html")
  ];

export const websiteName = "Vite & Gourmand";