/**
 * Arabic prop descriptions and notes, keyed `<item>.<prop>` and
 * `<item>.notes.<index>`. `*.<prop>` covers a prop that repeats across items,
 * which is what `className` does.
 *
 * Separate from `item-notes.mjs` on purpose: that file stays the single English
 * source of truth and the one `scripts/gen-md.mjs` reads, and a key missing
 * here simply falls back to it. So the docs are never broken by a translation
 * that has not been written yet.
 *
 * Prop names, types and default values are not here. `variant`, `asChild` and
 * `"default" | "secondary"` are what the reader types into their editor, and
 * translating them would only make the page harder to match against real code.
 */
export const AR = {
  "*.className": "يُدمج أخيرًا عبر cn()، فأي أداة تكتبها هنا تتغلّب على الافتراضيات.",

  "button.variant": "الوزن البصري. ألوان التمرير والضغط تأتي من توكنز ‎primary-*‎.",
  "button.size": "الارتفاع يأتي من ‎--control-h-*‎، فيستجيب لإعداد الكثافة.",
  "button.loading": "يستبدل المحتوى بمؤشّر دوّار ويُعلم التقنيات المساعدة بأن الزر مشغول.",
  "button.asChild": "يعرض الابن الوحيد بدل ‎<button>‎، رابطًا مثلًا.",
  "button.notes.0": "الزر الأيقوني يحتاج aria-label؛ الأيقونة وحدها ليست اسمًا مقروءًا.",

  "input.aria-invalid": "يحوّل الحدّ وحلقة التركيز إلى دور destructive.",
  "input.notes.0": "اقرن كل حقل بـ ‎<Label htmlFor>‎ حتى ينقل النقر على التسمية التركيز إلى الحقل.",

  "select.notes.0":
    "Select جذر من Radix: استخدم value و onValueChange، أو defaultValue للحالة غير المضبوطة.",

  "checkbox.notes.0": 'يدعم الحالة الوسطى عبر ‎checked="indeterminate"‎.',

  "form.notes.0": "Form هو FormProvider من react-hook-form، و FormField هو Controller الخاص به.",
  "form.notes.1": "FormControl يستنسخ ابنه الوحيد ويوصّل له id و aria-describedby و aria-invalid.",

  "dialog.showCloseButton": "على DialogContent. أخفه حين يوفّر المحتوى أداة إغلاق خاصة به.",
  "dialog.notes.0": "كل DialogContent يحتاج DialogTitle، ولو كان مخفيًا بصريًا.",

  "sheet.side":
    "الحافة المنطقية التي تنزلق منها اللوحة، فتنعكس صحيحًا في الاتجاه من اليمين لليسار.",

  "dropdown-menu.variant": "على DropdownMenuItem. يلوّن الإجراءات التي لا رجعة فيها.",
  "dropdown-menu.inset": "يضيف حشوًا في البداية المنطقية ليصطفّ النص مع الصفوف التي تحمل مؤشّرات.",

  "tooltip.notes.0": "غلّف الشاشة كلها بـ TooltipProvider واحد ليصبح تأخير الفتح مشتركًا.",

  "accordion.type": 'مطلوب. مع ‎"single"‎ أضف collapsible للسماح بإغلاق العنصر المفتوح.',

  "table.notes.0": "Table يُعرض داخل حاوية تمرير خاصة به، فالجداول العريضة لا تكسر الصفحة أبدًا.",

  "badge.variant": "تدرّجات الحالة منفصلة عن تدرّج الهوية، فلا تتصادم معه أبدًا.",

  "alert.variant": "يختار تدرّج الحالة للحدّ والخلفية ولون الأيقونة.",

  "command.notes.0": "مبني على cmdk. و CommandDialog يضيف هيكل اللوحة واسمًا مقروءًا لها.",

  "data-table.data": "الصفوف. البحث والفرز والتصفّح كلها تعمل على هذه المصفوفة.",
  "data-table.columns":
    "‎id‎ و ‎header‎ و ‎cell‎ مطلوبة؛ أضف sortable أو align أو accessor عند الحاجة.",
  "data-table.searchable": "يُظهر حقل البحث.",
  "data-table.selectable": "يضيف عمود مربّعات الاختيار.",
  "data-table.paginated": "اضبطه على false لعرض كل الصفوف.",
  "data-table.loading": "يستبدل جسم الجدول بصفوف هيكلية.",

  "stat-card.label": "ما الذي يقيسه الرقم.",
  "stat-card.value": "الرقم نفسه، منسّقًا مسبقًا.",
  "stat-card.delta": "التغيّر مقارنةً بالفترة السابقة.",
  "stat-card.trend": "يلوّن الفرق: success أو destructive أو muted.",
  "stat-card.loading": "يستبدل الرقم والفرق بهياكل تحميل.",

  "pricing-table.period": "أي سعر تعرضه الخطط. المكوّن الأب هو من يملك هذه الحالة.",
  "pricing-table.onPeriodChange": "يُستدعى من مفتاح دورة الفوترة.",
  "pricing-table.columns": "أقصى اتساع للصف قبل أن يلتفّ.",
  "pricing-table.featured": "على PricingTier. يرفع الخطة إلى سطح الهوية.",

  "copy-button.value":
    "ما يصل إلى الحافظة. صيغة الدالة تُنفَّذ لحظة النقر، للنصوص التي لا تُعرف إلا حينها.",
  "copy-button.copyLabel": "الاسم المقروء للصيغة الأيقونية، وعنوان التلميح عند التمرير.",
  "copy-button.copiedLabel": "يحلّ محلّ النص الظاهر ويُعلَن في منطقة حيّة مهذّبة.",
  "copy-button.timeout": "مدة بقاء حالة النجاح، بالمللي ثانية.",
  "copy-button.onCopy": "يعمل مع النص المنسوخ. استدعِ ‎notify.copied()‎ هنا لعرض إشعار.",
  "copy-button.onCopyError": "يعمل حين يرفض المتصفّح الكتابة، كما في أصل غير آمن.",
  "copy-button.notes.0":
    "الزر لا يحمل أي اعتمادية إشعارات بنفسه؛ وصّل onCopy بـ notify() إن أردت واحدًا.",
  "copy-button.notes.1": "useClipboard هو المنطق نفسه دون أي عناصر، لأداة نسخ من تصميمك.",

  "install-command.packageName":
    "الحزمة أو الحزم المراد إضافتها. تُعرض كـ npm install و pnpm add و yarn add و bun add.",
  "install-command.command":
    "ملف تنفيذي يُشغَّل مرة واحدة بدلًا من ذلك، مسبوقًا حسب كل مدير بـ npx أو pnpm dlx أو yarn dlx أو bunx.",
  "install-command.commands": "تجاوز كامل لكل مدير، حين لا تناسبك أي من الصيغتين أعلاه.",
  "install-command.dev": "يضيف راية اعتمادية التطوير التي يستخدمها كل مدير.",
  "install-command.managers": "التبويبات المعروضة، وترتيبها.",
  "install-command.storageKey":
    "أين يُحفظ اختيار القارئ. يُقرأ بعد التركيب، فيبقى العرض من الخادم ثابتًا.",
  "install-command.toast": "إشعار عند نجاح النسخ؛ ويمكن لنصّ أن يحلّ محلّ الرسالة.",
  "install-command.notes.0":
    'الأمر يُعرض بـ ‎dir="ltr"‎ ليبقى مقروءًا داخل صفحة من اليمين إلى اليسار.',
  "install-command.notes.1":
    "ركّب ‎<Toaster />‎ مرة واحدة في التخطيط الجذري، أو مرّر ‎toast={false}‎.",

  "code-block.code": "النص المعروض، وهو بعينه ما يكتبه زر النسخ.",
  "code-block.label": "تسمية الهامش: اسم ملف، أو لغة.",
  "code-block.lineNumbers": "يرقّم الأسطر. الأرقام aria-hidden ولا تصل إلى الحافظة أبدًا.",
  "code-block.maxHeight": "الارتفاع الذي تبدأ عنده الكتلة بالتمرير.",
  "code-block.hideHeader": "يحذف الشريط ويُطفي زر النسخ فوق الكود عند التمرير أو التركيز.",
  "code-block.toast": "إشعار عند نجاح النسخ؛ ويمكن لنصّ أن يحلّ محلّ الرسالة.",
  "code-block.notes.0": "بلا تلوين نحوي عن قصد: لا اعتمادية على مُحلّل، ولا شيء يختلف عند الإماهة.",

  "theme-select.variant":
    "‎select‎ يعرض اسم الوضع وسهمًا؛ والصيغتان الأخريان تنكمشان إلى زر مربّع مناسب للترويسة.",
  "theme-select.size": "الارتفاع يأتي من ‎--control-h-*‎، فيتبع إعداد الكثافة.",
  "theme-select.align": "الحافة المنطقية التي تصطفّ معها القائمة، فتنعكس في الاتجاه المعاكس.",
  "theme-select.labels": "يتجاوز Theme و Light و Dark و System، لتطبيق يعمل بلغة أخرى.",
  "theme-select.defaultTheme": "الوضع المستخدم في العرض من الخادم وحتى يختار القارئ.",
  "theme-select.storageKey": "أين يُحفظ الاختيار. يجب أن يطابق سكربت ما قبل الرسم لديك.",
  "theme-select.onThemeChange": "يُستدعى بعد تحديث جذر المستند.",
  "theme-select.notes.0":
    "الحالة تعيش على ‎<html>‎ لا في سياق React، فيعمل هذا مع مزوّد أو بدونه، ويتفق مع سكربت ما قبل الرسم الذي عمل قبل إقلاع React.",
  "theme-select.notes.1":
    "أضف سكربتًا مباشرًا في ‎<head>‎ يقرأ المفتاح نفسه ويضبط الصنف قبل أول رسم، وإلا ومضت الصفحة بالوضع الخاطئ في كل تحميل.",
  "theme-select.notes.2": "صفّ System يُظهر ما يؤول إليه النظام حاليًا، فلا يكون الاختيار تخمينًا.",

  "language-select.locales":
    "اللغات المعروضة، بترتيب القائمة. كل واحدة ‎{ code, nativeName, englishName?, dir? }‎.",
  "language-select.display": "هل يعرض الزر اسم اللغة بلغتها أم رمزها، مثل AR.",
  "language-select.variant": "الأشكال الثلاثة نفسها التي في ThemeSelect.",
  "language-select.label": "يسمّي عنصر التحكّم ويتصدّر القائمة. افتراضيًا يأتي من الكتالوج النشط.",
  "language-select.storageKey": "أين يُحفظ الاختيار. يجب أن يطابق سكربت ما قبل الرسم لديك.",
  "language-select.onLocaleChange":
    "يُستدعى بعد ضبط lang و dir. وصّل هنا إطار الترجمة أو الموجّه لديك؛ المكوّن لا يتنقّل بنفسه.",
  "language-select.notes.0":
    'اختيار العربية يضبط ‎dir="rtl"‎ إلى جانب lang، وهذا وحده هو مرور الاتجاه المعاكس على كل مكوّن في الصفحة — لأن المكتبة مكتوبة بخصائص منطقية.',
  "language-select.notes.1":
    "الاتجاه يُشتقّ من رمز اللغة حين لا تُصرّح به، فتنعكس العبرية والفارسية دون أي إعداد إضافي.",
  "language-select.notes.2": "بلا أعلام. العلم يدلّ على بلد لا على لغة، وللعربية عشرون منها.",

  "use-theme.returns":
    "‎theme‎ قد يكون system؛ و ‎resolvedTheme‎ دائمًا light أو dark. و ‎mounted‎ يكون false أثناء الإماهة.",
  "use-theme.defaultTheme": "يُستخدم في العرض من الخادم وحتى يختار القارئ.",
  "use-theme.storageKey": "مفتاح localStorage الذي يحمل الاختيار.",
  "use-theme.notes.0":
    "مبني على useSyncExternalStore فوق المستند، فتبقى عدة منتقيات في الصفحة الواحدة متوافقة، وكذلك تبويبتان.",
  "use-theme.notes.1":
    "‎system‎ يظلّ يتابع نظام التشغيل: تغيير المظهر في إعدادات النظام يعيد رسم الصفحة دون إعادة تحميل.",
  "use-theme.notes.2":
    "يصدّر أيضًا applyTheme و resolveTheme، لسكربت ما قبل الرسم أو لاستدعاء أمري خارج React.",

  "use-locale.returns": "‎option‎ هو المُدخل الكامل للرمز النشط؛ و ‎dir‎ مطبَّق بالفعل.",
  "use-locale.locales": "اللغات المعروضة. أي رمز خارج القائمة يُتجاهل.",
  "use-locale.storageKey": "مفتاح localStorage الذي يحمل الاختيار.",
  "use-locale.notes.0":
    "يكتب lang و dir على ‎<html>‎ ولا شيء غير ذلك: لا يتولّى التوجيه، ولا يحمّل كتالوجات الرسائل. وصّل هذين بـ onLocaleChange.",
  "use-locale.notes.1":
    "يصدّر أيضًا directionOf و applyLocale، ليتمكّن سكربت ما قبل الرسم من ضبط الاتجاه قبل أول رسم.",

  "hero.variant": "مكدّس ومحاذٍ للبداية، أو موسّط، أو نصّ بجانب وسائط.",
  "hero.decoration": "طبقة خلفية زخرفية. هي aria-hidden ولا تؤثّر في التخطيط أبدًا.",
};
