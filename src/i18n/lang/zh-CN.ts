import type { UIStrings } from "../types";

export default {
  nav: { home: "首页", posts: "文章", tags: "标签", about: "关于", archives: "归档", search: "搜索" },
  post: {
    publishedAt: "发布于", updatedAt: "更新于", sharePostIntro: "分享文章：",
    sharePostOn: "分享到 {{platform}}", sharePostViaEmail: "通过邮件分享",
    tagLabel: "标签", backToTop: "回到顶部", tableOfContents: "文章目录",
    goBack: "返回", editPage: "编辑文章", previousPost: "上一篇", nextPost: "下一篇",
  },
  pagination: { prev: "上一页", next: "下一页", page: "页" },
  home: { socialLinks: "找到我", featured: "精选文章", recentPosts: "近期文章", allPosts: "全部文章" },
  footer: { copyright: "版权所有", allRightsReserved: "保留所有权利" },
  pages: {
    tagTitle: "标签", tagDesc: "包含此标签的文章", tagsTitle: "标签", tagsDesc: "从关键词发现文章",
    postsTitle: "全部文章", postsDesc: "按发布时间记录学习与探索",
    archivesTitle: "文章归档", archivesDesc: "按年份和月份回看所有文章",
    searchTitle: "搜索", searchDesc: "搜索文章标题与正文",
  },
  a11y: {
    skipToContent: "跳转到正文", skipTableOfContents: "跳过文章目录", openMenu: "展开菜单",
    closeMenu: "收起菜单", toggleTheme: "切换明暗主题", searchPlaceholder: "搜索文章…",
    noResults: "没有找到相关内容", goToPreviousPage: "前往上一页", goToNextPage: "前往下一页",
  },
  notFound: { title: "404 · 页面不存在", message: "这个页面暂时找不到了", goHome: "返回首页" },
} satisfies UIStrings;
