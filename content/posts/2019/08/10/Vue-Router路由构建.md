---
title: "Vue-Router路由构建"
pubDatetime: 2019-08-10T21:00:45+08:00
description: "一、前端路由和后端路由1.1 路由路由就是通过互联的网络把信息从源地址传输到目的地址的活动。在Web的路由中，最重要的就是有一个路由映射表。这个映射表能够完整的表现出映射关系，便于路由管理。"
categories: ["前端应用"]
tags: ["Vue.js","前端框架","VueRouter","Vue-Cli"]
---

<a id="一、前端路由和后端路由"></a>

## 一、前端路由和后端路由

<a id="1-1-路由"></a>

### 1.1 路由

路由就是通过互联的网络把信息从源地址传输到目的地址的活动。在Web的路由中，最重要的就是有一个路由映射表。这个映射表能够完整的表现出映射关系，便于路由管理。

<a id="1-2-后端路由"></a>

### 1.2 后端路由

有过服务端开发经验的Coder应该知道，在服务端开发中需要专门来写一个Router,其中包括了请求路径`/index`和请求方法比如`get/post`然后再写其对应的处理方法。

再后端渲染开发中，可以用这个图来简单描述。

![](https://s2.ax1x.com/2019/08/09/eqkorT.png)

从这里可以看出，后端路由的工作就是处理一个URL对应一个页面数据的关系。

<a id="1-3-前端路由"></a>

### 1.3 前端路由

在学习Vue当中，应该听过最多的词就是SPA(单页面富应用)。SPA的概念相信不需要我多说，就是在页面不跳转的情况下访问页面的各个功能，并且还有历史记录信息。

随着SPA的功能越来越多，我们必然需要有一个路由映射关系来便于管理。这就是我们所说的前端路由

![](https://s2.ax1x.com/2019/08/09/eq3L28.png)

如图，客户端会把所有需要的数据都请求下来。但是并不是全部都显示，而是只显示一部分，所以前端路由需要提供一个URL和显示内容或者说组件的一个映射关系。

这是一个被模拟的一个完整的 URL，于是当 URL 改变时，页面不会重新加载。就是`Hash`或者H5的`history`来实现的。

<a id="二、-Vue-Router初使用"></a>

## 二、 Vue-Router初使用

Vue也提供了一个前端路由管理包，就是`vue-router`。可以手动npm方式安装，但是为了方便，接下来的演示都在用`vueCli`构建后的项目中演示。

在使用`vueCli`构建项目时选择安装`vue-router`

<a id="2-1-配置路由"></a>

### 2.1 配置路由

在项目根目录下新建`router`目录，并在`router` 建立`index.js`

-   导入`vue`,`vue-router`包
    
    ```javascript
    const Vue = require('vue')
    const VueRouter = require('vue-router')
    ```
    
-   将`vue-router`挂载到`Vue`上
    
    ```javascript
    Vue.use(VueRouter)
    ```
    
-   建立路由关系
    
    ```javascript
    const routes = [
    	{
    		path:'',
    		redirect:'/home'  //若需要页面重定向
    	},
    	{
    		path:'/home',
    		component:require('组件'), //建立标准路由对应组件(查看2.3了解)
    		childrens:[      //若是使用嵌套路由
    			{
    				path:'new' //无需加“/”,
    				component:require('组件')
    			}
    		]
    	},
    	....
    ]
    ```
    
-   导出路由对象
    
    ```javascript
    const router = new RouterVue({
        routes:routes //ES6下可以直接用routes
    })
    export default router
    ```
    

<a id="2-2-挂载路由"></a>

### 2.2 挂载路由

配置完路由，需要把路由挂载到Vue实例对象上才能生效，届时，整个Vue实例上的组件链上的组件都可以使用路由了。

-   `main.js` 下
    
    ```javascript
    import Vue from 'vue'
    import App from './App'
    import router from './router'  //自动执行/router/index.js
    
    Vue.config.productionTip = false
    
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,      //挂载路由
      render: h => h(App)
    })
    ```
    

<a id="2-3-使用路由"></a>

### 2.3 使用路由

通过以上两步，我们的前端路由已经准备就绪，映射关系也已经建立完成。接下来我们就是要来看看如何通过请求这个URL，来达到显示出对应的组件内容的目的。

在`template`中

-   通过`router-link`标签来发送请求
-   通过`router-view`来显示对应的组件内容

```html
<template>
    <div id="app">
      <h1>Vue-router</h1>
        <router-link to:'/home/news' >新闻</router-link>
      <router-link to='/home' tag='button'>首页</router-link>
      <router-link to='/about' replace="">关于</router-link>
      <router-link :to="'/user/'+userID">用户</router-link>
      <router-link :to="{path:'/profile',query:{name:'mjk',age:18,sex:'男'}}">档案</router-link>
        
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'App',
}
</script>
```

在最终的网页上，`router-link`标签会被默认处理为a标签，而`router-view`会被处理为在`routes`定义的对应路径的对应组间，如没有则为空。

<a id="三、路由上的一些细节"></a>

## 三、路由上的一些细节

至此，我们已经可以完成一个最最基本的路由构建了。点击`router-link` 可以在`router-view`显示对应的`component`。但是在实际开发中，肯定不止那么点需求。

<a id="3-1-关于VueRouter构造函数"></a>

### 3.1 关于VueRouter构造函数

```javascript
const router = new VueRouter({
  routes,
  mode: 'history', //路由模式从默认的Hash改为H5的history模式
  linkActiveClass:'active'   //设置全局router-link被点击后的class
})
```

`vue-router` 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

如果不想要很丑的 hash，我们可以用路由的 <strong>history 模式</strong>，这种模式充分利用 `history.pushState` API 来完成 URL 跳转而无须重新加载页面。

<a id="3-2-关于router-link"></a>

### 3.2 关于`router-link`

在`router-link`上有一些属性，可以供我们使用

-   `replace`
    
    该属性是替换当前url,默认是Push。它可以不被赋任何值就能声明
    
-   `tag`
    
    `router-link`最终默认会被处理为a标签，而使用该属性，可以设置被处理为其他标签。
    
    如下，`router-link`会被处理为`button`标签，且为replace模式
    
    ```html
    <router-link to='/home' replace="" tag='button'>首页</router-link>
    ```
    
-   `active-class`
    
    当`router-link`被点击后，将会获得一个特殊的类—-`router-link-active`,当你不想使用类名时，就可以使用该属性，设置你的自定义类名。和在构造函数中设置`linkActiveClass`有所不同，一个是当前router-link,一个是全局的router-link
    
-   `to`
    
    对于这个属性来说，它可以让你点击该router-link时跳转到指定的路径。实际上它就是执行了
    
    ```javascript
    to='/home'  //对于这条语句来说就等于将会执行
    this.$router.push('/home')//或者
    this.$router.replace('/home')
    ```
    

<a id="3-3-关于传值"></a>

### 3.3 关于传值

在URL中，请求方是可以动态的传入一些数据，而接受方也可以接受到该值。并且不会影响路径的识别。

<a id="3-3-1-params传值方式"></a>

#### 3.3.1 `params`传值方式

-   在路由中设置你的值名称
    
    ```javascript
    path:'/home/:id'
    ```
    
-   使用
    
    ```html
    <router-link to="/home/123456">首页</router-link>
    ```
    
-   接收,在对应的/home组件中使用
    
    ```html
    this.$route.params.id
    ```
    
-   URL形式
    
    ```shell
    /home/123456
    ```
    

<a id="3-3-2-query传值方式"></a>

#### 3.3.2 `query`传值方式

如果要传送一组键值对数据，可以使用query传值

-   使用
    
    ```html
    <router-link to="{path:'/profile',query:{name:'mjk',age:18,sex:'男'}}">档案</router-link>
    ```
    
-   接收
    
    ```javascript
    this.$route.query.name
    this.$route.query.age ....
    ```
    
-   URL形式
    
    ```shell
    /profile?name=mjk&age=18&sex=男
    ```
    

<a id="3-4-Keep-Alive"></a>

### 3.4 Keep-Alive

在不断切换`router-view`中的组件过程中，实际上就是不断地创建和销毁经历过的组件。但是我们也许要使某些组件在被切换后不被销毁，这就需要使用`keep-alive`了，他能够让组件被保存到缓存中去。下次再使用这个组件时，我们只需要到缓存中去拿就可以了，不用再重新创建了。

-   使用
    
    ```html
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    ```
    
-   只对指定组件使用keep-alive
    
    -   `include`只对某些属性使用`keep-alive`
    
    ```html
    <keep-alive include='home,news'>  
        <router-view></router-view>
    </keep-alive>
    ```
    
    -   `exclude`不对某些属性使用`keep-alive`
    
    ```html
    <keep-alive exclude='profile'>  
        <router-view></router-view>
    </keep-alive>
    ```
    
-   配合`activated`和 `deactivated`钩子函数
    
    在能使用`keep-alive`的组件中，这两个钩子函数在当被切换到该组件和该组件被切换时触发。
    

<a id="四、导航守卫"></a>

## 四、导航守卫

<a id="4-1-关于导航守卫"></a>

### 4.1 关于导航守卫

导航守卫是关于路由状态的钩子函数

参数一般由`to,from,next`构成。

-   `to`
    
    要跳转到的`route`对象
    
-   `from`
    
    当前的`route`对象，或者上一个`route`对象
    
-   `next`
    
    你必须在你的函数体中加入`next()`以保证动作继续执行下去
    
    参数
    
    -   next()默认
        
    -   next(false)中断整个导航动作
        
    -   next({path:’’}) 重定向到其他路径
        
    -   next(err)抛出错误
        

<a id="4-2-定义导航守卫"></a>

### 4.2 定义导航守卫

导航守卫的钩子函数，可以定义为全局和组件个体的和路由独享的

-   全局定义
    
    在router目录下的`index.js`中，我们定义过一个`router`对象
    
    ```javascript
    router.beforeEach((to,from,next)=>{
        ....
        next()
    })
    ```
    

-   组件个体定义
    
    在`router-view`可能被显示的组件中
    
    ```javascript
    export default {
        name: 'home',
        data(){
            return {
                path:'/home/news'
            }
        },
        created(){
            console.log('create');
    
        },
        activated(){
            return this.$router.push(this.path)
        },
         deactivated(){
             return  this.path = this.$route.path
         }
        beforeRouteLeave(to,from,next){
            console.log(to,from)
            this.path = this.$route.path
            next()
        }
    }4.3 关于更多的钩子函数
    ```
    

-   路由独享守卫
    
    在路由中定义，可以保证该导航下的嵌套路由都被守卫到
    
    ```css
    {
    	path:'/home',
    	component: home,
    	//路由独享守卫
    	beforeRouteLeave:(to,from,next)=>{
    		....
    		next()
    	}
    }
    ```
    

<a id="4-3-更多信息"></a>

### 4.3 更多信息

关于更多的导航守卫的钩子函数， 可以在[官网](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)中查询

<a id="五、路由懒加载"></a>

## 五、路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

格式 :`()=>import('xxxx')`

我们只需要将之前定义的`routes`稍作修改即可

```javascript
const routes = [
	{
		path:'',
		redirect:'/home'  //若需要页面重定向
	},
	{
		path:'/home',
        //路由懒加载
		component:()=>import('xxx')
	},
	....
]
```
