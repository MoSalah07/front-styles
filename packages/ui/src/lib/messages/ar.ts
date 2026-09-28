/**
 * Arabic catalogue (Modern Standard Arabic).
 *
 * Arabic is the language that decides whether a plural implementation is real:
 * `Intl.PluralRules("ar")` returns all six CLDR categories — zero for 0, one
 * for 1, two for 2, few for 3–10, many for 11–99 and other from 100 up — and
 * each one takes a different noun form. The counted-noun entries below spell
 * out all six, so nothing ever reads as the Arabic equivalent of "1 rows".
 */
import type { Messages } from "./en";

export const ar: Messages = {
  // breadcrumb
  "breadcrumb.label": "مسار التنقل",
  "breadcrumb.more": "المزيد",

  // pagination
  "pagination.label": "ترقيم الصفحات",
  "pagination.previous": "السابق",
  "pagination.next": "التالي",
  "pagination.goToPrevious": "الانتقال إلى الصفحة السابقة",
  "pagination.goToNext": "الانتقال إلى الصفحة التالية",
  "pagination.morePages": "صفحات أخرى",

  // dialog / sheet / toast
  "dialog.close": "إغلاق",
  "sheet.close": "إغلاق",
  "toast.dismiss": "إخفاء",
  "toast.copied": "تم النسخ إلى الحافظة",

  // command palette
  "command.title": "لوحة الأوامر",
  "command.description": "ابحث عن أمر لتنفيذه.",

  // copy button / code block / install command
  "copyButton.copy": "نسخ",
  "copyButton.copied": "تم النسخ",
  "codeBlock.copy": "نسخ الكود",
  "installCommand.packageManager": "مدير الحزم",

  // application sidebar
  "sidebar.label": "التنقل الرئيسي",
  "sidebar.mobileDescription": "التنقل بين أقسام التطبيق.",
  "sidebar.toggle": "إظهار الشريط الجانبي أو إخفاؤه",

  // confirm dialog
  "confirmDialog.confirm": "تأكيد",
  "confirmDialog.cancel": "إلغاء",

  // data table
  "dataTable.searchLabel": "البحث في الصفوف",
  "dataTable.searchPlaceholder": "بحث…",
  "dataTable.emptyTitle": "لا توجد نتائج",
  "dataTable.emptyDescription": "لا شيء يطابق عوامل التصفية الحالية.",
  "dataTable.selectAll": "تحديد كل الصفوف",
  "dataTable.toggleColumns": "إظهار الأعمدة أو إخفاؤها",
  "dataTable.columns": "الأعمدة",
  "dataTable.previousPage": "الصفحة السابقة",
  "dataTable.nextPage": "الصفحة التالية",
  "dataTable.pageStatus": "الصفحة {page} من {pages}",
  "dataTable.rowCount": {
    zero: "لا توجد صفوف.",
    one: "صف واحد.",
    two: "صفان.",
    few: "{count} صفوف.",
    many: "{count} صفًا.",
    other: "{count} صف.",
  },
  "dataTable.selectedCount": {
    zero: "لم يُحدَّد أي صف من {total}.",
    one: "حُدِّد صف واحد من {total}.",
    two: "حُدِّد صفان من {total}.",
    few: "حُدِّدت {count} صفوف من {total}.",
    many: "حُدِّد {count} صفًا من {total}.",
    other: "حُدِّد {count} صف من {total}.",
  },

  // error state
  "errorState.title": "حدث خطأ ما",
  "errorState.retry": "إعادة المحاولة",

  // filter bar
  "filterBar.label": "بحث",
  "filterBar.placeholder": "بحث…",

  // language select
  "languageSelect.label": "اللغة",

  // logo marquee
  "logoMarquee.label": "الشعارات",

  // pricing table
  "pricingTable.monthly": "شهريًا",
  "pricingTable.annual": "سنويًا",
  "pricingTable.billAnnually": "الدفع سنويًا",

  // site footer
  "siteFooter.social": "التواصل الاجتماعي",
  "siteFooter.legal": "الشؤون القانونية",

  // site navbar
  "siteNavbar.nav": "التنقل الرئيسي",
  "siteNavbar.openMenu": "فتح القائمة",
  "siteNavbar.menuTitle": "القائمة",
  "siteNavbar.menuDescription": "التنقل في الموقع",
  "siteNavbar.home": "الرئيسية",

  // dashboard shell
  "dashboardShell.signOut": "تسجيل الخروج",
  "dashboardShell.sidebarLabel": "التنقل الرئيسي",

  // error pages
  "errorPages.home": "العودة إلى الرئيسية",
  "errorPages.back": "رجوع",
  "errorPages.retry": "إعادة المحاولة",
  "errorPages.notFoundEyebrow": "الصفحة غير موجودة",
  "errorPages.notFoundTitle": "هذه الصفحة سلكت منعطفًا خاطئًا.",
  "errorPages.notFoundDescription":
    "قد يكون الرابط معطوبًا، أو تكون الصفحة قد نُقلت. تحقّق من العنوان، أو عُد إلى مكان مألوف.",
  "errorPages.serverErrorEyebrow": "حدث عطل",
  "errorPages.serverErrorTitle": "اصطدمنا بجدار من جانبنا.",
  "errorPages.serverErrorDescription":
    "تعذّر إتمام الطلب. أُبلغ الفريق بالأمر، وإعادة المحاولة تنجح في العادة.",

  // sign in (split and centred)
  "login.eyebrow": "أهلًا بعودتك",
  "login.title": "تسجيل الدخول",
  "login.subtitle": "أدخل بياناتك للمتابعة.",
  "login.subtitleCentred": "استخدم بريد العمل للمتابعة.",
  "login.emailLabel": "البريد الإلكتروني",
  "login.emailPlaceholder": "you@example.com",
  "login.passwordLabel": "كلمة المرور",
  "login.passwordPlaceholder": "كلمة المرور",
  "login.remember": "تذكّرني",
  "login.forgot": "نسيت كلمة المرور؟",
  "login.submit": "تسجيل الدخول",
  "login.showPassword": "إظهار كلمة المرور",
  "login.hidePassword": "إخفاء كلمة المرور",
  "login.brandTitle": "سجّل الدخول إلى غرفة التحكّم.",
  "login.brandDescription": "نظام تصميم واحد لكل واجهة تُطلقها.",
  "login.pointsLabel": "عن هذا المنتج",
  "login.pointShipTitle": "أطلِق خلال دقائق",
  "login.pointShipDescription": "توكنز ومكوّنات وكتل متناغمة مع بعضها من البداية.",
  "login.pointAccessibleTitle": "سهولة وصول افتراضية",
  "login.pointAccessibleDescription": "كل عنصر تفاعلي يمكن بلوغه بلوحة المفاتيح وله تسمية صحيحة.",
  "login.pointRtlTitle": "دعم أصيل للعربية وللوضع الداكن",
  "login.pointRtlDescription": "العربية والإنجليزية، الفاتح والداكن، من مصدر واحد.",

  // forgot password
  "forgotPassword.eyebrow": "استعادة الحساب",
  "forgotPassword.title": "نسيت كلمة المرور؟",
  "forgotPassword.subtitle": "أدخل البريد المسجّل في حسابك وسنرسل إليك رابط إعادة التعيين.",
  "forgotPassword.emailLabel": "البريد الإلكتروني",
  "forgotPassword.emailPlaceholder": "you@example.com",
  "forgotPassword.submit": "إرسال رابط إعادة التعيين",
  "forgotPassword.sentTitle": "تفقّد بريدك",
  "forgotPassword.resend": "إعادة إرسال الرابط",
  "forgotPassword.back": "العودة إلى تسجيل الدخول",

  // one-time code
  "otp.eyebrow": "تحقّق بخطوتين",
  "otp.title": "أدخل الرمز",
  "otp.subtitle": "أرسلنا رمزًا لمرة واحدة إلى",
  "otp.fieldLabel": "رمز لمرة واحدة",
  "otp.submit": "تحقّق",
  "otp.resendPrompt": "لم يصلك الرمز؟",
  "otp.resend": "إرسال رمز جديد",
  "otp.back": "العودة إلى تسجيل الدخول",
  "otp.resendCountdown": "({seconds} ث)",

  // register
  "register.eyebrow": "ابدأ الآن",
  "register.title": "أنشئ حسابك",
  "register.subtitle": "لن يستغرق الأمر دقيقة.",
  "register.nameLabel": "الاسم الكامل",
  "register.namePlaceholder": "نور حسن",
  "register.emailLabel": "البريد الإلكتروني",
  "register.emailPlaceholder": "you@example.com",
  "register.passwordLabel": "كلمة المرور",
  "register.confirmLabel": "تأكيد كلمة المرور",
  "register.terms": "أوافق على شروط الخدمة وسياسة الخصوصية.",
  "register.submit": "إنشاء الحساب",
  "register.mismatch": "كلمتا المرور غير متطابقتين.",
  "register.showPassword": "إظهار كلمة المرور",
  "register.hidePassword": "إخفاء كلمة المرور",
  "register.strengthLabel": "قوة كلمة المرور",
  // Latin digit on purpose: bare `ar` resolves to the `latn` numbering system,
  // so a hardcoded ٨ here would clash with every figure Intl formats around it.
  "register.strengthHint": "استخدم 8 أحرف على الأقل، مع رقم ورمز.",
  "register.strengthValue": "قوة كلمة المرور: {strength}",
  "register.strength0": "قصيرة جدًا",
  "register.strength1": "ضعيفة",
  "register.strength2": "مقبولة",
  "register.strength3": "جيدة",
  "register.strength4": "قوية",

  // settings
  "settings.title": "الإعدادات",
  "settings.description": "أدِر حسابك وإشعاراتك وشكل الواجهة.",
  "settings.sectionsLabel": "أقسام الإعدادات",
  "settings.profile": "الملف الشخصي",
  "settings.profileDescription": "هكذا يراك زملاؤك في مساحة العمل.",
  "settings.uploadPhoto": "رفع صورة",
  "settings.nameLabel": "الاسم الكامل",
  "settings.emailLabel": "البريد الإلكتروني",
  "settings.save": "حفظ التغييرات",
  "settings.preferences": "التفضيلات",
  "settings.preferencesDescription": "اختر ما يحقّ لنا إرساله إليك.",
  "settings.prefUpdatesLabel": "تحديثات المنتج",
  "settings.prefUpdatesDescription": "رسالة بين الحين والآخر عن المكوّنات والإصدارات الجديدة.",
  "settings.prefSecurityLabel": "تنبيهات الأمان",
  "settings.prefSecurityDescription": "تُرسل دائمًا عند تسجيل الدخول من جهاز جديد.",
  "settings.prefDigestLabel": "الملخّص الأسبوعي",
  "settings.prefDigestDescription": "ملخّص كل ما أنجزه فريقك، يصلك كل يوم اثنين.",
  "settings.appearance": "المظهر",
  "settings.colourMode": "وضع الألوان",
  "settings.brand": "الهوية",
  "settings.density": "الكثافة",
  "settings.themeLight": "فاتح",
  "settings.themeDark": "داكن",
  "settings.themeSystem": "النظام",
  "settings.densityCompact": "مضغوط",
  "settings.densityComfortable": "افتراضي",
  "settings.densitySpacious": "فسيح",
  "settings.dangerTitle": "منطقة الخطر",
  "settings.dangerDescription":
    "حذف مساحة العمل يزيل كل مشروع وعضو ومفتاح API. لا يمكن التراجع عن ذلك.",
  "settings.dangerAction": "حذف مساحة العمل",
  "settings.dangerConfirmTitle": "حذف مساحة العمل هذه؟",
  "settings.dangerConfirmDescription":
    "يُزال كل مشروع وعضو ومفتاح API فورًا. لا يمكن التراجع عن هذا الإجراء.",
};
