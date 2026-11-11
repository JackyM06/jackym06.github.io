import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jackym06.github.io/",
    title: "Jiankai's Blog",
    description: "Jiankai 的个人博客，记录前端工程、音视频、AI 与学习随想。",
    author: "Jiankai",
    profile: "https://github.com/JackyM06",
    ogImage: "og.png",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 6,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/JackyM06", linkTitle: "Jiankai 的 GitHub" },
  ],
  shareLinks: [
  ],
});
