# Maoli 博客

个人技术博客，使用 [Astro](https://astro.build/) 和 [AstroPaper 7.1.0](https://github.com/satnaing/astro-paper) 构建，部署目标为 GitHub Pages。

支持中文排版、明暗主题、全文搜索、分类、标签、时间归档、文章目录、图片放大与 RSS。完整保留原有 40 篇文章的日期型网址。

## 本地开发

需要 Node.js 24 和 pnpm（版本由 `package.json` 的 `packageManager` 固定）。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

打开开发服务输出的本地网址。完整检查与生产预览：

```sh
pnpm build
pnpm preview
```

`pnpm build` 包含 Astro 类型检查、静态构建和 Pagefind 全文索引生成。开发模式下的搜索依赖最近一次构建的索引。

## 内容与资源

- 文章：`content/posts/YYYY/MM/DD/文章路径.md`，目录和文件名共同构成原文章网址。
- 图片、动画、视频：`public/images/`、`public/media/`，文章中使用 `/images/...`、`/media/...` 引用。
- 个人介绍：`src/content/pages/about.md`。
- 站点信息和主题功能：`astro-paper.config.ts`。
- 中文界面：`src/i18n/lang/zh-CN.ts`。

新文章示例（正文从二级标题开始，页面会自动显示标题）：

```md
---
title: "文章标题"
pubDatetime: 2026-11-11T16:00:00+08:00
description: "文章摘要"
categories: ["前端工程"]
tags: ["SSG", "Vue.js"]
featured: false
draft: false
---

## 正文小节

文章内容。
```

图片和字体无需访问外部服务即可构建。历史文章中已有的外链图片继续保留原地址；旧 Valine / LeanCloud 评论和访问统计暂未接入新主题。

## GitHub Pages

工作流位于 `.github/workflows/deploy.yml`：PR 执行构建；只有 `master` 分支执行 Pages 发布。试验分支不会自动上线。

将来上线时，在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**，再将迁移分支合入 `master`。无需提交 `dist/` 或生成的 HTML。站点地址在 `astro-paper.config.ts` 中配置；自定义域名还需配置 DNS 和 `public/CNAME`。

## Hexo 迁移记录

迁移基线为 `408f565`，完整清单和旧列表页跳转记录见 `content/migration.json`。40 篇文章中，3 篇沿用已有 Markdown，37 篇从原 HTML 正文恢复为 Markdown。保留了发布时间、修改时间、分类、标签、代码块、媒体以及旧标题锚点。

一次性迁移验收：

```sh
pnpm build
pnpm verify:migration
```

验收脚本将生成页面与 Git 历史中的原站逐篇对比。它用于确认这次迁移的完整性，日常修改文章不需要运行，也不作为后续写作的 CI 限制。`scripts/migrate-hexo.mjs` 是一次性恢复工具，会覆盖迁移的文章源文件；日常发布只需要写文章和构建。

原站生成文件保存在 Git 历史中，新分支改为维护源稿与主题源码。主题遵循仓库中的 MIT 许可证。

## 提交规范

代码提交遵循 Conventional Commits 规范，格式为：

```plaintext
<type>(<scope>): <subject>
```

### type

`type` 表示此次修改的类别，可选值如下：

| type | 说明 |
| --- | --- |
| feat | 新功能（feature） |
| fix | 修补 bug |
| docs | 文档（documentation） |
| style | 格式调整，不影响代码运行 |
| refactor | 重构，既不是新增功能，也不是修补 bug |
| test | 增加测试 |
| chore | 构建过程或辅助工具的变动 |
| perf | 性能优化 |
| revert | 回滚 |

### scope

`scope` 为子项目名称，按主要改动目录填写。本仓库可使用 `content`、`categories`、`tags`、`images`、`media` 等目录名；涉及多个目录时，选择此次改动的主要范围。

### subject

`subject` 应使用中文，简洁地说明此次改动的内容。

提交示例：

```plaintext
feat(content): 收录音视频技术文章
fix(categories): 修复旧分类链接跳转
docs(content): 补充文章维护说明
```
