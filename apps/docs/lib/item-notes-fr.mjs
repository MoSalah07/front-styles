/**
 * French prop descriptions and notes. See `item-notes-ar.mjs` for the key
 * scheme and for why the prop names themselves stay in English.
 *
 * French requires a space before `?`, `!`, `;` and `:`, and it has to be a
 * non-breaking one. The strings below carry U+202F (narrow no-break space)
 * and U+00A0, written as escapes because editors and formatters quietly
 * normalise the characters themselves.
 */
export const FR = {
  "*.className":
    "Fusionné en dernier via cn(), si bien qu’un utilitaire écrit ici l’emporte sur les valeurs par défaut.",

  "button.variant":
    "Le poids visuel. Les couleurs de survol et d’activation viennent des tokens primary-*.",
  "button.size": "La hauteur vient de --control-h-*, elle suit donc le réglage de densité.",
  "button.loading":
    "Remplace le contenu par un indicateur et signale le bouton comme occupé aux technologies d’assistance.",
  "button.asChild": "Rend l’unique enfant à la place d’un <button>, un lien par exemple.",
  "button.notes.0":
    "Un bouton à icône seule a besoin d’un aria-label : le glyphe ne constitue pas un nom accessible.",

  "input.aria-invalid": "Bascule la bordure et l’anneau vers le rôle destructive.",
  "input.notes.0":
    "Associez chaque champ à un <Label htmlFor>, pour qu’un clic sur l’étiquette donne le focus au contrôle.",

  "select.notes.0":
    "Select est une racine Radix : utilisez value et onValueChange, ou defaultValue en non contrôlé.",

  "checkbox.notes.0": 'Prend en charge l’état indéterminé via checked="indeterminate".',

  "form.notes.0": "Form est le FormProvider de react-hook-form, et FormField son Controller.",
  "form.notes.1":
    "FormControl clone son unique enfant et lui câble id, aria-describedby et aria-invalid.",

  "dialog.showCloseButton":
    "Sur DialogContent. Masquez-le quand le contenu fournit sa propre commande de fermeture.",
  "dialog.notes.0": "Chaque DialogContent a besoin d’un DialogTitle, même masqué visuellement.",

  "sheet.side":
    "Le bord logique d’où glisse le panneau, pour qu’il se reflète correctement en RTL.",

  "dropdown-menu.variant": "Sur DropdownMenuItem. Teinte les actions irréversibles.",
  "dropdown-menu.inset":
    "Ajoute un remplissage au début logique, pour qu’un libellé s’aligne sur les lignes qui portent un indicateur.",

  "tooltip.notes.0":
    "Enveloppez un écran dans un seul TooltipProvider, pour que le délai d’ouverture soit partagé.",

  "accordion.type":
    'Obligatoire. Avec "single", ajoutez collapsible pour permettre de refermer l’élément ouvert.',

  "table.notes.0":
    "Table s’affiche dans son propre conteneur de défilement, si bien qu’un tableau large ne casse jamais la page.",

  "badge.variant":
    "Les rampes d’état sont distinctes de la rampe de marque, elles n’entrent donc jamais en collision.",

  "alert.variant": "Choisit la rampe d’état pour la bordure, la teinte et la couleur de l’icône.",

  "command.notes.0":
    "Bâti sur cmdk. CommandDialog ajoute l’habillage de la palette et un nom accessible.",

  "data-table.data":
    "Les lignes. La recherche, le tri et la pagination s’exécutent tous sur ce tableau.",
  "data-table.columns":
    "id, header et cell sont obligatoires ; ajoutez sortable, align ou accessor selon les besoins.",
  "data-table.searchable": "Affiche le champ de recherche.",
  "data-table.selectable": "Ajoute la colonne de cases à cocher.",
  "data-table.paginated": "Mettez false pour rendre toutes les lignes.",
  "data-table.loading": "Remplace le corps par des lignes squelettes.",

  "stat-card.label": "Ce que le chiffre mesure.",
  "stat-card.value": "Le chiffre lui-même, déjà formaté.",
  "stat-card.delta": "L’évolution par rapport à la période de comparaison.",
  "stat-card.trend": "Colore l’écart : success, destructive ou muted.",
  "stat-card.loading": "Remplace la valeur et l’écart par des squelettes.",

  "pricing-table.period":
    "Quel prix les offres affichent. C’est le parent qui en est propriétaire.",
  "pricing-table.onPeriodChange": "Déclenché par l’interrupteur de facturation.",
  "pricing-table.columns": "Largeur maximale de la rangée avant qu’elle ne passe à la ligne.",
  "pricing-table.featured": "Sur PricingTier. Fait monter l’offre sur la surface de marque.",

  "copy-button.value":
    "Ce qui atterrit dans le presse-papiers. La forme fonction s’exécute au clic, pour un texte qui n’est connu qu’à ce moment-là.",
  "copy-button.copyLabel": "Le nom accessible de la forme à icône seule, et l’infobulle au survol.",
  "copy-button.copiedLabel":
    "Remplace le libellé visible et est annoncé dans une région live polie.",
  "copy-button.timeout": "Durée de l’état de succès, en millisecondes.",
  "copy-button.onCopy":
    "S’exécute avec le texte copié. Appelez notify.copied() ici pour une notification.",
  "copy-button.onCopyError":
    "S’exécute quand le navigateur refuse l’écriture, par exemple sur une origine non sécurisée.",
  "copy-button.notes.0":
    "Le bouton ne porte aucune dépendance de notification ; câblez onCopy à notify() si vous en voulez une.",
  "copy-button.notes.1":
    "useClipboard, c’est la même logique sans le balisage, pour une commande de copie de votre cru.",

  "install-command.packageName":
    "Le ou les paquets à ajouter. Rendus en npm install, pnpm add, yarn add et bun add.",
  "install-command.command":
    "Un binaire à exécuter une seule fois à la place, préfixé selon le gestionnaire par npx, pnpm dlx, yarn dlx ou bunx.",
  "install-command.commands":
    "Remplacement complet par gestionnaire, quand aucune des deux formes ci-dessus ne convient.",
  "install-command.dev":
    "Ajoute le drapeau de dépendance de développement propre à chaque gestionnaire.",
  "install-command.managers": "Les onglets à afficher, dans l’ordre.",
  "install-command.storageKey":
    "Où le choix du lecteur est retenu. Il est lu après le montage, le rendu serveur reste donc stable.",
  "install-command.toast": "Notification en cas de copie réussie ; une chaîne remplace le message.",
  "install-command.notes.0":
    'La commande est rendue en dir="ltr", pour rester lisible à l’intérieur d’une page RTL.',
  "install-command.notes.1":
    "Montez <Toaster /> une fois dans votre layout racine, ou passez toast={false}.",

  "code-block.code": "Le texte affiché, et exactement celui que le bouton de copie écrit.",
  "code-block.label": "Libellé de gouttière : un nom de fichier, ou un langage.",
  "code-block.lineNumbers":
    "Numérote les lignes. Les numéros sont aria-hidden et n’atteignent jamais le presse-papiers.",
  "code-block.maxHeight": "Hauteur à partir de laquelle le bloc commence à défiler.",
  "code-block.hideHeader":
    "Supprime la barre et fait flotter le bouton de copie au-dessus du code, au survol ou au focus.",
  "code-block.toast": "Notification en cas de copie réussie ; une chaîne remplace le message.",
  "code-block.notes.0":
    "Sans coloration syntaxique, volontairement : aucune dépendance à un analyseur, et rien qui puisse diverger à l’hydratation.",

  "theme-select.variant":
    "select affiche le nom du mode et un chevron ; les deux autres se réduisent à un bouton carré, pour un en-tête.",
  "theme-select.size": "La hauteur vient de --control-h-*, elle suit donc le réglage de densité.",
  "theme-select.align":
    "Le bord logique sur lequel la liste s’aligne, pour qu’elle se reflète en RTL.",
  "theme-select.labels":
    "Remplace Theme, Light, Dark et System, pour une application qui tourne dans une autre langue.",
  "theme-select.defaultTheme":
    "Le mode utilisé pour le rendu serveur, et jusqu’à ce que le lecteur ait choisi.",
  "theme-select.storageKey":
    "Où le choix est retenu. Doit correspondre à votre script de pré-peinture.",
  "theme-select.onThemeChange": "Se déclenche une fois la racine du document mise à jour.",
  "theme-select.notes.0":
    "L’état vit sur <html>, pas dans un contexte React : cela fonctionne donc avec ou sans provider, et s’accorde avec un script de pré-peinture exécuté avant le démarrage de React.",
  "theme-select.notes.1":
    "Ajoutez un script inline dans <head> qui lit la même clé et pose la classe avant la première peinture, sans quoi la page clignote dans le mauvais thème à chaque chargement.",
  "theme-select.notes.2":
    "La ligne System montre ce à quoi le système se résout actuellement, si bien que le choix n’est jamais une devinette.",

  "language-select.locales":
    "Les langues proposées, dans l’ordre de la liste. Chacune est { code, nativeName, englishName?, dir? }.",
  "language-select.display":
    "Si le déclencheur montre le nom de la langue dans sa propre écriture ou son code, par exemple AR.",
  "language-select.variant": "Les trois mêmes formes de déclencheur que ThemeSelect.",
  "language-select.label":
    "Nomme le contrôle et coiffe la liste. Par défaut, il vient du catalogue actif.",
  "language-select.storageKey":
    "Où le choix est retenu. Doit correspondre à votre script de pré-peinture.",
  "language-select.onLocaleChange":
    "Se déclenche une fois lang et dir posés. Câblez-y votre framework i18n ou votre routeur ; le composant ne navigue pas de lui-même.",
  "language-select.notes.0":
    'Choisir l’arabe pose dir="rtl" en plus de lang, et c’est là toute la passe RTL pour chaque composant de la page — la bibliothèque est écrite en propriétés logiques.',
  "language-select.notes.1":
    "La direction est déduite du code quand une locale n’en déclare pas, si bien que l’hébreu et le persan se reflètent sans configuration supplémentaire.",
  "language-select.notes.2":
    "Pas de drapeaux. Un drapeau désigne un pays, pas une langue, et l’arabe en compte vingt.",

  "use-theme.returns":
    "theme peut valoir system ; resolvedTheme vaut toujours light ou dark. mounted est false pendant l’hydratation.",
  "use-theme.defaultTheme":
    "Utilisé pour le rendu serveur, et jusqu’à ce que le lecteur ait choisi.",
  "use-theme.storageKey": "La clé localStorage qui porte le choix.",
  "use-theme.notes.0":
    "Bâti sur useSyncExternalStore au-dessus du document, si bien que plusieurs sélecteurs sur une même page restent synchronisés, et deux onglets aussi.",
  "use-theme.notes.1":
    "system continue de suivre l’OS : changer l’apparence dans les réglages système repeint la page sans rechargement.",
  "use-theme.notes.2":
    "Exporte aussi applyTheme et resolveTheme, pour un script de pré-peinture ou un appel impératif hors de React.",

  "use-locale.returns": "option est l’entrée complète du code actif ; dir est déjà appliqué.",
  "use-locale.locales": "Les langues à proposer. Un code absent de la liste est ignoré.",
  "use-locale.storageKey": "La clé localStorage qui porte le choix.",
  "use-locale.notes.0":
    "Écrit lang et dir sur <html>, et rien d’autre : il ne route pas, et ne charge pas de catalogues de messages. Câblez-les à onLocaleChange.",
  "use-locale.notes.1":
    "Exporte aussi directionOf et applyLocale, pour qu’un script de pré-peinture puisse poser la direction avant la première peinture.",

  "hero.variant": "Empilé et aligné au début, centré, ou texte à côté d’un média.",
  "hero.decoration":
    "Couche de fond décorative. Elle est aria-hidden et n’affecte jamais la mise en page.",
};
