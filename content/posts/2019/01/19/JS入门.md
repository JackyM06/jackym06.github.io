---
title: "JS入门"
pubDatetime: 2019-01-19T21:03:30+08:00
modDatetime: 2019-08-07T19:52:52+08:00
description: "JavaScript 基础笔记，涵盖变量与数据类型、作用域、事件和常见输出方式。"
categories: ["前端基础"]
tags: ["JavaScript"]
---

<a id="一、js的输出"></a>

## 一、js的输出

JavaSctipt没有任何打印输出的函数或方法

1.  window.alert()浏览器警告框
2.  document.write()方法可以将内容写入到Html中（如果在写入流结束后再使用将会覆盖整个HTML）
3.  innerHTML 写入与读取HTML元素
4.  console.log()在浏览器控制台输出

<a id="二、js的基本语法"></a>

## 二、js的基本语法

###（1）JavaScript的常量称为字面量。所有字面量类型有：###  
1.数字(Number)  
2.字符串(String)  
3.数组(Array)  
4.对象(Object)  
5.函数(Function)  
6.表达式

<a id="2-JavaScript中变量一般由var来进行定义"></a>

### (2)JavaScript中变量一般由var来进行定义

```text
var a=0,b;
b=0;
/*注释 a=0,b=0 */
```

<a id="3-JavaScript-中，常见的是小驼峰法的命名规则，如-lastName-而不是lastname"></a>

### (3)JavaScript 中，常见的是小驼峰法的命名规则，如 lastName(而不是lastname)

```text
变量的三种命名方法：
var firstName='king';//小驼峰
var FirstName='queen';//大驼峰
var first_name='maizi';//下划线法
```

<a id="三、JavaScript的数据类型"></a>

## 三、JavaScript的数据类型

```text
JavaScript中的基本类型可以分为：
基本数据类型:Number(数字)、String（字符串）、布尔型(Boolean)、对空（Null）、未定义(Undefined)、Symbol
引用类型:对象(Object)、数组(Array)、函数(Function)
```

<a id="1-创建数组的三种方法"></a>

### (1)创建数组的三种方法

```text
1.var cha=new Array("123","456");
2.var cha=new Array();
  cha[0]="123";
  cha[1]="456";
3.var cha=["123","456"];
```

<a id="2-创建对象的方法"></a>

### (2)创建对象的方法

```text
1.    
var person={
    name="jone",
    sex="男",
    id="123456"
}
2.键值对的容器，“键”必须为字符串
var person={
    "name":"小明",
    "age":"18",
    "like":function(){
            return "喜欢打篮球,弹吉他";
    }
}
/*对象属性的2种寻址方式:*/
person.name;
person["name"];
```

<a id="3-声明变量类型"></a>

### (3)声明变量类型

```text
var carname=new String;
var x=      new Number;
var y=      new Boolean;
var cars=   new Array;
var person= new Object;
```

<a id="4-函数的一般格式"></a>

### (4)函数的一般格式

```text
function 函数名(形参列表){
    ……
}
```

<a id="5-给未声明的变量赋值"></a>

### (5)给未声明的变量赋值

如果您把值赋给尚未声明的变量，该变量将被自动作为 window 的一个属性。  
carname=”haha”;  
console.log(window.carname)//haha

```text
/*给未声明变量赋值创建的全局变量，是全局对象的可配置属性，可以删除。*/    
delete carname;//正常删除（只有可配置的属性才能delete）
```

<a id="四、JavaScript的作用域"></a>

## 四、JavaScript的作用域

<a id="JavaScript中作用域的探讨范围是：可访问变量、对象和函数。"></a>

### JavaScript中作用域的探讨范围是：可访问变量、对象和函数。

```text
作用域可以分为全局变量和局部变量。
在函数外定义的变量为全局变量，而在函数内定义的变量为局部变量。
全局作用域: 网页中所有脚本和函数均可使用。
局部变量:仅在声明的函数中可用
```

全局变量，或者函数，可以覆盖 window 对象的变量或者函数。局部变量，包括 window 对象可以覆盖全局变量和函数

> ES6中加入let和const来定义变量。const是用于声明常量，增加了安全性。用var定义的变量只能是全局有效或者整个函数块有效，而let声明的变量、语句或者表达式允许你只在本级代码块中使用。

<a id="五、JavaScript事件"></a>

## 五、JavaScript事件

<a id="1-HTML中添加事件属性"></a>

### (1)HTML中添加事件属性

```text
<标签名 事件属性名="……代码"></标签名>
```

<a id="2-在js中为相关元素添加事件属性"></a>

### (2)在js中为相关元素添加事件属性

```text
在HTML中:
<button id="test" onclick="check()">检查</button>
在js中:
var test=document.getElementById("test");
test.onclick=check();
```

<a id="3-常用的事件属性名"></a>

### (3)常用的事件属性名

| 事件 | 描述 |
| :-- | :-- |
| onchange | HTML 元素改变 |
| onclick | 用户点击 HTML 元素 |
| onmouseover | 用户在一个HTML元素上移动鼠标 |
| onmouseout | 用户从一个HTML元素上移开鼠标 |
| onkeydown | 用户按下键盘按键 |
| onload | 浏览器已完成页面的加载 |
| [http://www.runoob.com/jsref/dom-obj-event.html](http://www.runoob.com/jsref/dom-obj-event.html "更多事件") |  |

<a id="六、JavaScript数据类型转换"></a>

## 六、JavaScript数据类型转换

```text
Number()转换为数字,String()转换为字符串,Boolean()转换为布尔型
```

5种数据类型: string,number,boolean,,object,function

3种对象类型：Object，Date,Array

2种不包含任何值的数据类型：null,undefined

> 可以利用typeof操作符来查看数据类型。
> 
> 注：NaN的数据类型是number,Array和Date以及null的数据类型是object,未定义变量的数据类型为undefined
