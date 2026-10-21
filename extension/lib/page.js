// Lê a questão da aba ativa: texto selecionado (se houver), texto da página
// em todos os frames e uma captura da área visível.

const MAX_TEXT_CHARS = 30000;
const MAX_IMAGE_SIDE = 1600;

// Roda dentro da página; precisa ser autocontida.
function extractFrame() {
  const selection = String(window.getSelection ? window.getSelection() : "").trim();
  const body = document.body ? document.body.innerText : "";
  return {
    url: location.href,
    title: document.title,
    selection,
    text: body.replace(/\n{3,}/g, "\n\n").trim(),
  };
}

export async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab) throw new Error("Nenhuma aba ativa encontrada.");
  return tab;
}

export async function readPage(tab, { screenshot }) {
  let frames;
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: extractFrame,
    });
    frames = results.map((r) => r.result).filter(Boolean);
  } catch (err) {
    throw new Error(
      "Não consigo ler esta página (páginas internas do Chrome e a Chrome Web Store são bloqueadas). " +
        "Abra a página da questão e tente de novo."
    );
  }

  const selection = frames.map((f) => f.selection).filter(Boolean).join("\n\n");
  let text = frames
    .map((f) => f.text)
    .filter(Boolean)
    .join("\n\n----- (conteúdo de outro quadro da página) -----\n\n");
  const truncated = text.length > MAX_TEXT_CHARS;
  if (truncated) text = text.slice(0, MAX_TEXT_CHARS);

  let image = null;
  if (screenshot) {
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 80 });
      image = await shrink(dataUrl);
    } catch (err) {
      console.warn("Captura da tela falhou:", err);
    }
  }

  return { url: tab.url, title: tab.title, selection, text, truncated, image };
}

// Reduz a captura para economizar tokens; devolve { mediaType, data(base64) }.
async function shrink(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = new OffscreenCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const out = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.8 });
  const bytes = new Uint8Array(await out.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return { mediaType: "image/jpeg", data: btoa(binary) };
}
