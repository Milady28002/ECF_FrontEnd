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
  new Route("/account", "Mon compte", "./pages/auth/account.html", ["client", "admin", "employe"]),
  new Route("/commandes", "Mes commandes", "./pages/commandes.html", ["client"]),
  new Route("/modifPassword", "Mot de passe oublié", "./pages/auth/modifPassword.html", ["client", "admin", "employe"]),
  new Route("/classique", "Classique", "./pages/nos-menus/classique.html", [], "/js/menu.js"),
  new Route("/commander", "Commander", "./pages/order/commander.html", [], "/js/commander.js"),
  new Route("/cgv", "Conditions generales", "./pages/footer/cgv.html", []),
  new Route("/mentions-legales", "Mentions légales", "./pages/footer/mentions-legales.html", []),
  new Route("/engagements", "Nos engagements", "./pages/engagements.html", []),
  new Route("/noel-paques", "Noel / Paques", "./pages/nos-menus/noel-paques.html", [], "/js/menu.js"),
  new Route("/evenements", "Evenements", "./pages/nos-menus/evenement.html", [], "/js/menu.js"),

];

export const websiteName = "Vite & Gourmand";