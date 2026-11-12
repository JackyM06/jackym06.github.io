---
title: "Vue.js框架"
pubDatetime: 2019-08-06T20:00:27+08:00
modDatetime: 2019-08-07T19:50:44+08:00
description: "Vue 2 基础笔记，通过示例介绍数据绑定、常用指令与自定义指令的使用"
categories: ["前端应用"]
tags: ["Vue.js","前端框架"]
---

<a id="一、关于Vue-js"></a>

## 一、关于Vue.js

> Vue (读音 /vjuː/，类似于 <strong>view</strong>) 是一套用于构建用户界面的<strong>渐进式框架</strong>。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。 –摘自官网

总体来说作为一门前端框架，Vue.js本身可以<strong>最大程度减少用户操作Dom</strong>的工作

<a id="二-、数据的双向绑定"></a>

## 二 、数据的双向绑定

Vue.js可以将简洁的模板语法来声明式的将数据渲染到页面中，且声明的数据是双向的。而且对于一些特殊的标签可以通过绑定元素特性。例如

```html
<div id="app">
    姓氏：<input type="text" v-model = 'firstname'> 
    名字：<input type="text" v-model = 'lastname'>
    <p>{{firstname+lastname}}</p>
</div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    const app = new Vue({
        el:'#app',  //绑定id=app的元素   
        data: {     //声明数据
            firstname:'',
            lastname:''
        }
    })
```

解释一下上例，功能：输入姓氏和名字来合成名字。

首先为两个Input绑定了v-model，因为数据是双向的，默认值为Vue构造函数中声明的“”，但是当修改文本框中的值时，`app.firstname`和`app.lastname`也会对应发生改变。

<a id="三、-指令"></a>

## 三、 指令

在上例中使用的`v-model`就是一个指令，它可以用于绑定`<input>、<select>、<textarea>`、components标签的数据。指令一般都以`v-`开头。

<a id="3-1-用v-on指令绑定监听"></a>

#### 3.1 用`v-on`指令绑定监听

基本格式：（事件方法内容可以直接为Js语句也可以是方法名）简写格式为`@`

```html
v-on: 监听方式='事件方法'
```

例如：功能：输入价格，可以利用按钮来增减数量，并显示价格。通过`v-on`指令来绑定`click`事件，

方法应当挂载在`methods`下。

```html
<div id="app">
    <div>
        <label for="">价格</label>
        <input type="text" v-model='price'>
    </div>
    <div>
        数量：<button v-on:click='jian'>-</button><span>{{ number }}</span><button v-on:click='jia'>+</button>  
    </div>
    <div>
        <strong>{{ price*number }}</strong>
    </div>
</div>
<script src="./node_modules/vue/dist/vue.js"></script>
<script>
    new Vue({
        el:'#app',
        data:{
            price:0,
            number:0
        },
        methods:{
            jian:function(){
                --this.number
            },
            jia:function(){
                ++this.number
            }
        }
    })
</script>
```

<a id="3-2-条件与循环"></a>

#### 3.2 条件与循环

-   `v-if`作为条件指令，在引号内，值可以为绑定的数据，也可以直接填写`true` 或 `false`,
    
    当然还包括`v-else`和`v-else-if`进行配套使用
    

```html
<div id="app3">
     <span v-if='true'>NiKon</span>
     <span v-if='nonSeen'>Canen</span>
 </div>
```

```javascript
new Vue({
    el:"#app3",
    data:{
        nonSeen: true
    }
})
```

结果：NiKon Canen

-   v-for`作为循环指令。在要要遍历的标签中绑定该指令，值的格式为`‘xx\[,index\] in xxs’\`

```html
<div id="app4">
    <ul>
        <li v-for='todo,index in todos'>
            {{ index+'·'+todo.text }}
        </li>
    </ul>
</div>
```

```javascript
new Vue({
    el:'#app4',
    data: {
        todos:[
            {
                index:1,
                text:'wowo'
            },
            {
                index:2,
                text:'wowo'
            },
            {
                index:3,
                text:'wowo'
            }
        ]
    }
})
```

结果：

0·wowo

1·wowo

2·wowo

<a id="3-3-v-model指令"></a>

#### 3.3 v-model指令

用于作为表单控件的双向绑定的指令，格式：`v-model="xxx"`

<a id="3-4-v-bind属性渲染指令"></a>

#### 3.4 v-bind属性渲染指令

对于原有的HTML标签属性可以通过`v-bind`来渲染，为单向数据绑定。简写格式为`:`

```html
<input type="text" v-bind: value="xxx">
或者
<input type="text" :class="{xxx:true of false}">
```

<a id="3-5-v-once只渲染一次指令"></a>

#### 3.5 v-once只渲染一次指令

数据不再绑定，仅在在第一次加载页面时进行渲染。

<a id="3-6-v-text和v-cloak指令"></a>

#### 3.6 v-text和v-cloak指令

在vue管理的模板入口节点作用`v-cloak`

这两条指令是为了解决模板语法在页面加载时会出现页面抖动。

```html
<h1 v-text="message" ><h1>
```

```html
<style>
    [v-cloak]{
        display:none;
    }
</style>
<div v-cloak>
    <h1>{{ message }}</h1>
</div>
```

一般`v-text`使用较少

<a id="3-7-v-show显示标签指令"></a>

#### 3.7 v-show显示标签指令

这条指令是在渲染层上将改标签隐藏。

```html
<h1 v-show="false">hehe</h1>
```

和`v-if`不同的是，该指令是将改标签的样式设置为`display: none`,而`v-if`是直接将该标签从Dom树中移除。

<a id="3-8-v-pre跳过编译指令"></a>

#### 3.8 v-pre跳过编译指令

跳过不需要Vue编译的节点和其子节点，显示其原始内容。可以加快编译。😂

<a id="四、-自定义指令"></a>

## 四、 自定义指令

如果到了不得不自己去操作Dom元素时，且没有Vue内置指令来实现需求时。可以使用自定义指令来解决需求。

<a id="4-1-定义自定义指令"></a>

#### 4.1 定义自定义指令

自定义指令分为全局和局部，即可以定义为在所有组件下都可以使用的自定义指令，也可以定义为只能在当前组件下使用的自定义指令。

<a id="4-1-1-全局自定义指令"></a>

##### 4.1.1 全局自定义指令

```javascript
Vue.directive('指令名',{
    钩子函数
})
```

<a id="4-1-2-局部自定义指令"></a>

##### 4.1.2 局部自定义指令

```javascript
new Vue({
    ...,
    directives:{
    	指令名:{
    		钩子函数
		}
	},
    ...
})
```

<a id="4-2-钩子函数"></a>

#### 4.2 钩子函数

钩子函数就是当自定义指令在何时出发什么样的动作

形式都为`钩子名:function([el[,binding]])`

其中，`el`是当前绑定指令的Dom元素，而binding是指令对象其中`value`属性包含了指令被赋的值。

Vue官方文档中给出的钩子函数有5个：

-   `bind` -在指令被绑定时执行一次，无法读取被绑定的Dom元素的父节点`el.parentNode`
-   `inserted` -和bind一样是在指令被绑定时执行一次，但是在`bind`后面执行。并且可以读取被绑定的Dom元素的父节点
-   `update` -当指令所在的被Vue管理的整个模板更新时执行，binding.value是更新后的值
-   `componendUpdated` -和update一样，但是binding.value是更新前的值
-   `unbind` -当指令被解绑时执行，例如清除定时器（移除Dom时自动解绑）

<a id="4-3-复现一个v-show"></a>

#### 4.3 复现一个`v-show`

```html
<div id="app">
    <input type="text" v-focus>
    <div style="width: 100px;height: 100px ;background-color:#005151" v-myshow = "show" ></div>
</div>
```

<a id="4-3-1-全局定义方式"></a>

##### 4.3.1 全局定义方式

```javascript
Vue.directive('myshow',{
    bind:function(el,binding){
        if(binding.value){
            el.style.display = "block"
        }else{
            el.style = "none"
        }
    },
    // inserted:function(){
    //     console.log("inserted  is  called")
    // },
    update:function(el,binding){
        if(binding.value){
            el.style.display = "block"
        }else{
            el.style.display= "none"
        }
    },
    // componentUpdated:function(){
    //     console.log("componentUpdated  is  called")
    // },
    // unbind:function(){
    //     console.log("unbind  is  called")
    // }
})
```

> 大多数情况都是bind & update钩子函数配合使用的比较多，且大多情况下两者的代码是一样的，所以可以使用简写方式

```javascript
Vue.directive('myshow',function(el,binding){
        if(binding.value){
            el.style.display = "block"
        }else{
            el.style.display= "none"
        }
})
```

<a id="4-3-2-局部定义"></a>

##### 4.3.2 局部定义

```javascript
app = new Vue({
    el:'#app',
    data:{
        show: true
    },
    directives:{
        myshow:function(el,binding){
        if(binding.value){
            el.style.display = "block"
        }else{
            el.style.display= "none"
        }
        }
    }
```

<a id="五、-计算属性和侦听器"></a>

## 五、 计算属性和侦听器

<a id="5-1-计算属性computed"></a>

#### 5.1 计算属性`computed`

计算属性要在`computed`对象中定义。

计算属性的本质就是方法，在使用时就像`data`中定义的属性那样去使用。

每一个计算属性都必须有一个getter，还可以根据需求来加入一个setter。

1.  只包含getter的计算属性的一般使用方法

```javascript
computed:{
	remaingCount:{
		get(){
                  return this.todoList.filter(item=>!item.completed).length || 0
              }
	}
}
```

2.  对于只包含getter的计算属性还有一种简写方法

```javascript
computed:{
	remaingCount(){
		return this.todoList.filter(item=>!item.completed).length || 0
	}
},
```

3.  同时存在getter和setter的标准计算属性定义方式

```javascript
computed:{
	toggleAll:{
		get(){
			return this.todoList.every(item => item.completed)
		},
		set([value]){
			let boolean = !this.toggleAll
			this.todoList.forEach(element => {
				element.completed = boolean
			});
		}
	}
}
```

<a id="5-2-侦听器watch"></a>

#### 5.2 侦听器`watch`

侦听器要在`watch`对象中定义。

侦听器的作用是每当侦听对象发生改变时就作出反应。

同情况下计算属性要比侦听器合适，但是还有一些自定义业务需求需要使用侦听器。

-   `hanlder:function(val,oldval)` 是在触发监听对象时去执行的那个自己定义的方法
-   `deep:boolean` 当监听对象为一个引用类型的对象时，只能监听到对象整体，无法监听到对象内的个体。当设置为true时即可同时监听到对象内的个体。
-   `immediate:boolean` 在监听开始前就会调用该监听器下的`hanlder`方法

```javascript
watch:{
	todoList:{
		handler(val,oldVal){
			window.localStorage.setItem("todoList",JSON.stringify(val))
		},
		deep: true  //深度监听
	},
          //只包含handler时的简写方法
	toggleAll(){
		console.log('计算属性也可以被监听哦')
	}
},
```

<a id="六、-组件"></a>

## 六、 组件

Vue中，可以将单独功能的模块可以拆分为一个一个的组件。一个项目的组件构成通常为一个树形结构。一个典型的TodoMVC案例可以拆封为这样一个组件示例图：

![](http://imglf3.nosdn0.126.net/img/LzV5U2MxM2hkNnpRZjh5QUFncnUxREtqK1ZLR1YwaDNLWDYrQzdqMHFmTDlIZEFJZFhSdHRRPT0.png?imageView&thumbnail=500x0&quality=96&stripmeta=0)

<a id="6-0-组件的使用方式"></a>

#### 6.0 组件的使用方式

定义好的属性，只需要像使用html标签一样使用，只不过把标签名换为组建名就可以了

<a id="6-1-组件定义方式"></a>

#### 6.1 组件定义方式

组件定义方式和自定义指令一样，有全局和局部之分。

-   全局定义

```javascript
Vue.component('myComponent',{
    template:`<p>hello</p>`,
    data:function(){
        return {
            ...,
            ...
        }
    }
})
```

-   局部定义

```javascript
new Vue({
    el:'#app',
    template:`<app></app>`
    components:{
		app:{
    		template = `<header></header> .. `,
    		components:{
            header:{
             template:`<p>hello i am header</p>`,
   			 data:function(){
    			    return {
      				      ...,
        			    ...
        			}
    			}，
        	    //当然组件中也可以放子组件
        	    components:{
         	       ....
          	  }
        	},
        	...其他组件
			}
		}
    }
})
```

在Vue根实例中创建的这些组件的父子节点可能不同，但是他们的根组件都是这个Vue实例。因为这个Vue实例本身也是一个组件。

<a id="6-2-组件间的通信"></a>

#### 6.2 组件间的通信

<a id="6-2-1-直接父子通信"></a>

##### 6.2.1 直接父子通信

-   <strong>父传子通信（<code>prop down</code>）：</strong>

要将父组件中的属性值传送给其子组件

1.  需要在父组件中的模板中调用子组件的部分加上v-bind属性(如传送name属性给其子组件son)
    
    ```javascript
    const Father = {
        template: `<son v-bind:name="name"></son>`,
        data(){
            return {
                name:"jack"
            }
        }
        componends:{
        	son
    	}
    }
    ```
    
2.  在子组件体中，使用`props`数组属性将name接收过来，之后就可以像自己的data定义的属性一样去用了。
    
    ```javascript
    const son = {
        template:`<p> my father is {{ name }}</p>`,
        props:["name"]
    }
    ```
    

<strong>注意：Vue不允许在子组件去修改基本类型的*父组件传过来的值。但是很不幸。因为传过来的数据如果是引用l类型的话，你可以修改成功，且不会报错，但是请不要这样去做！，如有子元素要修改穿过来的值的需求，请使用子传夫通信方法</strong>

-   <strong>子传父通信(<code>Event up</code>)</strong>

父组件的值就要在父组件中进行，所以子组件可以把修改好的父组件数据整一个副本(不要修改原数据)，然后通过订阅事件的方法来传给父组件。

1.  再子组件的方法中生成数据副本
    
    ```javascript
    const son = {
        template:`<button @click = "handleUpdateName"> my father is {{ name }}</button>`,
        props:["name"],
        methods:{
            handleUpateName(){
                let value = 'maojiankai'
                this.$emit('UpdatedName',value) // 向父组件提交UpdatedName事件
            }
        }
    }
    ```
    
2.  在父组件中订阅对应事件并处理数据
    
    ```javascript
    const Father = {
        template: `<son v-bind:name="name" @UpatedName="handleName"></son>`, //订阅UpdatedName事件
        data(){
            return {
                name:"jack"
            }
        },
        componends:{
        	son
    	},
        methods:{
            handleName(name){ //对应的处理
                this.name = name 
            }
        }
    }
    ```
    

-   非父子关系的组件通信
    
    -   简单环境中 `Event Bus`
    
    1.  设组件a,b非父子关系但他们同属于一个Vue根实例，所以在Vue的根实例之前创建一个名字为`bus`的空Vue实例
    
    ```javascript
    var bus = new Vue()
    ```
    
    2.  在组件A中向bus提交自定义事件
    
    ```javascript
    bus.$emit('Edited',value)
    ```
    
    3.  在组件B的创建钩子函数中，订阅bus中组件A提交的事件
    
    ```javascript
    bus.$on('Edited',function(e){
        ...
    })
    ```
    
    -   复杂环境中 `VueX`（状态管理模式)

<a id="七、插槽"></a>

## 七、插槽

<a id="7-1-关于插槽solt"></a>

#### 7.1 关于插槽`solt`

在父组件调用子组件时，会使用子组件的模板HTML内容，但是如果父组件想要加入一些自己的内容到使用子组件的的模板HTML内容可能就是个问题了，尤其是当父组件多次引用子组件时，想要加入不同得内容到子组件模板当中去。

为此，Vue提供了一个插槽—`slot`标签。在子组件得`template`中加入一个`slot`标签后，父组件只需在引用子组件的标签内加入自己想加入的内容即可。

需要说明的是，如果想要插槽具有默认的内容，只需要在加入的`slot`标签内添加你需要的标签即可。

```html
<div id='app'>
        <cnp><button>hehe</button></cnp>
        <cnp></cnp>
    </div>
```

```html
<template id="cnp">
    <div>
        <h2>我是组件</h2>
        <p>123456789</p>
        <slot ><button>footer</button></slot>
    </div>
</template>
```

```javascript
const app = new Vue({
    el:'#app',
    components:{
        cnp:{
            template:'#cnp'
        }
    }
})
```

<a id="7-2-具名插槽"></a>

#### 7.2 具名插槽

如果子组件存在多个不同的插槽,当你在调用时只想改动其中的一小部分插槽，其他的插槽都保留其原始值时,就需要用到Vue提供的具名插槽了。

具名插槽的定义是在插槽的`name`属性上设置插槽的名称

```html
<template>
    <slot name="left"><span>left</span></slot>
    <slot name="center"><span>center</span></slot>
    <slot name="right"><span>right</span></slot>
    <slot><span>defalut</span></slot>
</template>
```

具名插槽的使用需要在先使用设置了`v-slot:name`指令的`template`标签包裹要改动的内容

```html
<div id='app'>
    <cnp>
        <template v-slot:center>
            <h1 >123</h1>
        </template>
    </cnp>
    <cnp></cnp>
</div>
```

<a id="7-3-作用域插槽"></a>

#### 7.3 作用域插槽

首先是Vue的编译作用域。

摘自Vue官网:<strong>父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。</strong>

其实很意思很简单，比如：

```html
<div id="app">
    <cnp>
        <button v-show='show'>hello</button>
    </cnp>
</div>

<!-- 子组件模板 -->
<template id='cnp'>
    <div>
    	<h1>我是模板</h1>
    	<slot v-show='show'></slot>
    </div>
</template>

<!-- 入口Vue实例 -->
<script>
	const app = new Vue({
        el:'#app',
        data:{
            show:false
        },
        components:{
            cnp:{
                template:'#cnp',
                data(){
                    return {
                        show:true
                    }
                }
            }
        }
    })
</script>
```

通过不断调试Vue实例和组件`cnp`中的show，可以看出。模板`tempate`属于组件`cnp`，所以模板中的show是组件`cnp`中的show，而在实际调用中的show是属于Vue实例中的show。

这说明Vue的是具有编译作用域的，且父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

虽然Vue的编译作用域是合理且安全的。但是影响到了一种插槽需求，就是当引用该子组件时，需要用到一些将子组件的一些数据以不同的形式在组件的插槽内显示。

所以，Vue提供了作用域插槽。

定义`v-bind:属性名='表达式'`

```html
<template id="cnp">
    <div>
        <h2>我是组件</h2>
        <p>123456789</p>
        <!-- 定义一个随意名称的属性 -->
        <slot :data='pLanguages'></slot>
    </div>
</template>
```

使用`v-solt:name或者default='数据名'` (name是具名时用于替换指定插槽，default是默认插槽)

```html
   <div id='app'>
       <cnp>
           <!-- 完整的 -->
           <template v-slot:default='slot'>
               <span>{{ slot.data.join(' - ') }}</span>
           </template>
       </cnp>
</div>
```

如果像上例一样使用的是默认插槽，还可以使用简写方式

<strong>简写时请勿与具名插槽混用</strong>

```html
   <div id='app'>
       <cnp>
           <!-- 简写的 -->
           <template v-slot='slot'>
               <span>{{ slot.data.join(' - ') }}</span>
           </template>
       </cnp>
</div>
```

如果是多个插槽，则需要使用完整的使用格式。

<strong>Example</strong>

比如现在要来实现将子组件中提供的编程语言数组在插槽中以两种不同形式显示

```html
<div id='app'>
    <cnp>
        <template v-slot:default='slot'>
            <span>{{ slot.data.join(' - ') }}</span>
        </template>
    </cnp>
    <cnp>
            <template v-slot='slot'>
                    <span>{{ slot.data.join(' * ') }}</span>
                </template>
    </cnp>
</div>

<template id="cnp">
    <div>
        <h2>我是组件</h2>
        <p>123456789</p>
        <slot :data='pLanguages'></slot>
    </div>
</template>    

<script>

    const app = new Vue({
        el:'#app',
        components:{
            cnp:{
                template:'#cnp',
                data(){
                    return {
                        pLanguages:['Java','C++','JavaScript','Python','Php']
                    }
                }
            }
        }
    })
</script>
```
