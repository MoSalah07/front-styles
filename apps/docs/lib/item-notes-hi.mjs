/**
 * Hindi prop descriptions and notes. See `item-notes-ar.mjs` for the key scheme
 * and for why the prop names themselves stay in English.
 *
 * The register is the one a Hindi-speaking developer reads: settled loanwords
 * stay loanwords — कंपोनेंट, टोकन, क्लिपबोर्ड, डिफ़ॉल्ट — and plain Hindi is used
 * wherever it is the everyday word.
 */
export const HI = {
  "*.className":
    "cn() के ज़रिए सबसे आख़िर में मर्ज होता है, इसलिए यहाँ लिखी कोई भी यूटिलिटी डिफ़ॉल्ट पर भारी पड़ती है।",

  "button.variant": "दृश्य भार। होवर और सक्रिय रंग primary-* टोकन से आते हैं।",
  "button.size": "ऊँचाई --control-h-* से आती है, इसलिए यह सघनता सेटिंग पर प्रतिक्रिया देती है।",
  "button.loading": "सामग्री की जगह स्पिनर दिखाता है और सहायक तकनीक को बताता है कि बटन व्यस्त है।",
  "button.asChild": "<button> के बजाय अपने इकलौते चाइल्ड को रेंडर करता है, जैसे कोई ऐंकर।",
  "button.notes.0": "सिर्फ़ आइकन वाले बटन को aria-label चाहिए; अकेला ग्लिफ़ सुलभ नाम नहीं होता।",

  "input.aria-invalid": "बॉर्डर और रिंग को destructive भूमिका में बदल देता है।",
  "input.notes.0":
    "हर फ़ील्ड को <Label htmlFor> से जोड़ें, ताकि लेबल पर क्लिक करने से कंट्रोल पर फ़ोकस आए।",

  "select.notes.0":
    "Select एक Radix रूट है: value और onValueChange इस्तेमाल करें, या अनियंत्रित रूप के लिए defaultValue।",

  "checkbox.notes.0": 'checked="indeterminate" के ज़रिए अनिश्चित स्थिति का समर्थन करता है।',

  "form.notes.0": "Form दरअसल react-hook-form का FormProvider है, और FormField उसका Controller।",
  "form.notes.1":
    "FormControl अपने इकलौते चाइल्ड को क्लोन करता है और उसमें id, aria-describedby तथा aria-invalid जोड़ देता है।",

  "dialog.showCloseButton":
    "DialogContent पर। जब सामग्री ख़ुद अपना क्लोज़ कंट्रोल देती हो तो इसे छिपा दें।",
  "dialog.notes.0": "हर DialogContent को एक DialogTitle चाहिए, भले ही वह दृश्य रूप से छिपा हो।",

  "sheet.side": "वह लॉजिकल किनारा जहाँ से पैनल सरकता है, ताकि RTL में वह सही तरफ़ से आए।",

  "dropdown-menu.variant": "DropdownMenuItem पर। अपरिवर्तनीय क्रियाओं को रंग देता है।",
  "dropdown-menu.inset":
    "लॉजिकल शुरुआत में पैडिंग जोड़ता है, ताकि लेबल उन पंक्तियों से संरेखित हो जिनमें संकेतक होते हैं।",

  "tooltip.notes.0":
    "पूरी स्क्रीन को एक ही TooltipProvider में लपेटें, ताकि खुलने की देरी साझा रहे।",

  "accordion.type":
    'आवश्यक। "single" के साथ collapsible जोड़ें, ताकि खुला आइटम बंद भी किया जा सके।',

  "table.notes.0":
    "Table अपने ही स्क्रॉल कंटेनर के भीतर रेंडर होता है, इसलिए चौड़े टेबल कभी पेज नहीं तोड़ते।",

  "badge.variant": "स्थिति रैंप ब्रांड रैंप से अलग हैं, इसलिए वे कभी आपस में नहीं टकरातीं।",

  "alert.variant": "बॉर्डर, टिंट और आइकन के रंग के लिए स्थिति रैंप चुनता है।",

  "command.notes.0": "cmdk पर बना है। CommandDialog पैलेट का ढाँचा और एक सुलभ नाम जोड़ देता है।",

  "data-table.data": "पंक्तियाँ। खोज, क्रमबद्धता और पेजिंग सब इसी ऐरे पर चलते हैं।",
  "data-table.columns":
    "id, header और cell आवश्यक हैं; ज़रूरत हो तो sortable, align या accessor जोड़ें।",
  "data-table.searchable": "खोज फ़ील्ड दिखाता है।",
  "data-table.selectable": "चेकबॉक्स कॉलम जोड़ता है।",
  "data-table.paginated": "सभी पंक्तियाँ दिखाने के लिए false कर दें।",
  "data-table.loading": "टेबल की बॉडी को स्केलेटन पंक्तियों से बदल देता है।",

  "stat-card.label": "यह आँकड़ा किस चीज़ को मापता है।",
  "stat-card.value": "आँकड़ा ख़ुद, पहले से फ़ॉर्मैट किया हुआ।",
  "stat-card.delta": "तुलना अवधि के मुक़ाबले बदलाव।",
  "stat-card.trend": "अंतर को रंग देता है: success, destructive या muted।",
  "stat-card.loading": "मान और अंतर की जगह स्केलेटन दिखा देता है।",

  "pricing-table.period": "प्लान कौन-सी क़ीमत दिखाएँ। यह स्थिति पैरेंट के पास रहती है।",
  "pricing-table.onPeriodChange": "बिलिंग स्विच से चलता है।",
  "pricing-table.columns": "पंक्ति रैप होने से पहले अधिकतम कितनी चौड़ी हो सकती है।",
  "pricing-table.featured": "PricingTier पर। उस प्लान को ब्रांड सतह पर उठा देता है।",

  "copy-button.value":
    "क्लिपबोर्ड में क्या जाएगा। फ़ंक्शन वाला रूप क्लिक के समय चलता है, उस टेक्स्ट के लिए जो तभी पता चलता है।",
  "copy-button.copyLabel": "सिर्फ़ आइकन वाले रूप का सुलभ नाम, और होवर पर दिखने वाला title।",
  "copy-button.copiedLabel":
    "दिखने वाले लेबल की जगह लेता है और एक विनम्र लाइव रीजन में घोषित होता है।",
  "copy-button.timeout": "सफलता की स्थिति कितनी देर रहे, मिलीसेकंड में।",
  "copy-button.onCopy":
    "कॉपी किए गए टेक्स्ट के साथ चलता है। टोस्ट चाहिए तो यहाँ notify.copied() बुलाएँ।",
  "copy-button.onCopyError": "जब ब्राउज़र लिखने से मना कर दे, जैसे किसी असुरक्षित ऑरिजिन पर।",
  "copy-button.notes.0":
    "बटन ख़ुद किसी टोस्ट डिपेंडेंसी के साथ नहीं आता; चाहिए तो onCopy को notify() से जोड़ दें।",
  "copy-button.notes.1":
    "useClipboard वही तर्क है, बिना किसी मार्कअप के — अपनी बनाई कॉपी सुविधा के लिए।",

  "install-command.packageName":
    "जोड़े जाने वाले पैकेज। npm install, pnpm add, yarn add और bun add के रूप में दिखते हैं।",
  "install-command.command":
    "इसके बजाय एक बार चलाने वाली बाइनरी, जिसे हर मैनेजर के हिसाब से npx, pnpm dlx, yarn dlx या bunx लगाकर दिखाया जाता है।",
  "install-command.commands": "हर मैनेजर के लिए पूरा ओवरराइड, जब ऊपर के दोनों रूप काम न आएँ।",
  "install-command.dev": "हर मैनेजर का अपना dev-dependency फ़्लैग जोड़ देता है।",
  "install-command.managers": "कौन-से टैब दिखें, और किस क्रम में।",
  "install-command.storageKey":
    "पाठक की पसंद कहाँ याद रखी जाए। यह माउंट के बाद पढ़ी जाती है, इसलिए SSR स्थिर रहता है।",
  "install-command.toast": "कॉपी सफल होने पर टोस्ट; कोई स्ट्रिंग देने पर वही संदेश बन जाती है।",
  "install-command.notes.0":
    'कमांड dir="ltr" के साथ रेंडर होती है, ताकि RTL पेज के भीतर भी पढ़ी जा सके।',
  "install-command.notes.1":
    "<Toaster /> को अपने रूट लेआउट में एक बार माउंट करें, या toast={false} पास कर दें।",

  "code-block.code": "जो टेक्स्ट दिखता है, और ठीक वही जो कॉपी बटन लिखता है।",
  "code-block.label": "गटर लेबल: कोई फ़ाइल नाम, या कोई भाषा।",
  "code-block.lineNumbers":
    "पंक्तियों को संख्या देता है। ये संख्याएँ aria-hidden हैं और कभी क्लिपबोर्ड तक नहीं पहुँचतीं।",
  "code-block.maxHeight": "किस ऊँचाई पर ब्लॉक स्क्रॉल होने लगे।",
  "code-block.hideHeader":
    "पट्टी हटा देता है और कॉपी बटन को होवर या फ़ोकस पर कोड के ऊपर तैरा देता है।",
  "code-block.toast": "कॉपी सफल होने पर टोस्ट; कोई स्ट्रिंग देने पर वही संदेश बन जाती है।",
  "code-block.notes.0":
    "जानबूझकर बिना सिंटैक्स हाइलाइटिंग के: न किसी टोकनाइज़र पर निर्भरता, न हाइड्रेशन पर कुछ बेमेल होने की गुंजाइश।",

  "theme-select.variant":
    "select मोड का नाम और एक शेवरॉन दिखाता है; बाक़ी दो हेडर के लिए चौकोर बटन में सिमट जाते हैं।",
  "theme-select.size": "ऊँचाई --control-h-* से आती है, इसलिए यह सघनता सेटिंग का अनुसरण करती है।",
  "theme-select.align":
    "वह लॉजिकल किनारा जिससे सूची संरेखित होती है, ताकि RTL में वह सही तरफ़ खुले।",
  "theme-select.labels":
    "Theme, Light, Dark और System को बदल देता है — उस ऐप के लिए जो किसी और भाषा में चलता है।",
  "theme-select.defaultTheme": "सर्वर रेंडर के लिए, और तब तक जब तक पाठक चुन न ले।",
  "theme-select.storageKey":
    "चुनाव कहाँ याद रखा जाए। यह आपकी प्री-पेंट स्क्रिप्ट से मेल खाना चाहिए।",
  "theme-select.onThemeChange": "डॉक्यूमेंट रूट अपडेट होने के बाद चलता है।",
  "theme-select.notes.0":
    "स्थिति React कॉन्टेक्स्ट में नहीं, <html> पर रहती है — इसलिए यह प्रोवाइडर के साथ भी चलता है और बिना उसके भी, और React के बूट होने से पहले चली प्री-पेंट स्क्रिप्ट से भी सहमत रहता है।",
  "theme-select.notes.1":
    "<head> में एक इनलाइन स्क्रिप्ट जोड़ें जो वही कुंजी पढ़कर पहली पेंट से पहले क्लास सेट कर दे, वरना हर लोड पर पेज ग़लत थीम में झपक उठेगा।",
  "theme-select.notes.2":
    "System पंक्ति दिखाती है कि सिस्टम अभी किस मोड पर है, ताकि चुनाव कभी अंदाज़ा न बने।",

  "language-select.locales":
    "कौन-सी भाषाएँ दिखें, सूची के क्रम में। हर एक { code, nativeName, englishName?, dir? } है।",
  "language-select.display": "ट्रिगर पर भाषा का अपना नाम दिखे या उसका कोड, जैसे AR।",
  "language-select.variant": "ThemeSelect जैसे ही तीन ट्रिगर रूप।",
  "language-select.label":
    "कंट्रोल को नाम देता है और सूची का शीर्ष बनता है। डिफ़ॉल्ट रूप से सक्रिय कैटलॉग से आता है।",
  "language-select.storageKey":
    "चुनाव कहाँ याद रखा जाए। यह आपकी प्री-पेंट स्क्रिप्ट से मेल खाना चाहिए।",
  "language-select.onLocaleChange":
    "lang और dir सेट होने के बाद चलता है। अपना i18n फ़्रेमवर्क या राउटर यहीं जोड़ें; कंपोनेंट ख़ुद नेविगेट नहीं करता।",
  "language-select.notes.0":
    'अरबी चुनने पर lang के साथ dir="rtl" भी सेट होता है, और पेज के हर कंपोनेंट के लिए पूरा RTL बदलाव बस इतना ही है — लाइब्रेरी लॉजिकल प्रॉपर्टी में लिखी गई है।',
  "language-select.notes.1":
    "जब कोई लोकेल दिशा घोषित न करे तो वह उसके टैग से आ जाती है, इसलिए हिब्रू और फ़ारसी बिना अतिरिक्त सेटिंग के सही दिशा में आते हैं।",
  "language-select.notes.2":
    "झंडे नहीं। झंडा देश का होता है, भाषा का नहीं — और अरबी के बीस देश हैं।",

  "use-theme.returns":
    "theme system भी हो सकता है; resolvedTheme हमेशा light या dark होता है। हाइड्रेशन के दौरान mounted false रहता है।",
  "use-theme.defaultTheme": "सर्वर रेंडर के लिए, और तब तक जब तक पाठक चुन न ले।",
  "use-theme.storageKey": "वह localStorage कुंजी जिसमें चुनाव रखा है।",
  "use-theme.notes.0":
    "डॉक्यूमेंट के ऊपर useSyncExternalStore पर बना है, इसलिए एक ही पेज के कई पिकर आपस में तालमेल में रहते हैं — और दो टैब भी।",
  "use-theme.notes.1":
    "system OS का अनुसरण करता रहता है: सिस्टम सेटिंग्स में दिखावट बदलते ही पेज बिना रीलोड दोबारा रंग जाता है।",
  "use-theme.notes.2":
    "applyTheme और resolveTheme भी एक्सपोर्ट करता है — प्री-पेंट स्क्रिप्ट के लिए, या React के बाहर किसी सीधे कॉल के लिए।",

  "use-locale.returns": "option सक्रिय कोड की पूरी एंट्री है; dir पहले ही लागू हो चुका होता है।",
  "use-locale.locales": "कौन-सी भाषाएँ दी जाएँ। सूची से बाहर का कोड नज़रअंदाज़ कर दिया जाता है।",
  "use-locale.storageKey": "वह localStorage कुंजी जिसमें चुनाव रखा है।",
  "use-locale.notes.0":
    "यह <html> पर lang और dir लिखता है, इससे ज़्यादा कुछ नहीं: न रूटिंग करता है, न मैसेज कैटलॉग लोड करता है। उन दोनों को onLocaleChange से जोड़ें।",
  "use-locale.notes.1":
    "directionOf और applyLocale भी एक्सपोर्ट करता है, ताकि प्री-पेंट स्क्रिप्ट पहली पेंट से पहले दिशा सेट कर सके।",

  "hero.variant": "ऊपर-नीचे और शुरुआत से संरेखित, बीच में, या मीडिया के बग़ल में टेक्स्ट।",
  "hero.decoration": "सजावटी बैकग्राउंड परत। यह aria-hidden है और लेआउट पर कभी असर नहीं डालती।",
};
