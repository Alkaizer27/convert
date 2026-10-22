import { loadSettings, saveSettings } from "./lib/settings.js";
import { getActiveTab, readPage } from "./lib/page.js";
import { ask } from "./lib/providers.js";
import { escapeHtml, renderMarkdown, renderSources } from "./lib/render.js";

const $ = (id) => document.getElementById(id);
const els = {
  provider: $("provider"),
  settings: $("settings"),
  solve: $("solve"),
  status: $("status"),
  error: $("error"),
  result: $("result"),
  question: $("question"),
  send: $("send"),
};

let settings = await loadSettings();
let controller = null;
els.provider.value = settings.provider;

function show(el, html) {
  el.hidden = !html;
  if (html !== undefined) el.innerHTML = html || "";
}

function setBusy(busy, message) {
  els.solve.disabled = busy;
  els.send.disabled = busy;
  show(els.status, busy ? `<span class="spinner"></span>${message}` : "");
}

async function run(question) {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  show(els.error, "");
  show(els.result, "");
  const name = settings.provider === "gemini" ? "Gemini" : "Claude";
  const started = performance.now();

  try {
    setBusy(true, "Lendo a página…");
    const tab = await getActiveTab();
    const page = await readPage(tab, { screenshot: settings.sendScreenshot });
    if (signal.aborted) return;

    setBusy(true, `${name} está analisando${settings.webSearch ? " e pesquisando" : ""}…`);
    const { text, sources, model, notice } = await ask({ settings, page, question, signal });
    if (signal.aborted) return;

    const secs = ((performance.now() - started) / 1000).toFixed(1);
    show(
      els.result,
      renderMarkdown(text) +
        renderSources(sources) +
        (notice ? `<p class="notice">${escapeHtml(notice)}</p>` : "") +
        `<p class="meta">${name} · ${escapeHtml(model || "")} · ${secs}s</p>`
    );
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error(err);
    show(els.error, "");
    els.error.textContent = err.message || String(err);
    els.error.hidden = false;
  } finally {
    if (!signal.aborted) setBusy(false);
  }
}

els.solve.addEventListener("click", () => run(""));

els.send.addEventListener("click", () => {
  const q = els.question.value.trim();
  if (q) run(q);
});

els.question.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) els.send.click();
});

els.provider.addEventListener("change", async () => {
  settings.provider = els.provider.value;
  await saveSettings({ provider: settings.provider });
});

els.settings.addEventListener("click", () => chrome.runtime.openOptionsPage());

const hasKey = () => (settings.provider === "gemini" ? settings.geminiKey : settings.claudeKey);
const MISSING_KEY = 'Configure sua chave de API para começar: clique em <strong>⚙</strong> no canto superior.';

// Atualiza o aviso de chave ao salvar as configurações ou trocar de IA.
function refreshKeyWarning() {
  if (!hasKey()) show(els.error, MISSING_KEY);
  else if (els.error.innerHTML === MISSING_KEY) show(els.error, "");
}

chrome.storage.onChanged.addListener(async (_changes, area) => {
  if (area !== "local") return;
  settings = await loadSettings();
  els.provider.value = settings.provider;
  refreshKeyWarning();
});

refreshKeyWarning();
if (hasKey() && settings.autoRun) run("");
