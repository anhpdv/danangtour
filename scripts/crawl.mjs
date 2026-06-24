import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'web', 'content', 'pages');
const RAW_DIR = path.join(ROOT, 'web', 'content', 'raw');
const BASE = 'https://danangfantasticity.com';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function urlToSlug(url) {
  const u = new URL(url);
  let slug = decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g, '');
  if (!slug) return 'home';
  const id = u.searchParams.get('id');
  if (id) slug = `${slug}--id-${id}`;
  return slug.replace(/[/\\?%*:|"<>]/g, '-');
}

function extractBetween(html, start, end) {
  const s = html.indexOf(start);
  if (s < 0) return '';
  const e = html.indexOf(end, s + start.length);
  if (e < 0) return '';
  return html.substring(s, e + end.length);
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, 'i');
  return html.match(re2)?.[1] || '';
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '';
}

function extractMainContent(html) {
  const mainStart = html.indexOf('<main');
  if (mainStart < 0) return '';
  const mainOpenEnd = html.indexOf('>', mainStart) + 1;
  const footerStart = html.indexOf('<footer', mainOpenEnd);
  if (footerStart < 0) return html.substring(mainStart);
  return html.substring(mainStart, footerStart) + '</main>';
}

function extractHeader(html) {
  const start = html.indexOf('<header');
  const end = html.indexOf('</header>');
  if (start < 0 || end < 0) return '';
  return html.substring(start, end + 9);
}

function extractFooter(html) {
  const start = html.indexOf('<footer');
  const end = html.indexOf('</footer>');
  if (start < 0 || end < 0) return '';
  return html.substring(start, end + 9);
}

function extractImages(html) {
  const imgs = new Set();
  const re = /src="(https:\/\/danangfantasticity\.com\/wp-content\/uploads\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html))) imgs.add(m[1]);
  return [...imgs];
}

function extractCssLinks(html) {
  const links = [];
  const re = /href="(\/_next\/static\/chunks\/[^"]+\.css)"/g;
  let m;
  while ((m = re.exec(html))) links.push(m[1]);
  return [...new Set(links)];
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DanangTourClone/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function discoverUrls() {
  const urls = new Set();
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    const xml = await readFile(sitemapPath, 'utf8');
    const re = /<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(xml))) urls.add(m[1].trim());
  }

  // Discover extra internal links from homepage
  try {
    const home = await fetchPage(BASE);
    const linkRe = /href="(\/(?!_next)[^"#?][^"]*)"/g;
    let m;
    while ((m = linkRe.exec(home))) {
      const href = m[1];
      if (!href.startsWith('/')) continue;
      urls.add(`${BASE}${href}`);
    }
  } catch {}

  return [...urls];
}

async function crawlPage(url) {
  const slug = urlToSlug(url);
  const html = await fetchPage(url);
  const isHome = slug === 'home';

  let mainHtml = extractMainContent(html);
  if (isHome) {
    const heroEnd = html.indexOf('<!--$?-->', html.indexOf('<main'));
    if (heroEnd > 0) {
      const mainStart = html.indexOf('<main');
      mainHtml = html.substring(mainStart, heroEnd);
    }
    const sections = [];
    for (let i = 0; i <= 10; i++) {
      const pattern = `id="S:${i}"`;
      const idx = html.indexOf(pattern);
      if (idx < 0) continue;
      const start = html.indexOf('>', idx) + 1;
      const end = html.indexOf('</div><script>', start);
      if (end > start) sections.push(html.substring(start, end));
    }
    mainHtml += sections.join('\n') + '</main>';
  }

  const page = {
    slug,
    url,
    title: extractTitle(html),
    description: extractMeta(html, 'description') || extractMeta(html, 'og:description'),
    ogImage: extractMeta(html, 'og:image'),
    locale: url.includes('/vi/') ? 'vi' : html.includes('lang="vi"') ? 'vi' : 'en',
    headerHtml: extractHeader(html),
    footerHtml: extractFooter(html),
    mainHtml: mainHtml
      .replace(/ hidden=""/g, '')
      .replace(/data-nimg="[^"]*"/g, '')
      .replace(/<!--\$[^-]*-->/g, ''),
    images: extractImages(html),
    cssLinks: extractCssLinks(html),
    crawledAt: new Date().toISOString(),
  };

  await writeFile(path.join(OUT_DIR, `${slug}.json`), JSON.stringify(page, null, 2), 'utf8');
  await writeFile(path.join(RAW_DIR, `${slug}.html`), html, 'utf8');
  return page;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });

  const urls = await discoverUrls();
  console.log(`Crawling ${urls.length} URLs...`);

  const index = [];
  const errors = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const slug = urlToSlug(url);
    try {
      console.log(`[${i + 1}/${urls.length}] ${slug}`);
      const page = await crawlPage(url);
      index.push({ slug: page.slug, url: page.url, title: page.title, locale: page.locale });
      await delay(300);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      errors.push({ url, error: err.message });
    }
  }

  await writeFile(path.join(ROOT, 'web', 'content', 'index.json'), JSON.stringify({ pages: index, errors, total: index.length }, null, 2), 'utf8');
  console.log(`Done: ${index.length} pages, ${errors.length} errors`);
}

main().catch(console.error);
