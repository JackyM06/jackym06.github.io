---
title: "JS函数"
pubDatetime: 2019-02-17T12:31:18+08:00
modDatetime: 2019-08-07T19:52:26+08:00
description: "整理 JavaScript 函数的定义、参数与调用方式，并通过代码示例说明箭头函数和闭包。"
categories: ["前端基础"]
tags: ["JavaScript"]
---

<a id="一、JavaScript函数"></a>

### 一、JavaScript函数

<a id="定义"></a>

#### 定义

JavaScript中必须使用function来定义函数

```text
function name([a[,b][,c]...]){
    代码
}
```

<a id="函数参数"></a>

#### 函数参数

js函数对参数的值类型没由进行任何检查。函数再定义是列出的参数被称为“显式参数(Parameters)”，而调用时真实传递的值被称为“隐式参数(Arguments)”。

<a id="默认值-ES6"></a>

##### 默认值(ES6)

ES6中，支持类似于C++中的为参数赋默认值，例如:

```text
funciton sum(x,y=10){
    return  x+y;
}
sum(0,2); //2
sum(5); //15
```

<a id="Arguments-对象"></a>

##### Arguments 对象

JavaScript函数有个内置的Arguments数组对象，它存储了调用函数时所有的参数值。类似于Java中主函数会再参数中加入”String \[\] args”的方法。例如：

```text
//在任意多个参数中查到其中的最大值的函数：
function findMax() {
    var i, max = arguments[0];
    if(arguments.length < 2) return max;
    for (i = 0; i < arguments.length; i++){
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    return max;
}
x = findMax(1, 123, 500, 115, 44, 88); //x=500
```

<a id="传值注意事项"></a>

##### 传值注意事项

通过一般的值传递，相当于在函数中创建了一个副本，在函数中修改不会改变函数外部的值。而通过对象传值相当于传的是地址，如果在函数体内修改对象的值将会影响到源对象的值！

<a id="函数提升"></a>

#### 函数提升

funciton 函数支持提升(提升(Hoisting)是Js在预编译时发生的将某些对象放到其作用域内的最前面的行为)，所以支持先调用后声明，例如:

```text
sum(5,2); //10

function sum(x,y){return x+y;}
```

<a id="匿名自调用函数"></a>

#### 匿名自调用函数

未命名的函数称为匿名函数，而自调用也就是函数自己调用自己，例如:

```text
(function(a){return a * a;})(5) //25
```

<a id="箭头函数-ES6"></a>

#### 箭头函数 (ES6)

格式:

```text
(参数1,……) => {函数声明};

(参数1,……) => 表达式;//相当于
(参数1,……) => {return 表达式};
```

例如:

```text
var a=(x,y) => x*y;
consle.log(a(2,5));//10
```

箭头函数不支持提升，使用前需要先声明！

<a id="二、JavaScript-闭包"></a>

### 二、JavaScript 闭包

闭包是指一个函数能够引用上级函数的局部变量，因此在上级函数执行完毕后，其局部变量并不会被立即回收。不必要的闭包会浪费内存空间。

例如”计数器问题”的解决方案有这几个:

一、

```text
var conter=0;
function add(){
    return conter+=1;
}
add();
add(); //2
```

这样做是最简单的，但也是最不安全的。因为conter是全局变量，因此在外部可以随意改变conter的值，完全可以使用 `conter++;`来代替`add（）`。则计数器失去了意义，所以这种方法不采用。

二、 内嵌函数

```text
function add(){
    var conter=0;
    var plus=() => conter+=1;
    plus();
    plus();
    return conter;
}
add(); //2
```

使用内嵌函数的方法固然不能再外部修改conter的值了，平且实际的计数器`plus()`只能再函数`add()`中调用，因此这种方法也不能采用。

三、闭包

```text
var add=function(){
    var conter=0;
    return () => conter+=1;
}();
add();
add(); //2
```

闭包实现，其中`add()`实际就是执行匿名函数后返回的`() => conter+=1;`这个箭头函数，而箭头函数引用了`conter`这个局部变量，所以形成了闭包。这即保证了`conter`不会被随意修改，还解决了计数器问题。

> 需要补充的是闭包实际上使用了JavaSctipt中的一些Bug，虽然很巧妙的解决了计数器问题，但是太过于依赖JavaSctipt内部实现，指不定哪天都被休息啦，所以在实际编写时还是要使用创建对象的方法来完成这个问题。

<a id="三、总结"></a>

### 三、总结

-   在ES6中，函数支持为参数设置默认值
-   ES6中，函数支持通过箭头来定义
-   函数中内置Arguments数组对象，存放了所有在调用函数时的参数值
-   匿名函数需要在被定义后就被执行，否则就失去了其意义
-   闭包就是当前函数引用了上级函数的局部变量，使其在执行后无法被释放，形成了闭包
