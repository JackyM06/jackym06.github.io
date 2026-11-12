---
title: "Node.js通过cron模块实现定时执行脚本"
pubDatetime: 2020-05-04T22:00:27+08:00
description: "以每天统计网站访问量为例，介绍在 Node.js 中配置 cron 定时任务并执行脚本的方法。"
categories: ["服务端开发"]
tags: ["Node.js","cron"]
---

<a id="Node-js通过cron模块实现定时执行脚本"></a>

## Node.js通过cron模块实现定时执行脚本

> 实际开发中，可能会由定时执行某段代码的需求。下面分享如何使用cron在Node.js中如何实现该需求

<a id="思路"></a>

### 思路

当前项目遇到了一个需求，每天的<strong>0时0分0秒</strong>统计前一天的网站访问量，并将该数据保存到一张表中。暂时不考虑数据库操作部分，只考虑如何实现<strong>定时执行某段脚本</strong>。

由于使用Node.js开发，一拍脑袋刚开始想到的是使用`setInterval`：每秒执行一次，判断当前时间是否为<strong>0时0分0秒</strong>，如果是则执行脚本。但是后来考虑到这样做实在是太不美观了，所以使用了一款第三方包`cron`。

<strong><code>cron</code></strong>就是一款可让您按计划执行<strong>某些任务</strong>的工具。

<a id="配置"></a>

### 配置

<strong>安装</strong>

```powershell
npm install cron --save
```

<a id="使用"></a>

### 使用

引入 cron

```javascript
const CronJob = require('cron').CronJob
```

建立定时任务

```javascript
new CronJob('0 0 0 * * *',function(){ //每天0：0：0执行
    定时任务
},null, true)
```

<strong>计时规则</strong>

计时规则就是 `CronJob`中的第一个字符串参数，该字符串由5个空格隔开的6个数字或字符构成。由左向右分别代表的含义为：

-   秒：0-59
-   分钟：0-59
-   时间：0-23
-   每月的日期：1-31
-   月：0-11（1月-12月）
-   星期几：0-6（周六）

<strong>如果该值为*则代表不限制某个时间</strong>

<strong>例如</strong>

`0 0 0 * * *`则代表每一天的0:0:0执行；

`* * * * * *`则代表每一秒都执行；

`1 * * * * *`则代表每分钟的第一秒执行；

`1 * * 1 * *`则代表每月的第一天 的 每分钟的第一秒执行；
