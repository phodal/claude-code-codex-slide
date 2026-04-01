import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const globalsCssPath = path.join(repoRoot, "src", "app", "globals.css");

const desktopLightMap = {
  "--dt-brand-blue": "var(--brand-blue-500)",
  "--dt-brand-blue-soft": "var(--brand-blue-400)",
  "--dt-brand-orange": "var(--brand-amber-500)",
  "--dt-brand-orange-soft": "var(--brand-amber-300)",
  "--dt-brand-green": "var(--brand-emerald-500)",
  "--dt-brand-green-soft": "var(--brand-emerald-400)",
  "--dt-brand-red": "var(--brand-red-500)",
  "--dt-brand-purple": "var(--brand-orchid-500)",
  "--dt-brand-gray": "var(--brand-slate-500)",
  "--dt-brand-route": "var(--brand-slate-400)",
  "--dt-bg-primary": "var(--brand-slate-50)",
  "--dt-bg-secondary": "var(--brand-slate-100)",
  "--dt-bg-tertiary": "var(--brand-slate-200)",
  "--dt-bg-active": "var(--brand-blue-100)",
  "--dt-border": "var(--brand-slate-300)",
  "--dt-border-light": "var(--brand-slate-200)",
  "--dt-text-primary": "var(--brand-slate-900)",
  "--dt-text-secondary": "var(--brand-slate-700)",
  "--dt-text-muted": "var(--brand-slate-500)",
  "--dt-accent": "var(--dt-brand-blue)",
  "--dt-accent-strong": "var(--dt-brand-blue-soft)",
  "--dt-accent-text": "var(--surface)",
  "--dt-trace-chat": "var(--dt-brand-blue)",
  "--dt-trace-event-bridge": "var(--dt-brand-orange)",
  "--dt-trace-ag-ui": "var(--dt-brand-green)",
  "--dt-button-primary": "var(--dt-brand-blue)",
  "--dt-button-secondary": "var(--brand-slate-200)",
  "--dt-button-secondary-hover": "var(--brand-blue-100)",
  "--dt-input-bg": "var(--surface)",
  "--dt-panel-bg": "var(--brand-slate-100)",
  "--dt-panel-header-bg": "var(--brand-slate-200)",
  "--dt-list-item-hover": "var(--brand-blue-100)",
  "--dt-badge-bg": "var(--dt-brand-route)",
  "--dt-badge-warning-bg": "var(--dt-brand-orange)",
  "--dt-badge-success-bg": "var(--dt-brand-green)",
};

const desktopDarkOverrides = {
  "--dt-bg-primary": "var(--brand-slate-900)",
  "--dt-bg-secondary": "var(--brand-slate-800)",
  "--dt-bg-tertiary": "var(--brand-slate-700)",
  "--dt-bg-active": "var(--brand-blue-900)",
  "--dt-border": "var(--brand-slate-700)",
  "--dt-border-light": "var(--brand-slate-600)",
  "--dt-text-primary": "var(--brand-slate-200)",
  "--dt-text-secondary": "var(--brand-slate-400)",
  "--dt-text-muted": "var(--brand-slate-500)",
  "--dt-accent": "var(--dt-brand-blue-soft)",
  "--dt-accent-strong": "var(--dt-brand-blue)",
  "--dt-accent-text": "var(--surface)",
  "--dt-trace-chat": "var(--dt-brand-blue-soft)",
  "--dt-trace-event-bridge": "var(--dt-brand-orange)",
  "--dt-trace-ag-ui": "var(--dt-brand-green)",
  "--dt-button-primary": "var(--dt-brand-blue)",
  "--dt-button-secondary": "var(--brand-slate-800)",
  "--dt-button-secondary-hover": "var(--brand-blue-900)",
  "--dt-input-bg": "var(--brand-slate-900)",
  "--dt-panel-bg": "var(--brand-slate-900)",
  "--dt-panel-header-bg": "var(--brand-slate-800)",
  "--dt-list-item-hover": "var(--brand-blue-900)",
  "--dt-badge-bg": "var(--brand-slate-700)",
  "--dt-badge-warning-bg": "var(--dt-brand-orange)",
  "--dt-badge-success-bg": "var(--dt-brand-green)",
};

const paletteFamilies = [
  {
    id: "blue",
    label: "Coordinator Blue",
    semantic: "Primary actions, focus, coordinator identity",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    id: "amber",
    label: "Crafter Amber",
    semantic: "Execution, momentum, in-progress work",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    id: "emerald",
    label: "Gate Emerald",
    semantic: "Verification, healthy, passed states",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    id: "red",
    label: "Danger Red",
    semantic: "Errors, destructive actions, blocked flows",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    id: "orchid",
    label: "Signal Purple",
    semantic: "Ideas, AI signals, elevated highlights",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
  {
    id: "slate",
    label: "Slate Neutral",
    semantic: "Shell, surfaces, hierarchy, grayscale support",
    steps: ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"],
  },
];

const semanticAliases = [
  { name: "primary-action", cssVar: "--brand-blue", role: "Buttons, selected tabs, coordinator" },
  { name: "execution", cssVar: "--brand-orange", role: "Crafter, install, task execution" },
  { name: "verified", cssVar: "--brand-green", role: "Gate, pass, healthy states" },
  { name: "danger", cssVar: "--brand-red", role: "Delete, error, blocked" },
  { name: "signal", cssVar: "--brand-purple", role: "Highlights, AI signals, special callouts" },
  { name: "route-neutral", cssVar: "--brand-route", role: "Muted support, route and grayscale mapping" },
  { name: "surface-border", cssVar: "--border", role: "Default separators and card edge" },
  { name: "app-background", cssVar: "--background", role: "Global page canvas" },
];

function parseCssVars(source, selector) {
  const regex = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Unable to locate CSS block for selector: ${selector}`);
  }

  return Object.fromEntries(
    [...match[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((entry) => [entry[1], entry[2].trim()]),
  );
}

function resolveCssVar(value, vars, stack = []) {
  const varMatch = value.match(/^var\((--[\w-]+)\)$/);
  if (!varMatch) {
    return value;
  }

  const nextKey = varMatch[1];
  if (stack.includes(nextKey)) {
    throw new Error(`Circular CSS variable reference: ${[...stack, nextKey].join(" -> ")}`);
  }

  const nextValue = vars[nextKey];
  if (!nextValue) {
    throw new Error(`Missing CSS variable: ${nextKey}`);
  }

  return resolveCssVar(nextValue, vars, [...stack, nextKey]);
}

function normalizeHex(value) {
  return value.trim().replace(/^#/, "").toUpperCase();
}

function buildResolvedMap(baseVars, semanticMap) {
  const mergedVars = { ...baseVars, ...semanticMap };
  return Object.fromEntries(
    Object.entries(semanticMap).map(([name, value]) => [name, normalizeHex(resolveCssVar(value, mergedVars))]),
  );
}

export function loadRoutaTokens() {
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");
  const rootVars = parseCssVars(globalsCss, ":root");
  const darkVars = { ...rootVars, ...parseCssVars(globalsCss, "html\\.dark") };

  const desktopLight = buildResolvedMap(rootVars, desktopLightMap);
  const desktopDark = buildResolvedMap(darkVars, { ...desktopLightMap, ...desktopDarkOverrides });

  return {
    sourceFiles: {
      globalsCssPath,
      desktopThemePath: path.join(repoRoot, "src", "app", "styles", "desktop-theme.css"),
    },
    raw: {
      light: rootVars,
      dark: darkVars,
    },
    paletteFamilies: paletteFamilies.map((family) => ({
      ...family,
      colors: family.steps.map((step) => ({
        step,
        cssVar: `--brand-${family.id}-${step}`,
        hex: normalizeHex(resolveCssVar(`var(--brand-${family.id}-${step})`, rootVars)),
      })),
    })),
    semanticAliases: semanticAliases.map((alias) => ({
      ...alias,
      lightHex: normalizeHex(resolveCssVar(`var(${alias.cssVar})`, rootVars)),
      darkHex: normalizeHex(resolveCssVar(`var(${alias.cssVar})`, darkVars)),
    })),
    desktop: {
      light: desktopLight,
      dark: desktopDark,
    },
  };
}

export function pickTextColor(hexWithoutHash) {
  const normalized = hexWithoutHash.replace(/^#/, "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "0F172A" : "FFFFFF";
}
