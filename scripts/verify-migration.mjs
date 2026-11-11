/** Compare the built site against the original publication, not the converter. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, access, readdir } from "node:fs/promises";
import { load } from "cheerio";

const manifest = JSON.parse(await readFile("content/migration.json", "utf8"));
const baselineFiles = new Set(execFileSync("git", ["ls-tree", "-rz", "--name-only", manifest.baseCommit], { encoding: "utf8" }).split("\0"));
const compact = value => value.normalize("NFC").replace(/\s/g, "");
const errors = [];
const existingMissingAssets = new Set();
const original = file => execFileSync("git", ["show", `${manifest.baseCommit}:${file}`], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
const assetPath = (value, route) => {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return null;
  return decodeURIComponent(new URL(value, `https://jackym06.github.io${route}`).pathname).slice(1);
};

assert.equal(manifest.articles.length, 40, "The migration inventory must include every published article");
const sourceFiles = (await readdir("content/posts", { recursive: true })).filter(file => /\.mdx?$/.test(file));
assert.equal(sourceFiles.length, 40, "The content collection must contain exactly one source per article");

for (const article of manifest.articles) {
  const old = load(original(article.route.slice(1) + "index.html"));
  const oldBody = old(".post-body").first();
  oldBody.find("td.gutter, a.headerlink, #more, script").remove();
  oldBody.find("br").replaceWith("\n");
  let built;
  try { built = load(await readFile(`dist${article.route}index.html`, "utf8")); }
  catch { errors.push(`${article.route}: missing page at the original permalink`); continue; }
  const body = built("#article");
  if (built("main h1").text().trim() !== article.title) errors.push(`${article.route}: incorrect title`);
  if (built('link[rel="canonical"]').attr("href") !== new URL(article.route, "https://jackym06.github.io").href) errors.push(`${article.route}: incorrect canonical URL`);

  if (article.recoveredFromHTML && compact(oldBody.text()) !== compact(body.text())) {
    const before = compact(oldBody.text()), after = compact(body.text());
    let offset = 0; while (before[offset] === after[offset] && offset < Math.min(before.length, after.length)) offset++;
    errors.push(`${article.route}: changed body text at ${offset}: ${JSON.stringify(before.slice(offset, offset + 65))} -> ${JSON.stringify(after.slice(offset, offset + 65))}`);
  }
  const oldCode = oldBody.find("pre").map((_, el) => compact(old(el).text())).get();
  const newCode = body.find("pre code").map((_, el) => compact(built(el).text())).get();
  if (JSON.stringify(oldCode) !== JSON.stringify(newCode)) errors.push(`${article.route}: code blocks differ (${oldCode.length} before, ${newCode.length} after)`);

  const ids = body.find("[id]").map((_, el) => built(el).attr("id")).get();
  if (new Set(ids).size !== ids.length) errors.push(`${article.route}: duplicate content anchors`);
  for (const id of oldBody.find("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]").map((_, el) => old(el).attr("id")).get()) {
    if (!ids.includes(id)) errors.push(`${article.route}: lost heading anchor #${id}`);
  }
  const oldAssets = new Set(oldBody.find("[src],video[poster]").map((_, el) => assetPath(old(el).attr("src") ?? old(el).attr("poster"), article.route)).get());
  for (const value of oldAssets) if (!baselineFiles.has(value)) existingMissingAssets.add(value);
  const newAssets = body.find("[src],video[poster]").map((_, el) => built(el).attr("src") ?? built(el).attr("poster")).get();
  for (const value of newAssets) {
    const asset = assetPath(value, article.route);
    if (!asset) continue;
    try { await access(`dist/${asset}`); }
    catch { if (!existingMissingAssets.has(asset)) errors.push(`${article.route}: missing asset /${asset}`); }
  }
  // Every original image, animation, and video must still appear in its article.
  const normalizeAsset = value => value && decodeURI(new URL(value, `https://jackym06.github.io${article.route}`).href);
  const renderedAssets = new Set(newAssets.map(normalizeAsset));
  oldBody.find("[src],video[poster]").each((_, el) => {
    const value = old(el).attr("src") ?? old(el).attr("poster");
    if (!renderedAssets.has(normalizeAsset(value))) errors.push(`${article.route}: lost media ${value}`);
  });
}

for (const [route, target] of Object.entries(manifest.redirects)) {
  const html = await readFile(`dist${route}index.html`, "utf8");
  if (!html.includes(target) && !html.includes(encodeURI(target))) errors.push(`${route}: missing legacy redirect`);
  try { await access(`dist${target}index.html`); } catch { errors.push(`${route}: redirect target missing: ${target}`); }
}
const rss = load(await readFile("dist/rss.xml", "utf8"), { xmlMode: true });
assert.equal(rss("item").length, 40, "RSS must list every article");
await access("dist/pagefind/pagefind.js");
for (const page of ["index.html", "posts/index.html", "categories/index.html", "tags/index.html", "archives/index.html", "search/index.html", "about/index.html", "404.html"]) await access(`dist/${page}`);

if (existingMissingAssets.size) console.log("Existing missing local resources:", [...existingMissingAssets]);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`Verified ${manifest.articles.length} original article URLs, body text, code blocks, anchors, media, redirects, RSS and search index.`);
