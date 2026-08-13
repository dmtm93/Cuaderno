// Polyfills the window.storage.get/set API (originally provided by the
// Claude artifacts sandbox) using the browser's built-in localStorage,
// so the app can run as a fully standalone static site with no backend.
//
// The app only ever calls storage.get(key, false) / storage.set(key, value, false)
// with string values (it JSON.stringifies before calling set, and JSON.parses
// after get) — the boolean "shared" flag is accepted but ignored here, since a
// standalone deploy has no concept of shared multi-user storage.

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        // Matches the original API: accessing a missing key throws rather
        // than returning null, so callers use try/catch to detect "not found".
        throw new Error(`storage: no value for key "${key}"`);
      }
      return { key, value: raw, shared: false };
    },

    async set(key, value) {
      window.localStorage.setItem(key, value);
      return { key, value, shared: false };
    },

    async delete(key) {
      window.localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    },

    async list(prefix) {
      const keys = Object.keys(window.localStorage).filter(
        (k) => !prefix || k.startsWith(prefix)
      );
      return { keys, prefix, shared: false };
    },
  };
}
