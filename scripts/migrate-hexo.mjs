/** Recover the complete Hexo publication from its last commit; no live site needed. */
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const baseCommit = "408f565";
const readOriginal = file => execFileSync("git", ["show", `${baseCommit}:${file}`], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
const files = execFileSync("git", ["ls-tree", "-rz", "--name-only", baseCommit], { encoding: "utf8" }).split("\0").filter(Boolean);
const articles = files.filter(file => /^20\d\d\/\d\d\/\d\d\/[^/]+\/index\.html$/.test(file));
const sourceMarkdown = files.filter(file => /^content\/posts\/.*\.md$/.test(file)).map(file => ({ file, source: readOriginal(file) }));
const taxonomy = { tags: {}, categories: {} };
const manifest = { baseCommit, theme: "AstroPaper 7.1.0", articles: [], redirects: {} };
const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-", emDelimiter: "*" });
td.use(gfm);
td.keep(["video", "audio", "iframe", "figure"]);
// GFM pipes delimit table cells even inside inline code.
td.addRule("tableCellPipes", {
  filter: ["td", "th"],
  replacement: (content, node) => `${node === node.parentNode.firstChild ? "| " : " "}${content.replace(/\|/g, "\\|").replace(/\n+/g, "<br>")} |`,
});
// Keep emphasis whose punctuation would violate CommonMark delimiter rules.
td.addRule("inlineFormatting", {
  filter: ["strong", "b", "em", "i"],
  replacement: (_content, node) => node.outerHTML,
});
td.addRule("legacyHeading", {
  filter: node => /^H[1-6]$/.test(node.nodeName),
  replacement: (content, node) => {
    const anchor = node.id ? `<a id="${node.id.replaceAll('"', "&quot;")}"></a>\n\n` : "";
    return `\n\n${anchor}${"#".repeat(Math.max(2, Number(node.nodeName[1])))} ${content.trim()}\n\n`;
  },
});
td.addRule("fencedCode", {
  filter: node => node.nodeName === "PRE",
  replacement: (_content, node) => {
    const code = node.querySelector("code") ?? node;
    const lang = code.className.match(/language-([^\s]+)/)?.[1] ?? "text";
    const text = code.textContent.replace(/\n$/, "");
    const fence = "`".repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map(m => m[0].length + 1)));
    return `\n\n${fence}${lang}\n${text}\n${fence}\n\n`;
  },
});
const normalizeURL = (url, route) => {
  if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;
  const resolved = new URL(url, `https://jackym06.github.io${route}`);
  return decodeURI(resolved.pathname) + resolved.search + resolved.hash;
};
const frontmatter = data => "---\n" + Object.entries(data).map(([key, value]) => `${key}: ${key.endsWith("Datetime") ? value : JSON.stringify(value)}`).join("\n") + "\n---\n\n";

for (const file of articles) {
  const $ = load(readOriginal(file));
  const body = $(".post-body").first();
  if (!body.length) throw new Error(`Missing article body: ${file}`);
  const route = "/" + file.replace(/index\.html$/, "");
  const title = $("h1.post-title").text().trim();
  const pubDatetime = $("time[itemprop~='datePublished']").attr("datetime");
  const modDatetime = $("time[itemprop='dateModified']").attr("datetime");
  const tags = $(".post-tags a").map((_, el) => {
    const name = $(el).text().trim(); taxonomy.tags[name] = decodeURIComponent($(el).attr("href").split("/").filter(Boolean).at(-1)); return name;
  }).get();
  const categories = $(".post-category a").map((_, el) => {
    const name = $(el).text().trim(); taxonomy.categories[name] = decodeURIComponent($(el).attr("href").split("/").filter(Boolean).at(-1)); return name;
  }).get();
  body.find("a.headerlink, #more, script").remove();
  const source = sourceMarkdown.find(({ source }) => source.includes(`# ${title}\n`));
  let markdown;
  if (source) {
    markdown = source.source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").replace(/^\s*# [^\n]+\n/, "").trim();
    markdown = markdown.replace(/(?:\.\.\/)+(images|media|uploads)\//g, "/$1/");
    const headingIDs = new Map();
    const headingKey = value => value.replace(/<[^>]+>|\*\*|`/g, "").replace(/\s/g, "");
    body.find("h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]").each((_, el) => {
      const key = headingKey($(el).text());
      headingIDs.set(key, [...(headingIDs.get(key) ?? []), $(el).attr("id")]);
    });
    let fence = null;
    markdown = markdown.split("\n").map(line => {
      const match = line.match(/^\s*(`{3,}|~{3,})/);
      if (match) { fence = fence ? null : match[1]; return line; }
      if (fence) return line;
      const heading = line.match(/^#{2,6}\s+(.+)$/)?.[1];
      const id = heading && headingIDs.get(headingKey(heading))?.shift();
      return id ? `<a id="${id}"></a>\n\n${line}` : line;
    }).join("\n");
  } else {
    body.find("figure.highlight, div.highlight").each((_, el) => {
      const figure = $(el);
      const code = figure.find("td.code pre").first();
      if (!code.length) throw new Error(`Unrecognised code block: ${file}`);
      code.find("br").replaceWith("\n");
      const lang = (figure.attr("class") ?? "").split(/\s+/).find(c => c !== "highlight") ?? "text";
      const alias = { "c++": "cpp", "c#": "csharp", htmlbars: "html", plain: "text", js: "javascript", dust: "html", angelscript: "text", pgsql: "sql", xquery: "text", arduino: "cpp", xl: "text", gauss: "text", gradle: "groovy", zephir: "php", "jboss-cli": "text" };
      const pre = $("<pre></pre>").append($("<code></code>").attr("class", `language-${alias[lang] ?? lang}`).text(code.text()));
      figure.replaceWith(pre);
    });
    body.find("[src], a[href], video[poster]").each((_, el) => {
      for (const attr of ["src", "href", "poster"]) {
        const value = $(el).attr(attr);
        if (value) $(el).attr(attr, normalizeURL(value, route));
      }
    });
    markdown = td.turndown(body.html()).trim();
  }
  const description = ($('meta[name="description"]').attr("content") || body.find("p").first().text() || title).replace(/\s+/g, " ").trim().slice(0, 160);
  const data = { title, pubDatetime, ...(modDatetime && modDatetime !== pubDatetime ? { modDatetime } : {}), description, categories, tags, ...(route.includes("/2026/") ? { featured: true } : {}) };
  const destination = `content/posts/${file.replace(/\/index\.html$/, ".md")}`;
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, frontmatter(data) + markdown + "\n");
  manifest.articles.push({ title, route, file: destination, source: source?.file ?? file, recoveredFromHTML: !source });
}

const about = load(readOriginal("about/index.html"));
about("a.headerlink").remove();
const aboutText = td.turndown(about(".post-body").first().html() || "Jiankai\n\nJiankai's Blog")
  .replace("目前，虽然是支持手机查看博客的，但是会隐藏一些内容，例如目录等。在未来，分类与标签以及功能将会越来越丰富！", "这里收录从 2018 年开始的技术文章，支持按分类、标签和时间浏览，也可以搜索全文。")
  .replace("基于 [Hexo](https://github.com/hexojs/hexo)–>[NexT](https://github.com/theme-next/hexo-theme-next) & [Github pages](https://pages.github.com/)搭建", "当前基于 [Astro](https://astro.build/)、[AstroPaper](https://github.com/satnaing/astro-paper) 与 [GitHub Pages](https://pages.github.com/)搭建。最初使用 Hexo 与 NexT，旧文章的网址继续保留。");
await writeFile("src/content/pages/about.md", frontmatter({ title: "关于", description: "关于 Jiankai 和 Jiankai's Blog" }) + aboutText + "\n");

// Keep old list/pagination bookmarks working after the publishing engine changes.
for (const file of files.filter(file => /^(?:page|archives|tags|categories)\/.*\/index\.html$/.test(file))) {
  const route = "/" + file.replace(/index\.html$/, "");
  if (route.startsWith("/page/")) manifest.redirects[route] = route.replace("/page/", "/posts/");
  else if (route.startsWith("/archives/") && route.includes("/page/")) manifest.redirects[route] = route.split("page/")[0];
  else if (route.includes("/page/")) manifest.redirects[route] = route.split("page/")[0];
  else if (route.startsWith("/categories/")) {
    const match = readOriginal(file).match(/http-equiv="refresh"[^>]+content="[^;]+;\s*url=([^"]+)/i);
    if (match) manifest.redirects[route] = decodeURI(match[1]);
  }
}
await mkdir("src/data", { recursive: true });
await writeFile("src/data/taxonomy.json", JSON.stringify(taxonomy, null, 2) + "\n");
await writeFile("content/migration.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Imported ${articles.length} articles: ${manifest.articles.filter(a => !a.recoveredFromHTML).length} Markdown + ${manifest.articles.filter(a => a.recoveredFromHTML).length} recovered HTML.`);
