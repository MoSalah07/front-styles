import type { MessageValue } from "@design-eg/ui";

/**
 * The shape every language file implements. Each JSON file is typed as
 * `Dictionary`, so a key added here and missed in one language is a build
 * failure rather than an English string in the middle of a translated page.
 *
 * A `MessageValue` is either a plain string or a set of CLDR plural forms;
 * `formatMessage` from `@design-eg/ui` resolves either, using the same rules
 * the component library uses for its own strings.
 *
 * What is deliberately *not* in here: prop names, type signatures, component
 * names and the code in the examples. A French developer writes
 * `<Button variant="ghost">` exactly as an Arabic one does, so translating the
 * API surface would only make the docs harder to match against real code. The
 * prose around it is another matter, and all of it is here.
 */
export interface Dictionary {
  site: {
    tagline: string;
    description: string;
    keywords: string[];
  };

  nav: {
    /** Landmark names. */
    primary: string;
    secondary: string;
    documentation: string;
    /** Header links. */
    docs: string;
    templates: string;
    tokens: string;
    /** Sidebar entries above the generated groups. */
    overview: string;
    templateGallery: string;
    /** Mobile sheet. */
    openMenu: string;
    menuDescription: string;
    /** Count of registry items in the docs header. */
    itemCount: MessageValue;
    /** Name of the language picker. */
    language: string;
  };

  /** Sidebar group headings, which `lib/registry.ts` keys by its English name. */
  groups: {
    Foundations: string;
    Forms: string;
    Overlays: string;
    Navigation: string;
    "Data display": string;
    Feedback: string;
    Components: string;
    Blocks: string;
    Templates: string;
  };

  home: {
    badge: string;
    /** Contains `{accent}`, which is rendered in the primary colour. */
    headline: string;
    accent: string;
    browseDocs: string;
    starOnGithub: string;
    open: string;
    catalogue: {
      components: { label: string; body: string };
      blocks: { label: string; body: string };
      templates: { label: string; body: string };
    };
    features: {
      tokens: { title: string; body: string };
      rtl: { title: string; body: string };
      source: { title: string; body: string };
      radix: { title: string; body: string };
    };
    sampleTitle: string;
    /** Contains `{count}`. */
    sampleBody: MessageValue;
    goToDocs: string;
    source: string;
  };

  docsHub: {
    title: string;
    /** Contains `{components}`, `{blocks}` and `{templates}`. */
    intro: string;
    /** Contains `{count}`. */
    badge: MessageValue;
    startWithButton: string;
    install: string;
    installCopy: string;
    installStyles: string;
    everything: string;
    forMachines: string;
    forMachinesIntro: string;
    machineLinks: {
      projectMap: string;
      fullApi: string;
      pageAsMarkdown: string;
      itemAsMarkdown: string;
      registryIndex: string;
      oneItem: string;
    };
  };

  item: {
    installation: string;
    orShadcn: string;
    example: string;
    anatomy: string;
    props: string;
    propName: string;
    propType: string;
    propDefault: string;
    propDescription: string;
    notes: string;
    dependencies: string;
    noDependencies: string;
    registryDependencies: string;
    standalone: string;
  };

  templatesPage: {
    title: string;
    intro: string;
    open: string;
  };

  showcase: {
    button: { title: string; description: string };
    fields: { title: string; description: string };
    card: { title: string; description: string };
    badge: { title: string; description: string };
    /** Demo copy. The variant names themselves stay in English: they are API values. */
    demo: {
      add: string;
      perMonth: string;
      featureProjects: string;
      featureSupport: string;
      featureCancel: string;
      paid: string;
      beta: string;
      continue: string;
      delete: string;
      saving: string;
      disabled: string;
      notifications: string;
      email: string;
      password: string;
      withError: string;
      invalidEmail: string;
      rememberMe: string;
      signIn: string;
      monthlyPlan: string;
      planBlurb: string;
      popular: string;
      choosePlan: string;
      loadingState: string;
      skeletonBlurb: string;
      pending: string;
      failed: string;
    };
  };

  /** Copy for the Open Graph share cards, which are rendered as images. */
  og: {
    openSource: string;
    stack: string;
    homeAlt: string;
    /** Contains {components}, {blocks} and {templates}. */
    catalogueMeta: string;
    docsAlt: string;
    docsTitle: string;
    docsDescription: string;
    templatesAlt: string;
    templatesTitle: string;
    templatesDescription: string;
    /** Contains {count}. */
    templatesMeta: MessageValue;
  };

  playground: {
    brand: string;
    density: string;
    compact: string;
    comfortable: string;
    spacious: string;
    tokens: string;
  };

  swatches: {
    title: string;
    intro: string;
    compiledBrands: string;
  };
}
