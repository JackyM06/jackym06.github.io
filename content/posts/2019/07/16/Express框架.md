---
title: "Express框架"
pubDatetime: 2019-07-16T10:03:27+08:00
modDatetime: 2019-08-07T20:04:06+08:00
description: "一、引入Express框架1.安装并加载Express模块1npm install express -g 1234let express = require('express')let app = express() //相当于http.createServer()module.exports = app"
categories: ["服务端开发"]
tags: ["Node.js","Express框架"]
---

<a id="一、引入Express框架"></a>

## 一、引入Express框架

<a id="1-安装并加载Express模块"></a>

#### 1.安装并加载Express模块

```cmd
npm install express -g
```

```javascript
let express = require('express')
let app = express() //相当于http.createServer()

module.exports = app
```

<a id="2-编写响应和绑定端口号"></a>

#### 2.编写响应和绑定端口号

在Express框架下，不再需要更改响应头，其具有自动识别并更改响应头的能力。

```javascript
app.get('/',(req,res)=>{
    console.log(req.url)
    res.send('i am erxpress')
})
app.listen(3000,()=>{
    console.log('Server is running~')
})
```

<a id="3-设置静态空间"></a>

#### 3.设置静态空间

在被设置为静态空间的文件夹下的文件可以被终端直接访问,例如：

```javascript
/*
	功能：为在当前文件夹下的public文件夹设置为静态空间
		可以直接以./public/*的方式打开对应文件
*/
app.use('/public/',express.static('./public'))
```

<a id="4-在express中使用art-template"></a>

#### 4.在express中使用art-template

使用`express-art-tempalte`虽然不需要再载入`art-template`,但是前者是基于后者的，所以使用前者必须安装后者。

安装`express-art-template`模块后，使用方法如下：

```javascript
app.engine('html',require('express-art-template'))

app.get('/',(req,res)=>{
    res.render('文件名.html',模板json)
})
```

注意

-   render中的文件无需加入路径，默认访问当前文件夹下的`views`文件夹下的对应文件，如需更改可以使用：
    
    ```javascript
    app.set('views',更改的默认目录+'/')
    ```
    

<a id="5-在express中解析post请求的数据"></a>

#### 5.在express中解析post请求的数据

需要先安装中间件-`body-parser`,然后根据以下命令配置

```javascript
let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json)

app.post('/',(req,res)=>{
    console.log(req.body)
})
```

<a id="6-构建路由"></a>

#### 6.构建路由

```javascript
router = express.Router()
router.get('/',(req,res)=>{})
router.post('/',(req,res)=>{})
app.use(router)
```

<a id="7-构建项目链"></a>

#### 7.构建项目链

1.  构建入口函数
2.  设计路由
3.  设计API
4.  具体实现

```javascript
app.js <--- router.js <--- APIname.js
```

<a id="二、Session"></a>

## 二、Session

`express-session中间件`

配置:

```javascript
let session = require('express-session')

app.use(session({
  secret: 'keyboard cat',  //配置加密字符串。为了增加安全性，再加密后再加上该字符串进行一次加密
  resave: false,
  saveUninitialized: true  //无论是否使用session,默认分配一个sid（钥匙）
}))


app.get('/',(req,res)=>{
    req.session.xx = xxx
})
```

<a id="三、关于Express中的中间件"></a>

## 三、关于Express中的[中间件](http://expressjs.com/en/guide/using-middleware.html)

<a id="3-1-中间件"></a>

#### 3.1 中间件

中间件`middleware`就是一个为你增加功能的方法。配置好对应的中间件之后，我们就能使用对应的功能了。在`Node.js`中，中间件一般都是处理请求的`req,res`

<a id="3-2-Express中间件按关心内容分类"></a>

#### 3.2 Express中间件按关心内容分类

| 中间件 | 参数 | 功能 | 类型 |
| --- | --- | --- | --- |
| use | (req,res,next)=>{} | 不论收到来自客户端的任何请求，都会执行参数里的方法。next()代表自动执行下一个中间件 | 不关心请求路径和请求方式的中间件 |
| use | ‘/xxx’,(req,res,next)=>{} | 当请求路径以第一个参数开头时，则执行第二个参数的方法 | 关心请求路径但不关心请求方式的中间件 |
| get、post | ‘/xxx’,(req,res,next)=>{} | 当对应get、post请求的请求路径为对应的第一个参数时执行 | 严格按照请求路径并关心请求方式的中间件 |

<a id="3-3-中间件匹配策略"></a>

#### 3.3 中间件匹配策略

-   如果匹配到第一个符合条件的中间件
    -   如果没有next则结束匹配
    -   如果执行了next（）则继续匹配下一个符合条件的中间件
-   如果没有匹配到，则继续向下找满足条件的中间件

<a id="3-4-使用中间件配置404和全局错误处理"></a>

#### 3.4 使用中间件配置404和全局错误处理

```javascript
//example...
app.get('/',(req,res,next)=>{
    fs.read('ab.txt',(err,data)=>{
        if(err){
            return next(err)
        }
    })
})
//example...


//配置404页面
app.use((req,res)=>{
    res.render('404.html')
})

//配置全局错误处理
app.use((err,req,res)=>{
    res.status(500).send(err.message)
    //或者
    res.status(500).json({
        ....
    })
})
```
