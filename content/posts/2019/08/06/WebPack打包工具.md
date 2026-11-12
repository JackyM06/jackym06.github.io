---
title: "WebPack打包工具"
pubDatetime: 2019-08-06T20:02:33+08:00
modDatetime: 2019-08-07T20:10:44+08:00
description: "结合模块化示例，介绍 webpack 的打包配置、Loader 与插件，以及样式、图片和 Vue 文件的处理"
categories: ["前端工程"]
tags: ["Vue.js","VueCli","webpack"]
---

<a id="一、模块化开发"></a>

## 一、模块化开发

<a id="1-1-关于模块化"></a>

### 1.1 关于模块化

模块化是现在Web前端开发的趋势，它可以解决以前Js多文件协同开发会出现的命名问题等等。

再模块化下，每一个Js文件都是独立的文件，每个独立的js文件可以导入和导出数据。

像在Node.js环境下用CommonJS开发流程一样，ES6也制定了一些关于模块化开发的标准以保证他们可以再浏览器上运行。

<a id="1-2-ES6下的模块化"></a>

### 1.2 ES6下的模块化

在ES6制定的标准中，声明一个Js为模块化文件需要在该js文件在被HTML当中引用时加入`type = "module"`

```html
<script src = "./src/test.js" type="module"></script>
```

在Js文件中导入一个js模块

```javascript
import {a,b} from './src/test.js'
//或
import value from './src/test/js'
```

导出模块

```javascript
export var a = 5
export var b = 4
//或
export default {
    a:5,
    b:4
}
```

<a id="二、WebPack工具"></a>

## 二、WebPack工具

webpack是一个打包工具。何谓打包，就是将你的编写的模块化的Js文件联系起来，编译并压缩合成为能成被对应环境识别的文件。

现在主流的打包工具就是WebPack，配合前端框架来用简直开心。

<a id="2-1-WebPack的安装"></a>

### 2.1 WebPack的安装

WebPack是基于Node.js环境运行的，所以使用npm即可完成下载

```shell
npm i webpack@3.6.0 -g
```

<strong>现在最新版是4.x.x,但是因为3和4版本变化略大，为了便于学习，所以下载3.6.0版本。</strong>

<a id="2-2-WebPack打包JavaScript"></a>

### 2.2 WebPack打包JavaScript

webpack打包Js有好几种方法，最常用的是利用配置文件来打包。

<a id="2-2-1-命令行打包"></a>

#### 2.2.1 命令行打包

```shell
webpack 入口模块 ./dist/bundle.js
```

<a id="2-2-2-配置文件打包"></a>

#### 2.2.2 配置文件打包

很显然，我们并不想每次都利用命令行来打包。甚至于如果有多个入口和多个出口的话每次打包都过于麻烦。所以在4.x.x版本的webpack中上面的方法已经被摒弃。

在项目文件夹中新建一个`webpack.config.js`文件，作为webpack打包配置文件。

一个最基本的配置文件：

```javascript
module.exports = {
    entry='入口',
    output:{
    	path:'绝对路径',
    	filename:'文件名'
	}
}
```

<a id="2-3-Loader预处理打包CSS"></a>

### 2.3 Loader预处理打包CSS

`Webpack`本身只支持Js文件的打包，但是在实际开发中常常需要对css等等其他文件一并进行打包。所以`Webpack`有一个Loader扩展，使用对应的Loader就可以完成对css文件的打包。

-   安装

```shell
npm i style-loader css-loader -s-d
```

-   使用

在配置文件导出对象中加入

```javascript
module:{
    rules:[
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        }
    ]
}
```

这样，你就可以使用`require('./css/main.css')`的方式来引用`css`文件了。最终我们仍然只需引用`bundle。js`一个文件再HTML中即可。

需要说明的是，`style-loader`是用于将css内容编译并挂载到Dom上，而`css-loader`只是负责使css文件能够通过模块化导入的方式导入到js文件当中。而且use数组中对多个`loader`的顺序有严格的要求。所以按照逻辑来说，应当是先`css-loader`再`style-loader`。但是webpack比较特殊，他是从右向左逐个使用`loader`。

<a id="2-4-处理图片文件"></a>

### 2.4 处理图片文件

在Css中我们可能会使用到以url方式引用的图片文件，但是在打包过程中将无法识别图片，所以Loader拓展给出了解决方案。

1.  `url-loader`

安装好`url-loader`后，写入以下规则即可完成对图片的打包。

其中，`limit`是一个阈值，如果图片文件小于该阈值，将使用`base64`的方式来将图片打包为一个字符串/

如果大于该阈值则自动调用`file-loader`来进行打包，如果未安装，则报错

```javascript
{
    test:/\.(jpg|png|jpeg|gif)$/,
    use:[
        {
            loader:'url-loader',
            options:{
                limit:4192,
            }
        }
    ]
}
```

2.  `file-loader`

安装后，再使用上面的代码则可以将大于阈值的图片打包，且生成文件名为32位哈希值存放在`/dist/`文件夹下。

在开发过程中，`html`页面可能并未放在dist目录下，所以可能存在引用图片URL路径问题。只需要在`webpack`配置文件中的`output`下加入`publicPath:'/dist/'`即可

如果还需要对打包后的图片存放到`dist`下的指定目录中，且对文件名有要求，则可以这样做

```javascript
{
    test:/\.(jpg|png|jpeg|gif)$/,
    use:[
        {
            loader:'url-loader',
            options:{
                limit:4192,
                //img/存放到dist下的img目录下
                //[name]原图片名称
                //[hash:8]默认为32位哈希值，过长，设置位8位
                //[ext]原图片文件名后缀
                name:'img/[name].[hash:8].[ext]'
            }
        }
    ]
}
```

<a id="三、Vue结合WebPack使用方案"></a>

## 三、Vue结合WebPack使用方案

Vue的组件化开发固然很强，但是代码写起来过于繁杂。所以在学习VueCli之前，先了解如何结合WebPack来组件化开发Vue项目

<a id="3-1-Vue文件"></a>

### 3.1 Vue文件

建立`.vue`文件，我们可以这样写

```text
<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
export default {
    name:'App',
    data(){
        return {
            message:"hello adfasfdvue"
        }
    }
}
</script>

<style>
	h1{
  	  color: yellow
	}
</style>
```

<a id="3-2-配置对应的Loader"></a>

### 3.2 配置对应的Loader

-   安装
    
    1.  `vue-loader` 能够导入.vue文件
    2.  `vue-template-compiler`能够识别处理`template`标签
    
    ```shell
    npm i vue-loader@13.0.0 vue-template-compiler -s-d
    ```
    
-   配置`webpack.config`的`rule`
    
    ```javascript
    {
        test:/\.vue$/,
        use:['vue-loader']
    }
    ```
    
-   挂载一个组件只需要
    
    ```javascript
    import app from 'app.vue'
    ```
    

<a id="四、WebPack高级开发"></a>

## 四、WebPack高级开发

<a id="4-1-Plugin插件"></a>

### 4.1 Plugin插件

`Plugin`是webPack的扩展插件，webPack本身也自带了一些插件。

`plugin`挂载在配置导出对象中的`plugins`数组内。

<a id="4-1-2-版权声明"></a>

#### 4.1.2 版权声明

在实际开发中需要在源码中写入你的版权和开源协议等等信息，可以使用webPack自带的`BannerPlugin`插件

```javascript
const webPack = require('webpack')
module.exports = {
    entry:'xxx',
    ....,
    plugins:[
        new webPack.BannerPlugin('版权归MJK所有')
    ]
}
```

<a id="4-1-2-生成打包目录下的-html"></a>

#### 4.1.2 生成打包目录下的`.html`

实际开发中，需要把在根目录下的`index.html`放到`dist`目录下，且自动引用打包后的出口文件。所以有一个可以使用原html模板的自动生成过去的插件`html-webpack-plugin`

安装后的使用方法

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
....
plugins:[
    new HtmlWebpackPlugin({
       //可设置参数，我是以项目根目录下的index.html作为生成模板，
     template:'index.html'   
    })
]
```

<a id="4-1-3-压缩打包后的Js文件"></a>

#### 4.1.3 压缩打包后的Js文件

最终发布项目时，需要将Js代码进行压缩。`uglifyjs-webpack-plugin`插件可以完成该功能

配置方法

```javascript
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
.....
    plugins:[
        new UglifyJsWebpackPlugin()
    ]
```

<a id="4-2-webpack-dev-server"></a>

### 4.2 `webpack-dev-server`

和`nodemon`、`live-server`这类工具一样，当项目文件发生改动时，就自动刷新。

安装后，在webpack的配置文件中进行配置

```javascript
{
    entry:'xxx',
    ....,    
    devServer:{
        contentBase:'./dist',  //目标目录
        inline:true,    //实时刷新
 		port:3000 //端口号
    }
}
```

需要在项目文件中的`package.json`中的`scripts`中添加：

```javascript
"scripts": {
...
   "dev": "webpack-dev-server --open"
 }
```

在命令行中输入如下命令即可运行

```shell
npm run dev
```

<a id="4-3-分离webpack配置文件"></a>

### 4.3 分离webpack配置文件

实际开发中，开发时和发布时需要执行不同的操作。此时我们不能一把把所有的配置文件都写在`webpack.config.js`中，而是需要进行分离。

安装能够合并webpack代码的工具——`webpack-meger`

<strong>Example</strong>

建立`build`目录,建立以下文件

```shell
base.config.js //所有时候都要用到的配置文件
build.config.js  //发布时需要使用
dev.config.js    //开发时需要使用
```

`dev.config.js`

```javascript
const WebpackMerge = require('webpack-merge')
const baseConfig = require('./base.config')

module.exports = WebpackMerge(baseConfig,{
    //开发时需要用
    devServer:{
        contentBase:'./dist',
        inline:true
    }
})
```

`build.config.js`

```javascript
const WebpackMerge = require('webpack-merge')
const baseConfig = require('./base.config')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
 
module.exports = WebpackMerge(baseConfig,{
    //发布时需要使用
    plugins:[
        new UglifyJsWebpackPlugin()
    ]
})
```

最后，修改下`package.json`中的脚本。

```text
"scripts": {
  ....,
  "build": "webpack --config ./build/build.config.js",
  "dev": "webpack-dev-server --open --config ./build/dev.config.js"
},
```

在`npm run build`和`npm run dev`命令下就会使用不同的配置文件。
