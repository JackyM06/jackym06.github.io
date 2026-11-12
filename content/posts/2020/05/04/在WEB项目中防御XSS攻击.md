---
title: "在WEB项目中防御XSS攻击"
pubDatetime: 2020-05-04T12:32:00+08:00
description: "结合输入内容被当作代码执行的场景，介绍 XSS 风险，以及使用 xss 模块过滤内容的做法"
categories: ["前端工程"]
tags: ["xss"]
---

<a id="在WEB项目中防御XSS攻击"></a>

## 在WEB项目中防御XSS攻击

> 所谓XSS攻击就是开发者在网站开发时提供了用户的输入入口中输入可执行代码或标记语言（当然本意可能只是想让用户输入文本），并且该内容能够直接在网页中执行（例如在VUE中提供的v-html指令）时，攻击者利用该漏洞，注入一些恶意代码攻击该网站的用户。

<a id="有效的XSS攻击可能造成的后果"></a>

### 有效的XSS攻击可能造成的后果

一次有效的XSS攻击轻则导致网页乱码（通过注入HTML），重则为了搜集用户信息，攻击者甚至会在有漏洞的程序中插入 JavaScript、VBScript、 ActiveX或Flash以欺骗用户。一旦得手，他们可以盗取用户帐户，修改用户设置，盗取/污染cookie，做虚假广告等。

所以说防御XSS的WEB安全最重要的事。

<a id="防御XSS攻击"></a>

### 防御XSS攻击

XSS攻击的两个充分条件是网站提供输入接口，并且该内容将直接被浏览器执行。所以在对用户输入的内容直接放到浏览器中去执行前，需要过滤掉一些关键词，例如HTML的标签、JS的执行语句。目前这些工作都有比较成熟的工具来做了

<a id="使用XSS模块"></a>

### 使用XSS模块

`xss`是用于过滤用户输入以防止XSS攻击的模块。

<strong>安装</strong>

```text
npm i xss -save
```

<strong>使用</strong>

```javascript
import xss from 'xss' // const xss = require('xss')
xss(要过滤的字符串) //返回过滤后的结果
```

xss模块提供过滤白名单

参考 [https://github.com/leizongmin/js-xss/blob/master/README.zh.md](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)

<a id="实际开发的建议"></a>

### 实际开发的建议

笔者也是在实际开发过程中有幸了解到xss模块以解决我的问题。而在使用中，我的做法是当用户将内容在上传到服务端后，服务端在保存到数据库前将用户内容使用`xss`模块过滤一遍。而用户请求该内容到前端渲染前再用户端再使用xss模块过滤一遍。这样做可以很大程度上防止xss攻击。
