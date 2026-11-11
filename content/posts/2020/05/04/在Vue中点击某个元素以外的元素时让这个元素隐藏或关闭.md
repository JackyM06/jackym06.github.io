---
title: "在Vue中点击某个元素以外的元素时让这个元素隐藏或关闭"
pubDatetime: 2020-05-04T12:31:27+08:00
description: "在Vue中点击某个元素以外的元素时让这个元素隐藏或关闭 在实际开发中，可能会有点击某个元素以外的元素时让这个元素隐藏或关闭的需求。在Vue中实现则更加简单。"
categories: ["前端应用"]
tags: ["Vue.js"]
---

<a id="在Vue中点击某个元素以外的元素时让这个元素隐藏或关闭"></a>

## 在Vue中点击某个元素以外的元素时让这个元素隐藏或关闭

> 在实际开发中，可能会有点击某个元素以外的元素时让这个元素隐藏或关闭的需求。在Vue中实现则更加简单。

<a id="思路"></a>

### 思路

为全局`document`添加`click`事件，判断是否为指定节点及其子节点，如果不是则隐藏该指定节点。

例如该组件

```text
<template>
    <div>
    	<span v-show="isShow">没点击我我就消失了哦</span>
		<button @click="isShow = true">显示</button>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isShow:false,
            }
    }
</script>
```

当前组件现有功能是：`span`默认不显示，当点击`button`时显示`span`。

<strong>而现在想要的功能是</strong>，当点击`button`时显示`span`，当点击`span`和`button`以外的节点都导致`span`隐藏。

<a id="实现"></a>

### 实现

<strong>为span加上ref 以便于获取该DOM节点</strong>

```text
<span v-show="isShow" ref="showPanel">没点击我我就消失了哦</span>
```

<strong>当前组件添加<code>created</code> hook</strong>

-   为所有`document`添加`click`事件句柄
-   判断当前的`span`（`this.$refs.showPanel`）是否存在
-   判断当前点击的元素(`e.target`)是否被span所包含
-   若不包含则导致`span`隐藏

```text
created(){
   document.addEventListener('click',(e)=>{
       if(this.$refs.showPanel){
           let isSelf = this.$refs.showPanel.contains(e.target)
           if(!isSelf){
               this.isShow = false
           }
       }
   })
}
```

<strong>改进</strong>

实时上述工作完成后，还存在一个问题就是当点击`button`时导致`isShow`最终又变为`false`（事件冒泡，`button`也是`span`之外的元素）。所以为了防止冒泡，需要为`button`的`click`事件添加`.stop`修饰符

```text
<button @click.stop="isShow = true">显示</button>
```
