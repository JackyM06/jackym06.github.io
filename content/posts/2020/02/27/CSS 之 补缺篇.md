---
title: "CSS补缺备忘"
pubDatetime: 2020-02-27T23:20:22+08:00
description: "记录文本排版、背景与表格等 CSS 用法，配合示例补充容易遗漏的属性细节"
categories: ["前端基础"]
tags: ["CSS"]
---

<a id="CSS-之-补缺备忘用"></a>

## CSS 之 补缺备忘用

个人补缺时记录。

<a id="一、段落相关"></a>

## 一、段落相关

> 关于文字，这次要补充的并不多，是一些并不太常见，但又有实用价值的属性及其值

<a id="首行缩进"></a>

#### 首行缩进

在段落标签中，可以使用`text-indent:length`属性对段落进行指定长度的首行缩进，值得一提的是将长度设置为负数并不能达到悬挂缩进的效果，反而会隐藏前面的`content`。

<a id="词间距"></a>

#### 词间距

每个单词之间的间距`word-spacing:length`,实际上是对内容中的空格的长度进行了设置。

<a id="字间距"></a>

#### 字间距

`letter-spacing:length`

<a id="单行文本溢出省略"></a>

#### 单行文本溢出省略

```css
p{
	...;
    overflow:hidden;
    /*文本溢出部分使用省略号表示*/
    text-overflow:ellipsis;
    /*设置文本不换行*/
    white-space:nowrap;
}
```

<a id="多行文本溢出省略"></a>

#### 多行文本溢出省略

```css
p{
	...;
	display:-webkit-box;
   	/*设置为3行溢出*/
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
}
```

<strong>注：</strong>

1.  `-webkit-line-clamp`用来限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他的WebKit属性。常见结合属性：
2.  `display: -webkit-box;`： 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。
3.  `-webkit-box-orient`： 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。

<a id="段落换行"></a>

#### 段落换行

默认情况下，对于在固定宽度的块级标签中的英文内容，不会拆分单词换行（以空格之间的字符串算作单词），为了解决这个问题，可以通过

```css
p{
    word-wrap:break-word;
    /*或者*/
    word-break: break-all;
}
```

<a id="段落中文字相对于inline-block元素的垂直对齐方式"></a>

#### 段落中文字相对于inline-block元素的垂直对齐方式

例如对于段落中的图片所在的一行中的文字位于上/中/下

```css
img{
    ...;
    vertical-align:top/middle/bottom/*length;
}
```

![默认/buttom](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131131158.png)

![top](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131131409.png)

<a id="二、关于背景-Background"></a>

## 二、关于背景 Background

> 在css中其实对于元素的背景有很多丰富的功能定义，在此次笔记中，将不再赘述我所认为的background常规属性及值。

<a id="背景裁剪"></a>

#### 背景裁剪

默认情况下，元素设置背景是在盒子模型的边框以内（包括边框）的空间内都会渲染到。

背景裁剪就是，限制背景渲染空间：包括边框以内 / 包括padding以内 / 包括内容以内。

```css
div.bg1{
	...;
	background-clip:border-box/padding-box/content-box;
}
```

<a id="背景滚动"></a>

#### 背景滚动

默认下背景会跟随网页一起滚动，实际上也可以将背景固定在屏幕上

```css
div.bg2{
	...;
	background-attachment:screen/fixed;
}
```

<a id="背景线性渐变"></a>

#### 背景线性渐变

1.  为背景色按指定角度进行线性渐变
    
    `backgoround:linear-gradient(90deg,red,blue)`（90度，由红均等向蓝色渐变）
    
2.  可以设置多种颜色`linear-gradient(90deg,red,blue，yellow,...)`
    
3.  设置渐变的距离`linear-gradient(90deg,red 50%,blue 60%)` 即（50%，60%）为渐变空间，来认识一下完整写法其实为`linear-gradient(90deg,red 0%,red 50%,blue 60%,blue 100%)` ，多色同理。
    
    ![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131134830.png)
    
4.  若两色之间的渐变空间为0，既：`linear-gradient(90deg,red 50%,blue 50%)`，就是直接变换的效果了
    
    ![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131135102.png)
    
5.  <strong>重复线性渐变</strong> ，通过`repeating-linear-gradient(角度，颜色1 起始位置，颜色1 结束位置，颜色2起始位置，...)`方法设定，可以实现重复已定义区域的效果完成未定义内容的背景。例如
    
    `repeating-linear-gradient(45deg,yellow 0px,yellow 25px,black 25px,black 50px)`实现警示条
    
    ![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131134857.png)
    

<a id="背景径向渐变"></a>

#### 背景径向渐变

1.  `background/background-image: radial-gradient(shape size at position, start-color, ..., last-color);`
    
    shape 为由内向外的形状，默认为Ellipse椭圆，可设为Circle原型
    
    例如`radial-gradient(Circle,red 0,yellow 40%,black 70%)`
    

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131134846.png)

2.  重复径向渐变
    
    `repeating-radial-gradient(shape size at position, start-color beginLength, ..., last-color endLength)`
    
    例如 `repeating-radial-gradient(black 0px,black 10px,yellow 10px,yellow 20px)`
    
    ![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131150541.png)
    

<a id="三、关于表格Table"></a>

## 三、关于表格Table

<a id="css定义表格"></a>

#### css定义表格

使用css通过设定display 属性的方式绘制表格，效率很低，但是得知道。

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200131152116.png)

```css
div.table{
	...;
	display:table;
}
```

<a id="为表格内容垂直定位"></a>

#### 为表格内容垂直定位

普通单元格只需要使用`vertical-align:top/middle/bottom`。

但是，值得一提的是caption标签对以上属性无效，需要利用该属性`caption{ caption-side:bottom/top; }`

<a id="设置单元格间距"></a>

#### 设置单元格间距

```css
table{
	...;
	border-space:水平间距，垂直间距;
}
```

<a id="为单元格去除互相之间的边距和重复框线"></a>

#### 为单元格去除互相之间的边距和重复框线

```css
table{
	...;
	border-collapse: collapse;
}
```

<a id="四、关于粘性定位-Sticky"></a>

## 四、关于粘性定位 Sticky

在被声明为sticky定位的元素，在参照对象（至少为父元素）为relative的前提下，当该元素的处于相对于参照对象的某一位置阈值前该元素按照正常的文档流定位，然而当其超过该阈值后，则该元素按照fixed定位方式固定在父元素上。

例如

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/gg1.gif)

对于每个分段`section`的标题`h4`和底部`footer`都设置为sticky定位方式，而他们的参照元素是`article`，当其相对于参照元素的顶部距离小于等于0时，切换为fixed方式固定于窗体顶端否则为正常文档流。

而对于底部，当其相对于参照元素的底部距离小于等于50px时则切换为fixed固定于距参照元素底部50px的位置，一旦大于则切换为正常相对定位。

```text
<style>

        article{
            width: 300px;
            margin: auto;
            border: 5px #ddd solid;
            height: 400px;
            overflow-y: scroll;
            position: relative;
        }
        .content{
            background-color: #fff;
            margin-top: 0px;
            padding: 5px;
        }
        article h4{
            padding:15px 5px;
            margin-bottom: 0px;
            color: #fff;
            background-color: #323232;
            position: -webkit-sticky;
            position: sticky;
            top: 0px;
            z-index: 1;
        }
        article footer{
            color: #fff;
            background-color: #888;
            position:-webkit-sticky;
            position: sticky;
            z-index:-1;
            bottom: 50px;
        }
    </style>
```

<a id="五、弹性布局方式Flex"></a>

## 五、弹性布局方式Flex

> 弹性（Flex）布局是一种灵活响应式的布局方式，目前已获得主流浏览器的支持。

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称”容器”。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称”项目”。

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202201335.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

定义容器

```css
.container{
   	/*块级*/
    display:-webkit-flex;
    display:flex;
    /*行内*/
    display:inline-flex;
}
```

<a id="容器的属性（6个）"></a>

### 容器的属性（6个）

<a id="1-项目的排列方向"></a>

#### 1\. 项目的排列方向

```text
flex-direction: row|row-reverse|column|column-reverse
```

主轴分别为自左而右，自右而左，自上而下，自下而上

<strong>注意，根据该属性的定义，会决定主轴和交叉轴的水平和垂直方式。例如，为<code>row/row-reverse</code>时,主轴为水平，交叉轴为垂直，当属性值为<code>column/column-reverse</code>时，主轴为垂直，交叉轴为水平。</strong>

例如

```html
....    
<style>
        .container{
            width: 550px;
            margin: auto;
            display: flex;
            border: 2px yellow solid;
            /*默认值*/
            flex-direction: row;
        }
        .item{
            border: 5px #fff solid;
            width: 100px;
            height: 100px;
            background: #888;
            color: #fff;
            font-size: 40px;
            text-align: center;
            line-height: 100px;
        }
    </style>
....
<body>
    <div class="container">
        <div class="item item1" >1</div>
        <div class="item item2">2</div>
        <div class="item item3">3</div>
        <div class="item item4">4</div>
        <div class="item item5">5</div>
    </div> 
</body> 
....
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202203145.png)

```css
...
	flex-derection:row-reverse;
...
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202204046.png)

```css
...
	flex-derection:column;
...
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202204002.png)

```css
...
	flex-derection:column-reverse;
...
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202203852.png)

<a id="2-项目的换行方式"></a>

#### 2\. 项目的换行方式

```text
flex-wrap: nowrap|wrap|wrap-reverse
```

当主轴上排不下时，对于项目的换行方法，分别为不换行（均等减少所有项目的`main size`）、溢出部分补到后面、溢出部分添至前面

根据上例再追加2个项目6，7后，分别实现

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202204352.png)

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202204442.png)

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202204513.png)

<a id="3-排列换行的简写"></a>

#### 3\. 排列换行的简写

```css
flex-flow: <flex-direction> || <flex-wrap>;
/*例如*/
flex-flow:row wrap;
```

<a id="4-项目在主轴上对齐方式"></a>

#### 4\. 项目在主轴上对齐方式

```text
justify-content: flex-start | flex-end | center | space-between | space-around;
```

设置项目在主轴上的对齐方式

-   主轴起始处对齐（默认值）
-   主轴终止处对齐
-   根据主轴居中
-   两端对齐
-   均等对齐。每个项目两端展开的距离相等，因此项目间的距离是项目与边界间的距离的两倍

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202225037.png)

<a id="5-项目在交叉轴上的对齐方式"></a>

#### 5\. 项目在交叉轴上的对齐方式

```text
align-items: flex-start | flex-end | center | baseline | stretch
```

-   交叉轴起点处对齐
-   交叉轴终点处对齐
-   根据交叉轴居中
-   项目第一行文字为基线对齐
-   如果项目未设置高度或设为auto，默认将占满整个容器的高度，否则以`flex-start`对齐。

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202212313.png)

<a id="6-多行项目在交叉轴上的对齐方式"></a>

#### 6\. 多行项目在交叉轴上的对齐方式

```text
align-content:flex-start | flex-end | center | space-between | space-around | stretch
```

<strong>注意，只对多行的项目的容器有效</strong>

-   `flex-start`：与交叉轴的起点对齐。
-   `flex-end`：与交叉轴的终点对齐。
-   `center`：与交叉轴的中点对齐。
-   `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
-   `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
-   `stretch`（默认值）：轴线占满整个交叉轴。

<em>和<code>justify-content</code>效果基本一致，仅依据轴相反，因此不再置示意图。</em>

<a id="项目的属性（6个）"></a>

### 项目的属性（6个）

<a id="1-调整项目顺序"></a>

#### 1\. 调整项目顺序

```css
order:<number> /*默认为0*/
```

`order`的值确定项目先后顺序，按从低到高，同级间按dom先后顺序排，是一种优雅的调整项目先后顺序的方式。

例如

```css
...
		.item4{
            order: -1;
        }
        .item1{
            order: 1;
        }
...
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202214943.png)

<a id="2-项目按比例放大"></a>

#### 2\. 项目按比例放大

```css
flex-grow: <number>; /* default 0 负数无效 */
```

`flex-grow`属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。

默认情况：

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202220124.png)

所有项目等分剩余空间：

```css
.item{
    ...;
    flex-grow:1;
}
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202215502.png)

或者：item2是item1分得剩余空间的2倍，而item3为item1的3倍

```css
.item1{
    flex-grow:1;
}
.item2{
    flex-grow:2;
}
.item3{
    flex-grow:3;
}
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202220004.png)

<a id="3-项目按比例缩小"></a>

#### 3.项目按比例缩小

```css
flex-shrink: <number>; /* default 1 负数无效*/
```

当该属性值为默认1时，在`flex-wrap`为`nowrap`的情况下，所有项目在超出主轴宽度时会等比缩小。而`flex-shrink`的属性值越大则缩小的比例也就越高。

<strong>值得一提的是，当某项目的该属性值为0时，则该项目不会被自动缩小。</strong>

<a id="4-项目main-size的设置"></a>

#### 4.项目`main size`的设置

```text
flex-basis: <length> | auto; /* default auto */
```

`flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。

<a id="5-简写方式"></a>

#### 5\. 简写方式

```text
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。该属性有两个快捷值：`auto` (`1 1 auto`) 和 none (`0 0 auto`)。

这就有了我们常见的写法：

```css
.item{
    flex:1;
}
```

![各个项目等比放大](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202215502.png)

或者：

```css
.item{
    flex:1 0 auto;
}
```

![等比放大，但不自动缩小](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202222743.png)

![与上同](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202222803.png)

<a id="6-对项目单独设置在交叉轴上的对齐方式"></a>

#### 6.对项目单独设置在交叉轴上的对齐方式

```text
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```

`align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

例如

```css
.item{
    ...;
    align-items:center;
}
.item3{
    align-self:flex-end;
}
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200202223829.png)

<a id="六、栅格布局方式Grid"></a>

## 六、栅格布局方式Grid

> 众人云，Grid布局是CSS中最强的布局方式。Grid 布局与 Flex 布局有一定的相似性，都可以指定容器内部多个项目的位置。但是，它们也存在重大区别。
> 
> Flex 布局是轴线布局，只能指定”项目”针对轴线的位置，可以看作是<strong>一维布局</strong>。Grid 布局则是将容器划分成”行”和”列”，产生单元格，然后指定”项目所在”的单元格，可以看作是<strong>二维布局</strong>。Grid 布局远比 Flex 布局强大。

<strong>注</strong>

-   容器和项目：<em>和Flex布局所述一致，只对项目生效，但不包括项目的子元素</em>
-   行`row`和列`column`与单元格`cell`：<em>容器中的水平方向为行，垂直方向为列，行列交叉处为单元格</em>
-   网格线`grid line`:<em>划分网格的线，分水平网格线和垂直网格线</em>

定义为Grid容器

```css
.container{
    display:grid;
    /*或行内元素*/
    display:inline-grid;
}
```

<a id="容器的属性container"></a>

### 容器的属性`container`

<a id="1-依次定义各列各行宽度"></a>

#### 1\. 依次定义各列各行宽度

```css
grid-template-rows: 第一行高度 第二行高度 ... ;
grid-template-column: 第一列宽度 第二列宽度 ...;
```

通过这两个属性的设置，可以确定该容器内有多少行和多少列，定义多少就有多少。

例如定义个3\*3的表格：

```css
.container{
    ...;
    dispaly:grid;
    grid-template-rows:100px 100px 100px;
    grid-template-columns: 100px 100px 100px;
    /*当然百分比或者其他单位也可以*/
}
```

![3\*3等距表格](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200203154736.png)

又或者定义一个 不规则 2\*4的表格：

```css
         
.container{
    ...;
    dispaly:grid;
    grid-template-rows:100px 200px;
    grid-template-columns: 100px 100px 50px 100px;
}
```

![2\*4](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200203155309.png)

<strong>对于容器内超出单元格总数的项目会自动按行追加下去，注意，宽度仍依照Grid定义的宽度，但是行高为项目自身的宽度</strong>

可以注意到，如果对于具有要定义很多行列数据的容器，这两个属性的属性值写起来很繁琐。所以CSS提供了一些方法分别用于处理一些特殊情况：

-   repeat()
    
-   auto-fill关键字
    
-   fr关键字
    
-   minmax()
    
-   auto关键字
    
-   \[\]
    
    <strong>repeat 按某些值重复</strong>
    

```css
{
    grid-template-rows:repeat(重复次数，长度1 | 长度2 | ...);
}
```

<strong>auto-fill 自动设置重复次数</strong>

与repeat函数配合使用，根据容器的`width`或者`height`来确定最大能放下这容器行或列的重复次数。假设容器宽度为400px,那么下面这段代码将会将容器确定为4列。

```css
{
	grid-template-rows:100px 100px ;
	grid-template-columns: repeat(auto-fill,100px);
}
```

<strong>fr作为单位 在项目的尺寸没有明确定义时，根据容器的宽或高分别按比分配项目的列宽或行高</strong>

类似于Flex中的flex-grow属性，但是fs是根据容器的整个尺寸确定的，而flex-grow是根据容器的剩余空间按比分配。如果值列表中有明确的长度定义，则根据剩余尺寸按比分配如例2。

例1

```css
{
    grid-template-rows:repeat(4,100px);
    grid-template-columns: 1fr 2fr;
}
```

![4\*2](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200203163244.png)

例2

```css
{
    grid-template-rows:repeat(4,100px);
    grid-template-columns: 100px 1fr 2fr;
}
```

若容器宽度为400px ,则列宽分别为100px、100px、200px。

<strong>minmax() 确定项目所能取得行高或列宽的范围</strong>

`minmax()`函数产生一个长度范围，表示长度就在这个范围之中。它接受两个参数，分别为最小值和最大值。

```css
grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```

<strong>[]为网格线命名</strong>

`grid-template-columns`属性和`grid-template-rows`属性里面，还可以使用方括号，指定每一根网格线的名字，方便以后的引用。

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4 endL];
}
```

和类名一样，可以为一个网格线同时定义多个名称如`[r4 endL]`。

<a id="2-设置行列间距"></a>

#### 2.设置行列间距

```css
/*行间距*/
row-gap:length;
/*列间距*/
column-gap:length;
/*简写方式*/
grid-gap:<row-gap> <column-gap>;
```

这里的行间距仅指行与行之间的距离，不包括行与边界的距离。列间距同理。若行列间距都相等，`grid-gap`也可以只填一个值。

```css
.container{
    ...;
    column-gap: 30px;
    row-gap: 50px;
}
```

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200203170046.png)

<a id="3-区域划分"></a>

#### 3\. 区域划分

```css
gird-template-areas:'第一行第一列区域名 第一行第二列区域名 第一行第三列区域名 ...'
					'第二行第一列区域名...'
					...
```

对每个单元格来说，可能多个单元格同属一个区域，可以为他们进行定义区域，同一区域的区域名一致。

例如 划分为3\*3个不同的区域

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-template-areas: 'a b c'
                       'd e f'
                       'g h i';
}
```

划分3\*1个不同区域

```css
.container {
  grid-template-areas: 'a a a'
                       'b b b'
                       'c c c';
}
```

<strong>注意，存在一些不需要利用的单元格区域，可以使用<code>.</code>号</strong>

例如，不需要利用最后一列

```css
.container {
  grid-template-areas: 'a a .'
                       'b b .'
                       'c c .';
}
```

区域的命名会影响到网格线。每个区域的起始的水平网格线和垂直网格线会自动命名为`区域名-start`，终止网格线自动命名为`区域名-end`。

<a id="4-单元格排列换行"></a>

#### 4\. 单元格排列换行

```text
grid-auto-flow: row | column | row dense |column dense;
```

分别为

-   按行排列，换行时添加到下一行第一列（默认）
-   按列排列，换行时添加到下一列第一行
-   按行排列，换行时添加到下一行第一列，但并不严格，会自动填充
-   按列排列，换行时添加到下一列第一行，但并不严格，会自动填充

<a id="5-项目内容对齐方式"></a>

#### 5.项目内容对齐方式

```css
justify-items: start | end | center | stretch;
align-items: start | end | center | stretch;
place-items: <align-items> <justify-items>;
```

-   start：对齐单元格的起始边缘。
-   end：对齐单元格的结束边缘。
-   center：单元格内部居中。
-   stretch：拉伸，占满单元格的整个宽度（默认值）。

1.  前两个分别是单元格内容的水平对齐方式和垂直对齐方式，这两个并不陌生，各个属性值的效果和`flex`布局中的一致（当然，相比之下去掉了一些`flex`前缀）。注意的是当单元格内容的高宽都没有定义的时候，默认值是`stretch`,一旦定义高或宽后，其对应的`justify-items`或`align-items`默认值改为`start`
    
2.  而`place-items`是前两者的简写方式,如果省略第二个值，则浏览器认为与第一个值相等。
    

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200204151912.png)

```css
.container{
    ...;
    justify-items: center;
    align-items: end;
    /*或者*/
    place-items:center end;
}
```

<a id="6-表格整体在容器内的对齐方式"></a>

#### 6\. 表格整体在容器内的对齐方式

```css
justify-content: start | end | center | stretch | space-around | space-between | space-evenly;

align-content: start | end | center | stretch | space-around | space-between | space-evenly;

place-content:<align-content> <justify-content> ;
```

-   start - 对齐容器的起始边框。
-   end - 对齐容器的结束边框。
-   center - 容器内部居中。
-   stretch - 项目大小没有指定时，拉伸占据整个网格容器。
-   space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
-   space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。
-   space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

<a id="7-设置新增行列的高宽"></a>

#### 7\. 设置新增行列的高宽

```css
gird-auto-rows:length;
grid-auto-columns:length;
```

`grid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高。它们的写法与`grid-template-columns`和`grid-template-rows`完全相同。如果不指定这两个属性，浏览器完全根据单元格内容的大小，决定新增网格的列宽和行高。

> `grid-template`属性是`grid-template-columns`、`grid-template-rows`和`grid-template-areas`这三个属性的合并简写形式。
> 
> `grid`属性是`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`这六个属性的合并简写形式。

<a id="项目的属性item"></a>

### 项目的属性`item`

<a id="1-根据网格线控制项目位置"></a>

#### 1.根据网格线控制项目位置

```css
grid-column-start:左边框所在的垂直网格线
grid-column-end:右边框所在的垂直网格线
grid-row-start:上边框所在的水平网格线
grid-row-end:下边框所在的水平网格线
```

<strong>简写模式</strong>

```text
grid-column:起始值 / 结束值；
grid-row：起始值 / 结束值；
```

<strong>斜杠以及后面的部分可以省略，默认跨越一个网格。</strong>

决定项目的左右框线和上下框线，其中框线可以用数字（从1开始计数）表示，也可以使用在容器阶段定义的网格线名称。

```css
.container{
    ...;
    grid-template-rows:repeat(4,100px);
    grid-template-columns: [l1]1fr [l2]2fr [l3]; /*之前说过这里可以定义网格线名称*/
}        
.item1{        
    grid-column-start: 1;    
    grid-column-end:3;    
    /*简写*/
    grid-column:1/3;
}

.item4{
    grid-row-start: 3;    
    grid-row-end: 5;    
    grid-column-start: l1;   /*使用之前定义的网格线名称*/  
    grid-column-end: l3;    
}
```

![项目1和项目4发生的变化](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200204161213.png)

这里值得一提的是，当某单元格发生改变后，具体的填充效果由容器阶段定义的`grid-auto-flow`决定。

这四个属性的值还可以使用<strong><code>span</code>关键字</strong>，表示”跨越”，即左右边框（上下边框）之间跨越多少个网格。<strong>当跨越的网格数超出该行或者该列最大剩余数目的时候会扩大该项目所属容器的宽或高</strong>

```css
.item1 {
  grid-column-start: span 2;
  /*使用span时，两者效果一致*/
  grid-column-end: span 2; 
    
  /*使用简写模式时，只在终止值使用span*/
  grid-column:1 / span2;
}
```

使用简写方式，再重新实现`item4`的位置控制

```css
.item4{
    grid-row:3 / span 2;
    grid-column: l1 / span 2;
}
```

<a id="2-根据区域放置项目"></a>

#### 2.根据区域放置项目

```css
grid-area:区域名;
```

通过该方法，我们可以指定该项目放到任何一个在容器中使用`grid-template-areas`属性来定义过的区域中去。

![](https://cdn.jsdelivr.net/gh/JackyM06/MyPictures/20200204163847.png)

上例中设置了一个3\*2的表格，4共个项目，并设定了4个区域，分别指定了每个项目的区域:

```css
.container{
    ...;
    grid-template-areas: 'head head'
                         'content note'
                         'foot foot';
}

        .item1{
            grid-area: content;
        }
        .item2{
            grid-area: note;
        }
        .item3{
            grid-area: head;
        }
        .item4{
            grid-area:foot;
        }
```

`grid-area`属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。

```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
```

所以上上例中的`item4`可以简写为

```css
.item4{
    gird-area:3 / 1 / span 2 / span 2; 
}
```

<a id="3-单个项目中内容对齐方式"></a>

#### 3.单个项目中内容对齐方式

```css
justify-self: start | end | center | stretch;
align-self: start | end | center | stretch;
place-self:<align-self> <justify-self>;
```

和容器中定义的`justify-items`那三个属性效果一致，唯一的区别就是，容器中定义的是所有的项目的对齐方式，而`xxx-self`是项目独自的对齐方式。

<a id="七、计量单位"></a>

## 七、计量单位

<a id="px"></a>

### `px`

以像素数目为基准的绝对单位。

<a id="pt"></a>

### `pt`

以物理尺寸”磅“为绝对单位，类似于word中的字体单位，一般12磅字相当于五号字。

<a id="em"></a>

### `em`

`1em`表示相对于父元素的字体大小的一种相对单位。

<a id="rem"></a>

### `rem`

`1rem`表示根元素(`html`)的字体大小的一种相对单位。默认情况下，网页的字体大小是`16px`，所以默认下`1rem`为`16px`。更改根元素的字体大小：

```css
html{
    font-size:10px;  /*此时 1rem = 10px*/
}
```

<a id="vw"></a>

### `vw`

表示viewpoint width,视窗宽度。`1vw`代表视窗宽度的`1%`，是一种相对单位。

<a id="vh"></a>

### `vh`

表示viewpoint height 视窗高度。`1vh`代表视窗高度的`1%`，是一种相对单位。

<a id="vmax"></a>

### `vmax`

`vmax`相对于视口的宽度或高度中较大的那个。其中最大的那个被均分为100单位的`vmax`。

<a id="vmin"></a>

### `vmin`

`vmin`相对于视口的宽度或高度中较小的那个。其中最小的那个被均分为100单位的`vmin`。

<a id="八、媒体查询"></a>

## 八、媒体查询

媒体查询就是对于不同的设备（以屏幕分辨率作为区分）使用一部分或者完全不同的css样式。

常见的默认种类有：

| 选项 | 说明 |
| --- | --- |
| all | 所有媒体类型 |
| screen | 用于电脑屏幕，平板电脑，智能手机等 |
| print | 打印设备 |
| speech | 应用于屏幕阅读器等发声设备 |

> 注：tty, tv, projection, handheld, braille, embossed, aural 设备类型已经被废弃

-   可以使用 link 与 style 中定义媒体查询
    
    ```html
    <link rel="stylesheet" href="screen.css" media="screen">
    <style media="print">
        ...
    </style>
    ```
    
-   也可以使用 `@import url(screen.css) screen` 形式媒体使用的样式
    
    使用`@import` 可以引入指定设备的样式规则。文件中引入一个样式文件，在这个文件中再引入其他媒体的样式文件。
    
    ```text
    <link rel="stylesheet" href="style.css">
    ```
    
    <strong>style.css</strong>
    
    ```text
    @import url(screen.css) screen;
    @import url(print.css) print;
    ```
    
-   可以用逗号分隔同时支持多个媒体设备
    
-   未指定媒体设备时等同于all
    
-   如果上述常见设备并不能解决需求，可以使用查询条件`@media`来进一步细分
    
    例如横屏和最小宽度不得低于1000px的设备时，将根元素的字体大小设置为20px:
    
    ```css
    @media screen and (orientation: landscape) and (min-width:1000px){
        html{
            font-size:20px;
        }
    }
    ```
    

-   连接符与 and 、 或 or、 非 not
-   一些常见的条件：除了常见媒体名称，其余每个独立条件需要使用括号（）

| 媒体特性 | 取值 | 接受min/max | 描述 |
| :-- | :-- | :-- | :-- |
| width |  | yes | 定义输出设备中的页面可见区域宽度 |
| height |  | yes | 定义输出设备中的页面可见区域高度 |
| device-width |  | yes | 定义输出设备的屏幕可见宽度 |
| device-height |  | yes | 定义输出设备的屏幕可见高度 |
| orientation | portrait \| landscape | no | 定义’height’是否大于或等于’width’。值portrait代表是，landscape代表否 |
| aspect-ratio |  | yes | 定义’width’与’height’的比率 |
| device-aspect-ratio |  | yes | 定义’device-width’与’device-height’的比率。如常见的显示器比率：4/3, 16/9, 16/10 |
| color |  | yes | 定义每一组输出设备的彩色原件个数。如果不是彩色设备，则值等于0 |
| color-index |  | yes | 定义在输出设备的彩色查询表中的条目数。如果没有使用彩色查询表，则值等于0 |
| monochrome |  | yes | 定义在一个单色框架缓冲区中每像素包含的单色原件个数。如果不是单色设备，则值等于0 |
| resolution |  | yes | 定义设备的分辨率。如：96dpi, 300dpi, 118dpcm |
| scan | progressive \| interlace | no | 定义电视类设备的扫描工序 |
| grid |  | no | 用来查询输出设备是否使用栅格或点阵。只有1和0才是有效值，1代表是，0代表否 |
