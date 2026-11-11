---
title: "JavaScript异步编程"
pubDatetime: 2019-07-20T20:45:48+08:00
modDatetime: 2019-08-07T19:56:08+08:00
description: "一、回调函数为了实现JS中的异步操作，主要的解决方案就是利用回调函数的方法 回调函数是先调用，后定义的方式使用的。 如： 123456789function d1(interval,callback)&#123; setTimeout(()=>&#123; callback('hello world') &#125;,"
categories: ["前端基础"]
tags: ["JavaScript","ES6"]
---

<a id="一、回调函数"></a>

## 一、回调函数

为了实现JS中的异步操作，主要的解决方案就是利用回调函数的方法

回调函数是先调用，后定义的方式使用的。

如：

```javascript
function d1(interval,callback){
    setTimeout(()=>{
        callback('hello world')
    },interval)
}

d1(1000,data=>{
    console.log(data)
})
```

<a id="二、Promise"></a>

## 二、Promise

`Promise`是ES6封装的对象,`Promise`对象可以化解回调地狱`callback hell`的情况。

`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

一般用`resolve`来表示`fulfilled`

<a id="1-构造函数"></a>

#### 1.构造函数

```javascript
new Promise((resolve,reject)=>{
    异步方法
})
```

注意：

-   构造函数中的函数参数会立即开始执行。也就是说，构造Promise时，异步方法就会开始执行。
-   resolve,reject是两个回调方法

<a id="2-then"></a>

#### 2.then

最重要的API(then)。then是当构造函数中异步方法执行完毕后，才会执行的方法。then中的第一个参数就是构造函数中resolve的回调，第二个参数就是构造函数中的reject的回调：

```javascript
then((data)=>{
    
},(err)=>{
    
})
```

<a id="3-then的链式调用"></a>

#### 3.then的链式调用

then可以链式调用，并且可以解决回调地域的问题。如果then中resolve的回调中有retuen Promise1对象，则当前then执行后返回一个Promise1对象。如：

封装一个fs模块下的readFileAPI:

```javascript
let pFileR=(FilePath)=>{
    return  new Promise((resolve,reject)=>{
    fs.readFile(FilePath,'utf8',(err,data)=>{
        if(err){
            reject(err)
        }
        resolve(data)
    })
})
}

pFileR('./a.txt')
.then((data)=>{
    console.log(data)
    return pFileR('./b.txt')
})
.then((data)=>{
    console.log(data)
    return pFileR('./c.txt')
})
.then((data)=>{
    console.log(data)
})
```

<a id="4-应用场景"></a>

#### 4.应用场景

建立一个表单，给定用户名，得到该用户的年龄，和所有的工作信息，其中默认选择的是该用户选择的工作。

```text
{
    User:[
      	id:Number,
      	name:String,
        job:Number
    ],
    Jobs:[
        id:Number,
        name:String
    ]
}
```

显然，我们要先根据ID请求对应User的完整数据，然后请求所有的工作信息，根据User下job的id,设置选中的工作。所以我们要先请求User,再请求Jobs。

安装：

-   `json-server`
-   `http-server`
-   `jquery`
-   `art-template`

html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="" id="user_form">
       
    </form>
    <script type="text/template" id="tpl">
        <div>
                <label for="">用户名</label>
                <input type="text" value="{{ user.name }}">
            </div>
            <div>
                <label for="">年龄</label>
                <input type="text" value="{{ user.age }}">
            </div>
            <div>
                <label for="">职业</label>
                <select name="" id="">
                    {{ each jobs }}
                    {{ if user.id === $value.id }}
                        <option value="{{ $value.id }}" selected>{{ $value.name }}</option>
                    {{ else }}
                        <option value="{{ $value.id }}">{{ $value.name }}</option>
                    {{ /if }}
                    {{ /each }}
                </select>
            </div>
    </script>
    <script src="./node_modules/art-template/lib/template-web.js"></script>
    <script src="./node_modules/jquery/dist/jquery.js"></script>
    <script>
        let get = (url,callback)=>{
            var oReq = new XMLHttpRequest()
            oReq.onload = ()=>{
                callback(oReq.responseText)
            }
            oReq.open("get",url,true)
            oReq.send()
        }
    </script>
</body>
</html>
```

<a id="4-1-回调嵌套的方法"></a>

##### 4.1 回调嵌套的方法

```javascript
get('http://localhost:3000/user/2',(userData)=>{
    get('http://localhost:3000/jobs',(jobsData)=>{
        let sH = template('tpl',{
            user:JSON.parse(userData),
            jobs:JSON.parse(jobsData)            
        })
        document.getElementById('user_form').innerHTML = sH  
    })    
})
```

<a id="4-2-封装Promise对象的get"></a>

##### 4.2 封装Promise对象的get

```javascript
let pGet = (url)=>{
            return new Promise((resolve)=>{
                get(url,(data)=>{
                    resolve(data)
                })
            })
        }

        let data = {}
        pGet('http://localhost:3000/user/2')
        .then((userData)=>{
            data.user = JSON.parse(userData)
            return pGet('http://localhost:3000/jobs')
        })
        .then((jobsData)=>{
            data.jobs = JSON.parse(jobsData)
            let sH = template('tpl',data)
            document.getElementById('user_form').innerHTML = sH
        })
```

<a id="4-3-调用jquery封装好的-get方法"></a>

##### 4.3 调用jquery封装好的$.get方法

```javascript
let data = {}
$.get('http://localhost:3000/user/3')
        .then((user)=>{
            data.user = user
            return $.get(`http://localhost:3000/jobs/$`)
        })
        .then((jobs)=>{
            data.jobs = jobs
            let sH = template('tpl',data)
            document.getElementById('user_form').innerHTML = sH
        })
```

<a id="三、async函数"></a>

## 三、async函数

<a id="3-1-async函数使用环境"></a>

#### 3.1 async函数使用环境

-   `async`函数是为了实现对异步操作的控制而产生的。本身和`Generator`函数没有区别，实际上就是后者的语法糖。`async`函数配合`await`来代替`Gennerator`函数的`*`和`yield`。如果不了解`Gennerator`函数的话没有关系。直接从更好用的`async`开始学习。
-   以前对于异步操作的继发执行（比如：异步A执行完之后在执行异步B）都是使用函数嵌套的方式，后来上文中介绍的`Promise`对象，现在有了ES7中正式提出的`async`函数来控制异步函数。

<a id="3-2-async函数使用方式"></a>

#### 3.2 async函数使用方式

-   在`function`前加入`async`声明该方法为async函数
-   在函数体中，在异步操作前加入`await`用以声明，一般该异步操作应当为`Promise`对象化的
-   在一个`await`声明后的异步操作时，整个`async`函数将会暂停向下执行，直到当前异步操作执行完毕后才会向下执行，但是当该异步操作出错时，`async`函数将会结束整个函数，并返回一个`reject(err)`的`Promise`对象。如果要实现，当异步出错时，也继续向下执行`async`函数的话，需要配合`try..catch`或`.catch()`使用。
-   `async`返回一个默认的`promise`对象，如果return一个`promise`对象的话则返回该`Promise`对象，如果return一个其他数据的的话则返回一个`Promise`对象，且该对象的`resolve`的参数为当时return的数据

<a id="3-3-async函数实现异步继发执行"></a>

#### 3.3 async函数实现异步继发执行

```javascript
function sleep(interval) {
    return new Promise(resolve => {
      setTimeout(resolve, interval);
    })
  }
  
  // 用法
  async function one2FiveInAsync() {
    for(let i = 1; i <= 5; i++) {
        await sleep(1000);  //实际上就是暂停one2FiveInAsync函数1s后再继续执行
      	console.log(i); 
    }
  }
  
  one2FiveInAsync()

/*
	result:
	after 1s : 1
	....
	after 5s : 5
*/
```

<a id="3-4-实现异步出错处理"></a>

#### 3.4 实现异步出错处理

<a id="3-4-1-使用try-catch捕获异常"></a>

##### 3.4.1 使用try-catch捕获异常

在下面这个例子中，放在同一个try中的当遇到一个await定义的异步后将被catch捕获异常，然后跳出try,继续向下执行，当遇到没有在try中的await定义的异步出错时，退出了整个async函数

```javascript
//try..catch方式
async function a(){
	try{
		await Promise.reject('出错啦1')
		await Promise.reject('出错啦2')
	}catch(e){
		console.log(e)
	}
	await Promise.reject('出错啦3')
	await Promise.resolve('成功啦')
}

a().then(d=>{console.log(d)})
.catch(e=>{console.log(e)})

/*
	result:
		出错啦1
		出错啦3
*/
```

<a id="3-4-2-使用catch方法捕获异常"></a>

##### 3.4.2 使用catch方法捕获异常

```javascript
async function a(){
    await Promise.reject('出错啦！1').catch(e=>{console.log(e)})
    await Promise.reject('出错啦！2').catch(e=>{console.log(e)})
    await Promise.resolve('成功啦')
}
a()
.then(d=>{console.log(d)})
.catch(e=>{console.log(e)})

/*
	result:
		出错啦！1
		出错啦！2
		undefined
*/
```

<a id="3-5-实现异步的类并发执行"></a>

#### 3.5 实现异步的类并发执行

类并发执行，即非继发执行。在async中实现类并发，可以配合Promise.all方法使用

```javascript
await Promise.all([Example1(),Example2()])
```
