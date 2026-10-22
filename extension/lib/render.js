// Markdown mínimo e seguro: escapa todo HTML antes de aplicar a formatação.

export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function inline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

export function renderMarkdown(md) {
  const out = [];
  let list = null;
  let para = [];

  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };

  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) {
      flushPara();
      flushList();
    } else if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushPara();
      flushList();
      out.push("<hr>");
    } else if ((m = line.match(/^#{1,6}\s+(.*)$/))) {
      flushPara();
      flushList();
      const title = m[1].trim();
      const cls = /^resposta/i.test(title) ? ' class="answer-title"' : "";
      out.push(`<h3${cls}>${inline(title)}</h3>`);
    } else if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
      flushPara();
      if (!list || list.tag !== "ul") {
        flushList();
        list = { tag: "ul", items: [] };
      }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
      flushPara();
      if (!list || list.tag !== "ol") {
        flushList();
        list = { tag: "ol", items: [] };
      }
      list.items.push(m[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return out.join("\n");
}

export function renderSources(sources) {
  if (!sources.length) return "";
  const items = sources
    .map((s) => {
      let host = "";
      try {
        host = new URL(s.url).hostname.replace(/^www\./, "");
      } catch {}
      const safeUrl = /^https?:\/\//i.test(s.url) ? escapeHtml(s.url) : "#";
      return `<li><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title)}</a>${
        host && host !== s.title ? ` <span class="host">${escapeHtml(host)}</span>` : ""
      }</li>`;
    })
    .join("");
  return `<h3>Fontes</h3><ol class="sources">${items}</ol>`;
}
