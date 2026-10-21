// Configurações guardadas só neste navegador (chrome.storage.local).
export const DEFAULTS = {
  provider: "claude",
  claudeKey: "",
  claudeModel: "claude-opus-5-5",
  claudeEffort: "low",
  geminiKey: "",
  geminiModel: "gemini-3.5-flash",
  autoRun: true,
  sendScreenshot: true,
  webSearch: true,
};

export async function loadSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return { ...DEFAULTS, ...stored };
}

export async function saveSettings(partial) {
  await chrome.storage.local.set(partial);
}
