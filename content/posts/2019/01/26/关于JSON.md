---
title: "关于JSON"
pubDatetime: 2019-01-26T16:10:33+08:00
modDatetime: 2019-08-07T19:54:44+08:00
description: "介绍 JSON 的数据格式与语法规则，并补充 javascript:void(0) 在链接中的作用"
categories: ["前端基础"]
tags: ["JavaScript"]
---

<a id="一、JavaScript-JSON"></a>

### 一、JavaScript JSON

-   Json全称 JavaScript Object Notation(Js 对象标记)
-   轻量级数据交换格式
-   Json是用于存储和传输数据的格式。
-   Json通常用于服务端向网页传递数据

<a id="JSON语法结构"></a>

#### JSON语法结构

<a id="语法规则"></a>

##### 语法规则

JSON语法事JS对象表示语法的子集。书写格式为

```text
"name"="Jack";
或
"age"=18;
```

JSON的值可以是：

-   数字
-   字符串(加双引号)
-   逻辑值(true或false)
-   数组(再方括号中，用逗号隔开各个数组元素)
-   对象(再花括号中，逗号隔开各个属性)
-   null

例如JSON数组中包含3个对象:

```text
{
"sites":[
{"name":"Jack","age":15},
{"name":"Bob","age",16},
{"name":"Unto","age",16}
]
}
```

JavaScript中JSON对象内置了两个函数用于将Js于JSON进行转换

| 函数 | 描述 |
| :-- | :-- |
| JSON.parse(Json字符串) | 将一个JSON字符串转换为JavaScript对象 |
| JSON.stringify(JavaScript值) | 将JavaScript值转换为JSON字符串 |

Js中eval函数可以执行某个字符串中的语句。但是字符串内容如果为函数或者是代码块，需要在字符串前后分别连接”(“和”)”.

```text
eval(String);
//JSON对象化处理:
eval('('+user+')');
//例如
eval("("+"function (){return 0;}"+")")(); //返回0
```

> 不建议在JSON中使用函数。

<a id="二、Javascript-void-0-含义"></a>

### 二、Javascript:void(0)含义

void关键字表示运行表达式，但是不返回值(undefined)。例如:

```text
<a href="javascript:void(0)">单机此处啥也不会发生</a>
//确实啥也不会发生
<a href="javascript:void(alert('warning!'))">点我</a>
//浏览器提示warning!
```

<a id="总结"></a>

### 总结

1.  JSON是一种js与服务器端的交换格式
2.  JSON在ajax应用中要优于XML
3.  JSON.parse()函数可以将JSON字符串转换为JS对象
4.  JSON.stringify（）函数可以将JS对象转换为JSON字符串格式。
5.  JavaScript代码规范，其中尽量用4个空格键来代替tab键
