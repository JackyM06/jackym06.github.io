---
title: "VueCli构建工具"
pubDatetime: 2019-08-07T19:35:35+08:00
description: "介绍 Vue CLI 2 与 3 的项目创建方式，并说明运行时构建与完整构建的区别"
categories: ["前端工程"]
tags: ["Vue.js","VueCli","webpack"]
---

<a id="一、VueCli构建工具"></a>

## 一、VueCli构建工具

如果我们所有的项目都像原来那样配置，难免过于繁琐。所以Vue官方提供了一个构建工具——`VueCli`来快速构建一个工具 。他可以帮助我们快速安装webPack的插件、`loader`等等配套的包。以及帮我们自动化构建配置目录等等。

<a id="二、VueCli-2-x"></a>

## 二、VueCli 2.x

虽然在2018年8月尤雨溪发布了`VueCli 3`，但是由于现在还有大量的项目都是通过2.x.x版本构建的。所以在此需要记录一下`VueCli 2`的一些特性。

-   安装
    
    ```shell
    npm i @vue/cli -g
    ```
    
    虽然是3版本，如果想像2版本那样构建，需要使用他们提供的一个桥接工具
    
    ```shell
    npm i @vue/cli-init -g
    ```
    
-   构建一个Vue项目(2版本)
    
    ```shell
    vue init webpack 项目名称
    ```
    
-   接下来要你选择一些关键项
    
    ```shell
    ? Project name (test)   ##填写项目文件名称
    
    ? Project description (A Vue.js project)  ## 填写项目介绍
    
    ? Author Jiankai <your-email@example.com>   ## 填写作者信息，默认读取全局git中的信息
    
    ? Vue build  ## 选择一个构建方式，初学者建议选择第一个，后文有介绍这两种方式的区别
    	> Runtime + Compiler: recommended for most users
      	  Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML) are ONLY allowed in .vue files - render functions are required elsewhere
      
    ? Install vue-router? (Y/n) n   ## 是否加载Vue-router
    
    ? Use ESLint to lint your code? No   ## 是否使用一种js代码标准
    
    ? Setup unit tests No   ##是否安装单元测试
    
    ? Setup e2e tests with Nightwatch? (Y/n) n   ##是否安装端对端测试
    
    ? Should we run `npm install` for you after the project has been created? (recommended) (Use arrow keys)   ##选择一种包管理工具
    > Yes, use NPM
      Yes, use Yarn
      No, I will handle that myself
    ```
    
-   生成后的目录
    
    ```shell
    │  .babelrc
    │  .editorconfig
    │  .gitignore
    │  .postcssrc.js
    │  index.html
    │  package.json
    │  README.md
    │
    ├─build
    │      build.js
    │      check-versions.js
    │      logo.png
    │      utils.js
    │      vue-loader.conf.js
    │      webpack.base.conf.js
    │      webpack.dev.conf.js
    │      webpack.prod.conf.js
    │
    ├─config
    │      dev.env.js
    │      index.js
    │      prod.env.js
    │
    ├─src
    │  │  App.vue
    │  │  main.js
    │  │
    │  ├─assets
    │  │      logo.png
    │  │
    │  └─components
    │          HelloWorld.vue
    │
    └─static
            .gitkeep
    ```
    

-   构建完成😄

<a id="三、VueCli-3-x"></a>

## 三、VueCli 3.x

`VueCli 3`在原来基础上，减去了`build`文件夹等等，修改`static`文件夹为`public`。官方的话来说就是0配置，那么就让我们来瞅一瞅怎么用的吧

因为上面我们已经安装过了，所以我们只需要换一种构建方式即可。

-   构建
    
    ```shell
    vue create 项目名称
    ```
    
-   选择关键项
    
    ```shell
    ? Please pick a preset: ##选择你的配置方案，一般选择手动
      default (babel, eslint)
    > Manually select features
    
    ? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to invert selection) ##选择需要的关键项
    >(*) Babel
     ( ) TypeScript
     ( ) Progressive Web App (PWA) Support
     ( ) Router
     ( ) Vuex
     ( ) CSS Pre-processors
     (*) Linter / Formatter
     ( ) Unit Testing
     ( ) E2E Testing
     
     
     ? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.?
     ##你要将的一些Babel配置信息保存到哪里，可以选择保存到Package.json，或自定义文件中去
     
     ? Save this as a preset for future projects? (y/N)y
     ##是否将你的这些配置信息保存下来，在未来能够使用
    ```
    
    <strong>注：如果要删除你所保存的个人配置信息项 ，你可以在C盘用户目录下的.vuerc文件中管理</strong>
    
    `VueCli 3`开始,还提供了一个`vue ui`命令，可以让你在可视化工具上进行修改你的项目配置
    
-   文件目录
    
    ```shell
    │  .browserslistrc
    │  .gitignore
    │  babel.config.js
    │  package-lock.json
    │  package.json
    │  postcss.config.js
    │  README.md
    │
    ├─public
    │      favicon.ico
    │      index.html
    │
    └─src
        │  App.vue
        │  main.js
        │
        ├─assets
        │      logo.png
        │
        └─components
                HelloWorld.vue
    ```
    
    <strong>注意：VueCli3构建的默认是Runtime-only方式的，可以在可视化工具中修改</strong>
    

<a id="四、关于Runtime方式的说明"></a>

## 四、关于Runtime方式的说明

<a id="4-1-问题说明"></a>

### 4.1 问题说明

在`VueCli 2`中构建Vue项目时，有一个让你选择`runtime-compiler` or `runtime-only`。那这两者有什么区别呢？

先看一下分别使用两种方式构建的`main.js`

-   `runtime-compiler`

```javascript
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```

-   `runtime-only`

```javascript
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h=>h(App)
})
```

-   render使用方式

```javascript
render: function(createElement){
  // 1.普通用法 createElement(标签名，{属性}，[内容或者嵌套使用createElement])
  return createElement(
    'h2',
    {class:'box'},
    [
      '我是魔鬼',
      createElement('p',{class:'pp'},['hello'])
    ])
 // 2.真正的用法 createElement(导入的组件)
    return createElement(App)
}
```

<a id="4-2-两种方式的区别"></a>

### 4.2 两种方式的区别

显然，前者是用我们熟悉的方式引用的App组件，而后者是以`render`函数的方式出现。这到底是怎么回事呢？

我们首先需要看一下Vue程序的过程

首先将`template`解析为`ats`\-抽象语法树，然后使用vue实例中的render方法将ats编译为虚拟节点，然后建立`vDom`\-虚拟Dom树，最终把`vDom`转换为我们在浏览器上所能看到的`ui`。

简单来说就是：

`template`\-> `ats`\->`render`\->`vDom`\->`ui`

那么,对于`runtime-compiler`方式来说，就是完整的用上述流程运行的。

而对于`runtime-only`来说，他是直接从`render`开始(`render`\->`vDom`\->`ui`)。显然这种方式的性能更高。

<a id="4-3-最后的问题"></a>

### 4.3 最后的问题

也许各位也会有一个疑问，那再子组件中挂载其他子组件岂不是都需要用render方法来做了？

我们来看看App.vue的内容

```text
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

显然，在导出对象中我们并没有使用`render`方法来挂载子组件，这是为撒子呢🤔

看过我上一篇关于`webpack`的文章的童鞋应该知道，我们在使用webpack导入vue文件使安装了两个东西。

其中一个是为了支持.vue文件导入的`vue-loader`，还有一个是`vue-template-compiler`。而在VueCli构建中，这些它已经自动为我们安装了。

它能够在导出过程中将`template`编译为一个`ast`，我们只需要按原来的方式来挂载组件，最后形成一颗抽象语法树，在main.js中我们只需要使用`render`方法就可以。
