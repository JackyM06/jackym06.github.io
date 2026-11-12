---
title: "Node.js基本语法"
pubDatetime: 2019-07-16T09:59:16+08:00
modDatetime: 2019-08-07T20:06:10+08:00
description: "从 HTTP 服务入手，介绍 Node.js 的文件读写、路径处理与模块加载。"
categories: ["服务端开发"]
tags: ["Node.js","Common.js"]
---

<a id="一、创建一个Node-js应用"></a>

## 一、创建一个Node.js应用

1.  加载http核心模块

```javascript
var http = require("http")
```

2.  创建一个Web服务器，返回一个server实例

```javascript
var server = http.createServer()
```

3.  服务端接收到来自客户端的请求时”request”执行回调函数
    -   参数：
        -   request 请求对象（客户端向本服务端发送的请求对象）
        -   response 响应对象（本服务端向客户端发送的响应对象）

```javascript
server.on("request",function(request,response){

​    console.log("接受到请求了！url："+request.url)

​    console.log("请求的Ip"+response.socket.remoteAddress+":"+response.socket.remotePort)

​    var str=request.url

​    var mes

​    if(str === "/"){

​        response.end("Index page")

​    }else if(str == "/login"){
​        response.end("登录")
​    }else if(str == "/haha"){   
​        response.end("哈哈")
​    }
​   // 响应内容只能是二进制数据或字符串
​    if(str == "/product"){
​        var product=[
​            {
​                name: "apple",
​                price: 3500
​            },
​            {
​                name: "banana",
​                price: 5330
​            },
​            {
​                name: "banana",
​                price: 5330
​            }
​        ]
​        response.end(JSON.stringify(product))
​    }
})
```

4.  绑定端口号，开启服务器

```javascript
server.listen(80,function(){

​    console.log("服务器启动成功了，访问http://127.0.0.1:3000/ 进行访问")

})
```

<a id="二、Node-js常用核心模块"></a>

## 二、Node.js常用核心模块

除了我们刚刚用的`http`模块，Node.js中还有一些比较常用的模块

<a id="1-fs模块"></a>

### 1\. fs模块

<a id="1-1-加载文件系统模块"></a>

#### 1.1 加载文件系统模块

```javascript
var fs=require('fs')//加载fs核心模块
```

<a id="1-2-文件读操作"></a>

#### 1.2 文件读操作

-   参数
    -   读文件的文件名
    -   回调函数
        -   err : 出错信息，读文件出错时返回错误对象。否则返回Null。
        -   data : 读出的数据，默认为二进制数据。

```javascript
fs.readFile('readme.txt',function(err,data){
    if(err){
        return console.log('file read err!')
    }
    console.log(data.toString)
})
```

<a id="1-3-文件写操作"></a>

#### 1.3 文件写操作

-   参数
    -   将数据写入的目标文件
    -   要写入的数据
    -   回调函数
        -   err

```javascript
fs.writeFile('output.txt','i am data',function(err){
    if(err){
        return console.log('file write err!')
    }
    console.log('success!')
})
```

<a id="2-Path模块"></a>

### 2\. Path模块

这是Node.js提供的路径模块。主要是为了解析路径

-   `path.basename(path[,ext])`获得当前path中的最终文件名（带后缀），如参数加入ext，则获得不带路径的结果
-   `path.dirname(path)`获得path中的路径解析结果
-   `path.extname(path)` 获得path中最终文件的后缀
-   `path.join([...paths])`将paths合并为一个路径
-   `path.parse(path)` 将path解析为一个路径信息对象比如

```javascript
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

<a id="三、Node-js中的其他成员"></a>

## 三、Node.js中的其他成员

再Node.js中的每个模块除了都有`require`、`exports`等模块相关的API外，还有两个特殊的成员：

-   `__dirname`可以用来获得当前文件模块的绝对路径
-   `__filename`可以用来获取当前文件的绝对路径

<a id="三、Node-js面向模块编程思想"></a>

## 三、Node.js面向模块编程思想

<a id="1-万物基于模块"></a>

#### 1.万物基于模块

在Node.js中每个Js文件都是一个模块，都可以被其他的模块用`require('路径+文件名')` 的方式引用。模块分为Node.js自带的系统模块和第三方模块，以及用户自定义的模块

<a id="2-模块的接口"></a>

#### 2.模块的接口

模块的接口利用每个模块本身所提供的`module.exports` 或`exports`对象即可,关于它们之间的区别会在后面说明自己的看法。

<a id="3-引用自定义模块举例"></a>

#### 3.引用自定义模块举例

1.  引用系统模块

```javascript
let http = require('http')
```

2.  引用第三方模块
    
    1.  在终端或控制台中输入`npm install 包名` 命令 的方式来安装第三方模块到当前目录的node\_mudoles文件夹中
        
    2.  像引用系统模块那样引用第三方模块即可，例如
        
        ```javascript
        npm install  art-template
        
        let temp = require('art-template')
        ```
        
3.  引用用户自定义模块
    
    1.  文件a
        
        ```javascript
        let a = require('./b.js')
        console.log(a.add(3,10)) //30
        ```
        
    2.  文件b
        
        ```javascript
        exports.add = (x,y)=>a+b
        //或
        mudole.exports.add = (x,y)=>a+b
        ```
        
    3.  关于`exports` 与`mudoles.exports`之间的关系
        
        首先，每个模块都有一个`module`对象，他可能是这样的：
        
        ```javascript
        Module {
          id: '.',
          exports: { test: 5, add: [Function], readFile: [Function] },
          parent: null,
          filename: 'D:\\Fontend\\Node.js学习\\简单的模块化\\c.js',
          loaded: false,
          children: [],
          paths:
           [ 'D:\\Fontend\\Node.js学习\\简单的模块化\\node_modules',
             'D:\\Fontend\\Node.js学习\\node_modules',
             'D:\\Fontend\\node_modules',
             'D:\\node_modules' ] }
        ```
        
        它包括的一些关于模块本身的信息，其中就包含有`exports`。所以，`exports`与`module.exports`在默认情况下是等价的。为了便于挂载接口，所以每个模块可以直接用`exports`，但是实际上模块向引用它的上层返回的是`module.exports`这个对象
        

<a id="4-关于Node-js对于模块的查找"></a>

#### 4.关于Node.js对于模块的查找

实际上在运行过程中，如果要加载第三方模块，系统默认会先在当前文件目录下的node\_module文件夹下按名寻找对应的第三方模块。如果没有，则在向上一层目录下的node\_module文件夹下按名寻找，依此类推，直到计算机盘符下的根目录下的node\_module文件夹。

<a id="四、总结"></a>

## 四、总结

在有一定JavaScript语言的基础上学习原生Node.js相对容易，但是对于很多操作来说，过程还是过于繁琐，所以，接下来将在此基础上学习更加简洁高效的Express框架。

个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象`err`（如果没有错误，该参数就是`null`）？

原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。
