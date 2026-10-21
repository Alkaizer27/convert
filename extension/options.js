import { DEFAULTS, loadSettings, saveSettings } from "./lib/settings.js";

const form = document.getElementById("form");
const saved = document.getElementById("saved");
const fields = Object.keys(DEFAULTS);

const settings = await loadSettings();
for (const key of fields) {
  const el = document.getElementById(key);
  if (el.type === "checkbox") el.checked = settings[key];
  else el.value = settings[key];
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const next = {};
  for (const key of fields) {
    const el = document.getElementById(key);
    next[key] = el.type === "checkbox" ? el.checked : el.value.trim();
  }
  if (!next.geminiModel) next.geminiModel = DEFAULTS.geminiModel;
  await saveSettings(next);
  saved.hidden = false;
  setTimeout(() => (saved.hidden = true), 2000);
});
