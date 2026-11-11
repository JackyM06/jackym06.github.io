---
title: "在Vue中使用Echarts"
pubDatetime: 2020-05-04T22:00:46+08:00
description: "在Vue中使用Echarts 实际的Vue项目开发中可能需要用到Echarts来制作图表。本文将分享在VueCli3中使用Echarts的小经验。"
categories: ["前端应用"]
tags: ["Vue.js","echarts"]
---

<a id="在Vue中使用Echarts"></a>

## 在Vue中使用Echarts

> 实际的Vue项目开发中可能需要用到`Echarts`来制作图表。本文将分享在VueCli3中使用Echarts的小经验。

<a id="环境配置"></a>

### 环境配置

<a id="安装"></a>

#### 安装

将`echarts`与`vue-echarts` ( `vue-echarts`是基于`echarts`封装实现的一个组件库)

```powershell
npm i echarts vue-echarts --save
```

<a id="引入"></a>

#### 引入

在`main.js`中导入包

```javascript
import ECharts from 'vue-echarts'
import echarts from 'echarts'
Vue.component('chart', ECharts)
Vue.prototype.$echarts = echarts
```

引入一些echarts中比较常用的模块,其他主要模块到使用的组件内按需引入

```javascript
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
```

<a id="使用相关"></a>

### 使用相关

<a id="基本使用"></a>

#### 基本使用

使用注册的全局组件`chart`即可

```text
<template>
    <chart  :options="options" :auto-resize="true"></chart>
</template>

<script>
    import 'echarts/lib/chart/line' //加入折现表
    export default {
        data () {
            return {
                options:{} //设置echarts中的参数options
            }
        }
    }
</script>
```

<a id="更为优雅的使用"></a>

#### 更为优雅的使用

由于实际开发时可能遇到不同的数据格式。我比较推荐将图表封装为一个与项目中实际数据结构相同的组件。

`options`的数据结构可以参考官网 [https://www.echartsjs.com/zh/option.html#title](https://www.echartsjs.com/zh/option.html#title)

```text
<template>
    <chart  :options="options" :auto-resize="true"></chart>
</template>

<script>
    import 'echarts/lib/chart/line'
    export default {
        props:{
            title:String, //图表标题
            Cats:Array, //对象数组{name:String,data:[]}
            xData:Array //x轴的标记
        },
        data () {
            return {
                options:{}
            }
        },
        created(){
            this.options =  {
                title: {
                    left:'center',
                    top:"0",
                    text: this.title
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top:"40",
                    data: this.Cats.map(e=>e.name)
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '20%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xData
                },
                yAxis: {
                    type: 'value'
                },
                series: this.Cats.map(e => {e.type = "line";return e})
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
```

<a id="遇到的问题"></a>

#### 遇到的问题

图表中的数据是由<strong>后端</strong>获取的，那么当图表绘制完成后，由于图表<strong>options</strong>中有些数据比较深，更新时可能会发生数据<strong>监听不到</strong>的问题。

我的解决办法是在在组件中加入一个<strong>vue侦听</strong>，侦听要发生变化的变量，例如上例中我加入了<strong>watch</strong>来侦听会发生变化的属性`Cats`

```text
watch:{
    Cats(newValue){
        this.$set(this.options,'series',newValue.map(e => {e.type = "line";return e}))
        this.$set(this.options.legend,'data',newValue.map(e=>e.name))
    }
}
```

<a id="完整代码与效果"></a>

### 完整代码与效果

<a id="折线图"></a>

#### 折线图

<strong>数据结构内容说明</strong>

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200504211539.png)

<strong>组件代码</strong>

```text
<template>
    <chart  :options="options" :auto-resize="true"></chart>
</template>

<script>
    import 'echarts/lib/chart/line'
    export default {
        props:{
            title:String,
            Cats:Array,
            xData:Array
        },
        data () {
            return {
                options:{}
            }
        },
        created(){
            this.options =  {
                title: {
                    left:'center',
                    top:"0",
                    text: this.title
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    top:"40",
                    data: this.Cats.map(e=>e.name)
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    top: '20%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xData
                },
                yAxis: {
                    type: 'value'
                },
                series: this.Cats.map(e => {e.type = "line";return e})
            }
        },
        watch:{
            Cats(newValue){
                this.$set(this.options,'series',newValue.map(e => {e.type = "line";return e}))
                this.$set(this.options.legend,'data',newValue.map(e=>e.name))
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
```

<strong>运行效果</strong>

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200504210539.png)

<a id="饼图"></a>

#### 饼图

<strong>数据结构内容说明</strong>

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200504211847.png)

<strong>组件代码</strong>

```text
<template>
    <chart ref="charts" :options="options" :auto-resize="true"></chart>
</template>

<script>
    import 'echarts/lib/chart/pie'
    import "echarts/lib/component/legendScroll";
    export default {
        props:{
            title:String,
            Cats:Array
        },
        computed: {
            CatsName(){
                return this.Cats.map(e=>e.name)
            }
        },
        data () {
            return {
                options:{}
            }
        },
        mounted(){
            this.options={
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    type:'scroll',
                    orient: 'vertical',
                    left: 2,
                    top: 20,
                    height:140,
                },
                 title: [{
                   left: 'center',
                   text: this.title
                }],
                series: [
                    {
                        name: '访问量',
                        type: 'pie',
                        radius: '63%',
                        left:150,
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            },
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                    }
                ]
            }
        },
        watch:{
            Cats(newValue){
                this.$set(this.options.series[0],'data',newValue)
                this.$set(this.options.legend,'data',this.CatsName)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
```

<strong>运行效果</strong>

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200504211340.png)
