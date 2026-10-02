/**
 * French catalogue.
 *
 * French typography puts a space before the double punctuation marks, and it
 * must not be a plain space or the mark wraps onto its own line. The strings
 * below use U+202F (narrow no-break space) before `?`, `!` and `;`, and U+00A0
 * (no-break space) before `:`, which is what the Imprimerie nationale rules
 * call for and what every French publication follows.
 *
 * `many` is a real category here, not padding: CLDR gives French a `many` form
 * for round millions, so 1 000 000 reads "1 000 000 de lignes" rather than the
 * ungrammatical "1 000 000 lignes".
 */
import type { Messages } from "./en";

export const fr: Messages = {
  // breadcrumb
  "breadcrumb.label": "Fil d’Ariane",
  "breadcrumb.more": "Plus",

  // pagination
  "pagination.label": "Pagination",
  "pagination.previous": "Précédent",
  "pagination.next": "Suivant",
  "pagination.goToPrevious": "Aller à la page précédente",
  "pagination.goToNext": "Aller à la page suivante",
  "pagination.morePages": "Autres pages",

  // dialog / sheet / toast
  "dialog.close": "Fermer",
  "sheet.close": "Fermer",
  "toast.dismiss": "Masquer",
  "toast.copied": "Copié dans le presse-papiers",

  // command palette
  "command.title": "Palette de commandes",
  "command.description": "Recherchez une commande à exécuter.",

  // copy button / code block / install command
  "copyButton.copy": "Copier",
  "copyButton.copied": "Copié",
  "codeBlock.copy": "Copier le code",
  "installCommand.packageManager": "Gestionnaire de paquets",

  // application sidebar
  "sidebar.label": "Navigation principale",
  "sidebar.mobileDescription": "Naviguez entre les sections de l’application.",
  "sidebar.toggle": "Afficher ou masquer la barre latérale",

  // confirm dialog
  "confirmDialog.confirm": "Confirmer",
  "confirmDialog.cancel": "Annuler",

  // data table
  "dataTable.searchLabel": "Rechercher dans les lignes",
  "dataTable.searchPlaceholder": "Rechercher…",
  "dataTable.emptyTitle": "Aucun résultat",
  "dataTable.emptyDescription": "Rien ne correspond aux filtres actuels.",
  "dataTable.selectAll": "Sélectionner toutes les lignes",
  "dataTable.toggleColumns": "Afficher ou masquer les colonnes",
  "dataTable.columns": "Colonnes",
  "dataTable.previousPage": "Page précédente",
  "dataTable.nextPage": "Page suivante",
  "dataTable.pageStatus": "Page {page} sur {pages}",
  "dataTable.rowCount": {
    one: "{count} ligne.",
    many: "{count} de lignes.",
    other: "{count} lignes.",
  },
  "dataTable.selectedCount": {
    one: "{count} ligne sélectionnée sur {total}.",
    many: "{count} de lignes sélectionnées sur {total}.",
    other: "{count} lignes sélectionnées sur {total}.",
  },

  // error state
  "errorState.title": "Une erreur est survenue",
  "errorState.retry": "Réessayer",

  // filter bar
  "filterBar.label": "Rechercher",
  "filterBar.placeholder": "Rechercher…",

  // language select
  "languageSelect.label": "Langue",

  // logo marquee
  "logoMarquee.label": "Logos",

  // pricing table
  "pricingTable.monthly": "Mensuel",
  "pricingTable.annual": "Annuel",
  "pricingTable.billAnnually": "Facturation annuelle",

  // site footer
  "siteFooter.social": "Réseaux sociaux",
  "siteFooter.legal": "Mentions légales",

  // site navbar
  "siteNavbar.nav": "Navigation principale",
  "siteNavbar.openMenu": "Ouvrir le menu",
  "siteNavbar.menuTitle": "Menu",
  "siteNavbar.menuDescription": "Navigation du site",
  "siteNavbar.home": "Accueil",

  // dashboard shell
  "dashboardShell.signOut": "Se déconnecter",
  "dashboardShell.sidebarLabel": "Navigation principale",

  // error pages
  "errorPages.home": "Retour à l’accueil",
  "errorPages.back": "Retour",
  "errorPages.retry": "Réessayer",
  "errorPages.notFoundEyebrow": "Page introuvable",
  "errorPages.notFoundTitle": "Cette page a pris un mauvais virage.",
  "errorPages.notFoundDescription":
    "Le lien est peut-être rompu, ou la page a été déplacée. Vérifiez l’adresse, ou revenez en terrain connu.",
  "errorPages.serverErrorEyebrow": "Quelque chose a cassé",
  "errorPages.serverErrorTitle": "Nous avons heurté un mur de notre côté.",
  "errorPages.serverErrorDescription":
    "La requête n’a pas pu aboutir. L’équipe a été prévenue\u202F; réessayer suffit généralement.",

  // sign in (split and centred)
  "login.eyebrow": "Ravi de vous revoir",
  "login.title": "Connexion",
  "login.subtitle": "Saisissez vos identifiants pour continuer.",
  "login.subtitleCentred": "Utilisez votre e-mail professionnel pour continuer.",
  "login.emailLabel": "E-mail",
  "login.emailPlaceholder": "nom@exemple.com",
  "login.passwordLabel": "Mot de passe",
  "login.passwordPlaceholder": "Votre mot de passe",
  "login.remember": "Se souvenir de moi",
  "login.forgot": "Mot de passe oublié\u202F?",
  "login.submit": "Se connecter",
  "login.showPassword": "Afficher le mot de passe",
  "login.hidePassword": "Masquer le mot de passe",
  "login.brandTitle": "Connectez-vous à la salle de contrôle.",
  "login.brandDescription": "Un seul design system pour toutes les interfaces que vous livrez.",
  "login.pointsLabel": "À propos de ce produit",
  "login.pointShipTitle": "Livrez en quelques minutes",
  "login.pointShipDescription": "Des tokens, des primitives et des blocs déjà cohérents entre eux.",
  "login.pointAccessibleTitle": "Accessible par défaut",
  "login.pointAccessibleDescription":
    "Chaque contrôle est atteignable au clavier et correctement étiqueté.",
  "login.pointRtlTitle": "RTL et mode sombre natifs",
  "login.pointRtlDescription": "Arabe et anglais, clair et sombre, depuis une source unique.",

  // forgot password
  "forgotPassword.eyebrow": "Récupération du compte",
  "forgotPassword.title": "Mot de passe oublié\u202F?",
  "forgotPassword.subtitle":
    "Saisissez l’e-mail de votre compte et nous vous enverrons un lien de réinitialisation.",
  "forgotPassword.emailLabel": "E-mail",
  "forgotPassword.emailPlaceholder": "nom@exemple.com",
  "forgotPassword.submit": "Envoyer le lien",
  "forgotPassword.sentTitle": "Consultez votre boîte de réception",
  "forgotPassword.resend": "Renvoyer le lien",
  "forgotPassword.back": "Retour à la connexion",

  // one-time code
  "otp.eyebrow": "Vérification en deux étapes",
  "otp.title": "Saisissez votre code",
  "otp.subtitle": "Nous avons envoyé un code à usage unique à",
  "otp.fieldLabel": "Code à usage unique",
  "otp.submit": "Vérifier",
  "otp.resendPrompt": "Vous ne l’avez pas reçu\u202F?",
  "otp.resend": "Envoyer un nouveau code",
  "otp.back": "Retour à la connexion",
  "otp.resendCountdown": "({seconds} s)",

  // register
  "register.eyebrow": "Commencer",
  "register.title": "Créez votre compte",
  "register.subtitle": "Cela prend moins d’une minute.",
  "register.nameLabel": "Nom complet",
  "register.namePlaceholder": "Nour Hassan",
  "register.emailLabel": "E-mail",
  "register.emailPlaceholder": "nom@exemple.com",
  "register.passwordLabel": "Mot de passe",
  "register.confirmLabel": "Confirmez le mot de passe",
  "register.terms": "J’accepte les conditions d’utilisation et la politique de confidentialité.",
  "register.submit": "Créer le compte",
  "register.mismatch": "Les deux mots de passe ne correspondent pas.",
  "register.showPassword": "Afficher le mot de passe",
  "register.hidePassword": "Masquer le mot de passe",
  "register.strengthLabel": "Robustesse du mot de passe",
  "register.strengthHint": "Utilisez au moins 8 caractères, avec un chiffre et un symbole.",
  "register.strengthValue": "Robustesse du mot de passe\u00A0: {strength}",
  "register.strength0": "Trop court",
  "register.strength1": "Faible",
  "register.strength2": "Moyen",
  "register.strength3": "Bon",
  "register.strength4": "Fort",

  // settings
  "settings.title": "Paramètres",
  "settings.description": "Gérez votre compte, vos notifications et l’apparence de l’interface.",
  "settings.sectionsLabel": "Sections des paramètres",
  "settings.profile": "Profil",
  "settings.profileDescription":
    "Voilà comment vos collègues vous voient dans l’espace de travail.",
  "settings.uploadPhoto": "Importer une photo",
  "settings.nameLabel": "Nom complet",
  "settings.emailLabel": "E-mail",
  "settings.save": "Enregistrer les modifications",
  "settings.preferences": "Préférences",
  "settings.preferencesDescription": "Choisissez ce que nous sommes autorisés à vous envoyer.",
  "settings.prefUpdatesLabel": "Nouveautés produit",
  "settings.prefUpdatesDescription":
    "Un e-mail occasionnel sur les nouveaux composants et les versions.",
  "settings.prefSecurityLabel": "Alertes de sécurité",
  "settings.prefSecurityDescription":
    "Toujours envoyées lors d’une connexion depuis un nouvel appareil.",
  "settings.prefDigestLabel": "Résumé hebdomadaire",
  "settings.prefDigestDescription":
    "Un récapitulatif, le lundi, de tout ce que votre équipe a livré.",
  "settings.appearance": "Apparence",
  "settings.colourMode": "Mode de couleur",
  "settings.brand": "Marque",
  "settings.density": "Densité",
  "settings.themeLight": "Clair",
  "settings.themeDark": "Sombre",
  "settings.themeSystem": "Système",
  "settings.densityCompact": "Dense",
  "settings.densityComfortable": "Par défaut",
  "settings.densitySpacious": "Aéré",
  "settings.dangerTitle": "Zone de danger",
  "settings.dangerDescription":
    "Supprimer l’espace de travail retire tous les projets, membres et clés API. Cette action est irréversible.",
  "settings.dangerAction": "Supprimer l’espace de travail",
  "settings.dangerConfirmTitle": "Supprimer cet espace de travail\u202F?",
  "settings.dangerConfirmDescription":
    "Tous les projets, membres et clés API sont retirés immédiatement. Cette action est irréversible.",

  // calendar / date picker
  "calendar.previousMonth": "Mois précédent",
  "calendar.nextMonth": "Mois suivant",
  "datePicker.placeholder": "Choisir une date",
  "datePicker.rangePlaceholder": "Choisir une période",
  "datePicker.dialogLabel": "Choix de la date",
  "datePicker.rangeDialogLabel": "Choix de la période",

  // sign in with a phone number
  "loginPhone.eyebrow": "Bon retour",
  "loginPhone.title": "Connexion par téléphone",
  "loginPhone.subtitle": "Nous enverrons un code à usage unique par SMS à votre numéro de mobile.",
  "loginPhone.countryLabel": "Indicatif du pays",
  "loginPhone.phoneLabel": "Numéro de mobile",
  "loginPhone.phonePlaceholder": "Numéro sans l’indicatif",
  "loginPhone.phoneRequired": "Saisissez votre numéro de mobile.",
  "loginPhone.phoneInvalid": "Saisissez un numéro de mobile valide, uniquement avec des chiffres.",
  "loginPhone.requestCode": "Envoyer le code",
  "loginPhone.codeEyebrow": "Consultez vos messages",
  "loginPhone.codeTitle": "Saisissez le code",
  "loginPhone.codeSubtitle": "Nous avons envoyé un code à usage unique par SMS au",
  "loginPhone.codeLabel": "Code à usage unique",
  "loginPhone.verify": "Vérifier et se connecter",
  "loginPhone.changeNumber": "Changer de numéro",
  "loginPhone.resendPrompt": "Pas de SMS ?",
  "loginPhone.resend": "Envoyer un nouveau code",
  "loginPhone.resendCountdown": {
    one: "Vous pourrez demander un nouveau code dans {count} seconde.",
    many: "Vous pourrez demander un nouveau code dans {count} de secondes.",
    other: "Vous pourrez demander un nouveau code dans {count} secondes.",
  },
  "loginPhone.or": "ou",

  // register wizard
  "registerWizard.eyebrow": "Commencer",
  "registerWizard.title": "Créez votre compte",
  "registerWizard.progressLabel": "Progression de l’inscription",
  "registerWizard.stepStatus": "Étape {current} sur {total}",
  "registerWizard.stepsDone": "Toutes les étapes sont terminées",
  "registerWizard.stepComplete": "(terminée)",
  "registerWizard.accountStep": "Compte",
  "registerWizard.profileStep": "Profil",
  "registerWizard.verifyStep": "Vérification",
  "registerWizard.accountTitle": "Vos identifiants",
  "registerWizard.accountDescription":
    "Vous utiliserez cette adresse et ce mot de passe pour vous connecter.",
  "registerWizard.profileTitle": "Parlez-nous de vous",
  "registerWizard.profileDescription":
    "Ces informations servent à préparer votre espace de travail.",
  "registerWizard.verifyTitle": "Vérifiez votre adresse e-mail",
  "registerWizard.verifyDescription": "Saisissez le code envoyé à",
  "registerWizard.emailLabel": "E-mail professionnel",
  "registerWizard.emailPlaceholder": "nom@exemple.com",
  "registerWizard.emailRequired": "Saisissez votre adresse e-mail.",
  "registerWizard.emailInvalid": "Saisissez une adresse e-mail au format nom@exemple.com.",
  "registerWizard.passwordLabel": "Mot de passe",
  "registerWizard.passwordTooShort": "Utilisez au moins 8 caractères.",
  "registerWizard.nameLabel": "Nom complet",
  "registerWizard.namePlaceholder": "Nour Hassan",
  "registerWizard.nameRequired": "Saisissez votre nom complet.",
  "registerWizard.companyLabel": "Entreprise",
  "registerWizard.optional": "(facultatif)",
  "registerWizard.roleLabel": "Fonction",
  "registerWizard.rolePlaceholder": "Choisissez votre fonction",
  "registerWizard.roleRequired": "Choisissez la fonction la plus proche de la vôtre.",
  "registerWizard.roleEngineering": "Ingénierie",
  "registerWizard.roleDesign": "Design",
  "registerWizard.roleProduct": "Produit",
  "registerWizard.roleMarketing": "Marketing",
  "registerWizard.roleLeadership": "Fondation ou direction",
  "registerWizard.roleOther": "Autre",
  "registerWizard.teamSizeLabel": "Taille de l’équipe",
  "registerWizard.teamSizeRequired": "Choisissez la taille de votre équipe.",
  "registerWizard.teamSolo": "Juste moi",
  "registerWizard.teamSmall": "De 2 à 10 personnes",
  "registerWizard.teamMedium": "De 11 à 50 personnes",
  "registerWizard.teamLarge": "De 51 à 200 personnes",
  "registerWizard.teamEnterprise": "Plus de 200 personnes",
  "registerWizard.codeLabel": "Code de vérification",
  "registerWizard.codeRequired": "Saisissez le code complet reçu par e-mail.",
  "registerWizard.resendPrompt": "Toujours rien ?",
  "registerWizard.resend": "Envoyer un nouveau code",
  "registerWizard.resendCountdown": {
    one: "Vous pourrez demander un nouveau code dans {count} seconde.",
    many: "Vous pourrez demander un nouveau code dans {count} de secondes.",
    other: "Vous pourrez demander un nouveau code dans {count} secondes.",
  },
  "registerWizard.back": "Retour",
  "registerWizard.next": "Continuer",
  "registerWizard.finish": "Vérifier et terminer",
  "registerWizard.doneTitle": "Tout est prêt",
  "registerWizard.doneDescription": "Votre compte est prêt. Bienvenue, {name}.",

  // combobox
  "combobox.placeholder": "Sélectionnez une option",
  "combobox.searchPlaceholder": "Rechercher…",
  "combobox.searchLabel": "Rechercher une option",
  "combobox.listLabel": "Options",
  "combobox.empty": "Aucun résultat.",
  "combobox.selectedCount": {
    one: "{count} élément sélectionné",
    many: "{count} d’éléments sélectionnés",
    other: "{count} éléments sélectionnés",
  },
  "combobox.remove": "Retirer {label}",

  // navigation menu
  "navigationMenu.label": "Navigation principale",

  // carousel
  "carousel.label": "Carrousel",
  "carousel.roleDescription": "carrousel",
  "carousel.slideRoleDescription": "diapositive",
  "carousel.slideLabel": "{index} sur {count}",
  "carousel.previous": "Diapositive précédente",
  "carousel.next": "Diapositive suivante",
  "carousel.dots": "Choisir une diapositive",
  "carousel.goTo": "Aller à la diapositive {index}",

  // landingStreaming
  "landingStreaming.wordmark": "Cinéma",
  "landingStreaming.signIn": "Se connecter",
  "landingStreaming.heroTitle": "Des histoires qui valent une nuit blanche",
  "landingStreaming.heroSubtitle":
    "Films, séries et documentaires réunis au même endroit. Regardez où vous voulez et résiliez en ligne quand vous le souhaitez.",
  "landingStreaming.emailPrompt":
    "Commencez par votre adresse e-mail. L’inscription prend moins d’une minute.",
  "landingStreaming.emailLabel": "Adresse e-mail",
  "landingStreaming.getStarted": "Commencer",
  "landingStreaming.emailRequired": "Saisissez votre adresse e-mail pour continuer.",
  "landingStreaming.emailInvalid":
    "Saisissez une adresse e-mail valide, par exemple nom@example.com.",
  "landingStreaming.rowTrending": "Tendances du moment",
  "landingStreaming.rowTop": "Top 10 de la semaine",
  "landingStreaming.rankedTitle": "Numéro {rank} : {title}",
  "landingStreaming.previousTitles": "Titres précédents",
  "landingStreaming.nextTitles": "Titres suivants",
  "landingStreaming.featureTvTitle": "Profitez-en sur votre téléviseur",
  "landingStreaming.featureTvDescription":
    "Regardez sur les téléviseurs connectés, les consoles de jeux, les clés de streaming et les box TV, jusqu’en 4K si votre écran le permet.",
  "landingStreaming.featureDownloadTitle": "Téléchargez pour regarder hors connexion",
  "landingStreaming.featureDownloadDescription":
    "Enregistrez vos favoris sur votre téléphone ou votre tablette et continuez à regarder en avion, en train ou partout où le réseau faiblit.",
  "landingStreaming.featureEverywhereTitle": "Regardez partout",
  "landingStreaming.featureEverywhereDescription":
    "Commencez sur votre ordinateur portable, poursuivez sur votre téléphone et terminez sur grand écran, là où vous vous étiez arrêté.",
  "landingStreaming.featureKidsTitle": "Des profils pensés pour les enfants",
  "landingStreaming.featureKidsDescription":
    "Offrez aux enfants leur propre espace, avec les limites d’âge que vous choisissez et les personnages qu’ils adorent, sans frais supplémentaires.",
  "landingStreaming.faqTitle": "Questions fréquentes",
  "landingStreaming.faq1Question": "Que puis-je regarder ?",
  "landingStreaming.faq1Answer":
    "Une bibliothèque de films, de séries, de documentaires et d’animation, enrichie de nouveaux titres chaque semaine.",
  "landingStreaming.faq2Question": "Combien cela coûte-t-il ?",
  "landingStreaming.faq2Answer":
    "Chaque formule commence par un premier mois offert. Vous payez ensuite un prix mensuel fixe, sans engagement.",
  "landingStreaming.faq3Question": "Où puis-je regarder ?",
  "landingStreaming.faq3Answer":
    "Sur le web, sur téléphone et tablette, et sur la plupart des téléviseurs connectés et appareils de streaming. Connectez-vous partout avec le même compte.",
  "landingStreaming.faq4Question": "Comment résilier ?",
  "landingStreaming.faq4Answer":
    "En ligne, en deux étapes, depuis la page de votre compte. La résiliation est sans frais, et vous gardez l’accès jusqu’à la fin de la période de facturation.",
  "landingStreaming.faq5Question": "Est-ce adapté aux enfants ?",
  "landingStreaming.faq5Answer":
    "Les profils enfants n’affichent que les titres correspondant à la limite d’âge que vous fixez, et un code PIN peut verrouiller tous les autres profils.",
  "landingStreaming.ctaTitle": "Prêts quand vous l’êtes",
  "landingStreaming.footerBlurb": "Une question ? Notre centre d’aide est ouvert jour et nuit.",
  "landingStreaming.footerHelp": "Aide",
  "landingStreaming.footerCompany": "Entreprise",
  "landingStreaming.linkHelpCentre": "Centre d’aide",
  "landingStreaming.linkAccount": "Compte",
  "landingStreaming.linkDevices": "Appareils compatibles",
  "landingStreaming.linkAbout": "À propos",
  "landingStreaming.linkCareers": "Carrières",
  "landingStreaming.linkPress": "Presse",
  "landingStreaming.linkPrivacy": "Confidentialité",
  "landingStreaming.linkTerms": "Conditions d’utilisation",
  "landingStreaming.linkCookies": "Préférences en matière de cookies",
  "landingStreaming.title1": "Le Port de verre",
  "landingStreaming.title2": "Sel et Signal",
  "landingStreaming.title3": "Les Cartographes de minuit",
  "landingStreaming.title4": "Les Gardiens des lanternes",
  "landingStreaming.title5": "Le Verger silencieux",
  "landingStreaming.title6": "Rue des Braises",
  "landingStreaming.title7": "Neuf rivières au nord",
  "landingStreaming.title8": "Radio marée basse",
  "landingStreaming.title9": "La Longue Lumière d’hiver",
  "landingStreaming.title10": "Floraison statique",

  // admin dashboard
  "adminDashboard.brandName": "Admin boutique",
  "adminDashboard.navStore": "Boutique",
  "adminDashboard.navOverview": "Vue d’ensemble",
  "adminDashboard.navOrders": "Commandes",
  "adminDashboard.navProducts": "Produits",
  "adminDashboard.navCustomers": "Clients",
  "adminDashboard.navWorkspace": "Espace de travail",
  "adminDashboard.navReports": "Rapports",
  "adminDashboard.navSettings": "Paramètres",
  "adminDashboard.menuProfile": "Profil",
  "adminDashboard.title": "Vue d’ensemble",
  "adminDashboard.description":
    "Chiffre d’affaires, commandes et clients de la boutique en un coup d’œil.",
  "adminDashboard.rangeLabel": "Période",
  "adminDashboard.rangeOption": {
    one: "{count} jour",
    many: "{count} de jours",
    other: "{count} jours",
  },
  "adminDashboard.export": "Exporter",
  "adminDashboard.metricsLabel": "Indicateurs clés",
  "adminDashboard.kpiRevenue": "Chiffre d’affaires",
  "adminDashboard.kpiOrders": "Commandes",
  "adminDashboard.kpiCustomers": "Clients",
  "adminDashboard.kpiConversion": "Taux de conversion",
  "adminDashboard.comparison": {
    one: "par rapport à la veille",
    many: "par rapport aux {count} de jours précédents",
    other: "par rapport aux {count} jours précédents",
  },
  "adminDashboard.revenueTitle": "Chiffre d’affaires dans le temps",
  "adminDashboard.revenueDescription":
    "Chiffre d’affaires quotidien de la période, comparé à la précédente.",
  "adminDashboard.revenueCurrent": "Cette période",
  "adminDashboard.revenuePrevious": "Période précédente",
  "adminDashboard.channelsTitle": "Ventes par canal",
  "adminDashboard.channelsDescription": "D’où vient le chiffre d’affaires de la période.",
  "adminDashboard.channelSales": "Ventes",
  "adminDashboard.channelOnline": "Boutique en ligne",
  "adminDashboard.channelMarketplace": "Places de marché",
  "adminDashboard.channelRetail": "Magasin",
  "adminDashboard.channelSocial": "Réseaux sociaux",
  "adminDashboard.ordersTitle": "Commandes récentes",
  "adminDashboard.ordersDescription": {
    one: "La dernière commande.",
    many: "Les {count} de dernières commandes.",
    other: "Les {count} dernières commandes.",
  },
  "adminDashboard.columnOrder": "Commande",
  "adminDashboard.columnCustomer": "Client",
  "adminDashboard.columnStatus": "Statut",
  "adminDashboard.columnAmount": "Montant",
  "adminDashboard.columnDate": "Date de commande",
  "adminDashboard.columnActions": "Actions",
  "adminDashboard.statusPaid": "Payée",
  "adminDashboard.statusPending": "En attente",
  "adminDashboard.statusRefunded": "Remboursée",
  "adminDashboard.statusFailed": "Échouée",
  "adminDashboard.orderActions": "Actions pour la commande {id}",
  "adminDashboard.actionView": "Voir la commande",
  "adminDashboard.actionInvoice": "Télécharger la facture",
  "adminDashboard.actionRefund": "Rembourser",
  "adminDashboard.productsTitle": "Meilleures ventes",
  "adminDashboard.productsDescription": "Les produits qui rapportent le plus sur la période.",
  "adminDashboard.productsEmpty": "Aucune vente sur cette période pour l’instant.",
  "adminDashboard.unitsSold": {
    one: "{count} unité vendue",
    many: "{count} d’unités vendues",
    other: "{count} unités vendues",
  },
  "adminDashboard.productDesk": "Bureau assis-debout",
  "adminDashboard.productChair": "Chaise ergonomique",
  "adminDashboard.productHeadphones": "Casque sans fil",
  "adminDashboard.productLamp": "Lampe de bureau",
  "adminDashboard.activityTitle": "Activité récente",
  "adminDashboard.activityDescription": "Les derniers événements de la boutique.",
  "adminDashboard.activityEmpty": "Rien ne s’est encore passé.",
  "adminDashboard.activityOrder": "{name} a passé la commande {id}.",
  "adminDashboard.activityPayout": "Un virement de {amount} a été envoyé à la banque.",
  "adminDashboard.activityStock": "Stock bientôt épuisé pour {product}.",
  "adminDashboard.activityRefund": "La commande {id} a été remboursée.",
  "adminDashboard.activitySignup": "{name} a créé un compte.",

  // productCard
  "productCard.addToCart": "Ajouter au panier",
  "productCard.addToCartNamed": "Ajouter au panier : {title}",
  "productCard.wishlist": "Ajouter {title} à la liste d’envies",
  "productCard.rating": {
    one: "{rating} sur {max}, {count} avis",
    many: "{rating} sur {max}, {count} d’avis",
    other: "{rating} sur {max}, {count} avis",
  },
  "productCard.ratingOnly": "{rating} sur {max}",
  "productCard.currentPrice": "Prix actuel",
  "productCard.originalPrice": "Prix d’origine",

  // landingSaas
  "landingSaas.skipToContent": "Aller au contenu",
  "landingSaas.navFeatures": "Fonctionnalités",
  "landingSaas.navDevelopers": "Développeurs",
  "landingSaas.navPricing": "Tarifs",
  "landingSaas.navFaq": "Questions fréquentes",
  "landingSaas.signIn": "Se connecter",
  "landingSaas.getStarted": "Commencer",
  "landingSaas.heroEyebrow": "Nouveau : la facturation à l’usage",
  "landingSaas.heroTitle": "Lancez votre facturation en un après-midi, pas en un trimestre.",
  "landingSaas.heroDescription":
    "{brand} vous offre une seule API pour les abonnements, la mesure de l’usage et les factures, avec des webhooks, des tableaux de bord et des SDK qui savent se faire oublier.",
  "landingSaas.heroPrimary": "Commencer à construire",
  "landingSaas.heroSecondary": "Lire la documentation",
  "landingSaas.logosTitle": "Les équipes produit qui nous font confiance",
  "landingSaas.featuresEyebrow": "Plateforme",
  "landingSaas.featuresTitle": "Tout ce qu’il faut pour facturer un logiciel",
  "landingSaas.featuresDescription":
    "Des briques modulaires qui fonctionnent seules, et encore mieux ensemble.",
  "landingSaas.featureSpeedTitle": "Rapide par défaut",
  "landingSaas.featureSpeedDescription":
    "Des lectures mises en cache en périphérie et une réponse médiane sous 40 ms, dans chaque région.",
  "landingSaas.featureWebhooksTitle": "Des webhooks fiables",
  "landingSaas.featureWebhooksDescription":
    "Des événements signés, avec relances automatiques, rejeux et un journal de livraison consultable.",
  "landingSaas.featureGlobalTitle": "International dès le premier jour",
  "landingSaas.featureGlobalDescription":
    "Devises, règles fiscales et langues locales, avec la mise en page de droite à gauche intégrée.",
  "landingSaas.featureSecurityTitle": "Sécurisé par conception",
  "landingSaas.featureSecurityDescription":
    "Chiffrement au repos, clés API à portée limitée et piste d’audit pour chaque modification.",
  "landingSaas.featureAnalyticsTitle": "Analyse des revenus",
  "landingSaas.featureAnalyticsDescription":
    "Revenus récurrents, attrition et usage dans des tableaux de bord auxquels votre équipe financière peut se fier.",
  "landingSaas.featureComposableTitle": "Des API modulaires",
  "landingSaas.featureComposableDescription":
    "Adoptez un produit ou tous. Chaque point de terminaison fonctionne seul.",
  "landingSaas.codeEyebrow": "Pensé pour les développeurs",
  "landingSaas.codeTitle": "Quelques lignes de code. Toute une pile de facturation.",
  "landingSaas.codeDescription":
    "Des SDK typés, des ressources prévisibles et un mode test fidèle à la production.",
  "landingSaas.codePointIdempotent": "Requêtes idempotentes par défaut",
  "landingSaas.codePointSdks": "SDK pour TypeScript, Python et Go",
  "landingSaas.codePointTestMode": "Mode test avec des données réalistes",
  "landingSaas.previewTitle": "Aperçu en direct",
  "landingSaas.previewStatus": "Payée",
  "landingSaas.previewCustomer": "Client",
  "landingSaas.previewPlan": "Offre",
  "landingSaas.previewAmount": "Montant",
  "landingSaas.previewLatency": "Terminé en {ms} ms",
  "landingSaas.stepsEyebrow": "Comment ça marche",
  "landingSaas.stepsTitle": "En production en trois étapes",
  "landingSaas.stepsDescription":
    "De la première requête à la première facture, sans projet de migration.",
  "landingSaas.stepSignUpTitle": "Créez un compte",
  "landingSaas.stepSignUpDescription":
    "Inscrivez-vous, copiez vos clés de test et explorez le tableau de bord. Aucune carte requise.",
  "landingSaas.stepConnectTitle": "Connectez votre produit",
  "landingSaas.stepConnectDescription":
    "Installez un SDK, décrivez vos offres et envoyez les événements d’usage depuis votre serveur.",
  "landingSaas.stepLaunchTitle": "Passez en production",
  "landingSaas.stepLaunchDescription":
    "Basculez sur les clés de production quand vous êtes prêt. Factures, reçus et relances tournent tout seuls.",
  "landingSaas.statsEyebrow": "En chiffres",
  "landingSaas.statsTitle": "Conçu pour un vrai trafic",
  "landingSaas.statUptime": "Disponibilité sur l’année écoulée",
  "landingSaas.statUptimeDescription":
    "La bascule multirégion maintient la facturation même pendant une panne.",
  "landingSaas.statRequests": "Requêtes API chaque mois",
  "landingSaas.statLatency": "Temps de réponse médian",
  "landingSaas.statTeams": "Équipes en production",
  "landingSaas.pricingTitle": "Des tarifs simples qui évoluent avec vous",
  "landingSaas.pricingDescription":
    "Commencez gratuitement, passez à l’offre supérieure quand vous en avez besoin, et ne payez jamais pour des postes inutilisés.",
  "landingSaas.pricingPeriod": "/mois",
  "landingSaas.pricingAnnualNote": "20 % d’économie",
  "landingSaas.pricingPopular": "Le plus choisi",
  "landingSaas.tierStarter": "Découverte",
  "landingSaas.tierStarterDescription": "Pour les projets personnels et les premiers essais.",
  "landingSaas.tierGrowth": "Croissance",
  "landingSaas.tierGrowthDescription":
    "Pour les produits qui ont des clients payants et une feuille de route.",
  "landingSaas.tierScale": "Entreprise",
  "landingSaas.tierScaleDescription":
    "Pour les organisations soumises à des exigences de conformité et de disponibilité.",
  "landingSaas.featureProjects": {
    one: "{count} projet",
    many: "{count} de projets",
    other: "{count} projets",
  },
  "landingSaas.featureRequests": {
    one: "{count} requête API par mois",
    many: "{count} de requêtes API par mois",
    other: "{count} requêtes API par mois",
  },
  "landingSaas.featureCommunitySupport": "Assistance communautaire",
  "landingSaas.featurePrioritySupport": "Assistance prioritaire par e-mail",
  "landingSaas.featureUsageAlerts": "Analyse de l’usage et alertes",
  "landingSaas.featureUnlimitedProjects": "Projets illimités",
  "landingSaas.featureSso": "Authentification unique SAML",
  "landingSaas.featureSla": "SLA de disponibilité à 99,99 %",
  "landingSaas.featureAuditLog": "Journal d’audit et résidence des données",
  "landingSaas.ctaStartFree": "Commencer gratuitement",
  "landingSaas.ctaStartTrial": "Démarrer l’essai gratuit",
  "landingSaas.ctaContactSales": "Contacter l’équipe commerciale",
  "landingSaas.testimonialsEyebrow": "Clients",
  "landingSaas.testimonialsTitle": "Apprécié des ingénieurs comme des financiers",
  "landingSaas.quotePlatform":
    "Nous avons remplacé trois services internes par une seule intégration et lancé la tarification à l’usage en deux semaines.",
  "landingSaas.rolePlatform": "Responsable de l’ingénierie plateforme",
  "landingSaas.quoteOnCall":
    "Le journal des webhooks à lui seul rend des heures à notre équipe d’astreinte chaque semaine.",
  "landingSaas.roleOnCall": "Ingénieure principale",
  "landingSaas.quoteFinance":
    "La finance fait enfin confiance aux chiffres, parce qu’ils viennent de la même source que le produit.",
  "landingSaas.roleFinance": "Vice-président finance",
  "landingSaas.faqTitle": "Vos questions, nos réponses",
  "landingSaas.faqDescription":
    "Tout ce que les équipes demandent avant de changer. Encore une question ? Nos ingénieurs lisent chaque message.",
  "landingSaas.faqFreeQuestion": "Existe-t-il une offre gratuite ?",
  "landingSaas.faqFreeAnswer":
    "Oui. L’offre Découverte est gratuite jusqu’à trois projets, et vous ne passez à une offre payante que lorsque vous en avez besoin.",
  "landingSaas.faqMigrateQuestion": "Puis-je migrer depuis mon système de facturation actuel ?",
  "landingSaas.faqMigrateAnswer":
    "Les outils d’import reprennent clients, offres et historique de paiement, et le mode test vous permet de répéter la bascule.",
  "landingSaas.faqSdkQuestion": "Quels langages les SDK prennent-ils en charge ?",
  "landingSaas.faqSdkAnswer":
    "Les SDK officiels couvrent TypeScript, Python et Go. Tout autre langage peut appeler directement l’API REST.",
  "landingSaas.faqSecurityQuestion": "Comment mes données sont-elles protégées ?",
  "landingSaas.faqSecurityAnswer":
    "Les données sont chiffrées en transit et au repos, les accès sont limités par clé, et chaque modification est consignée dans un journal d’audit.",
  "landingSaas.ctaTitle": "Commencez à construire dès aujourd’hui",
  "landingSaas.ctaDescription":
    "Créez un compte gratuit en quelques minutes, ou parlez-nous d’une offre pour votre équipe.",
  "landingSaas.footerBlurb":
    "{brand} est la plateforme de facturation des équipes qui préfèrent livrer du produit plutôt qu’entretenir des factures.",
  "landingSaas.footerProduct": "Produit",
  "landingSaas.footerCompany": "Entreprise",
  "landingSaas.footerChangelog": "Journal des modifications",
  "landingSaas.footerStatus": "État du service",
  "landingSaas.footerDocs": "Documentation",
  "landingSaas.footerApiReference": "Référence de l’API",
  "landingSaas.footerAbout": "À propos",
  "landingSaas.footerCareers": "Carrières",
  "landingSaas.footerContact": "Nous contacter",
  "landingSaas.footerPrivacy": "Confidentialité",
  "landingSaas.footerTerms": "Conditions",

  // landingStore
  "landingStore.skipToContent": "Aller au contenu",
  "landingStore.searchLabel": "Rechercher des produits",
  "landingStore.searchPlaceholder": "Tasses, lampes, linge de maison…",
  "landingStore.account": "Compte",
  "landingStore.cart": {
    one: "Panier, {count} article",
    many: "Panier, {count} d’articles",
    other: "Panier, {count} articles",
  },
  "landingStore.addedToCart": "{title} ajouté à votre panier",
  "landingStore.heroEyebrow": "La sélection d’automne",
  "landingStore.heroTitle": "Des matins lents, des objets bien faits.",
  "landingStore.heroDescription":
    "Grès, lin et luminaires issus de petits ateliers, choisis pour servir chaque jour et durer des années.",
  "landingStore.heroPrimary": "Découvrir la sélection",
  "landingStore.heroSecondary": "Voir les offres de la semaine",
  "landingStore.categoriesTitle": "Acheter par catégorie",
  "landingStore.categoryKitchen": "Cuisine",
  "landingStore.categoryHome": "Maison",
  "landingStore.categoryLighting": "Luminaires",
  "landingStore.categoryTextiles": "Linge de maison",
  "landingStore.categoryOutdoors": "Plein air",
  "landingStore.categoryStationery": "Papeterie",
  "landingStore.featuredTitle": "Produits à la une",
  "landingStore.featuredDescription":
    "Meilleures ventes et nouveautés vers lesquelles notre équipe revient sans cesse.",
  "landingStore.viewAll": "Tout voir",
  "landingStore.productMug": "Tasse en grès",
  "landingStore.productThrow": "Plaid en lin",
  "landingStore.productLamp": "Lampe de bureau en noyer",
  "landingStore.productCarafe": "Carafe en verre",
  "landingStore.productNotebook": "Carnet relié toile",
  "landingStore.productPlanter": "Pot en terre cuite",
  "landingStore.productBlanket": "Couverture de pique-nique en laine",
  "landingStore.badgeNew": "Nouveau",
  "landingStore.badgeSale": "−{percent} %",
  "landingStore.dealsEyebrow": "Durée limitée",
  "landingStore.dealsTitle": "Les offres de la semaine",
  "landingStore.dealsDescription":
    "Des remises choisies sur des pièces que nous aimons. Jusqu’à dimanche minuit.",
  "landingStore.dealsCta": "Voir toutes les offres",
  "landingStore.valuePropsLabel": "Pourquoi acheter chez nous",
  "landingStore.freeShippingTitle": "Livraison offerte",
  "landingStore.freeShippingDescription": "Pour toute commande de plus de {amount}.",
  "landingStore.returnsTitle": "Retours gratuits",
  "landingStore.returnsDescription": "Vous avez changé d’avis ? Renvoyez-le sous 30 jours.",
  "landingStore.securePaymentTitle": "Paiement sécurisé",
  "landingStore.securePaymentDescription":
    "Paiements chiffrés et protection de l’acheteur sur chaque commande.",
  "landingStore.newsletterTitle": "Nouvelles de l’atelier",
  "landingStore.newsletterDescription":
    "Nouveautés, réassorts et une recette de temps en temps. Un e-mail par mois, jamais plus.",
  "landingStore.newsletterEmailLabel": "Adresse e-mail",
  "landingStore.newsletterPlaceholder": "Votre adresse e-mail",
  "landingStore.newsletterSubmit": "S’abonner",
  "landingStore.newsletterSuccess":
    "Vous êtes inscrit. Vérifiez votre boîte de réception pour confirmer.",
  "landingStore.newsletterInvalid": "Saisissez une adresse e-mail valide.",
  "landingStore.footerBlurb":
    "Des objets du quotidien issus de petits ateliers, emballés avec soin et expédiés depuis notre studio.",
  "landingStore.footerShop": "Boutique",
  "landingStore.footerHelp": "Aide",
  "landingStore.footerCompany": "L’entreprise",
  "landingStore.footerShipping": "Livraison",
  "landingStore.footerReturns": "Retours",
  "landingStore.footerContact": "Nous contacter",
  "landingStore.footerAbout": "Notre histoire",
  "landingStore.footerJournal": "Le carnet",
  "landingStore.footerPrivacy": "Confidentialité",
  "landingStore.footerTerms": "Conditions",
};
