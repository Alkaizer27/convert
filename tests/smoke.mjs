// Teste de fumaça: carrega a extensão num Chromium, lê uma página de quiz e
// confere as chamadas às APIs (simuladas) do Claude e do Gemini.
// Uso: node tests/smoke.mjs   (precisa do Playwright instalado)
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require(path.join(process.execPath, "../../lib/node_modules/playwright"));
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ext = path.join(root, "extension");
const html = fs.readFileSync(path.join(root, "tests/fixtures/quiz.html"));
const server = http.createServer((_, res) => res.end(html)).listen(8765);

const ctx = await playwright.chromium.launchPersistentContext("", {
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, "--headless=new"],
});
const errors = [];
try {
  let [sw] = ctx.serviceWorkers();
  if (!sw) sw = await ctx.waitForEvent("serviceworker");
  const id = new URL(sw.url()).host;

  const quiz = await ctx.newPage();
  await quiz.goto("http://localhost:8765/");
  const panel = await ctx.newPage();
  panel.on("pageerror", (e) => errors.push(e.message));
  await panel.goto(`chrome-extension://${id}/sidepanel.html`);

  const r = await panel.evaluate(async () => {
    const { readPage } = await import("./lib/page.js");
    const { askClaude, askGemini } = await import("./lib/providers.js");
    const [tab] = await chrome.tabs.query({ url: "http://localhost:8765/*" });
    await chrome.tabs.update(tab.id, { active: true });
    const page = await readPage(tab, { screenshot: true });

    const calls = [];
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
    window.fetch = async (url, init = {}) => {
      calls.push({ url, body: init.body ? JSON.parse(init.body) : null, headers: init.headers });
      if (url.includes("anthropic")) {
        if (calls.filter((c) => c.url.includes("anthropic")).length === 1) {
          return json({ stop_reason: "pause_turn", content: [
            { type: "server_tool_use", id: "s1", name: "web_search", input: { query: "x" } },
            { type: "web_search_tool_result", tool_use_id: "s1", content: [{ type: "web_search_result", url: "https://ex.com/a", title: "A" }] }] });
        }
        return json({ stop_reason: "end_turn", content: [{ type: "text", text: "## Resposta\nB) 4",
          citations: [{ type: "web_search_result_location", url: "https://ex.com/b", title: "B" }] }] });
      }
      if (url.endsWith("/models?pageSize=200")) {
        return json({ models: [
          { name: "models/gemini-2.5-flash", supportedGenerationMethods: ["generateContent"] },
          { name: "models/gemini-9.0-flash-lite", supportedGenerationMethods: ["generateContent"] },
          { name: "models/gemini-9.0-flash", supportedGenerationMethods: ["generateContent"] }] });
      }
      if (url.includes("/models/gemini-velho:")) return json({ error: { message: "not found" } }, 404);
      return json({ candidates: [{ content: { parts: [{ text: "## Resposta\nBrasília" }] },
        groundingMetadata: { groundingChunks: [{ web: { uri: "https://g.com/x", title: "g.com" } }] } }] });
    };

    const settings = { claudeKey: "k", claudeModel: "claude-opus-5-5", claudeEffort: "low", webSearch: true,
      geminiKey: "g", geminiModel: "gemini-velho" };
    const claude = await askClaude({ settings, page, question: "" });
    const gemini = await askGemini({ settings, page, question: "" });
    const { geminiModel } = await chrome.storage.local.get("geminiModel");
    return { page: { ...page, image: !!page.image }, claude, gemini, geminiModel, calls: calls.map((c) => ({ url: c.url, body: c.body })) };
  });

  assert.match(r.page.text, /2x \+ 6 = 14/);
  assert.match(r.page.text, /capital do Brasil/, "deve ler o iframe");
  assert.ok(r.page.image, "deve capturar a tela");
  assert.equal(r.calls[0].body.tools[0].type, "web_search_20260209");
  assert.equal(r.calls[0].body.fallbacks, "default");
  assert.deepEqual(r.calls[1].body.messages.map((m) => m.role), ["user", "assistant"], "deve continuar após pause_turn");
  assert.deepEqual(r.claude.sources.map((s) => s.url), ["https://ex.com/b", "https://ex.com/a"]);
  assert.equal(r.gemini.text, "## Resposta\nBrasília");
  assert.equal(r.geminiModel, "gemini-9.0-flash", "deve trocar o modelo do Gemini desatualizado");
  assert.deepEqual(errors, []);
  console.log("OK: todos os testes passaram");
} finally {
  await ctx.close();
  server.close();
}
