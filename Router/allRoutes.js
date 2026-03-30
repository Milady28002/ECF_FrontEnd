import Route from "./Route.js";

export const allRoutes = [
  new Route("/", "Accueil", "./pages/home.html", [], "/js/home.js"),
  new Route("/menus", "Nos Menus", "./pages/nos-menus/menus.html", []),
  new Route("/catalogue-menus", "Catalogue menus", "./pages/nos-menus/catalogue-menus.html", [], "/js/catalogue-menus.js"),
  new Route("/menu-detail", "Détail menu", "./pages/nos-menus/menu-detail.html", [], "/js/menu-detail.js"),
  new Route("/galerie", "La galerie", "./pages/galerie.html", [], "/js/galerie.js"),
  new Route("/contact", "Nous contacter", "./pages/contact.html", []),
  new Route("/signin", "Se connecter", "./pages/auth/signin.html", ["disconnected"], "/js/auth/signin.js"),
  new Route("/signup", "S'inscrire", "./pages/auth/signup.html", ["disconnected"], "/js/auth/signup.js"),
  new Route("/account", "Mon compte", "./pages/auth/account.html", ["ROLE_USER", "ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/auth/account.js"),
  new Route("/mes-commandes", "Mes commandes", "./pages/mes-commandes.html", ["ROLE_USER"], "/js/mes-commandes.js"),
  new Route("/commande-detail", "Détail commande", "./pages/commande-detail.html", ["ROLE_USER"], "/js/commande-detail.js"),
  new Route("/commander", "Commander", "./pages/order/commander.html", ["ROLE_USER"], "/js/commander.js"),
  new Route("/cgv", "Conditions generales", "./pages/footer/cgv.html", []),
  new Route("/mentions-legales", "Mentions légales", "./pages/footer/mentions-legales.html", []),
  new Route("/engagements", "Nos engagements", "./pages/engagements.html", []),
  new Route("/gestion-commandes", "Gestion des commandes", "./pages/admin/gestion-commandes.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/gestion-commandes.js"),
  new Route("/gestion-menus", "Gestion des menus", "./pages/admin/gestion-menus.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/gestion-menus.js"),
  new Route("/gestion-plats","Gestion des plats","./pages/admin/gestion-plats.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"],
  "/js/admin/gestion-plats.js"),
  new Route("/create-menu", "Créer un menu", "./pages/admin/menu-form.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/menu-form.js"),
  new Route("/edit-menu", "Modifier un menu", "./pages/admin/menu-form.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/menu-form.js"),
  new Route("/create-plat", "Créer un plat", "./pages/admin/plat-form.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/plat-form.js"),
  new Route("/edit-plat", "Modifier un plat", "./pages/admin/plat-form.html", ["ROLE_ADMIN", "ROLE_EMPLOYE"], "/js/admin/plat-form.js"),
  new Route("/forgot-password", "Mot de passe oublié", "./pages/auth/forgot-password.html", ["disconnected"], "/js/auth/forgot-password.js"),
  new Route("/reset-password", "Réinitialiser mot de passe", "./pages/auth/reset-password.html", [], "/js/auth/reset-password.js"),
  new Route("/horaires-admin","Gestion des horaires","./pages/admin/horaires-admin.html",["ROLE_EMPLOYE", "ROLE_ADMIN"],"/js/admin/horaires-admin.js"),
];


export const websiteName = "Vite & Gourmand";