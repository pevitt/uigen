// Fix Node.js 25+ Web Storage SSR compatibility.
//
// Node 25 exposes global localStorage/sessionStorage via the experimental
// Web Storage API (--experimental-webstorage, enabled by default). Without
// --localstorage-file these globals exist but are non-functional, causing
// "localStorage.getItem is not a function" errors during SSR when
// dependencies detect the global and assume a browser environment.
//
// Removing the globals on the server restores pre-25 behaviour where
// typeof localStorage === "undefined" and SSR guard checks work correctly.

if (typeof globalThis !== "undefined" && typeof window === "undefined") {
  delete globalThis.localStorage;
  delete globalThis.sessionStorage;
}

// Load .env files manually so they are available before Next.js starts.
// This is needed because Node.js 25 does not automatically load .env files
// and --env-file is not allowed in NODE_OPTIONS.
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath, override = false) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // override=true: .env.local always wins (including clearing shell vars)
    // override=false: .env only sets vars not already defined
    if (override || !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const root = path.resolve(__dirname);
// .env.local overrides everything (including shell env vars)
// .env only fills in vars not already set
loadEnvFile(path.join(root, ".env.local"), true);
loadEnvFile(path.join(root, ".env"), false);
