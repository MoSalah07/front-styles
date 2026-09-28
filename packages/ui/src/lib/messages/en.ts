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
} as const;

/** Every message the library can render. */
export type MessageKey = keyof typeof en;

/**
 * The contract each language implements. Values are widened to `MessageValue`
 * so a translation may use plural forms where English needs none, or one fixed
 * string where English needs plural forms.
 */
export type Messages = Readonly<Record<MessageKey, MessageValue>>;
