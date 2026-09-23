export const VERSION = "0.1.0";

/** Change this once the docs site has its final domain. */
export const DEFAULT_REGISTRY_URL = "https://design-eg.vercel.app/r";

export const CONFIG_FILE = "design-eg.json";

export interface DesignEgConfig {
  $schema?: string;
  tsx: boolean;
  registry: string;
  paths: {
    /** Folder that receives `registry:ui` files, e.g. "components/ui" */
    ui: string;
    /** Folder that receives `registry:lib` files, e.g. "lib" */
    lib: string;
    /** Folder that receives `registry:hook` files, e.g. "hooks" */
    hooks: string;
    /** Main stylesheet that imports Tailwind, e.g. "app/globals.css" */
    css: string;
  };
  aliases: {
    ui: string;
    lib: string;
    hooks: string;
    utils: string;
  };
}

export const DEFAULT_CONFIG: DesignEgConfig = {
  $schema: "https://design-eg.vercel.app/schema/config.json",
  tsx: true,
  registry: DEFAULT_REGISTRY_URL,
  paths: {
    ui: "components/ui",
    lib: "lib",
    hooks: "hooks",
    css: "app/globals.css",
  },
  aliases: {
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
    utils: "@/lib/utils",
  },
};

export type RegistryItemType =
  "registry:ui" | "registry:lib" | "registry:hook" | "registry:block" | "registry:style";

export interface RegistryFile {
  path: string;
  type: RegistryItemType;
  content: string;
  target?: string;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}
