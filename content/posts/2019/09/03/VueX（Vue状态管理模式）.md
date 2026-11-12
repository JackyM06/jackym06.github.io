---
title: "VueX（Vue状态管理模式）"
pubDatetime: 2019-09-03T20:32:18+08:00
modDatetime: 2019-09-07T17:46:08+08:00
description: "围绕共享状态管理，介绍 Vuex 的 Store、Mutation、Getter、Action 和模块组织方式"
categories: ["前端应用"]
tags: ["Vue.js","VueCli","VueX"]
---

<a id="一、初识VueX"></a>

## 一、初识VueX

<a id="1-1-关于VueX"></a>

### 1.1 关于`VueX`

`VueX`是适用于在`Vue`项目开发时使用的状态管理工具。试想一下，如果在一个项目开发中频繁的使用组件传参的方式来同步`data`中的值，一旦项目变得很庞大，管理和维护这些值将是相当棘手的工作。为此，`Vue`为这些被多个组件频繁使用的值提供了一个统一管理的工具——`VueX`。在具有`VueX`的Vue项目中，我们只需要把这些值定义在VueX中，即可在整个Vue项目的组件中使用。

<a id="1-2-安装"></a>

### 1.2 安装

由于`VueX`是在学习`VueCli`后进行的，所以在下文出现的项目的目录请参照`VueCli 2.x`构建的目录。

以下步骤的前提是你已经完成了Vue项目构建，并且已转至该项目的文件目录下。

-   Npm安装Vuex
    
    ```shell
    npm i vuex -s
    ```
    
-   在项目的根目录下新增一个`store`文件夹，在该文件夹内创建index.js
    
    此时你的项目的`src`文件夹应当是这样的
    
    ```shell
    │  App.vue
    │  main.js
    │
    ├─assets
    │      logo.png
    │
    ├─components
    │      HelloWorld.vue
    │
    ├─router
    │      index.js
    │
    └─store
           index.js
    ```
    

<a id="1-3-使用"></a>

### 1.3 使用

<a id="1-3-1-初始化store下index-js中的内容"></a>

#### 1.3.1 初始化`store`下`index.js`中的内容

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex({
    state:{
        //存放的键值对就是所要管理的状态
        name:'helloVueX'
    }
})

export default store
```

<a id="1-3-2-将store挂载到当前项目的Vue实例当中去"></a>

#### 1.3.2 将store挂载到当前项目的Vue实例当中去

打开main.js

```javascript
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  //store:store 和router一样，将我们创建的Vuex实例挂载到这个vue实例中
  render: h => h(App)
})
```

<a id="1-3-3-在组件中使用Vuex"></a>

#### 1.3.3 在组件中使用Vuex

例如在App.vue中，我们要将state中定义的name拿来在h1标签中显示

```html
<template>
    <div id='app'>
        name:
        <h1>{{ $store.state.name }}</h1>
    </div>
</template>
```

或者要在组件方法中使用

```javascript
...,
methods:{
    add(){
      console.log(this.$store.state.name)
    }
},
...
```

<strong>注意，请不要在此处更改<code>state</code>中的状态的值，后文中将会说明</strong>

<a id="1-4-安装Vue开发工具VueDevtools"></a>

### 1.4 安装Vue开发工具VueDevtools

在Vue项目开发中，需要监控项目中得各种值，为了提高效率，Vue提供了一款浏览器扩展——VueDevtools。

![](https://s2.ax1x.com/2019/09/01/n9k3v9.png)

在学习VueX时，更为需要使用该插件。关于该插件的使用可以移步官网，在此不再赘叙。

<a id="二、VueX中的核心内容"></a>

## 二、VueX中的核心内容

在VueX对象中，其实不止有`state`,还有用来操作`state`中数据的方法集，以及当我们需要对`state`中的数据需要加工的方法集等等成员。

成员列表：

-   state 存放状态
-   mutations state成员操作
-   getters 加工state成员给外界
-   actions 异步操作
-   modules 模块化状态管理

<a id="2-1-VueX的工作流程"></a>

### 2.1 VueX的工作流程

![Vuex官网给出的流程图](https://vuex.vuejs.org/vuex.png)

首先，`Vue`组件如果调用某个`VueX`的方法过程中需要向后端请求时或者说出现异步操作时，需要`dispatch` VueX中`actions`的方法，以保证数据的同步。可以说，`action`的存在就是为了让`mutations`中的方法能在异步操作中起作用。

如果没有异步操作，那么我们就可以直接在组件内提交状态中的`Mutations`中自己编写的方法来达成对`state`成员的操作。注意，`1.3.3节`中有提到，不建议在组件中直接对`state`中的成员进行操作，这是因为直接修改(例如：`this.$store.state.name = 'hello'`)的话不能被`VueDevtools`所监控到。

最后被修改后的state成员会被渲染到组件的原位置当中去。

<a id="2-2-Mutations"></a>

### 2.2 Mutations

`mutations`是操作`state`数据的方法的集合，比如对该数据的修改、增加、删除等等。

<a id="2-2-1-Mutations使用方法"></a>

#### 2.2.1 Mutations使用方法

`mutations`方法都有默认的形参：

(<strong>[state]</strong> <strong>[,payload]</strong>)

-   `state`是当前`VueX`对象中的`state`
-   `payload`是该方法在被调用时传递参数使用的

例如，我们编写一个方法，当被执行时，能把下例中的name值修改为`"jack"`,我们只需要这样做

`index.js`

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex({
    state:{
        name:'helloVueX'
    },
    mutations:{
        //es6语法，等同edit:funcion(){...}
        edit(state){
            state.name = 'jack'
        }
    }
})

export default store
```

而在组件中，我们需要这样去调用这个`mutation`——例如在App.vue的某个`method`中:

```javascript
this.$store.commit('edit')
```

<a id="2-2-2-Mutation传值"></a>

#### 2.2.2 Mutation传值

在实际生产过程中，会遇到需要在提交某个`mutation`时需要携带一些参数给方法使用。

单个值提交时:

```javascript
this.$store.commit('edit',15)
```

当需要多参提交时，推荐把他们放在一个对象中来提交:

```javascript
this.$store.commit('edit',{age:15,sex:'男'})
```

接收挂载的参数：

```javascript
edit(state,payload){
    state.name = 'jack'
    console.log(payload) // 15或{age:15,sex:'男'}
}
```

<strong>另一种提交方式</strong>

```javascript
this.$store.commit({
    type:'edit',
    payload:{
        age:15,
        sex:'男'
    }
})
```

<a id="2-2-3-增删state中的成员"></a>

#### 2.2.3 增删state中的成员

为了配合Vue的响应式数据，我们在Mutations的方法中，应当使用Vue提供的方法来进行操作。如果使用`delete`或者`xx.xx = xx`的形式去删或增，则Vue不能对数据进行实时响应。

-   Vue.set 为某个对象设置成员的值，若不存在则新增
    
    例如对state对象中添加一个age成员
    
    ```javascript
    Vue.set(state,"age",15)
    ```
    
-   Vue.delete 删除成员
    
    将刚刚添加的age成员删除
    
    ```javascript
    Vue.delete(state,'age')
    ```
    

<a id="2-3-Getters"></a>

### 2.3 Getters

可以对state中的成员加工后传递给外界

Getters中的方法有两个默认参数

-   state 当前VueX对象中的状态对象
-   getters 当前getters对象，用于将getters下的其他getter拿来用

例如

```javascript
getters:{
    nameInfo(state){
        return "姓名:"+state.name
    },
    fullInfo(state,getters){
        return getters.nameInfo+'年龄:'+state.age
    }  
}
```

组件中调用

```javascript
this.$store.getters.fullInfo
```

<a id="2-4-Actions"></a>

### 2.4 Actions

由于直接在`mutation`方法中进行异步操作，将会引起数据失效。所以提供了Actions来专门进行异步操作，最终提交`mutation`方法。

`Actions`中的方法有两个默认参数

-   `context` 上下文(相当于箭头函数中的this)对象
-   `payload` 挂载参数

例如，我们在两秒中后执行`2.2.2`节中的`edit`方法

由于`setTimeout`是异步操作，所以需要使用`actions`

```javascript
actions:{
    aEdit(context,payload){
        setTimeout(()=>{
            context.commit('edit',payload)
        },2000)
    }
}
```

在组件中调用:

```javascript
this.$store.dispatch('aEdit',{age:15})
```

<strong>改进:</strong>

由于是异步操作，所以我们可以为我们的异步操作封装为一个`Promise`对象

```javascript
aEdit(context,payload){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
        	context.commit('edit',payload)
        	resolve()
    	},2000)
    })
}
```

<a id="2-5-Models"></a>

### 2.5 Models

当项目庞大，状态非常多时，可以采用模块化管理模式。Vuex 允许我们将 store 分割成<strong>模块（module）</strong>。每个模块拥有自己的 `state、mutation、action、getter`、甚至是嵌套子模块——从上至下进行同样方式的分割。

```javascript
models:{
    a:{
        state:{},
        getters:{},
        ....
    }
}
```

组件内调用模块a的状态：

```javascript
this.$store.state.a
```

而提交或者`dispatch`某个方法和以前一样,会自动执行所有模块内的对应`type`的方法：

```javascript
this.$store.commit('editKey')
this.$store.dispatch('aEditKey')
```

<a id="2-5-1-模块的细节"></a>

#### 2.5.1 模块的细节

-   模块中`mutations`和`getters`中的方法接受的第一个参数是自身局部模块内部的`state`
    
    ```javascript
    models:{
        a:{
            state:{key:5},
            mutations:{
                editKey(state){
                    state.key = 9
                }
            },
            ....
        }
    }
    ```
    

-   `getters`中方法的第三个参数是根节点状态
    
    ```javascript
    models:{
        a:{
            state:{key:5},
            getters:{
                getKeyCount(state,getter,rootState){
                    return  rootState.key + state.key
                }
            },
            ....
        }
    }
    ```
    
-   `actions`中方法获取局部模块状态是`context.state`,根节点状态是`context.rootState`
    
    ```javascript
    models:{
        a:{
            state:{key:5},
            actions:{
                aEidtKey(context){
                    if(context.state.key === context.rootState.key){
                        context.commit('editKey')
                    }
                }
            },
            ....
        }
    }
    ```
    

<a id="三、规范目录结构"></a>

## 三、规范目录结构

如果把整个`store`都放在`index.js`中是不合理的，所以需要拆分。比较合适的目录格式如下：

```shell
store:.
│  actions.js
│  getters.js
│  index.js
│  mutations.js
│  mutations_type.js   ##该项为存放mutaions方法常量的文件，按需要可加入
│
└─modules
        Astore.js
```

对应的内容存放在对应的文件中，和以前一样，在`index.js`中存放并导出`store`。`state`中的数据尽量放在`index.js`中。而`modules`中的`Astore`局部模块状态如果多的话也可以进行细分。
