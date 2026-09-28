/**
 * Hindi catalogue (Devanagari).
 *
 * The register is the one a Hindi-speaking developer actually reads: the
 * settled English loanwords stay as loanwords — कंपोनेंट, टोकन, साइन इन,
 * पासवर्ड, सेटिंग्स — because the Sanskritised coinages for them are not what
 * anyone says or searches for. Where a plain Hindi word is the everyday one,
 * that wins instead.
 *
 * Hindi takes the same two plural categories as English, so the counted-noun
 * entries carry `one` and `other`.
 */
import type { Messages } from "./en";

export const hi: Messages = {
  // breadcrumb
  "breadcrumb.label": "नेविगेशन पथ",
  "breadcrumb.more": "अधिक",

  // pagination
  "pagination.label": "पृष्ठ नेविगेशन",
  "pagination.previous": "पिछला",
  "pagination.next": "अगला",
  "pagination.goToPrevious": "पिछले पृष्ठ पर जाएँ",
  "pagination.goToNext": "अगले पृष्ठ पर जाएँ",
  "pagination.morePages": "और पृष्ठ",

  // dialog / sheet / toast
  "dialog.close": "बंद करें",
  "sheet.close": "बंद करें",
  "toast.dismiss": "खारिज करें",
  "toast.copied": "क्लिपबोर्ड पर कॉपी हो गया",

  // command palette
  "command.title": "कमांड पैलेट",
  "command.description": "चलाने के लिए कोई कमांड खोजें।",

  // copy button / code block / install command
  "copyButton.copy": "कॉपी करें",
  "copyButton.copied": "कॉपी हो गया",
  "codeBlock.copy": "कोड कॉपी करें",
  "installCommand.packageManager": "पैकेज मैनेजर",

  // application sidebar
  "sidebar.label": "मुख्य नेविगेशन",
  "sidebar.mobileDescription": "ऐप्लिकेशन के अनुभागों के बीच नेविगेट करें।",
  "sidebar.toggle": "साइडबार दिखाएँ या छिपाएँ",

  // confirm dialog
  "confirmDialog.confirm": "पुष्टि करें",
  "confirmDialog.cancel": "रद्द करें",

  // data table
  "dataTable.searchLabel": "पंक्तियों में खोजें",
  "dataTable.searchPlaceholder": "खोजें…",
  "dataTable.emptyTitle": "कोई परिणाम नहीं",
  "dataTable.emptyDescription": "मौजूदा फ़िल्टर से कुछ भी मेल नहीं खाता।",
  "dataTable.selectAll": "सभी पंक्तियाँ चुनें",
  "dataTable.toggleColumns": "कॉलम दिखाएँ या छिपाएँ",
  "dataTable.columns": "कॉलम",
  "dataTable.previousPage": "पिछला पृष्ठ",
  "dataTable.nextPage": "अगला पृष्ठ",
  "dataTable.pageStatus": "{pages} में से पृष्ठ {page}",
  "dataTable.rowCount": {
    one: "{count} पंक्ति।",
    other: "{count} पंक्तियाँ।",
  },
  "dataTable.selectedCount": {
    one: "{total} में से {count} पंक्ति चुनी गई।",
    other: "{total} में से {count} पंक्तियाँ चुनी गईं।",
  },

  // error state
  "errorState.title": "कुछ गलत हो गया",
  "errorState.retry": "फिर से कोशिश करें",

  // filter bar
  "filterBar.label": "खोजें",
  "filterBar.placeholder": "खोजें…",

  // language select
  "languageSelect.label": "भाषा",

  // logo marquee
  "logoMarquee.label": "लोगो",

  // pricing table
  "pricingTable.monthly": "मासिक",
  "pricingTable.annual": "वार्षिक",
  "pricingTable.billAnnually": "वार्षिक बिलिंग",

  // site footer
  "siteFooter.social": "सोशल",
  "siteFooter.legal": "कानूनी",

  // site navbar
  "siteNavbar.nav": "मुख्य नेविगेशन",
  "siteNavbar.openMenu": "मेनू खोलें",
  "siteNavbar.menuTitle": "मेनू",
  "siteNavbar.menuDescription": "साइट नेविगेशन",
  "siteNavbar.home": "होम",

  // dashboard shell
  "dashboardShell.signOut": "साइन आउट",
  "dashboardShell.sidebarLabel": "मुख्य नेविगेशन",

  // error pages
  "errorPages.home": "होम पर वापस जाएँ",
  "errorPages.back": "वापस जाएँ",
  "errorPages.retry": "फिर से कोशिश करें",
  "errorPages.notFoundEyebrow": "पृष्ठ नहीं मिला",
  "errorPages.notFoundTitle": "यह पृष्ठ गलत मोड़ ले बैठा।",
  "errorPages.notFoundDescription":
    "हो सकता है लिंक टूट गया हो, या पृष्ठ कहीं और ले जाया गया हो। पता जाँचें, या किसी परिचित जगह पर लौट जाएँ।",
  "errorPages.serverErrorEyebrow": "कुछ टूट गया",
  "errorPages.serverErrorTitle": "हमारी तरफ़ कुछ अटक गया।",
  "errorPages.serverErrorDescription":
    "अनुरोध पूरा नहीं हो सका। टीम को सूचित कर दिया गया है; दोबारा कोशिश करने से आम तौर पर काम बन जाता है।",

  // sign in (split and centred)
  "login.eyebrow": "वापसी पर स्वागत है",
  "login.title": "साइन इन",
  "login.subtitle": "जारी रखने के लिए अपनी जानकारी दर्ज करें।",
  "login.subtitleCentred": "जारी रखने के लिए अपना कार्य ईमेल इस्तेमाल करें।",
  "login.emailLabel": "ईमेल",
  "login.emailPlaceholder": "you@example.com",
  "login.passwordLabel": "पासवर्ड",
  "login.passwordPlaceholder": "आपका पासवर्ड",
  "login.remember": "मुझे याद रखें",
  "login.forgot": "पासवर्ड भूल गए?",
  "login.submit": "साइन इन करें",
  "login.showPassword": "पासवर्ड दिखाएँ",
  "login.hidePassword": "पासवर्ड छिपाएँ",
  "login.brandTitle": "कंट्रोल रूम में साइन इन करें।",
  "login.brandDescription": "आप जो भी इंटरफ़ेस बनाएँ, उस सबके लिए एक ही डिज़ाइन सिस्टम।",
  "login.pointsLabel": "इस उत्पाद के बारे में",
  "login.pointShipTitle": "मिनटों में लॉन्च करें",
  "login.pointShipDescription": "टोकन, प्रिमिटिव और ब्लॉक, जो पहले से आपस में मेल खाते हैं।",
  "login.pointAccessibleTitle": "डिफ़ॉल्ट रूप से सुलभ",
  "login.pointAccessibleDescription":
    "हर कंट्रोल कीबोर्ड से पहुँच में है और सही ढंग से लेबल किया गया है।",
  "login.pointRtlTitle": "RTL और डार्क, दोनों मूल रूप से",
  "login.pointRtlDescription": "अरबी और अंग्रेज़ी, हल्का और गहरा — सब एक ही स्रोत से।",

  // forgot password
  "forgotPassword.eyebrow": "खाता पुनर्प्राप्ति",
  "forgotPassword.title": "पासवर्ड भूल गए?",
  "forgotPassword.subtitle": "अपने खाते का ईमेल दर्ज करें, हम रीसेट लिंक भेज देंगे।",
  "forgotPassword.emailLabel": "ईमेल",
  "forgotPassword.emailPlaceholder": "you@example.com",
  "forgotPassword.submit": "रीसेट लिंक भेजें",
  "forgotPassword.sentTitle": "अपना इनबॉक्स देखें",
  "forgotPassword.resend": "लिंक दोबारा भेजें",
  "forgotPassword.back": "साइन इन पर वापस जाएँ",

  // one-time code
  "otp.eyebrow": "दो-चरणीय सत्यापन",
  "otp.title": "अपना कोड दर्ज करें",
  "otp.subtitle": "हमने एक बार इस्तेमाल होने वाला कोड भेजा है",
  "otp.fieldLabel": "एक बार का कोड",
  "otp.submit": "सत्यापित करें",
  "otp.resendPrompt": "कोड नहीं मिला?",
  "otp.resend": "नया कोड भेजें",
  "otp.back": "साइन इन पर वापस जाएँ",
  "otp.resendCountdown": "({seconds} सेकंड)",

  // register
  "register.eyebrow": "शुरू करें",
  "register.title": "अपना खाता बनाएँ",
  "register.subtitle": "इसमें एक मिनट से भी कम लगता है।",
  "register.nameLabel": "पूरा नाम",
  "register.namePlaceholder": "नूर हसन",
  "register.emailLabel": "ईमेल",
  "register.emailPlaceholder": "you@example.com",
  "register.passwordLabel": "पासवर्ड",
  "register.confirmLabel": "पासवर्ड की पुष्टि करें",
  "register.terms": "मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ।",
  "register.submit": "खाता बनाएँ",
  "register.mismatch": "दोनों पासवर्ड मेल नहीं खाते।",
  "register.showPassword": "पासवर्ड दिखाएँ",
  "register.hidePassword": "पासवर्ड छिपाएँ",
  "register.strengthLabel": "पासवर्ड की मज़बूती",
  "register.strengthHint": "कम से कम 8 वर्ण इस्तेमाल करें, जिनमें एक अंक और एक चिह्न हो।",
  "register.strengthValue": "पासवर्ड की मज़बूती: {strength}",
  "register.strength0": "बहुत छोटा",
  "register.strength1": "कमज़ोर",
  "register.strength2": "ठीक-ठाक",
  "register.strength3": "अच्छा",
  "register.strength4": "मज़बूत",

  // settings
  "settings.title": "सेटिंग्स",
  "settings.description": "अपना खाता, अपनी सूचनाएँ और इंटरफ़ेस का रूप प्रबंधित करें।",
  "settings.sectionsLabel": "सेटिंग्स के अनुभाग",
  "settings.profile": "प्रोफ़ाइल",
  "settings.profileDescription": "वर्कस्पेस में आपके साथी आपको ऐसे देखते हैं।",
  "settings.uploadPhoto": "फ़ोटो अपलोड करें",
  "settings.nameLabel": "पूरा नाम",
  "settings.emailLabel": "ईमेल",
  "settings.save": "बदलाव सहेजें",
  "settings.preferences": "प्राथमिकताएँ",
  "settings.preferencesDescription": "चुनें कि हम आपको क्या भेज सकते हैं।",
  "settings.prefUpdatesLabel": "उत्पाद अपडेट",
  "settings.prefUpdatesDescription": "नए कंपोनेंट और रिलीज़ के बारे में कभी-कभार ईमेल।",
  "settings.prefSecurityLabel": "सुरक्षा अलर्ट",
  "settings.prefSecurityDescription": "नए डिवाइस से साइन इन पर हमेशा भेजे जाते हैं।",
  "settings.prefDigestLabel": "साप्ताहिक सारांश",
  "settings.prefDigestDescription": "आपकी टीम ने जो कुछ पूरा किया, उसका सोमवार को आने वाला सारांश।",
  "settings.appearance": "रूप-रंग",
  "settings.colourMode": "रंग मोड",
  "settings.brand": "ब्रांड",
  "settings.density": "सघनता",
  "settings.themeLight": "हल्का",
  "settings.themeDark": "गहरा",
  "settings.themeSystem": "सिस्टम",
  "settings.densityCompact": "सघन",
  "settings.densityComfortable": "डिफ़ॉल्ट",
  "settings.densitySpacious": "खुला",
  "settings.dangerTitle": "जोखिम क्षेत्र",
  "settings.dangerDescription":
    "वर्कस्पेस हटाने पर उसका हर प्रोजेक्ट, सदस्य और API कुंजी हट जाती है। इसे पहले जैसा नहीं किया जा सकता।",
  "settings.dangerAction": "वर्कस्पेस हटाएँ",
  "settings.dangerConfirmTitle": "क्या यह वर्कस्पेस हटाना है?",
  "settings.dangerConfirmDescription":
    "हर प्रोजेक्ट, सदस्य और API कुंजी तुरंत हट जाएगी। इस कार्रवाई को पहले जैसा नहीं किया जा सकता।",
};
