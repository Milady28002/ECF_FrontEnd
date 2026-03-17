import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html", []),
  new Route("/menus", "Nos Menus", "./pages/nos-menus/menus.html", []),
  new Route("/catalogue-menus", "Catalogue menus", "./pages/nos-menus/catalogue-menus.html", [], "/js/catalogue-menus.js"),
  new Route("/menu-detail", "Détail menu", "./pages/nos-menus/menu-detail.html", [], "/js/menu-detail.js"),
  new Route("/galerie", "La galerie", "./pages/galerie.html", [], "/js/galerie.js"),
  new Route("/contact", "Nous contacter", "./pages/contact.html", []),
  new Route("/signin", "Se connecter", "./pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
  new Route("/signup", "S'inscrire", "./pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
  new Route("/account", "Mon compte", "./pages/auth/account.html", ["ROLE_USER"]),
  new Route("/mes-commandes", "Mes commandes", "./pages/mes-commandes.html", ["ROLE_USER"], "/js/mes-commandes.js"),
  new Route("/commande-detail", "Détail commande", "./pages/commande-detail.html", ["ROLE_USER"], "/js/commande-detail.js"),
  new Route("/modifPassword", "Mot de passe oublié", "./pages/auth/modifPassword.html", ["disconnected"]),
  new Route("/commander", "Commander", "./pages/order/commander.html", ["ROLE_USER"], "/js/commander.js"),
  new Route("/cgv", "Conditions generales", "./pages/footer/cgv.html", []),
  new Route("/mentions-legales", "Mentions légales", "./pages/footer/mentions-legales.html", []),
  new Route("/engagements", "Nos engagements", "./pages/engagements.html", []),

];

export const websiteName = "Vite & Gourmand";