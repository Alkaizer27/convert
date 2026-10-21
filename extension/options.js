import { DEFAULTS, loadSettings, saveSettings } from "./lib/settings.js";
import { testConnection } from "./lib/providers.js";

const form = document.getElementById("form");
const saved = document.getElementById("saved");
const fields = Object.keys(DEFAULTS);

function fill(settings) {
  for (const key of fields) {
    const el = document.getElementById(key);
    if (el.type === "checkbox") el.checked = settings[key];
    else el.value = settings[key];
  }
}

function readForm() {
  const next = {};
  for (const key of fields) {
    const el = document.getElementById(key);
    next[key] = el.type === "checkbox" ? el.checked : el.value.trim();
  }
  if (!next.geminiModel) next.geminiModel = DEFAULTS.geminiModel;
  return next;
}

fill(await loadSettings());

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveSettings(readForm());
  saved.hidden = false;
  setTimeout(() => (saved.hidden = true), 2000);
});

// Salva e faz uma pergunta curta para conferir chave e modelo.
for (const button of document.querySelectorAll("button.test")) {
  button.addEventListener("click", async () => {
    const provider = button.dataset.provider;
    const out = document.querySelector(`.test-result[data-for="${provider}"]`);
    button.disabled = true;
    out.className = "test-result";
    out.textContent = "Testando…";
    try {
      await saveSettings(readForm());
      const reply = await testConnection(provider, await loadSettings());
      fill(await loadSettings()); // o modelo do Gemini pode ter sido corrigido
      out.classList.add("ok");
      out.textContent = `Funcionou ✓ (resposta: "${reply}")`;
    } catch (err) {
      out.classList.add("fail");
      out.textContent = err.message || String(err);
    } finally {
      button.disabled = false;
    }
  });
}
