---
title: "vue-clipboard2实现复制功能"
pubDatetime: 2020-05-04T12:29:59+08:00
description: "vue-clipboard2实现复制功能 在Vue中通过该模块能够实现 将内容复制到剪贴板的功能"
categories: ["前端应用"]
tags: ["Vue.js","vue-clipboard2"]
---

<a id="vue-clipboard2实现复制功能"></a>

## vue-clipboard2实现复制功能

> 在Vue中通过该模块能够实现 将内容复制到剪贴板的功能

<strong>安装</strong>

```powershell
npm i vue-clipboard2 --save
```

<strong>在<code>main.js</code>中注册</strong>

```javascript
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
```

<strong>使用</strong>

1.  vue-clipboard2提供自定义指令使用（默认点击事件执行复制）

<strong>绑定要复制的内容</strong>

```javascript
v-clipboard:copy="url"
```

<strong>复制成功后执行的hook</strong>

```javascript
v-clipboard:success="cpySuccess" //cpySuccess为一个自定义方法
```

<strong>复制失败后执行的hook</strong>

```javascript
v-clipboard:error="cpyError" //cpyError为一个自定义方法
```

2.  vue-clipboard2提供使用$copyText方法

```javascript
{
    methods:{
        copy(){
            this.$copyText(String).then(res=>{
                ..复制成功
            },err=>{
                ..复制失败
            })
        }
    }
}
```
