# Maoli 博客

个人技术博客的静态站点，包含文章页面、分类、标签和归档。文章源稿位于 `content/posts/`，配图和视频分别位于 `images/`、`media/`。

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
