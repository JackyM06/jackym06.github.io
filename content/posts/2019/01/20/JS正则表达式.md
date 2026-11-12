---
title: "JS正则表达式"
pubDatetime: 2019-01-20T21:22:05+08:00
modDatetime: 2019-08-07T19:54:00+08:00
description: "介绍正则表达式的匹配规则与常用方法，并记录异常处理、严格模式、表单验证和 this 的用法"
categories: ["前端基础"]
tags: ["JavaScript"]
---

<a id="一、正则表达式"></a>

### 一、正则表达式

<a id="RegExp-对象"></a>

#### RegExp 对象

正则表达式是描述字符模式的对象。  
正则表达式用于对字符串模式匹配及检索替换，是对字符串执行模式匹配的强大工具。

```text
语法:
var regexp=new RegExp("模式","修饰符");
或者：
var regexp=/模式/修饰符;
/*其中模式就是要去与目标字符串去进行匹配的字符串*/
```

<a id="修饰符"></a>

#### 修饰符

| 修饰符 | 功能 |
| :-- | :-- |
| i | 不区分字母大小写 |
| g | 全局搜索(查找所有匹配，而非在查找到第一个后停止) |
| m | 执行多行匹配 |

<a id="模式内方法"></a>

#### 模式内方法

<a id="1-方括号"></a>

##### 1.方括号

方括号是用于查找某个范围内的字符：

| 表达式 | 描述 |
| :-- | :-- |
| \[abc\] | 查找方括号之间的任何字符。注:\[\\u4E00-\\u9FA5\]是查找中文 |
| \[^abc\] | 查找任何不再方括号之间的字符 |
| \[0-9\]、\[a-z\]、\[A-Z\]、\[A-z\] | 查找(0-9)或(a-z)或(A-Z)或(A-Z和a-z)的之间的数字或字符 |
| (red\|blue\|green) | 查找三者值中任意一项 |

<a id="2-元字符"></a>

##### 2.元字符

元字符是拥有特殊含义的字符:

| 元字符 | 描述 |
| :-- | :-- |
| . | 查找单个字符，除了换行和行结束附 |
| \\s,\\S | 查找空白字符和查找非空配字符 |
| \\w,\\W | 查找单词字符(大小写字母和下划线)和非单词字符 |
| \\d,\\D | 查找数字和非数字字符 |
| \\b,\\B | 匹配单词边界和非单词边界 |
| \\0 | 查找NULL字符 |
| \\n | 查找换行符 |
| \\f | 查找换页符 |
| \\r | 查找回车符 |
| \\t | 查找制表符 |
| \\v | 查找垂直制表符 |

<a id="3-量词"></a>

##### 3.量词

| 量词 | 描述 |
| :-- | :-- |
| n+ | 匹配任何包含至少一个n的字符串 |
| n\* | 匹配任何包含0个或多个n的字符串 |
| n? | 匹配任何包含0个或1个n的字符串 |
| n{X} | 匹配包含X个n的字符串 |
| n{X,} | 匹配至少包含X个n的字符串 |
| n{X,Y} | 匹配至少X个n，至多Y个n的字符串 |
| n$ | 任何结尾为n的字符串 |
| ^n | 任何开头为n的字符串 |
| ?=n | 匹配任何后面紧接着n的字符串,如/I(?= am)/匹配”I am Maojiankai”中的I |
| ?!n | 匹配任何其后紧接指定字符串n的字符串 |

<a id="4-RegExp对象方法"></a>

##### 4.RegExp对象方法

```text
RegExpObject.exec(String) 返回匹配的值，如匹配失败返回Null
RegExpObject.test(String) 返回是否匹配，返回类型为布尔型
RegExpObject.toString() 返回正则表达式的字符串类型
```

<a id="5-支持正则表达式的String对象方法"></a>

##### 5.支持正则表达式的String对象方法

```text
String.search(查找的字符串或者正则表达式) 返回匹配位置。 
String.match(正则表达式) 找到一个或多个正则表达式匹配的值不过这依赖于g修饰符,否则和search()功能一致。
String.replace(要替换字符串或正则表达式，新字符串) 返回被替换操作后的整个字符串。
String.split(字符串或正则表达式) 将字符串按指定参数分割为字符串数组，如果参数为空则不改变原字符，如果参数为""则每个字符都会被分割。
```

<a id="二、JavaScript异常处理"></a>

### 二、JavaScript异常处理

与Java处理异常有相似之处，由try、catch、throw关键字组成。

```text
基本格式：
try{
    代码块
    [throw抛出异常]
}catch(error异常变量){
    异常处理代码.
}finally{
...    //结束处理
}
这里需要注意，try喝catch是成对出现的。finally使得不论是否产生异常都会执行其下代码块。
```

<a id="三、变量提升和严格模式"></a>

### 三、变量提升和严格模式

<a id="变量提升"></a>

#### 变量提升

JavaScript允许先使用变量，后声明。

```text
a=5;
console.log(a) \\5
var a;
console.log(a) \\5
```

这被称为变量的提升。需要注意的是初始化不会被提升：

```text
console.log(a);\\undefined
var a=9; //这里a被提升了，但是a=9并未被提升，所以只是声明了a，所以a=undefined
```

<a id="严格模式（strict-mode）"></a>

#### 严格模式（strict mode）

严格模式下不能使用未声明变量。严格模式的声明只能是在脚本或函数的头部添加:

```text
"use strict";
```

<a id="严格模式的限制"></a>

##### 严格模式的限制

1.  不允许使用未声明变量(对象也是一个变量)
2.  不允许删除变量
3.  不允许删除函数
4.  不允许变量重名`funciton a(p1,p1);`
5.  不允许使用八进制`var x=010;`
6.  不允许使用转义字符`var x=\010;`  
    [http://www.runoob.com/js/js-strict.html](http://www.runoob.com/js/js-strict.html "更多限制信息")

<a id="四、JavaScript表单验证"></a>

### 四、JavaScript表单验证

HTML表单自动验证，在HTML中为`input`添加`required="required"`属性后，如果该字段的值为空，浏览器会组织表单提交。

一般为`form`标签添加`onsubmit="return 验证方法（）"`用来实现点击提交后的表单验证。

<a id="HTML约束验证"></a>

#### HTML约束验证

HTML5中新增的表单验证方式，基于:

-   HTML输入属性
-   [CSS伪类选择器](http://www.runoob.com/css/css-pseudo-classes.html)
-   DOM属性和方法

<a id="约束验证HTML输入属性"></a>

##### 约束验证HTML输入属性

| 属性 | 描述 |
| :-- | :-- |
| disabled | 规定输入的元素不可用 |
| max,min | 规定输入元素的最大最小值 |
| required | 规定输入元素字段是必需的 |
| type | 规定输入元素的类型 |
| [更多HTML输入属性](http://www.runoob.com/html/html5-form-attributes.html) |  |

<a id="约束验证DOM"></a>

##### 约束验证DOM

<a id="方法"></a>

###### 方法

```text
checkValidity(); 返回input元素中数据是否合法
setCustomValidity();设置input元素的vilidationMessage属性值，设置前需要将属性值设
置为空(""或null或undefined)，经过checkValidity()
判断后再设置其他自定义值，否则checkValidity()的值始终为false。
```

<a id="属性"></a>

###### 属性

```text
validity;返回input元素输入值是否合法
validationMessage;浏览器错误提示
willValidate;指定input是否需要验证(由input是否设置required属性确定)返回布尔值
```

<a id="五、JavaScript的this关键字"></a>

### 五、JavaScript的this关键字

<a id="基本规则"></a>

#### 基本规则

-   在方法中,this指向该方法所属的对象
-   如果单独使用,this指向全局对象
-   在函数中，this 表示全局对象
-   在函数中，在严格模式下，this 是未定义的(undefined)。
-   在事件中，this 表示接收事件的元素。
-   类似 call() 和 apply() 方法可以将 this 引用到任何对象。

> 与Java中的this基本无差异

<a id="显式函数绑定"></a>

#### 显式函数绑定

显式函数绑定。利用apply()和call()这两个函数对象的方法,允许函数切换this绑定的对象

```text
var person1 = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
var person2 = {
  firstName:"John",
  lastName: "Doe",
}
person1.fullName.call(person2);  // 返回 "John Doe"
```

<a id="总结"></a>

### 总结

1.  正则表达式是用于检索或替换字符串用的，格式一般为/模式/修饰符。
2.  HTML的表单验证中可以运用到正则表达式也可以用HTML约束验证。
3.  Js异常处理与Java无异，由try-catch关键子构成
4.  this关键字与Java中一致，Js中可以通过apply()和call()这两个函数对象方法来切换函数中this指向。
