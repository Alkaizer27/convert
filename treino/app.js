"use strict";
/* ===== Utilidades ===== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2, "0");
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtDay = k => parseDay(k).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
const ICON = {
  play: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
  swap: '<svg class="ico" viewBox="0 0 24 24"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
  up: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  down: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
  trash: '<svg class="ico" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  edit: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  plus: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
};
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2200); }

/* ===== Estado (guardado no celular) ===== */
const KEY = "treino.v2";
const PEOPLE = Object.keys(DEFAULT_PLANS);
// Cada item padrão ganha um id estável, para as marcações não se perderem ao reordenar.
for (const p of PEOPLE) for (const w of DEFAULT_PLANS[p].workouts) w.items.forEach((it, i) => it.u = it.u || `${w.id}-${i}`);

function blankPerson() { return { plan: null, sets: {}, hist: {}, updatedAt: 0 }; }
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  s = s || {};
  s.theme = s.theme || "auto"; s.rest = s.rest || 90; s.who = PEOPLE.includes(s.who) ? s.who : PEOPLE[0];
  s.tabs = s.tabs || {}; s.flags = s.flags || {}; s.sync = s.sync || { code: null };
  s.people = s.people || {};
  for (const p of PEOPLE) s.people[p] = Object.assign(blankPerson(), s.people[p] || {});
  return s;
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function touch(who) { S.people[who].updatedAt = Date.now(); save(); Sync.schedule(who); }

const person = () => S.people[S.who];
const plan = (who = S.who) => S.people[who].plan || DEFAULT_PLANS[who];
function editablePlan(who = S.who) { const P = S.people[who]; if (!P.plan) P.plan = clone(DEFAULT_PLANS[who]); return P.plan; }
const workout = () => plan().workouts.find(w => w.id === S.tabs[S.who]) || plan().workouts[0];
const exInfo = it => { const e = LIB[it.ex] || {}; return { n: it.n || e.n || "Exercício", g: e.g || "", img: e.img, t: e.t || "", q: e.q || it.n || "", v: it.v || e.v || "" }; };
const isCardio = it => exInfo(it).g === "cardio";

/* ===== Séries do dia e histórico ===== */
function marksFor(w, who = S.who) { const s = S.people[who].sets[w.id]; return s && s.date === dayKey() ? s.m : {}; }
function totals(w, who = S.who) {
  const m = marksFor(w, who); let t = 0, d = 0;
  for (const it of w.items) { t += +it.s || 0; d += (m[it.u] || []).filter(Boolean).length; }
  return { d, t };
}
function toggleSet(u, i) {
  const P = person(), w = workout(), today = dayKey();
  let s = P.sets[w.id];
  if (!s || s.date !== today) s = P.sets[w.id] = { date: today, m: {} };
  const arr = s.m[u] = s.m[u] || [];
  arr[i] = !arr[i];
  const tt = totals(w), hk = today + "|" + w.id;
  if (tt.d > 0) P.hist[hk] = { d: tt.d, t: tt.t }; else delete P.hist[hk];
  touch(S.who);
  return arr[i];
}
function sessions(who = S.who) {
  return Object.entries(S.people[who].hist).map(([k, v]) => { const [date, wid] = k.split("|"); return { date, wid, ...v }; })
    .sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
}
function nextWorkout(who = S.who) {
  const ws = plan(who).workouts, last = sessions(who)[0];
  if (!last) return ws[0];
  const today = sessions(who).find(s => s.date === dayKey());
  if (today) return ws.find(w => w.id === today.wid) || ws[0];
  const i = ws.findIndex(w => w.id === last.wid);
  return ws[(i + 1) % ws.length];
}

/* ===== Interface ===== */
let editing = false;
const playing = new Set();

function render() {
  const P = plan(), w = workout(), nx = nextWorkout();
  $("#h1").textContent = P.title || "Treino";
  $("#who").innerHTML = PEOPLE.map(p => `<button data-who="${p}" aria-pressed="${p === S.who}">${esc(DEFAULT_PLANS[p].name)}</button>`).join("");
  $("#tabs").innerHTML = P.workouts.map(x => `<button class="tab" role="tab" aria-selected="${x.id === w.id}" data-tab="${x.id}">${esc(x.name)}<small>${esc(x.sub || "")}</small>${x.id === nx.id ? '<span class="next">HOJE</span>' : ""}</button>`).join("");
  renderBanners(w, nx);
  const m = marksFor(w);
  $("#list").innerHTML = w.items.map((it, i) => card(it, i, m[it.u] || [], w.items.length)).join("") ||
    `<p class="muted">Nenhum exercício. Toque em “Adicionar exercício”.</p>`;
  const tt = totals(w);
  $("#ptext").textContent = `${tt.d}/${tt.t} séries hoje`;
  $("#pbar").style.width = (tt.t ? tt.d / tt.t * 100 : 0) + "%";
  $("#editbar").innerHTML = editing
    ? `<button class="btn solid" data-act="editDone">Concluir edição</button><button class="btn" data-act="add">${ICON.plus}Adicionar exercício</button>`
    : "";
  $("#after").innerHTML = (w.note ? `<div class="note"><b>Obs.:</b> ${esc(w.note)}</div>` : "") +
    (editing
      ? `<div class="row" style="margin-top:16px"><button class="btn danger" data-act="restore">Restaurar ${esc(w.name)} original</button></div>`
      : `<div class="row" style="margin-top:16px"><button class="btn" data-act="edit">${ICON.edit}Editar ${esc(w.name)}</button></div>`);
  $("#syncDot").hidden = !Sync.active();
}

function card(it, i, marks, n) {
  const e = exInfo(it), cardio = isCardio(it);
  const done = marks.filter(Boolean).length >= (+it.s || 1);
  let media;
  if (playing.has(it.u) && e.v) media = `<div class="media"><iframe src="https://www.youtube-nocookie.com/embed/${esc(e.v)}?autoplay=1&playsinline=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(e.n)}"></iframe></div>`;
  else if (e.img) media = `<div class="media" data-media title="Toque para pausar"><img class="a" loading="lazy" src="img/${e.img}_0.jpg" alt="${esc(e.n)} – posição inicial"><img class="b" loading="lazy" src="img/${e.img}_1.jpg" alt="${esc(e.n)} – posição final"><span class="badge">${i + 1}</span><span class="paused-l">pausado</span></div>`;
  else media = `<div class="media"><div class="noimg">${esc(e.n)}</div><span class="badge">${i + 1}</span></div>`;
  const sets = cardio
    ? `<button class="set wide ${marks[0] ? "on" : ""}" data-set="${it.u}" data-i="0">${marks[0] ? "✓ Feito" : "Marcar como feito"}</button>`
    : Array.from({ length: +it.s || 0 }, (_, k) => `<button class="set ${marks[k] ? "on" : ""}" data-set="${it.u}" data-i="${k}" aria-label="Série ${k + 1}">${marks[k] ? "✓" : k + 1}</button>`).join("");
  const vidLabel = playing.has(it.u) ? "Fechar vídeo" : "Vídeo";
  const edit = editing ? `
      <div class="edit">
        <label>Séries<input inputmode="numeric" data-f="s" data-u="${it.u}" value="${esc(it.s)}"></label>
        <label>Repetições / tempo<input data-f="r" data-u="${it.u}" value="${esc(it.r)}"></label>
        <label class="full">Observação<input data-f="tag" data-u="${it.u}" value="${esc(it.tag || "")}" placeholder="Ex.: Bi-set com o próximo"></label>
        <label class="full">Link do vídeo (YouTube)<input data-f="v" data-u="${it.u}" value="${it.v ? "https://youtu.be/" + esc(it.v) : ""}" placeholder="Cole aqui para usar outro vídeo"></label>
        <label class="full" style="flex-direction:row;align-items:center;gap:8px;font-size:14px;color:var(--text)"><input type="checkbox" style="width:auto" data-f="bs" data-u="${it.u}" ${it.bs ? "checked" : ""}> Emendar com o próximo (sem descanso)</label>
      </div>
      <div class="order">
        <button class="btn" data-act="up" data-u="${it.u}" ${i === 0 ? "disabled" : ""} aria-label="Subir">${ICON.up}</button>
        <button class="btn" data-act="down" data-u="${it.u}" ${i === n - 1 ? "disabled" : ""} aria-label="Descer">${ICON.down}</button>
        <button class="btn" style="flex:1" data-act="swap" data-u="${it.u}">${ICON.swap}Trocar</button>
        <button class="btn danger" data-act="del" data-u="${it.u}" aria-label="Remover">${ICON.trash}</button>
      </div>` : `
      <div class="sets">${sets}</div>
      <div class="actions">
        <button class="btn primary" data-act="video" data-u="${it.u}">${ICON.play}${vidLabel}</button>
        ${playing.has(it.u) ? `<a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${esc(e.v)}">Abrir no YouTube</a>` : `<button class="btn" data-act="swap" data-u="${it.u}">${ICON.swap}Trocar</button>`}
      </div>`;
  return `<article class="card ${done && !editing ? "done" : ""}">
    ${media}
    <div class="body">
      <div class="title"><h2>${esc(e.n)}</h2><span class="scheme">${cardio ? esc(it.r) : esc(it.s) + "×" + esc(it.r)}</span></div>
      ${e.g ? `<div class="grp">${esc(GROUPS[e.g] || "")}</div>` : ""}
      ${it.tag && !editing ? `<span class="tag">${esc(it.tag)}</span>` : ""}
      ${!editing && e.t ? `<p class="tip">${esc(e.t)}</p>` : ""}
      ${edit}
    </div></article>`;
}

function renderBanners(w, nx) {
  const b = [];
  if (!editing && nx.id !== w.id && totals(w).d === 0)
    b.push(`<div class="banner"><span>Pela ordem, hoje é dia do <b>${esc(nx.name)}</b>.</span><span><button data-tab="${nx.id}">Abrir</button></span></div>`);
  if (Install.text) b.push(`<div class="banner"><span>${Install.text}</span><span>${Install.canPrompt ? '<button data-act="install">Instalar</button>' : ""}<button class="x" data-act="noinstall" aria-label="Fechar">✕</button></span></div>`);
  $("#banners").innerHTML = b.join("");
}

/* ===== Painel deslizante ===== */
function openSheet(html) { $("#sheetBody").innerHTML = html; $("#overlay").classList.add("show"); $("#sheet").classList.add("show"); $("#sheet").scrollTop = 0; }
function closeSheet() { $("#overlay").classList.remove("show"); $("#sheet").classList.remove("show"); }
const sheetHead = t => `<h3>${t}<button class="close" data-act="close" aria-label="Fechar">✕</button></h3>`;

function optRow(key, cur, act, extra = "") {
  const e = LIB[key];
  return `<button class="opt ${key === cur ? "cur" : ""}" data-act="${act}" data-ex="${key}" ${extra}>
    <img loading="lazy" src="img/${e.img}_0.jpg" alt=""><span><b>${esc(e.n)}</b><small>${key === cur ? "Atual · " : ""}${esc(GROUPS[e.g])}</small></span></button>`;
}
function openSwap(u) {
  const it = workout().items.find(x => x.u === u), e = exInfo(it);
  const same = Object.keys(LIB).filter(k => LIB[k].g === e.g && k !== it.ex);
  openSheet(sheetHead("Trocar exercício") +
    `<p class="muted">Outros exercícios que trabalham <b>${esc(GROUPS[e.g] || "o mesmo músculo")}</b>. A troca vale para ${esc(DEFAULT_PLANS[S.who].name)} e mantém séries e repetições.</p>
     <div class="opts">${same.map(k => optRow(k, it.ex, "doSwap", `data-u="${u}"`)).join("") || '<p class="muted">Nenhuma alternativa cadastrada.</p>'}</div>
     <h4>Vídeos</h4>
     <a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.q)}">${ICON.play}Buscar vídeos de “${esc(e.n)}” no YouTube</a>`);
}
function openAdd() {
  const groups = Object.keys(GROUPS);
  openSheet(sheetHead("Adicionar exercício") +
    `<div class="row" style="margin:0 0 6px"><input class="field" id="customName" placeholder="Ou digite um nome (sem imagem)"><button class="btn solid" style="flex:none;padding:0 14px" data-act="addCustom">Adicionar</button></div>` +
    groups.map(g => `<h4>${esc(GROUPS[g])}</h4><div class="opts">${Object.keys(LIB).filter(k => LIB[k].g === g).map(k => optRow(k, null, "doAdd")).join("")}</div>`).join(""));
}

/* ===== Histórico ===== */
let calMonth = null;
function openHist() {
  const now = new Date();
  if (!calMonth) calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const ss = sessions(), byDay = {};
  for (const s of ss) (byDay[s.date] = byDay[s.date] || []).push(s.wid);
  const ws = new Date(now); ws.setDate(now.getDate() - ((now.getDay() + 6) % 7)); const wk = dayKey(ws);
  const mk = dayKey(new Date(now.getFullYear(), now.getMonth(), 1));
  const days = new Set(ss.map(s => s.date));
  const inWeek = [...days].filter(d => d >= wk).length, inMonth = [...days].filter(d => d >= mk).length;
  const y = calMonth.getFullYear(), mo = calMonth.getMonth(), first = (new Date(y, mo, 1).getDay() + 6) % 7, nd = new Date(y, mo + 1, 0).getDate();
  let cells = ["S", "T", "Q", "Q", "S", "S", "D"].map(d => `<div class="dow">${d}</div>`).join("");
  for (let i = 0; i < first; i++) cells += `<div class="day empty"></div>`;
  for (let d = 1; d <= nd; d++) {
    const k = `${y}-${pad(mo + 1)}-${pad(d)}`, h = byDay[k];
    cells += `<div class="day ${h ? "has" : ""} ${k === dayKey() ? "today" : ""}">${h ? `<i>${h.map(esc).join("·")}</i>` : ""}<span>${d}</span></div>`;
  }
  const names = Object.fromEntries(plan().workouts.map(w => [w.id, w.name]));
  openSheet(sheetHead(`Histórico · ${esc(DEFAULT_PLANS[S.who].name)}`) +
    `<div class="stats"><div class="stat"><b>${inWeek}</b><span>nesta semana</span></div><div class="stat"><b>${inMonth}</b><span>neste mês</span></div><div class="stat"><b>${days.size}</b><span>no total</span></div></div>
     <p class="muted" style="margin:0 0 6px">Próximo pela ordem: <b>${esc(nextWorkout().name)}</b></p>
     <div class="calhead"><button class="close" data-act="calPrev" aria-label="Mês anterior">‹</button><b>${(s => s[0].toUpperCase() + s.slice(1))(calMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }))}</b><button class="close" data-act="calNext" aria-label="Próximo mês">›</button></div>
     <div class="cal">${cells}</div>
     <h4>Últimos treinos</h4>
     <div class="log">${ss.slice(0, 15).map(s => `<div><span>${fmtDay(s.date)} · ${esc(names[s.wid] || s.wid)}</span><b>${s.d}/${s.t}</b></div>`).join("") || '<p class="muted">Nenhum treino ainda. Marque as séries durante o treino e eles aparecem aqui.</p>'}</div>`);
}

/* ===== Ajustes: tema, links, backup, sincronização ===== */
const baseUrl = () => location.href.split(/[?#]/)[0];
function openMenu() {
  const th = S.theme, cfg = !!window.SYNC_CONFIG;
  let sync;
  if (!cfg) sync = `<p class="muted">Ainda não ligada. Falta configurar o banco de dados (Supabase) no arquivo <code>config.js</code>. Enquanto isso, cada celular guarda os próprios dados.</p>`;
  else if (!S.sync.code) sync = `<p class="muted">Junte os dois celulares no mesmo “código da família” para verem o treino um do outro.</p>
      <div class="row"><button class="btn solid" data-act="syncNew">Criar código</button></div>
      <div class="row"><input class="field" id="syncCode" placeholder="Ou cole o código recebido"><button class="btn" style="flex:none;padding:0 14px" data-act="syncJoin">Entrar</button></div>`;
  else sync = `<p class="muted">Ligada. ${Sync.status}</p><div class="code">${esc(S.sync.code)}</div>
      <div class="row"><button class="btn primary" data-act="syncShare">Enviar convite</button><button class="btn" data-act="syncNow">Sincronizar agora</button></div>
      <div class="row"><button class="btn danger" data-act="syncLeave">Desligar neste celular</button></div>`;
  openSheet(sheetHead("Ajustes") +
    `<h4>Aparência</h4><div class="seg">${[["auto", "Automático"], ["light", "Claro"], ["dark", "Escuro"]].map(([k, l]) => `<button data-theme="${k}" aria-pressed="${th === k}">${l}</button>`).join("")}</div>
     <h4>Link direto de cada um</h4><p class="muted">Abre o app já no treino da pessoa.</p>
     ${PEOPLE.map(p => `<div class="row"><input class="field" readonly value="${esc(baseUrl() + "?p=" + p)}"><button class="btn primary" style="flex:none;padding:0 14px" data-act="shareLink" data-p="${p}">Enviar</button></div>`).join("")}
     <h4>Sincronizar entre celulares</h4>${sync}
     <h4>Backup</h4><p class="muted">Salva tudo (treinos editados, séries e histórico dos dois) num arquivo. Use para trocar de celular ou se limpar o navegador.</p>
     <div class="row"><button class="btn" data-act="export">Salvar backup</button><label class="btn" style="margin:0">Restaurar backup<input type="file" accept="application/json,.json" id="importFile" hidden></label></div>`);
}
function applyTheme() {
  if (S.theme === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = S.theme;
  requestAnimationFrame(() => { const bg = getComputedStyle(document.body).backgroundColor; $("#themeColor").setAttribute("content", bg); });
}
async function shareText(title, text, url) {
  try { if (navigator.share) { await navigator.share({ title, text, url }); return; } } catch (e) { if (e.name === "AbortError") return; }
  try { await navigator.clipboard.writeText(url); toast("Link copiado"); } catch (e) { prompt("Copie o link:", url); }
}
function exportData() {
  const blob = new Blob([JSON.stringify({ app: "treino", v: 2, exportedAt: new Date().toISOString(), people: S.people }, null, 1)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `treino-backup-${dayKey()}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
async function importData(file) {
  try {
    const d = JSON.parse(await file.text());
    if (d.app !== "treino" || !d.people) throw new Error("arquivo inválido");
    if (!confirm("Substituir os dados deste celular pelos do backup?")) return;
    for (const p of PEOPLE) if (d.people[p]) { S.people[p] = Object.assign(blankPerson(), d.people[p]); touch(p); }
    closeSheet(); render(); toast("Backup restaurado");
  } catch (e) { alert("Não consegui ler esse arquivo de backup."); }
}

/* ===== Sincronização (Supabase, opcional) ===== */
const Sync = {
  status: "", timers: {}, pending: new Set(),
  active() { return !!(window.SYNC_CONFIG && S.sync.code); },
  async rpc(fn, args) {
    const c = window.SYNC_CONFIG, h = { "Content-Type": "application/json", apikey: c.key };
    if (/^eyJ/.test(c.key)) h.Authorization = "Bearer " + c.key; // chave "anon" antiga (JWT)
    const r = await fetch(c.url.replace(/\/+$/, "") + "/rest/v1/rpc/" + fn, { method: "POST", headers: h, body: JSON.stringify(args) });
    if (!r.ok) throw new Error(r.status);
    const txt = await r.text(); return txt ? JSON.parse(txt) : null;
  },
  schedule(who) {
    if (!this.active()) return;
    this.pending.add(who); clearTimeout(this.timers.push);
    this.timers.push = setTimeout(() => this.push(), 1200);
  },
  async push() {
    if (!this.active() || !this.pending.size) return;
    const whos = [...this.pending]; this.pending.clear();
    try {
      for (const w of whos) await this.rpc("treino_set", { p_code: S.sync.code, p_who: w, p_data: S.people[w] });
      this.ok();
    } catch (e) { whos.forEach(w => this.pending.add(w)); this.fail(); }
  },
  async pull() {
    if (!this.active()) return;
    try {
      const f = (await this.rpc("treino_get", { p_code: S.sync.code })) || {}; let changed = false;
      for (const p of PEOPLE) {
        const remote = f[p] || null, local = S.people[p];
        if (remote && (remote.updatedAt || 0) > (local.updatedAt || 0)) { S.people[p] = Object.assign(blankPerson(), remote); changed = true; }
        else if (!remote || (local.updatedAt || 0) > (remote.updatedAt || 0)) this.pending.add(p);
      }
      if (changed) { save(); if (!editing) render(); }
      if (this.pending.size) await this.push(); else this.ok();
    } catch (e) { this.fail(); }
  },
  ok() { this.status = "Última sincronização: " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + "."; },
  fail() { this.status = "Sem conexão agora; tento de novo em instantes."; },
  start() {
    if (!this.active()) return;
    this.pull(); clearInterval(this.timers.poll);
    this.timers.poll = setInterval(() => { if (document.visibilityState === "visible") this.pull(); }, 20000);
  }
};
function newCode() { const a = new Uint8Array(12); crypto.getRandomValues(a); return "fam-" + [...a].map(b => b.toString(36).padStart(2, "0")).join("").slice(0, 20); }

/* ===== Vídeos ===== */
function parseYouTube(s) {
  s = (s || "").trim(); if (!s) return "";
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

/* ===== Cronômetro de descanso ===== */
let tEnd = 0, tInt = null;
const fmt = s => Math.floor(s / 60) + ":" + pad(s % 60);
function startTimer(s) { tEnd = Date.now() + s * 1000; clearInterval(tInt); tick(); tInt = setInterval(tick, 250); }
function tick() {
  const left = Math.max(0, Math.ceil((tEnd - Date.now()) / 1000)), el = $("#tt");
  el.textContent = fmt(left); el.classList.toggle("run", left > 0);
  if (left === 0) { clearInterval(tInt); try { navigator.vibrate && navigator.vibrate([300, 150, 300]); } catch (e) {} }
}

/* ===== Instalação como app ===== */
const Install = {
  text: "", canPrompt: false, ev: null,
  init() {
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (standalone || S.flags.noinstall || !location.protocol.startsWith("http")) return;
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) this.text = "Para virar app no iPhone: toque em <b>Compartilhar</b> ⬆️ e depois em <b>Adicionar à Tela de Início</b>.";
    addEventListener("beforeinstallprompt", e => { e.preventDefault(); this.ev = e; this.canPrompt = true; this.text = "Instale como app na tela inicial."; render(); });
    addEventListener("appinstalled", () => { this.text = ""; render(); });
  }
};

/* ===== Eventos ===== */
document.addEventListener("click", async ev => {
  const t = ev.target.closest("button,[data-media],[data-act]"); if (!t) return;
  const d = t.dataset, w = workout();
  if (d.who) { S.who = d.who; editing = false; playing.clear(); S.tabs[S.who] = S.tabs[S.who] || nextWorkout().id; save(); render(); scrollTo(0, 0); return; }
  if (d.tab) { S.tabs[S.who] = d.tab; playing.clear(); save(); render(); scrollTo(0, 0); return; }
  if (d.set) {
    const on = toggleSet(d.set, +d.i), it = w.items.find(x => x.u === d.set);
    render();
    if (on && !isCardio(it) && !it.bs) startTimer(S.rest);
    return;
  }
  if (d.rest) { S.rest = +d.rest; save(); startTimer(S.rest); return; }
  if (d.media !== undefined && t.hasAttribute("data-media")) { t.classList.toggle("paused"); return; }
  if (d.theme) { S.theme = d.theme; save(); applyTheme(); openMenu(); return; }
  const u = d.u, items = w.items, idx = items.findIndex(x => x.u === u);
  switch (d.act) {
    case "close": closeSheet(); break;
    case "video": {
      const e = exInfo(items[idx]);
      if (!e.v) { open("https://www.youtube.com/results?search_query=" + encodeURIComponent(e.q), "_blank", "noopener"); break; }
      playing.has(u) ? playing.delete(u) : playing.add(u); render(); break;
    }
    case "swap": openSwap(u); break;
    case "doSwap": {
      const it = editablePlan().workouts.find(x => x.id === w.id).items.find(x => x.u === u);
      it.ex = d.ex; delete it.v; delete it.n; playing.delete(u); touch(S.who); closeSheet(); render(); toast("Exercício trocado"); break;
    }
    case "edit": editing = true; playing.clear(); render(); scrollTo(0, 0); break;
    case "editDone": editing = false; render(); toast("Treino salvo"); break;
    case "add": openAdd(); break;
    case "doAdd": case "addCustom": {
      const pw = editablePlan().workouts.find(x => x.id === w.id), it = { u: w.id + "-" + Date.now().toString(36), s: 3, r: "12" };
      if (d.act === "doAdd") { it.ex = d.ex; if (LIB[d.ex].g === "cardio") { it.s = 1; it.r = "10 min"; } }
      else { const n = $("#customName").value.trim(); if (!n) { $("#customName").focus(); break; } it.n = n; }
      pw.items.push(it); touch(S.who); closeSheet(); render(); toast("Exercício adicionado no fim"); break;
    }
    case "up": case "down": {
      const pw = editablePlan().workouts.find(x => x.id === w.id), j = idx + (d.act === "up" ? -1 : 1);
      if (j < 0 || j >= pw.items.length) break;
      [pw.items[idx], pw.items[j]] = [pw.items[j], pw.items[idx]]; touch(S.who); render(); break;
    }
    case "del": {
      if (!confirm(`Remover “${exInfo(items[idx]).n}” do ${w.name}?`)) break;
      editablePlan().workouts.find(x => x.id === w.id).items.splice(idx, 1); touch(S.who); render(); break;
    }
    case "restore": {
      if (!confirm(`Voltar o ${w.name} para o original?`)) break;
      const pw = editablePlan(), def = DEFAULT_PLANS[S.who].workouts.find(x => x.id === w.id);
      pw.workouts[pw.workouts.findIndex(x => x.id === w.id)] = clone(def);
      if (JSON.stringify(pw) === JSON.stringify(DEFAULT_PLANS[S.who])) S.people[S.who].plan = null;
      touch(S.who); render(); toast("Treino restaurado"); break;
    }
    case "install": if (Install.ev) { Install.ev.prompt(); await Install.ev.userChoice; Install.ev = null; Install.canPrompt = false; Install.text = ""; render(); } break;
    case "noinstall": S.flags.noinstall = true; Install.text = ""; save(); render(); break;
    case "calPrev": calMonth.setMonth(calMonth.getMonth() - 1); openHist(); break;
    case "calNext": calMonth.setMonth(calMonth.getMonth() + 1); openHist(); break;
    case "shareLink": shareText("Treino", "Meu treino:", baseUrl() + "?p=" + d.p); break;
    case "export": exportData(); break;
    case "syncNew": S.sync.code = newCode(); save(); PEOPLE.forEach(p => Sync.pending.add(p)); await Sync.push(); Sync.start(); openMenu(); render(); break;
    case "syncJoin": {
      const c = ($("#syncCode").value || "").trim(); if (c.length < 16) { alert("Código inválido."); break; }
      S.sync.code = c; save(); await Sync.pull(); Sync.start(); openMenu(); render(); toast("Sincronização ligada"); break;
    }
    case "syncShare": shareText("Treino – sincronizar", "Abra este link para sincronizar o treino:", baseUrl() + "?sync=" + encodeURIComponent(S.sync.code)); break;
    case "syncNow": await Sync.pull(); openMenu(); toast(Sync.status); break;
    case "syncLeave": if (confirm("Desligar a sincronização neste celular? Os dados continuam aqui.")) { S.sync.code = null; save(); clearInterval(Sync.timers.poll); openMenu(); render(); } break;
  }
});
$("#overlay").addEventListener("click", closeSheet);
$("#openHist").addEventListener("click", () => { calMonth = null; openHist(); });
$("#openMenu").addEventListener("click", openMenu);
document.addEventListener("change", ev => {
  const t = ev.target;
  if (t.id === "importFile" && t.files[0]) return importData(t.files[0]);
  if (!t.dataset.f) return;
  const w = workout(), it = editablePlan().workouts.find(x => x.id === w.id).items.find(x => x.u === t.dataset.u);
  const f = t.dataset.f;
  if (f === "s") { const n = Math.max(1, Math.min(10, parseInt(t.value) || 1)); it.s = n; }
  else if (f === "r") it.r = t.value.trim() || "12";
  else if (f === "tag") { const v = t.value.trim(); v ? it.tag = v : delete it.tag; }
  else if (f === "bs") { t.checked ? it.bs = 1 : delete it.bs; }
  else if (f === "v") { const id = parseYouTube(t.value); if (id === null) { alert("Não reconheci esse link do YouTube."); return; } id ? it.v = id : delete it.v; }
  touch(S.who);
});
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { Sync.pull(); render(); } });
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);

// "GIF": alterna entre posição inicial e final
let frame = 0;
setInterval(() => { frame ^= 1; document.querySelectorAll(".media[data-media]:not(.paused)").forEach(m => m.classList.toggle("f1", !!frame)); }, 900);

/* ===== Início ===== */
(function boot() {
  const q = new URLSearchParams(location.search);
  if (PEOPLE.includes(q.get("p"))) { S.who = q.get("p"); }
  const inv = q.get("sync");
  if (q.has("p") || q.has("sync")) history.replaceState(null, "", baseUrl());
  // Abre no treino em andamento hoje ou no próximo da ordem.
  for (const p of PEOPLE) S.tabs[p] = nextWorkout(p).id;
  save(); applyTheme(); Install.init(); render(); Sync.start();
  if (inv && window.SYNC_CONFIG && inv !== S.sync.code && confirm("Ligar a sincronização com o outro celular?")) {
    S.sync.code = inv; save(); Sync.pull().then(() => { Sync.start(); render(); toast("Sincronização ligada"); });
  }
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
})();
