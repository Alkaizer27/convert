// Chamadas às IAs. Cada provedor devolve { text, sources: [{ url, title }] }.
// Extensão sem etapa de build, então as APIs são chamadas direto com fetch.

export const SYSTEM_PROMPT = `Você é um tutor de estudos em português do Brasil.
O usuário está vendo uma página com uma ou mais questões (matemática, português, ciências, qualquer matéria).
Você recebe o texto da página e, quando disponível, uma captura da parte visível da tela.

Como trabalhar:
- Se houver texto selecionado, responda só sobre ele. Senão, foque na questão que aparece na captura de tela.
- Se houver alternativas, diga qual é a correta.
- Pesquise na web quando isso ajudar a confirmar fatos, definições ou dados.
- Se houver várias questões visíveis, responda cada uma, numeradas, no mesmo formato.
- Se não encontrar nenhuma questão, diga isso e resuma em uma frase o que está na tela.

Formato da resposta (markdown simples):
## Resposta
A alternativa e o texto dela, ou a resposta direta. Curto.
## Explicação
Passo a passo objetivo de como se chega à resposta.

Não use LaTeX: escreva fórmulas em texto simples (ex.: x² + 3x − 10 = 0, √16 = 4).
Não liste links no texto; as fontes são mostradas à parte.`;

function buildUserText(page, question) {
  const parts = [`Página: ${page.title || ""}\nEndereço: ${page.url || ""}`];
  if (page.selection) parts.push(`TEXTO SELECIONADO PELO USUÁRIO:\n${page.selection}`);
  parts.push(
    `TEXTO DA PÁGINA${page.truncated ? " (cortado por ser muito longo; use a captura de tela como guia)" : ""}:\n${page.text || "(sem texto)"}`
  );
  parts.push(question ? `PEDIDO DO USUÁRIO:\n${question}` : "PEDIDO DO USUÁRIO:\nResponda a questão.");
  return parts.join("\n\n");
}

function dedupeSources(list) {
  const seen = new Set();
  return list.filter((s) => {
    if (!s.url || seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
}

async function readError(res) {
  let detail = "";
  try {
    const body = await res.json();
    detail = body?.error?.message || JSON.stringify(body);
  } catch {
    detail = await res.text().catch(() => "");
  }
  if (res.status === 401 || res.status === 403) return `Chave de API inválida ou sem permissão (${res.status}). ${detail}`;
  if (res.status === 429) return `Limite de uso atingido (429). Espere um pouco e tente de novo. ${detail}`;
  return `Erro ${res.status}: ${detail}`;
}

// ---------- Claude ----------

const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

// Modelos que aceitam a versão mais nova da pesquisa na web e o fallback do servidor.
const CLAUDE_NEW_GEN = /^claude-(opus-5|sonnet-5|fable-5|opus-4-[678]|sonnet-4-6)/;
const CLAUDE_FALLBACK = /^claude-(opus-5|sonnet-5-5|fable-5-1)/;

export async function askClaude({ settings, page, question, signal }) {
  if (!settings.claudeKey) throw new Error("Falta a chave de API do Claude. Abra as configurações (⚙).");
  const model = settings.claudeModel;
  const newGen = CLAUDE_NEW_GEN.test(model);

  const content = [];
  if (page.image) {
    content.push({ type: "image", source: { type: "base64", media_type: page.image.mediaType, data: page.image.data } });
  }
  content.push({ type: "text", text: buildUserText(page, question) });

  const body = {
    model,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
    output_config: { effort: settings.claudeEffort },
  };
  if (settings.webSearch) {
    body.tools = [{ type: newGen ? "web_search_20260209" : "web_search_20250305", name: "web_search", max_uses: 3 }];
  }
  const headers = {
    "content-type": "application/json",
    "x-api-key": settings.claudeKey,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
  if (CLAUDE_FALLBACK.test(model)) {
    // Se um filtro de segurança recusar por engano, o servidor tenta outro modelo.
    body.fallbacks = "default";
    headers["anthropic-beta"] = "server-side-fallback-2026-07-01";
  }

  const texts = [];
  const sources = [];
  // A pesquisa na web pode pausar o turno (pause_turn); reenviamos para continuar.
  for (let round = 0; round < 4; round++) {
    const res = await fetch(CLAUDE_URL, { method: "POST", headers, body: JSON.stringify(body), signal });
    if (!res.ok) throw new Error(await readError(res));
    const msg = await res.json();

    if (msg.stop_reason === "refusal") {
      throw new Error("O Claude recusou esta solicitação. Tente selecionar só o texto da questão.");
    }

    for (const block of msg.content || []) {
      if (block.type === "text") {
        texts.push(block.text);
        for (const c of block.citations || []) {
          if (c.url) sources.push({ url: c.url, title: c.title || c.url });
        }
      } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        for (const r of block.content) {
          if (r.type === "web_search_result") sources.push({ url: r.url, title: r.title || r.url, unused: true });
        }
      }
    }

    if (msg.stop_reason !== "pause_turn") break;
    body.messages = [...body.messages, { role: "assistant", content: msg.content }];
  }

  // Mostra primeiro as fontes citadas; resultados de busca não citados vão depois.
  const cited = sources.filter((s) => !s.unused);
  const others = sources.filter((s) => s.unused);
  return { text: texts.join(""), sources: dedupeSources([...cited, ...others]).slice(0, 8) };
}

// ---------- Gemini ----------

export async function askGemini({ settings, page, question, signal }) {
  if (!settings.geminiKey) throw new Error("Falta a chave de API do Gemini. Abra as configurações (⚙).");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(settings.geminiModel)}:generateContent`;

  const parts = [];
  if (page.image) parts.push({ inline_data: { mime_type: page.image.mediaType, data: page.image.data } });
  parts.push({ text: buildUserText(page, question) });

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts }],
  };
  if (settings.webSearch) body.tools = [{ google_search: {} }];

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": settings.geminiKey },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();

  if (data.promptFeedback?.blockReason) {
    throw new Error(`O Gemini bloqueou a solicitação (${data.promptFeedback.blockReason}).`);
  }
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || "").join("");
  if (!text) throw new Error(`O Gemini não devolveu resposta (${cand?.finishReason || "motivo desconhecido"}).`);

  const sources = (cand.groundingMetadata?.groundingChunks || [])
    .map((c) => c.web)
    .filter(Boolean)
    .map((w) => ({ url: w.uri, title: w.title || w.uri }));
  return { text, sources: dedupeSources(sources).slice(0, 8) };
}

export function ask(opts) {
  return opts.settings.provider === "gemini" ? askGemini(opts) : askClaude(opts);
}
