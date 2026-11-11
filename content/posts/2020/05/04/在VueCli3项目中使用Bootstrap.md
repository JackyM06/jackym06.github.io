---
title: "在VueCli3项目中使用Bootstrap"
pubDatetime: 2020-05-04T12:31:42+08:00
description: "在VueCli3项目中使用Bootsrap 在Vue开发中，为了实现响应式效果加入了Bootstrap框架"
categories: ["前端应用"]
tags: ["Vue.js","Bootstrap"]
---

<a id="在VueCli3项目中使用Bootsrap"></a>

## 在VueCli3项目中使用Bootsrap

> 在Vue开发中，为了实现响应式效果加入了Bootstrap框架

<strong>安装</strong>

```powershell
npm i bootstrap jquery popper.js --save
```

<strong>配置</strong>

在项目根目录下新建或修改`vue.config.js`

```javascript
const webpack = require("webpack");
module.exports={
    configureWebpack:{
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
              })
        ]
    }
}
```

<strong>引入</strong>

在`main.js`中引入

```javascript
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import 'jquery'
```

<strong>使用</strong>

在组件模板中，可以像常规开发那样使用bootstrap

```javascript
<template>
    <div class="container">
        <div class="row mt-0 mt-md-2">
            <div class="col-12 col-lg-9 px-0">
            </div>
            <div class="Right d-none d-lg-block col-lg-3  pl-2 p-0">
            </div>
        </div>
    </div>
</template>

<script>

    export default {
      
    }
</script>

<style lang="scss" scoped>

</style>
```
