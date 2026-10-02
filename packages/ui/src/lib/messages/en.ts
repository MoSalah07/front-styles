/**
 * English catalogue. This file is the source of truth for the key set: every
 * other language is typed as `Messages`, so a key added here and forgotten
 * there is a typecheck error rather than an English string appearing in the
 * middle of a translated page.
 *
 * Keys are flat and dotted, namespaced by the component that owns them. Flat
 * beats nested here because `t("dialog.close")` can then be checked against a
 * union of literal keys, and because overriding the wording of one component
 * is then a single entry rather than a nested merge.
 */
import type { MessageValue } from "./types";

export const en = {
  // breadcrumb
  "breadcrumb.label": "Breadcrumb",
  "breadcrumb.more": "More",

  // pagination
  "pagination.label": "Pagination",
  "pagination.previous": "Previous",
  "pagination.next": "Next",
  "pagination.goToPrevious": "Go to previous page",
  "pagination.goToNext": "Go to next page",
  "pagination.morePages": "More pages",

  // dialog / sheet / toast
  "dialog.close": "Close",
  "sheet.close": "Close",
  "toast.dismiss": "Dismiss",
  "toast.copied": "Copied to clipboard",

  // command palette
  "command.title": "Command palette",
  "command.description": "Search for a command to run.",

  // copy button / code block / install command
  "copyButton.copy": "Copy",
  "copyButton.copied": "Copied",
  "codeBlock.copy": "Copy code",
  "installCommand.packageManager": "Package manager",

  // application sidebar
  "sidebar.label": "Main navigation",
  "sidebar.mobileDescription": "Navigate between the sections of the application.",
  "sidebar.toggle": "Toggle sidebar",

  // confirm dialog
  "confirmDialog.confirm": "Confirm",
  "confirmDialog.cancel": "Cancel",

  // data table
  "dataTable.searchLabel": "Search rows",
  "dataTable.searchPlaceholder": "Search…",
  "dataTable.emptyTitle": "No results",
  "dataTable.emptyDescription": "Nothing matches the current filters.",
  "dataTable.selectAll": "Select all rows",
  "dataTable.toggleColumns": "Toggle columns",
  "dataTable.columns": "Columns",
  "dataTable.previousPage": "Previous page",
  "dataTable.nextPage": "Next page",
  "dataTable.pageStatus": "Page {page} of {pages}",
  "dataTable.rowCount": {
    one: "{count} row.",
    other: "{count} rows.",
  },
  "dataTable.selectedCount": {
    one: "{count} of {total} row selected.",
    other: "{count} of {total} rows selected.",
  },

  // error state
  "errorState.title": "Something went wrong",
  "errorState.retry": "Try again",

  // filter bar
  "filterBar.label": "Search",
  "filterBar.placeholder": "Search…",

  // language select
  "languageSelect.label": "Language",

  // logo marquee
  "logoMarquee.label": "Logos",

  // pricing table
  "pricingTable.monthly": "Monthly",
  "pricingTable.annual": "Annual",
  "pricingTable.billAnnually": "Bill annually",

  // site footer
  "siteFooter.social": "Social",
  "siteFooter.legal": "Legal",

  // site navbar
  "siteNavbar.nav": "Primary",
  "siteNavbar.openMenu": "Open menu",
  "siteNavbar.menuTitle": "Menu",
  "siteNavbar.menuDescription": "Site navigation",
  "siteNavbar.home": "Home",

  // dashboard shell
  "dashboardShell.signOut": "Sign out",
  "dashboardShell.sidebarLabel": "Main navigation",

  // error pages
  "errorPages.home": "Back to home",
  "errorPages.back": "Go back",
  "errorPages.retry": "Try again",
  "errorPages.notFoundEyebrow": "Page not found",
  "errorPages.notFoundTitle": "This page took a wrong turn.",
  "errorPages.notFoundDescription":
    "The link may be broken, or the page may have been moved. Check the address, or head back to somewhere familiar.",
  "errorPages.serverErrorEyebrow": "Something broke",
  "errorPages.serverErrorTitle": "Our side hit a wall.",
  "errorPages.serverErrorDescription":
    "The request could not be completed. The team has been notified; trying again usually works.",

  // sign in (split and centred)
  "login.eyebrow": "Welcome back",
  "login.title": "Sign in",
  "login.subtitle": "Enter your credentials to continue.",
  "login.subtitleCentred": "Use your work email to continue.",
  "login.emailLabel": "Email",
  "login.emailPlaceholder": "you@example.com",
  "login.passwordLabel": "Password",
  "login.passwordPlaceholder": "Your password",
  "login.remember": "Remember me",
  "login.forgot": "Forgot password?",
  "login.submit": "Sign in",
  "login.showPassword": "Show password",
  "login.hidePassword": "Hide password",
  "login.brandTitle": "Sign in to the control room.",
  "login.brandDescription": "One design system for every surface you ship.",
  "login.pointsLabel": "About this product",
  "login.pointShipTitle": "Ship in minutes",
  "login.pointShipDescription": "Tokens, primitives and blocks that already agree with each other.",
  "login.pointAccessibleTitle": "Accessible by default",
  "login.pointAccessibleDescription": "Every control is keyboard reachable and correctly labelled.",
  "login.pointRtlTitle": "RTL and dark native",
  "login.pointRtlDescription": "Arabic and English, light and dark, from one source of truth.",

  // forgot password
  "forgotPassword.eyebrow": "Account recovery",
  "forgotPassword.title": "Forgot your password?",
  "forgotPassword.subtitle": "Enter the email on your account and we will send a reset link.",
  "forgotPassword.emailLabel": "Email",
  "forgotPassword.emailPlaceholder": "you@example.com",
  "forgotPassword.submit": "Send reset link",
  "forgotPassword.sentTitle": "Check your inbox",
  "forgotPassword.resend": "Resend the link",
  "forgotPassword.back": "Back to sign in",

  // one-time code
  "otp.eyebrow": "Two-step verification",
  "otp.title": "Enter your code",
  "otp.subtitle": "We sent a one-time code to",
  "otp.fieldLabel": "One-time code",
  "otp.submit": "Verify",
  "otp.resendPrompt": "Did not get it?",
  "otp.resend": "Send a new code",
  "otp.back": "Back to sign in",
  "otp.resendCountdown": "({seconds}s)",

  // register
  "register.eyebrow": "Get started",
  "register.title": "Create your account",
  "register.subtitle": "It takes less than a minute.",
  "register.nameLabel": "Full name",
  "register.namePlaceholder": "Nour Hassan",
  "register.emailLabel": "Email",
  "register.emailPlaceholder": "you@example.com",
  "register.passwordLabel": "Password",
  "register.confirmLabel": "Confirm password",
  "register.terms": "I agree to the terms of service and the privacy policy.",
  "register.submit": "Create account",
  "register.mismatch": "The two passwords do not match.",
  "register.showPassword": "Show password",
  "register.hidePassword": "Hide password",
  "register.strengthLabel": "Password strength",
  "register.strengthHint": "Use at least 8 characters, with a number and a symbol.",
  "register.strengthValue": "Password strength: {strength}",
  "register.strength0": "Too short",
  "register.strength1": "Weak",
  "register.strength2": "Fair",
  "register.strength3": "Good",
  "register.strength4": "Strong",

  // settings
  "settings.title": "Settings",
  "settings.description": "Manage your account, your notifications and how the interface looks.",
  "settings.sectionsLabel": "Settings sections",
  "settings.profile": "Profile",
  "settings.profileDescription": "This is how your teammates see you across the workspace.",
  "settings.uploadPhoto": "Upload a photo",
  "settings.nameLabel": "Full name",
  "settings.emailLabel": "Email",
  "settings.save": "Save changes",
  "settings.preferences": "Preferences",
  "settings.preferencesDescription": "Choose what we are allowed to send you.",
  "settings.prefUpdatesLabel": "Product updates",
  "settings.prefUpdatesDescription": "Occasional email about new components and releases.",
  "settings.prefSecurityLabel": "Security alerts",
  "settings.prefSecurityDescription": "Always sent for sign-ins from a new device.",
  "settings.prefDigestLabel": "Weekly digest",
  "settings.prefDigestDescription": "A Monday summary of everything your team shipped.",
  "settings.appearance": "Appearance",
  "settings.colourMode": "Colour mode",
  "settings.brand": "Brand",
  "settings.density": "Density",
  "settings.themeLight": "Light",
  "settings.themeDark": "Dark",
  "settings.themeSystem": "System",
  "settings.densityCompact": "Compact",
  "settings.densityComfortable": "Default",
  "settings.densitySpacious": "Spacious",
  "settings.dangerTitle": "Danger zone",
  "settings.dangerDescription":
    "Deleting the workspace removes every project, member and API key. This cannot be undone.",
  "settings.dangerAction": "Delete workspace",
  "settings.dangerConfirmTitle": "Delete this workspace?",
  "settings.dangerConfirmDescription":
    "Every project, member and API key is removed immediately. This action cannot be undone.",

  // calendar / date picker
  "calendar.previousMonth": "Previous month",
  "calendar.nextMonth": "Next month",
  "datePicker.placeholder": "Pick a date",
  "datePicker.rangePlaceholder": "Pick a date range",
  "datePicker.dialogLabel": "Choose a date",
  "datePicker.rangeDialogLabel": "Choose a date range",

  // sign in with a phone number
  "loginPhone.eyebrow": "Welcome back",
  "loginPhone.title": "Sign in with your phone",
  "loginPhone.subtitle": "We will text a one-time code to your mobile number.",
  "loginPhone.countryLabel": "Country code",
  "loginPhone.phoneLabel": "Mobile number",
  "loginPhone.phonePlaceholder": "Number without the country code",
  "loginPhone.phoneRequired": "Enter your mobile number.",
  "loginPhone.phoneInvalid": "Enter a valid mobile number, using digits only.",
  "loginPhone.requestCode": "Send code",
  "loginPhone.codeEyebrow": "Check your messages",
  "loginPhone.codeTitle": "Enter the code",
  "loginPhone.codeSubtitle": "We texted a one-time code to",
  "loginPhone.codeLabel": "One-time code",
  "loginPhone.verify": "Verify and sign in",
  "loginPhone.changeNumber": "Change number",
  "loginPhone.resendPrompt": "No text yet?",
  "loginPhone.resend": "Send a new code",
  "loginPhone.resendCountdown": {
    one: "You can ask for a new code in {count} second.",
    other: "You can ask for a new code in {count} seconds.",
  },
  "loginPhone.or": "or",

  // register wizard
  "registerWizard.eyebrow": "Get started",
  "registerWizard.title": "Create your account",
  "registerWizard.progressLabel": "Sign-up progress",
  "registerWizard.stepStatus": "Step {current} of {total}",
  "registerWizard.stepsDone": "All steps complete",
  "registerWizard.stepComplete": "(completed)",
  "registerWizard.accountStep": "Account",
  "registerWizard.profileStep": "Profile",
  "registerWizard.verifyStep": "Verify",
  "registerWizard.accountTitle": "Set up your sign-in",
  "registerWizard.accountDescription": "You will use this email and password to sign in.",
  "registerWizard.profileTitle": "Tell us about you",
  "registerWizard.profileDescription": "We use this to set up your workspace.",
  "registerWizard.verifyTitle": "Verify your email",
  "registerWizard.verifyDescription": "Enter the code we sent to",
  "registerWizard.emailLabel": "Work email",
  "registerWizard.emailPlaceholder": "you@example.com",
  "registerWizard.emailRequired": "Enter your email address.",
  "registerWizard.emailInvalid": "Enter an email address like name@example.com.",
  "registerWizard.passwordLabel": "Password",
  "registerWizard.passwordTooShort": "Use at least 8 characters.",
  "registerWizard.nameLabel": "Full name",
  "registerWizard.namePlaceholder": "Nour Hassan",
  "registerWizard.nameRequired": "Enter your full name.",
  "registerWizard.companyLabel": "Company",
  "registerWizard.optional": "(optional)",
  "registerWizard.roleLabel": "Role",
  "registerWizard.rolePlaceholder": "Choose your role",
  "registerWizard.roleRequired": "Choose the role closest to yours.",
  "registerWizard.roleEngineering": "Engineering",
  "registerWizard.roleDesign": "Design",
  "registerWizard.roleProduct": "Product",
  "registerWizard.roleMarketing": "Marketing",
  "registerWizard.roleLeadership": "Founder or leadership",
  "registerWizard.roleOther": "Something else",
  "registerWizard.teamSizeLabel": "Team size",
  "registerWizard.teamSizeRequired": "Choose the size of your team.",
  "registerWizard.teamSolo": "Just me",
  "registerWizard.teamSmall": "2 to 10 people",
  "registerWizard.teamMedium": "11 to 50 people",
  "registerWizard.teamLarge": "51 to 200 people",
  "registerWizard.teamEnterprise": "More than 200 people",
  "registerWizard.codeLabel": "Verification code",
  "registerWizard.codeRequired": "Enter the full code from the email.",
  "registerWizard.resendPrompt": "No email yet?",
  "registerWizard.resend": "Send a new code",
  "registerWizard.resendCountdown": {
    one: "You can ask for a new code in {count} second.",
    other: "You can ask for a new code in {count} seconds.",
  },
  "registerWizard.back": "Back",
  "registerWizard.next": "Continue",
  "registerWizard.finish": "Verify and finish",
  "registerWizard.doneTitle": "You are all set",
  "registerWizard.doneDescription": "Your account is ready. Welcome aboard, {name}.",

  // combobox
  "combobox.placeholder": "Select an option",
  "combobox.searchPlaceholder": "Search…",
  "combobox.searchLabel": "Search options",
  "combobox.listLabel": "Options",
  "combobox.empty": "No results found.",
  "combobox.selectedCount": {
    one: "{count} selected",
    other: "{count} selected",
  },
  "combobox.remove": "Remove {label}",

  // navigation menu
  "navigationMenu.label": "Main",

  // carousel
  "carousel.label": "Carousel",
  "carousel.roleDescription": "carousel",
  "carousel.slideRoleDescription": "slide",
  "carousel.slideLabel": "{index} of {count}",
  "carousel.previous": "Previous slide",
  "carousel.next": "Next slide",
  "carousel.dots": "Choose a slide",
  "carousel.goTo": "Go to slide {index}",

  // landingStreaming
  "landingStreaming.wordmark": "Cinema",
  "landingStreaming.signIn": "Sign in",
  "landingStreaming.heroTitle": "Stories worth staying up for",
  "landingStreaming.heroSubtitle":
    "Films, series and documentaries in one place. Watch anywhere, and cancel online whenever you like.",
  "landingStreaming.emailPrompt": "Start with your email. Joining takes less than a minute.",
  "landingStreaming.emailLabel": "Email address",
  "landingStreaming.getStarted": "Get started",
  "landingStreaming.emailRequired": "Enter your email address to continue.",
  "landingStreaming.emailInvalid": "Enter a valid email address, such as name@example.com.",
  "landingStreaming.rowTrending": "Trending now",
  "landingStreaming.rowTop": "Top 10 this week",
  "landingStreaming.rankedTitle": "Number {rank}: {title}",
  "landingStreaming.previousTitles": "Previous titles",
  "landingStreaming.nextTitles": "Next titles",
  "landingStreaming.featureTvTitle": "Enjoy it on your TV",
  "landingStreaming.featureTvDescription":
    "Watch on smart TVs, games consoles, streaming sticks and set-top boxes, in up to 4K where your screen supports it.",
  "landingStreaming.featureDownloadTitle": "Download to watch offline",
  "landingStreaming.featureDownloadDescription":
    "Save your favourites to your phone or tablet and keep watching on a flight, a train or anywhere the signal drops.",
  "landingStreaming.featureEverywhereTitle": "Watch everywhere",
  "landingStreaming.featureEverywhereDescription":
    "Start on your laptop, carry on from your phone and finish on the big screen, right where you left off.",
  "landingStreaming.featureKidsTitle": "Profiles made for kids",
  "landingStreaming.featureKidsDescription":
    "Give children their own space, with the age ratings you choose and the characters they love, at no extra cost.",
  "landingStreaming.faqTitle": "Frequently asked questions",
  "landingStreaming.faq1Question": "What can I watch?",
  "landingStreaming.faq1Answer":
    "A growing library of films, series, documentaries and animation, with new titles added every week.",
  "landingStreaming.faq2Question": "How much does it cost?",
  "landingStreaming.faq2Answer":
    "Every plan starts with a free first month. After that you pay one fixed monthly price, with no contract.",
  "landingStreaming.faq3Question": "Where can I watch?",
  "landingStreaming.faq3Answer":
    "On the web, on phones and tablets, and on most smart TVs and streaming devices. Sign in with the same account everywhere.",
  "landingStreaming.faq4Question": "How do I cancel?",
  "landingStreaming.faq4Answer":
    "Online, in two steps, from your account page. There is no cancellation fee, and you keep access until the end of the billing period.",
  "landingStreaming.faq5Question": "Is it suitable for children?",
  "landingStreaming.faq5Answer":
    "Kids profiles only show titles within the age rating you set, and a PIN can lock every other profile.",
  "landingStreaming.ctaTitle": "Ready when you are",
  "landingStreaming.footerBlurb": "Questions? Our help centre is open around the clock.",
  "landingStreaming.footerHelp": "Help",
  "landingStreaming.footerCompany": "Company",
  "landingStreaming.linkHelpCentre": "Help centre",
  "landingStreaming.linkAccount": "Account",
  "landingStreaming.linkDevices": "Supported devices",
  "landingStreaming.linkAbout": "About us",
  "landingStreaming.linkCareers": "Careers",
  "landingStreaming.linkPress": "Press",
  "landingStreaming.linkPrivacy": "Privacy",
  "landingStreaming.linkTerms": "Terms of use",
  "landingStreaming.linkCookies": "Cookie preferences",
  "landingStreaming.title1": "The Glass Harbour",
  "landingStreaming.title2": "Salt and Signal",
  "landingStreaming.title3": "Midnight Cartographers",
  "landingStreaming.title4": "The Lantern Keepers",
  "landingStreaming.title5": "The Quiet Orchard",
  "landingStreaming.title6": "Ember Street",
  "landingStreaming.title7": "Nine Rivers North",
  "landingStreaming.title8": "Low Tide Radio",
  "landingStreaming.title9": "The Long Winter Light",
  "landingStreaming.title10": "Static Bloom",

  // admin dashboard
  "adminDashboard.brandName": "Store admin",
  "adminDashboard.navStore": "Store",
  "adminDashboard.navOverview": "Overview",
  "adminDashboard.navOrders": "Orders",
  "adminDashboard.navProducts": "Products",
  "adminDashboard.navCustomers": "Customers",
  "adminDashboard.navWorkspace": "Workspace",
  "adminDashboard.navReports": "Reports",
  "adminDashboard.navSettings": "Settings",
  "adminDashboard.menuProfile": "Profile",
  "adminDashboard.title": "Overview",
  "adminDashboard.description": "How the store is doing across revenue, orders and customers.",
  "adminDashboard.rangeLabel": "Date range",
  "adminDashboard.rangeOption": {
    one: "{count} day",
    other: "{count} days",
  },
  "adminDashboard.export": "Export",
  "adminDashboard.metricsLabel": "Key metrics",
  "adminDashboard.kpiRevenue": "Revenue",
  "adminDashboard.kpiOrders": "Orders",
  "adminDashboard.kpiCustomers": "Customers",
  "adminDashboard.kpiConversion": "Conversion rate",
  "adminDashboard.comparison": {
    one: "vs the previous day",
    other: "vs the previous {count} days",
  },
  "adminDashboard.revenueTitle": "Revenue over time",
  "adminDashboard.revenueDescription": "Daily revenue for this period against the one before.",
  "adminDashboard.revenueCurrent": "This period",
  "adminDashboard.revenuePrevious": "Previous period",
  "adminDashboard.channelsTitle": "Sales by channel",
  "adminDashboard.channelsDescription": "Where this period’s revenue came from.",
  "adminDashboard.channelSales": "Sales",
  "adminDashboard.channelOnline": "Online store",
  "adminDashboard.channelMarketplace": "Marketplace",
  "adminDashboard.channelRetail": "Retail",
  "adminDashboard.channelSocial": "Social",
  "adminDashboard.ordersTitle": "Recent orders",
  "adminDashboard.ordersDescription": {
    one: "The latest order.",
    other: "The latest {count} orders.",
  },
  "adminDashboard.columnOrder": "Order",
  "adminDashboard.columnCustomer": "Customer",
  "adminDashboard.columnStatus": "Status",
  "adminDashboard.columnAmount": "Amount",
  "adminDashboard.columnDate": "Date",
  "adminDashboard.columnActions": "Actions",
  "adminDashboard.statusPaid": "Paid",
  "adminDashboard.statusPending": "Pending",
  "adminDashboard.statusRefunded": "Refunded",
  "adminDashboard.statusFailed": "Failed",
  "adminDashboard.orderActions": "Actions for order {id}",
  "adminDashboard.actionView": "View order",
  "adminDashboard.actionInvoice": "Download invoice",
  "adminDashboard.actionRefund": "Refund",
  "adminDashboard.productsTitle": "Top products",
  "adminDashboard.productsDescription": "Best sellers by revenue this period.",
  "adminDashboard.productsEmpty": "No sales in this period yet.",
  "adminDashboard.unitsSold": {
    one: "{count} unit sold",
    other: "{count} units sold",
  },
  "adminDashboard.productDesk": "Standing desk",
  "adminDashboard.productChair": "Ergonomic chair",
  "adminDashboard.productHeadphones": "Wireless headphones",
  "adminDashboard.productLamp": "Desk lamp",
  "adminDashboard.activityTitle": "Recent activity",
  "adminDashboard.activityDescription": "What happened in the store lately.",
  "adminDashboard.activityEmpty": "Nothing has happened yet.",
  "adminDashboard.activityOrder": "{name} placed order {id}.",
  "adminDashboard.activityPayout": "A payout of {amount} was sent to the bank.",
  "adminDashboard.activityStock": "{product} is running low on stock.",
  "adminDashboard.activityRefund": "Order {id} was refunded.",
  "adminDashboard.activitySignup": "{name} created an account.",

  // productCard
  "productCard.addToCart": "Add to cart",
  "productCard.addToCartNamed": "Add to cart: {title}",
  "productCard.wishlist": "Save {title} to wishlist",
  "productCard.rating": {
    one: "{rating} out of {max}, {count} review",
    other: "{rating} out of {max}, {count} reviews",
  },
  "productCard.ratingOnly": "{rating} out of {max}",
  "productCard.currentPrice": "Current price",
  "productCard.originalPrice": "Original price",

  // landingSaas
  "landingSaas.skipToContent": "Skip to content",
  "landingSaas.navFeatures": "Features",
  "landingSaas.navDevelopers": "Developers",
  "landingSaas.navPricing": "Pricing",
  "landingSaas.navFaq": "FAQ",
  "landingSaas.signIn": "Sign in",
  "landingSaas.getStarted": "Get started",
  "landingSaas.heroEyebrow": "New: usage-based billing",
  "landingSaas.heroTitle": "Ship billing in an afternoon, not a quarter.",
  "landingSaas.heroDescription":
    "{brand} gives you one API for subscriptions, usage metering and invoices, with webhooks, dashboards and SDKs that stay out of your way.",
  "landingSaas.heroPrimary": "Start building",
  "landingSaas.heroSecondary": "Read the docs",
  "landingSaas.logosTitle": "Trusted by product teams at",
  "landingSaas.featuresEyebrow": "Platform",
  "landingSaas.featuresTitle": "Everything you need to charge for software",
  "landingSaas.featuresDescription":
    "Composable building blocks that work on their own and even better together.",
  "landingSaas.featureSpeedTitle": "Fast by default",
  "landingSaas.featureSpeedDescription":
    "Edge-cached reads and a median response under 40 ms, in every region.",
  "landingSaas.featureWebhooksTitle": "Reliable webhooks",
  "landingSaas.featureWebhooksDescription":
    "Signed events with automatic retries, replays and a delivery log you can search.",
  "landingSaas.featureGlobalTitle": "Global from day one",
  "landingSaas.featureGlobalDescription":
    "Local currencies, tax rules and languages, with right-to-left layouts built in.",
  "landingSaas.featureSecurityTitle": "Secure by design",
  "landingSaas.featureSecurityDescription":
    "Encryption at rest, scoped API keys and an audit trail for every change.",
  "landingSaas.featureAnalyticsTitle": "Revenue analytics",
  "landingSaas.featureAnalyticsDescription":
    "Recurring revenue, churn and usage in dashboards your finance team will trust.",
  "landingSaas.featureComposableTitle": "Composable APIs",
  "landingSaas.featureComposableDescription":
    "Adopt one product or all of them. Every endpoint works on its own.",
  "landingSaas.codeEyebrow": "Built for developers",
  "landingSaas.codeTitle": "A few lines of code. A whole billing stack.",
  "landingSaas.codeDescription":
    "Typed SDKs, predictable resources and a test mode that mirrors production.",
  "landingSaas.codePointIdempotent": "Idempotent requests by default",
  "landingSaas.codePointSdks": "SDKs for TypeScript, Python and Go",
  "landingSaas.codePointTestMode": "Test mode with realistic fixtures",
  "landingSaas.previewTitle": "Live preview",
  "landingSaas.previewStatus": "Paid",
  "landingSaas.previewCustomer": "Customer",
  "landingSaas.previewPlan": "Plan",
  "landingSaas.previewAmount": "Amount",
  "landingSaas.previewLatency": "Completed in {ms} ms",
  "landingSaas.stepsEyebrow": "How it works",
  "landingSaas.stepsTitle": "Live in three steps",
  "landingSaas.stepsDescription":
    "From the first request to the first invoice, without a migration project.",
  "landingSaas.stepSignUpTitle": "Create an account",
  "landingSaas.stepSignUpDescription":
    "Sign up, copy your test keys and explore the dashboard. No card required.",
  "landingSaas.stepConnectTitle": "Connect your product",
  "landingSaas.stepConnectDescription":
    "Install an SDK, describe your plans and send usage events from your backend.",
  "landingSaas.stepLaunchTitle": "Go live",
  "landingSaas.stepLaunchDescription":
    "Switch to live keys when you are ready. Invoices, receipts and retries run on their own.",
  "landingSaas.statsEyebrow": "By the numbers",
  "landingSaas.statsTitle": "Built to carry real traffic",
  "landingSaas.statUptime": "Uptime over the past year",
  "landingSaas.statUptimeDescription":
    "Multi-region failover keeps invoices flowing through an outage.",
  "landingSaas.statRequests": "API requests every month",
  "landingSaas.statLatency": "Median response time",
  "landingSaas.statTeams": "Teams in production",
  "landingSaas.pricingTitle": "Simple pricing that grows with you",
  "landingSaas.pricingDescription":
    "Start free, upgrade when you need more, and never pay for seats you do not use.",
  "landingSaas.pricingPeriod": "/month",
  "landingSaas.pricingAnnualNote": "Save 20%",
  "landingSaas.pricingPopular": "Most popular",
  "landingSaas.tierStarter": "Starter",
  "landingSaas.tierStarterDescription": "For side projects and early experiments.",
  "landingSaas.tierGrowth": "Growth",
  "landingSaas.tierGrowthDescription": "For products with paying customers and a roadmap.",
  "landingSaas.tierScale": "Scale",
  "landingSaas.tierScaleDescription": "For organisations with compliance and uptime targets.",
  "landingSaas.featureProjects": {
    one: "{count} project",
    other: "{count} projects",
  },
  "landingSaas.featureRequests": {
    one: "{count} API request a month",
    other: "{count} API requests a month",
  },
  "landingSaas.featureCommunitySupport": "Community support",
  "landingSaas.featurePrioritySupport": "Priority email support",
  "landingSaas.featureUsageAlerts": "Usage analytics and alerts",
  "landingSaas.featureUnlimitedProjects": "Unlimited projects",
  "landingSaas.featureSso": "SAML single sign-on",
  "landingSaas.featureSla": "99.99% uptime SLA",
  "landingSaas.featureAuditLog": "Audit log and data residency",
  "landingSaas.ctaStartFree": "Start free",
  "landingSaas.ctaStartTrial": "Start a free trial",
  "landingSaas.ctaContactSales": "Talk to sales",
  "landingSaas.testimonialsEyebrow": "Customers",
  "landingSaas.testimonialsTitle": "Loved by engineering and finance alike",
  "landingSaas.quotePlatform":
    "We replaced three internal services with one integration and shipped usage pricing in two weeks.",
  "landingSaas.rolePlatform": "Head of platform engineering",
  "landingSaas.quoteOnCall":
    "The webhook log alone gives our on-call rotation hours back every week.",
  "landingSaas.roleOnCall": "Staff engineer",
  "landingSaas.quoteFinance":
    "Finance finally trusts the numbers, because they come from the same source as the product.",
  "landingSaas.roleFinance": "Vice president of finance",
  "landingSaas.faqTitle": "Questions, answered",
  "landingSaas.faqDescription":
    "Everything teams ask before they switch. Still curious? Our engineers read every message.",
  "landingSaas.faqFreeQuestion": "Is there a free plan?",
  "landingSaas.faqFreeAnswer":
    "Yes. Starter is free for up to three projects, and you only move to a paid plan when you need more.",
  "landingSaas.faqMigrateQuestion": "Can I migrate from my current billing system?",
  "landingSaas.faqMigrateAnswer":
    "Import tools bring over customers, plans and payment history, and test mode lets you rehearse the switch first.",
  "landingSaas.faqSdkQuestion": "Which languages do the SDKs support?",
  "landingSaas.faqSdkAnswer":
    "Official SDKs cover TypeScript, Python and Go. Anything else can call the REST API directly.",
  "landingSaas.faqSecurityQuestion": "How is my data protected?",
  "landingSaas.faqSecurityAnswer":
    "Data is encrypted in transit and at rest, access is scoped per key, and every change is written to an audit log.",
  "landingSaas.ctaTitle": "Start building today",
  "landingSaas.ctaDescription":
    "Create a free account in minutes, or talk to us about a plan for your team.",
  "landingSaas.footerBlurb":
    "{brand} is the billing platform for teams who would rather ship product than maintain invoices.",
  "landingSaas.footerProduct": "Product",
  "landingSaas.footerCompany": "Company",
  "landingSaas.footerChangelog": "Changelog",
  "landingSaas.footerStatus": "System status",
  "landingSaas.footerDocs": "Docs",
  "landingSaas.footerApiReference": "API reference",
  "landingSaas.footerAbout": "About",
  "landingSaas.footerCareers": "Careers",
  "landingSaas.footerContact": "Contact us",
  "landingSaas.footerPrivacy": "Privacy",
  "landingSaas.footerTerms": "Terms",

  // landingStore
  "landingStore.skipToContent": "Skip to content",
  "landingStore.searchLabel": "Search products",
  "landingStore.searchPlaceholder": "Search mugs, lamps, linen…",
  "landingStore.account": "Account",
  "landingStore.cart": {
    one: "Cart, {count} item",
    other: "Cart, {count} items",
  },
  "landingStore.addedToCart": "{title} added to your cart",
  "landingStore.heroEyebrow": "The autumn edit",
  "landingStore.heroTitle": "Slow mornings, well made.",
  "landingStore.heroDescription":
    "Stoneware, linen and lamps from small workshops, chosen to be used every day and kept for years.",
  "landingStore.heroPrimary": "Shop the edit",
  "landingStore.heroSecondary": "See this week’s deals",
  "landingStore.categoriesTitle": "Shop by category",
  "landingStore.categoryKitchen": "Kitchen",
  "landingStore.categoryHome": "Home",
  "landingStore.categoryLighting": "Lighting",
  "landingStore.categoryTextiles": "Textiles",
  "landingStore.categoryOutdoors": "Outdoors",
  "landingStore.categoryStationery": "Stationery",
  "landingStore.featuredTitle": "Featured products",
  "landingStore.featuredDescription": "Bestsellers and new arrivals our team keeps reaching for.",
  "landingStore.viewAll": "View all",
  "landingStore.productMug": "Stoneware mug",
  "landingStore.productThrow": "Linen throw",
  "landingStore.productLamp": "Walnut desk lamp",
  "landingStore.productCarafe": "Glass carafe",
  "landingStore.productNotebook": "Cloth-bound notebook",
  "landingStore.productPlanter": "Terracotta planter",
  "landingStore.productBlanket": "Wool picnic blanket",
  "landingStore.badgeNew": "New",
  "landingStore.badgeSale": "-{percent}%",
  "landingStore.dealsEyebrow": "Limited time",
  "landingStore.dealsTitle": "Deals of the week",
  "landingStore.dealsDescription":
    "Hand-picked markdowns on pieces we love. Ends Sunday at midnight.",
  "landingStore.dealsCta": "Shop all deals",
  "landingStore.valuePropsLabel": "Why shop with us",
  "landingStore.freeShippingTitle": "Free shipping",
  "landingStore.freeShippingDescription": "On every order over {amount}.",
  "landingStore.returnsTitle": "Free returns",
  "landingStore.returnsDescription": "Changed your mind? Send it back within 30 days.",
  "landingStore.securePaymentTitle": "Secure checkout",
  "landingStore.securePaymentDescription":
    "Encrypted payments and buyer protection on every order.",
  "landingStore.newsletterTitle": "Letters from the workshop",
  "landingStore.newsletterDescription":
    "New arrivals, restocks and the occasional recipe. One email a month, never more.",
  "landingStore.newsletterEmailLabel": "Email address",
  "landingStore.newsletterPlaceholder": "Your email address",
  "landingStore.newsletterSubmit": "Subscribe",
  "landingStore.newsletterSuccess": "You are on the list. Check your inbox to confirm.",
  "landingStore.newsletterInvalid": "Enter a valid email address.",
  "landingStore.footerBlurb":
    "Everyday objects from small workshops, packed with care and shipped from our studio.",
  "landingStore.footerShop": "Shop",
  "landingStore.footerHelp": "Help",
  "landingStore.footerCompany": "Company",
  "landingStore.footerShipping": "Shipping",
  "landingStore.footerReturns": "Returns",
  "landingStore.footerContact": "Contact us",
  "landingStore.footerAbout": "Our story",
  "landingStore.footerJournal": "Journal",
  "landingStore.footerPrivacy": "Privacy",
  "landingStore.footerTerms": "Terms",
} as const;

/** Every message the library can render. */
export type MessageKey = keyof typeof en;

/**
 * The contract each language implements. Values are widened to `MessageValue`
 * so a translation may use plural forms where English needs none, or one fixed
 * string where English needs plural forms.
 */
export type Messages = Readonly<Record<MessageKey, MessageValue>>;
