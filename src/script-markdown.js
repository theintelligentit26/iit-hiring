function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return text;
}

function isSpecial(line) {
  return (
    line.startsWith("```") ||
    line.startsWith("|") ||
    line.startsWith(">") ||
    /^#{1,4} /.test(line) ||
    line.trim() === "---" ||
    /^[-*] (\[[ xX]\] )?/.test(line) ||
    /^\d+\. /.test(line)
  );
}

function cells(row) {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(rows) {
  const body = rows.filter((row) => !/^\|\s*-+/.test(row.replace(/\|/g, "|").trim()) && !/^\|?\s*:?-{3,}/.test(row));
  const parsed = rows
    .map(cells)
    .filter((row) => !row.every((cell) => /^:?-+:?$/.test(cell)));
  if (!parsed.length) return "";
  const [head, ...rest] = parsed;
  const headHtml = head.map((cell) => `<th>${inline(cell)}</th>`).join("");
  const bodyHtml = rest
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  return `<div class="script-table-wrap"><table class="script-md"><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function renderList(lines, start) {
  const ordered = /^\d+\. /.test(lines[start]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    if (ordered && /^\d+\. /.test(line)) {
      items.push(line.replace(/^\d+\.\s+/, ""));
      i += 1;
      continue;
    }
    if (!ordered && /^[-*] /.test(line)) {
      items.push(line.replace(/^[-*]\s+/, ""));
      i += 1;
      continue;
    }
    if (/^ {2,}[-*] /.test(line) && items.length) {
      items[items.length - 1] += `<ul><li>${inline(line.replace(/^\s+[-*]\s+/, ""))}</li></ul>`;
      i += 1;
      continue;
    }
    if (/^ {2,}\S/.test(line) && items.length && !isSpecial(line.trim())) {
      items[items.length - 1] += ` ${line.trim()}`;
      i += 1;
      continue;
    }
    break;
  }
  const tag = ordered ? "ol" : "ul";
  const html = items
    .map((item) => {
      const nested = item.indexOf("<ul>");
      if (nested === -1) return `<li>${inline(item)}</li>`;
      return `<li>${inline(item.slice(0, nested))}${item.slice(nested)}</li>`;
    })
    .join("");
  return { html: `<${tag}>${html}</${tag}>`, next: i };
}

export function renderScriptMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const buffer = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1;
      html.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
      continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i]);
        i += 1;
      }
      html.push(renderTable(rows));
      continue;
    }
    if (line.startsWith(">")) {
      const parts = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      html.push(
        `<blockquote class="say">${parts.map((part) => `<p>${inline(part)}</p>`).join("")}</blockquote>`,
      );
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }
    if (line.trim() === "---") {
      html.push("<hr />");
      i += 1;
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const list = renderList(lines, i);
      html.push(list.html);
      i = list.next;
      continue;
    }
    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }
  return html.join("\n");
}
