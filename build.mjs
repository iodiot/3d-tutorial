// Static site builder for https://iodiot.github.io/3d-tutorial/
// node build.mjs  ->  ./dist  (published on the gh-pages branch)
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist');
const BASE = '/3d-tutorial/';
const SITE = 'https://iodiot.github.io';
const series = JSON.parse(fs.readFileSync(path.join(ROOT, 'series.json'), 'utf8'));

const md = new MarkdownIt({
  html: true, linkify: true, typographer: false,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code class="language-${lang}">${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
});
const defaultLink = md.renderer.rules.link_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  const href = tokens[idx].attrGet('href') || '';
  if (/^https?:\/\//.test(href) && !href.startsWith(SITE)) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener');
  }
  return defaultLink(tokens, idx, opts, env, self);
};

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^(\w+):\s*(.*)$/); if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) v = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    else if (v.startsWith('"') && v.endsWith('"')) v = JSON.parse(v);
    meta[mm[1]] = v;
  }
  return { ...meta, part: Number(meta.part), tags: meta.tags || [], body: m[2] };
}

const parts = fs.readdirSync(path.join(ROOT, 'posts')).filter(f => f.endsWith('.md'))
  .map(f => parse(path.join(ROOT, 'posts', f))).sort((a, b) => a.part - b.part);
const live = new Set(parts.map(p => p.part));
const planned = series.planned.filter(p => !live.has(p.part));

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate = iso => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${MONTHS[m - 1]} ${d}, ${y}`; };

function layout({ title, desc, body, canonical, image = `${BASE}images/social-card.png` }) {
  const ogImage = /^https?:/.test(image) ? image : `${SITE}${image}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230b0d12'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='16' text-anchor='middle' fill='%237cf5d4'%3E3D%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${BASE}assets/style.css?v=2">
</head>
<body>
<div class="bg"></div>
<header class="nav">
  <a class="brand" href="/">Mike Smahin</a>
  <nav>
    <a href="${BASE}">3D Tutorial</a>
    <a href="/blog/">Blog</a>
    <a href="/">Portfolio</a>
  </nav>
</header>
<main>
${body}
</main>
<footer class="foot"><p>© Mike Smahin · <a href="https://github.com/iodiot/3d-tutorial" target="_blank" rel="noopener">source on GitHub</a></p></footer>
<script data-goatcounter="https://iodiot.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}

// "Support the series" block, shared by the index and every part.
// Platforms come from series.json -> support.platforms: { name, url, label, image?, imageWidth?, imageHeight? }.
// With an image the platform renders as a static image link, otherwise as a text button.
function supportBlock() {
  const s = series.support;
  if (!s || !s.platforms?.length) return '';
  const links = s.platforms.map(pl => {
    const label = pl.label || pl.name;
    const inner = pl.image
      ? `<img src="${esc(pl.image)}" alt="${esc(label)}" style="height:${pl.imageHeight || 50}px;width:${pl.imageWidth ? pl.imageWidth + 'px' : 'auto'}" loading="lazy">`
      : esc(label);
    return `<a class="${pl.image ? 'support-img' : 'btn'}" href="${esc(pl.url)}" target="_blank" rel="noopener" title="${esc(pl.name)}">${inner}</a>`;
  }).join('');
  return `<aside class="support" aria-label="Support the series">
  <p>${esc(s.text)}</p>
  <div class="support-links">${links}</div>
</aside>`;
}

const tagList = p => `<ul class="tags"><li class="topic">part ${p.part}</li>${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;

function indexPage() {
  const liveItems = parts.map(p => `
  <li class="part live">
    <span class="num">${String(p.part).padStart(2, '0')}</span>
    <div>
      <a class="part-title" href="${BASE}${p.slug}/">${esc(p.short || p.title)}</a>
      <p class="part-about">${esc(p.description || '')}</p>
      <p class="part-links"><time datetime="${p.date.slice(0, 10)}">${fmtDate(p.date)}</time> · <a href="${BASE}${p.slug}/">Read</a>${p.demo ? ` · <a href="${BASE}${p.demo}">Live demo</a>` : ''}</p>
    </div>
  </li>`).join('');
  const nextItems = planned.map((p, i) => `
  <li class="part soon">
    <span class="num">${String(p.part).padStart(2, '0')}</span>
    <div>
      <span class="part-title">${esc(p.title)}</span> <span class="badge">${i === 0 ? 'coming next' : 'planned'}</span>
      <p class="part-about">${esc(p.about)}</p>
    </div>
  </li>`).join('');
  return layout({
    title: `${series.title} — a 3D tutorial by Mike Smahin`, desc: series.lead, canonical: BASE,
    body: `<section class="hero">
  <p class="eyebrow">Tutorial series · ${parts.length} of ${parts.length + planned.length} parts published</p>
  <h1>${esc(series.title)}</h1>
  <p class="sub">${esc(series.subtitle)}</p>
  <p class="lead">${esc(series.lead)}</p>
  ${parts[0] ? `<div class="links"><a class="btn primary" href="${BASE}${parts[0].slug}/">Start with part 1 →</a>${parts[0].demo ? `<a class="btn" href="${BASE}${parts[0].demo}">Live demo</a>` : ''}<a class="btn" href="https://github.com/iodiot/3d-tutorial" target="_blank" rel="noopener">Source on GitHub</a></div>` : ''}
</section>
<section class="list">
  <ol class="parts">${liveItems}${nextItems}</ol>
</section>
${supportBlock()}`,
  });
}

function partPage(p) {
  const html = md.render(p.body);
  const prev = parts.find(x => x.part === p.part - 1), next = parts.find(x => x.part === p.part + 1);
  const soon = !next && planned.find(x => x.part === p.part + 1);
  const pager = `<nav class="pager">${prev ? `<a href="${BASE}${prev.slug}/">← Part ${prev.part}: ${esc(prev.short || prev.title)}</a>` : `<a href="${BASE}">← All parts</a>`}${next ? `<a href="${BASE}${next.slug}/">Part ${next.part}: ${esc(next.short || next.title)} →</a>` : soon ? `<span class="soon-next">Next: Part ${soon.part}, ${esc(soon.title)} (coming soon)</span>` : '<span></span>'}</nav>`;
  return layout({
    title: `${p.title} — Mike Smahin`, desc: p.description || p.title, canonical: `${BASE}${p.slug}/`, image: p.image || undefined,
    body: `<article class="post">
  <header class="post-head">
    <p class="eyebrow"><a href="${BASE}">← ${esc(series.title)} · all parts</a></p>
    <h1>${esc(p.title)}</h1>
    <p class="meta-line"><time datetime="${p.date.slice(0, 10)}">${fmtDate(p.date)}</time> · Mike Smahin</p>
    ${tagList(p)}
  </header>
  <div class="prose">${html}</div>
  ${pager}
  ${supportBlock()}
</article>`,
  });
}

function write(rel, content) {
  const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content);
}
fs.rmSync(OUT, { recursive: true, force: true });
write('index.html', indexPage());
for (const p of parts) write(`${p.slug}/index.html`, partPage(p));
fs.cpSync(path.join(ROOT, 'images'), path.join(OUT, 'images'), { recursive: true });
fs.cpSync(path.join(ROOT, 'demos'), path.join(OUT, 'demos'), { recursive: true });
fs.cpSync(path.join(ROOT, 'site/style.css'), path.join(OUT, 'assets/style.css'));
write('.nojekyll', '');
write('404.html', layout({ title: 'Not found', desc: '', canonical: BASE, body: `<section class="hero"><h1>404</h1><p class="lead"><a href="${BASE}">Back to the tutorial</a></p></section>` }));
console.log(`built ${parts.length} part(s), ${planned.length} planned -> dist/`);
