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
  "login.emailPlaceholder": "you@example.com",
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
  "forgotPassword.emailPlaceholder": "you@example.com",
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
  "register.emailPlaceholder": "you@example.com",
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
  "settings.densityCompact": "Compact",
  "settings.densityComfortable": "Par défaut",
  "settings.densitySpacious": "Aéré",
  "settings.dangerTitle": "Zone de danger",
  "settings.dangerDescription":
    "Supprimer l’espace de travail retire tous les projets, membres et clés API. Cette action est irréversible.",
  "settings.dangerAction": "Supprimer l’espace de travail",
  "settings.dangerConfirmTitle": "Supprimer cet espace de travail\u202F?",
  "settings.dangerConfirmDescription":
    "Tous les projets, membres et clés API sont retirés immédiatement. Cette action est irréversible.",
};
