---
title: "Axios网络框架"
pubDatetime: 2019-09-07T17:40:52+08:00
description: "一、axios网络框架 包含了对XMLHttpRequest浏览器的支持 能够在node.js环境中发起http请求 支持Promise API 支持拦截请求和响应 支持转换请求和响应数据 支持取消请求 支持自动转换JSON数据 axios更适合在Vue框架中使用，如果使用ajax需要引用整个jquery，而一个jqu"
categories: ["前端应用"]
tags: ["Node.js","axios","Vue.js"]
---

<a id="一、axios网络框架"></a>

## 一、axios网络框架

> -   包含了对`XMLHttpRequest`浏览器的支持
> -   能够在node.js环境中发起`http`请求
> -   支持`Promise` API
> -   支持拦截请求和响应
> -   支持转换请求和响应数据
> -   支持取消请求
> -   支持自动转换JSON数据

`axios`更适合在Vue框架中使用，如果使用`ajax`需要引用整个`jquery`，而一个`jquery`的大小都快抵上`Vue`框架的大小了，所以在`Vue`中使用`ajax`来发送网络请求并不合适。而使用原始的`XMLHttpRequest`来发送请求又过于繁琐了。所以更推荐`axios`。

安装

```shell
npm i axios -s
```

<a id="二、axios的使用"></a>

## 二、axios的使用

`axios`<strong>支持的请求方式</strong>

```javascript
axios(config)

axios.request(config)

axios.get(url[,config])

axios.delete(url[,config])

axios.head(url[,config])

axios.post(url[,data[,config]])

axios.put(url[,data[,config]])

axios.patch(url[,data[,config]])
```

<a id="2-1-发送简单的网络请求"></a>

### 2.1 发送简单的网络请求

```javascript
axios({
    url:'xxxx',
    method:'post'  //该项为可选，如无该项则默认为get请求
})
```

`axios`都是经过`promise`对象封装的，所有可以大胆的使用`promise`的方法

```javascript
axios({
  url:'http://123.207.32.32:8000/api/v1/home/multidata',
  method:'get'
}).then(res =>{
  console.log(res)
})
```

<a id="2-2-发送带query参数的请求"></a>

### 2.2 发送带query参数的请求

发送`http://123.207.32.32:8000/api/v1/home/data?type=sell&page=1`这种带有query参数的请求：

```javascript
axios({
  url:'http://123.207.32.32:8000/api/v1/home/data',
  params:{
      type:'sell',
      page:1
  }
}).then(res =>{
  console.log(res)
})
```

<a id="2-3-发送并发请求"></a>

### 2.3 发送并发请求

当需要同时发送多个请求时，可以使用`all`方法，这个方法其实就是promise中的all方法，毕竟axios都是经过promise封装过的

```javascript
axios.all([
    axios(...),
    axios(...)
])
.then(res=>{
   console.log(res)   //[请求结果1，请求结果2]
})
```

例如

```javascript
axios.all([
  axios({
    url:'http://123.207.32.32:8000/api/v1/home/multidata?callback=json123',
    method:'get'
  }),
  axios({
    url:'http://123.207.32.32:8000/api/v1/home/data',
    params:{
        type:'sell',
        page:1
    }
  })
])
.then(([res1,res2])=>{
  console.log(res1,res2)
})
```

关于then中返回的请求结果res，我是做了一个数组的解构。除此之外更推荐使用axios提供的方法来做

```javascript
.then(axios.spread((res1,res2)=>{
  console.log(res1,res2)
}))
```

<a id="2-4-全局配置"></a>

### 2.4 全局配置

axios为需要全局配置的属性提供了方法

```javascript
axios.default.xxx= xxx   //为需要全局配置的属性赋值
```

例如为全局的axios请求默认的请求时长设置为5秒

```javascript
axios.default.timeout = 5000
```

<a id="2-5-常用的配置项"></a>

### 2.5 常用的配置项

1.  <strong>请求地址</strong>

```javascript
url:'地址'
```

2.  <strong>请求类型</strong>

```javascript
method:''
```

3.  <strong>请求根路径</strong>

```javascript
baseURL:'根路径'
```

4.  <strong>请求前的数据处理</strong>

```javascript
transformRequest:[function(data){}]
```

5.  <strong>请求后的数据处理</strong>

```javascript
transformResponse:[function(data){}]
```

6.  <strong>URL查询对象</strong>

```javascript
params:{}
```

7.  <strong>自定义的请求头</strong>

```javascript
headers:{'x-Requested-width':'XMLHttpRequest'}
```

8.  <strong>查询对象序列化函数</strong>

```javascript
paramsSerializer: function(params){}
```

9.  <strong>request body</strong>

```javascript
data:{key:value}
```

10.  <strong>超时设置</strong>

```javascript
timeout: 1000   //ms
```

11.  <strong>跨域是否带Token</strong>

```javascript
withCredentials: false
```

12.  <strong>自定义请求处理</strong>

```javascript
adapter: function(resolve, reject, config){}
```

13.  <strong>身份验证信息</strong>

```javascript
auth: { uname:'',pwd: '12'},
```

14.  <strong>响应的数据格式json / blob /document /arraybuffer / text, stream</strong>

```javascript
responseType: 'json'
```

<a id="三、axios实例封装"></a>

## 三、axios实例封装

实际开发中,会遇到需要提供大量不同axios请求,且这些请求可能出现比较高的重复性,配置项只有一小部分不同,此时,我们可以将重复出现的不同请求抽离并封装起来

axios提供了实例封装方法`axios.create`

```javascript
const instance = axios.create({
    baseConfig  //抽离出来的公共配置项
})
```

使用实例发起请求

```javascript
instance({
    Config //特有配置项
})
.then(res => {
    ....
})
```

<a id="3-1-请求实例独立封装"></a>

### 3.1 请求实例独立封装

<strong>在文件中统一定义</strong>

请求的实例的定义可以放在独立的文件中,以供调用，并且易于统一管理。

```shell
network
    request.js
```

<strong>封装样例<code>request.js</code></strong>

```javascript
import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        baseURL:'http://123.207.32.32:8000'
    })
    return instance(config)
}
```

<strong>调用样例<code>main.js</code></strong>

```javascript
import {request} from './network/request'
request({
  url:'/api/v1/home/data',
  params:{
    type:'sell',
    page:1
  }
})
.then(res => {
  console.log(res)
})
```

<a id="四、拦截器"></a>

## 四、拦截器

```javascript
axios.interceptors
```

<a id="4-1-请求拦截"></a>

### 4.1 请求拦截

```javascript
axios.interceptors.request
```

功能：

-   比如`config`中的数据不符合服务器的要求
-   比如每次发送网络请求时，都希望在网页中加入等待图标
-   某些网络请求，例如`token`,必须携带一些特殊的信息

例如

```javascript
axios.interceptors.request.use(config => {
    console.log(config)
    return config   //一定要return config,否则请求将无法继续往下执行
},err => {
    console.log(err)
})
```

<a id="4-2-响应拦截"></a>

### 4.2 响应拦截

```javascript
axios.interceptors.response
```

在完成响应时进行拦截

```javascript
instance.interceptors.response.use(config => {
    console.log('加载成功')
    return config.data
},err => {
    console.log(err)
})
```
