---
title: "TypeScript渐进式入门"
pubDatetime: 2021-04-02T00:42:49+08:00
description: "面向 JavaScript 开发者的 TypeScript 基础笔记，逐步介绍基础类型、接口与函数的类型约束。"
categories: ["前端基础"]
tags: ["TypeScript","Webpack"]
---

本部分主要是一些基础概念，掌握后可以从JavaScript语法习惯转变为TypeScript。

<a id="基础类型"></a>

### 基础类型

表示形式：

```javascript
const foo:string = "test"
```

-   字符串：`string`
-   数字：`number`
-   布尔值：`boolean`
-   空值：`void` (主要用于表示函数无返回值或返回值为null时的定义)
-   任意值：`any` (意味着不限制类型，可以为任意值)
-   其他：`undefined`、`null`

<a id="类型推断"></a>

### 类型推断

TS提供两种类型推论机制（代码中未定义类型时，编译时自动增加类型）

```javascript
let bar     //  等同于 let bar:any
bar = "ok"

const t1 = "str" // 等价于const t1:string = "str"
```

需要注意的是，在使用类型推断后，不能在随意修改为其他类型，例如

```typescript
let bar = "string" // 此时相当于被ts推断为了 let bar:string = "string"
bar = 1 // error 类型冲突
```

数组也是如此

```ts
let bar = ['a','b']
bar[1] = 'c' // OK
bar[0] = 1 // ERROR

bar = ['b','a'] // OK
bar = [2, 1] // ERROR
```

对于对象

```ts
let bar = { a: '123', b: 234, c: true } //自动被推断生成一个接口
bar.a = 'test' // OK
bar.b = 'test' //ERROR 类型冲突
bar.d = 123 // ERROR 不存在属性“d”
```

<a id="联合类型"></a>

### 联合类型

```javascript
let myFavoriteNumber: string | number;
```

联合类型使用 `|` 分隔每个类型。

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，开发者只能访问此联合类型的所有类型里共有的属性或方法

```javascript
function getLength(something: string | number): number {
    return something.length;  // 编译器发生报错
}
```

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错
```

<a id="交叉类型"></a>

### 交叉类型

extend是一种非常常见的模式，可以从多个对象合并为一个新的对象。而在TS中，交叉类型可以让你安全的使用此模式 ,通过`&` 对类型进行连接

```ts
function extend<T extends object, U extends object,B>(first: T, second: U, dsf:B): T & U & B{
    let res = {} as T & U & B // 将res别名设置为T、U、B泛型的交叉类型,为了能够正常将res return出去
    for (const key in first) {
        (res as T)[key] = first[key]
    }
    for (const key in second) {
       if(!Object.prototype.hasOwnProperty.call(res,key)){
        (res as U)[key] = second[key]
       }
    }
    for (const key in dsf) {
        if(!Object.prototype.hasOwnProperty.call(res,key)){
         (res as B)[key] = dsf[key]
        }
     }
    return res
}
let bp = extend({a:'123'},{a:'222',b:234},{b: 888, c:true}) //{ a: '123', b: 234, c: true }
```

<a id="接口"></a>

### 接口

接口用于规范对象的属性和方法，是对象的类型。

<a id="确定属性"></a>

#### 确定属性

```typescript
interface Person{
	name:string;
  age:number;
}

let Tom:Person{
	name: "Tom",
  age:19,
}
```

接口定义关键字`interface`；每个字段定义完毕之后用分号分割

接口的定义与Java一致，实例赋值的时候不能比接口定义的少或者多，需要与接口的形状保持一致。

<a id="可选属性"></a>

#### 可选属性

使用`?`修饰的属性是可选的，不要求实例必须实现该属性

```typescript
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
```

这时<strong>仍然不允许添加未定义的属性</strong>

<a id="任意属性"></a>

#### 任意属性

在有些书上也会被称之为“索引签名”。 有时候我们希望一个接口允许有任意的属性，可以使用如下方式：

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

使用\[propName: string\]定义了任意属性可以取any值

任意属性的`string`是`KeyType`，而`any`代表`ValueType`

需要注意的是，<strong>任意属性被定义后，其他与任意属性相同<code>KeyType</code>的各种属性在赋值时会先去校验一次任意属性的<code>ValueType</code></strong>

以下代码将发生变异错误

```typescript
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;  // string 无法同时满足name和age
} 

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

上例中将任意属性改为联合类型即可

```typescript
[propName: string]: string | number;
```

或者把任意属性的类型改成非string类型（当然这也就意味着新增的任意属性值只能为number了）

```typescript
[propName: number]: string;
```

<a id="使用一组有限的字符串字面量作为属性"></a>

##### 使用一组有限的字符串字面量作为属性

一个索引签名可以通过映射类型来使索引字符串为联合类型中的一员，如下所示：

```ts
type Index = 'a' | 'b' | 'c';
type FromIndex = { [k in Index]?: number };

const good: FromIndex = { b: 1, c: 2 };

// Error:
// `{ b: 1, c: 2, d: 3 }` 不能分配给 'FromIndex'
// 对象字面量只能指定已知类型，'d' 不存在 'FromIndex' 类型上
const bad: FromIndex = { b: 1, c: 2, d: 3 };
```

<a id="只读属性"></a>

#### 只读属性

如果需要某个属性在<strong>对象赋值</strong>后就不能被改变可以在接口中使用`readonly`关键字来定义只读属性

```typescript
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

只读属性也是在定义时必必须要填的，<strong>只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候</strong>

<a id="数组类型"></a>

### 数组类型

<a id="类型-方括号表示法"></a>

#### 类型+方括号表示法

数组内容需要符合数组类型定义

```typescript
let fibonacci: number[] = [1, 1, 2, 3, 5]; //只能存在number类型的数组元素
```

<a id="数组泛型"></a>

#### 数组泛型

也可以使用范型的方式来定义数组类型`Array<elemType>`

```typescript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

<a id="用接口表示数组"></a>

#### 用接口表示数组

利用任意属性来表示数组

```typescript
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

通常不用这种方法来表示数组，但是这个方式可以有效的用来表示类数组

```typescript
function sum() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;
}
```

<strong>事实上常用的类数组都有自己的接口定义，如 <code>IArguments</code>, <code>NodeList</code>, <code>HTMLCollection</code> [参考内置对象章节]等：</strong>

```typescript
function sum() {
    let args: IArguments = arguments;
}
```

<a id="函数类型"></a>

### 函数类型

<a id="函数声明"></a>

#### 函数声明

<strong>function</strong>

```typescript
function sum(a:number,b:number):number{
  return a+b
}
```

<strong>函数表达式</strong>

```typescript
//类型推断简写方式
let sum = function (a:number,b:number):number{
  return a+b
}

//或者

let sum:(x:number,y:number)=>number = function (a:number,b:number):number{
  return a+b
}
console.log(sum(3,5))
```

<strong>箭头函数</strong>

```typescript
let sum = (a:number,b:number):number=>{
  return a+b
}
```

<strong>回调函数</strong>

```typescript
function map(array:any[],callback:(el?:any,index?:number,arr?:any[])=>any):any{
  let result:any[] = []
  for(let i:number = 0;i<array.length;i++){
  	result.push(callback(array[i],i,[...array]))
  }
  return result
}
```

仿写一个TS版的Array.prototype.map方法。其中map的第二个形参就是回调函数定义的方法。

<a id="利用接口定义函数的形状"></a>

#### 利用接口定义函数的形状

```typescript
interface sumFunc{
  (a:number,b:number):number
}

let sum:sumFunc
sum = function(a:number,b:number){
	return a+b
}
```

<strong>采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。</strong>

<a id="可选参数"></a>

#### 可选参数

正常情况下，输入多余的（或者少于要求的）参数，是不允许的。但是可以用 `?` 表示可选的参数

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

需要注意的是，可选参数必须接在必需参数后面。换句话说，<strong>可选参数后面不允许再出现必需参数了</strong>

<a id="函数重载"></a>

#### 函数重载

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

<a id="类型别名"></a>

### 类型别名

可以为类型定义别名，定义后可以直接使用别名来进行变量声明

```typescript
type Name = string
type NameResolve = () => Name
function getName(n:NameResolve):Name{
  return n()
}
```

<a id="字面量类型"></a>

### 字面量类型

字面量类型用来约束取值只能是某几个字符串中的一个。

```typescript
type ab = 1 | '1' | true

let k:ab = 1

let b:ab = 2
//error TS2322: Type '2' is not assignable to type 'ab'.
```

<a id="元组"></a>

### 元组

数组是合并相同类型的对象，而元组可以合并不同类型的对象

定义一对值分别为 `string` 和 `number` 的元组：

```ts
let tom: [string, number] = ['Tom', 25];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```ts
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);
```

也可以只赋值其中一项：

```ts
let tom: [string, number];
tom[0] = 'Tom';
```

但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

```ts
let tom: [string, number];
tom = ['Tom', 25];
let tom: [string, number];
tom = ['Tom'];

// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

<a id="越界的元素"></a>

#### 越界的元素

当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

```ts
let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```

注意ts本质上无法进行运行时检测，所以push被优化为了联合类型检测。但是，如果是直接字面量对数组进行赋值，编译是无法通过的。

```typescript
let tom:[string,number]
tom[2] = 123
//. Tuple type '[string, number]' of length '2' has no element at index '2'.
```

<a id="枚举"></a>

### 枚举

<a id="普通枚举"></a>

#### 普通枚举

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

```typescript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
console.log(Days);
/*
{
  '0': 'Sun',
  '1': 'Mon',
  '2': 'Tue',
  '3': 'Wed',
  '4': 'Thu',
  '5': 'Fri',
  '6': 'Sat',
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
}
*/
```

事实上，上面的例子会被编译为：

```javascript
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

手动赋值

```typescript
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat}
console.log(Days)
/*
{
  '7': 'Sun',
  '8': 'Mon',
  '9': 'Tue',
  '10': 'Wed',
  '11': 'Thu',
  '12': 'Fri',
  '13': 'Sat',
  Sun: 7,
  Mon: 8,
  Tue: 9,
  Wed: 10,
  Thu: 11,
  Fri: 12,
  Sat: 13
}
*/
```

自动赋值规则：未指定值的key将会以前一个key的值加1作为默认值，如果前面没有key则从0开始

<a id="常数枚举"></a>

#### 常数枚举

常数枚举是使用 `const enum` 定义的枚举类型：

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。

上例的编译结果是：

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

<a id="外部枚举"></a>

#### 外部枚举

外部枚举（Ambient Enums）是使用 `declare enum` 定义的枚举类型：

```ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

之前提到过，`declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。

上例的编译结果是：

```javascript
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

外部枚举与声明语句一样，常出现在声明文件中。

同时使用 `declare` 和 `const` 也是可以的：

```ts
declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

编译结果：

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

<a id="断言"></a>

### 断言

TS中的断言可以用于将当前值变成一个其他形状的兼容工具

<strong>语法</strong>

```typescript
值 as 类型 // 推荐
```

或者

```typescript
<类型>值
```

<a id="声明文件"></a>

### 声明文件

利用declare关键字声明的为全局模块可访问的实例

-   `declare var`
    
    声明全局变量，类似的还有`declare let` 和 `declare const`
    
-   `declare function`
    
    声明全局方法，
    
-   [`declare class`](https://ts.xcatliu.com/basics/declaration-files.html#declare-class) 声明全局类
    
-   [`declare enum`](https://ts.xcatliu.com/basics/declaration-files.html#declare-enum) 声明全局枚举类型
    
-   [`declare namespace`](https://ts.xcatliu.com/basics/declaration-files.html#declare-namespace) 声明（含有子属性的）全局对象
    
-   [`interface` 和 `type`](https://ts.xcatliu.com/basics/declaration-files.html#interface-和-type) 声明全局类型
    
-   [`export`](https://ts.xcatliu.com/basics/declaration-files.html#export) 导出变量
    
-   [`export namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-namespace) 导出（含有子属性的）对象
    
-   [`export default`](https://ts.xcatliu.com/basics/declaration-files.html#export-default) ES6 默认导出
    
-   [`export =`](https://ts.xcatliu.com/basics/declaration-files.html#export-1) commonjs 导出模块
    
-   [`export as namespace`](https://ts.xcatliu.com/basics/declaration-files.html#export-as-namespace) UMD 库声明全局变量
    
-   [`declare global`](https://ts.xcatliu.com/basics/declaration-files.html#declare-global) 扩展全局变量
    
-   [`declare module`](https://ts.xcatliu.com/basics/declaration-files.html#declare-module) 扩展模块
    
-   [`///`](https://ts.xcatliu.com/basics/declaration-files.html#san-xie-xian-zhi-ling) 三斜线指令
    

<a id="内置对象"></a>

### 内置对象

TS提供了对内置对象的 类型声明定义。内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准。

<strong>ES内置对象</strong>

提供了例如`Boolean`、`Error`、`Date`、`RegExp`等内置对象的声明

```typescript
let b:Boolean = new Boolean(1);
let e: Error = new Error('Error occurred');
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

<strong>DOM和BOM内置对象</strong>

DOM 和 BOM 提供的内置对象有：

`Document`、`HTMLElement`、`Event`、`NodeList` 等。

TypeScript 中会经常用到这些类型：

```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

<a id="类"></a>

### 类

<a id="访问修饰符"></a>

#### 访问修饰符

修饰在属性和方法上，用于设置该属性和方法的访问权限

-   <strong>public</strong>： 在任何地方被访问到。
    
-   <strong>protected</strong>： 只能被类自身和子类访问，应用于构造函数上则意味着<strong>只能被子类继承</strong>
    
-   <strong>private</strong>： 只能被类自身访问，应用于构造函数上则意味着<strong>该类不能被继承</strong>
    

<a id="参数属性"></a>

#### 参数属性

修饰符和`readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。

```typescript
class Animal {
  public constructor(public name:string){}
}

//等同于

class Animal {
  public name:string
  public constructor(name:string){
    this.name = name
  }
}
```

<a id="readonly-关键字"></a>

#### readonly 关键字

在属性前添加`readonly`修饰意味着该属性为只读属性，如果修改该属性将会发生报错

<a id="抽象类"></a>

#### 抽象类

`abstract` 用于定义抽象类和其中的抽象方法。

抽象类不能被直接实例化，需要由子类继承实现 ，并且子类必须实现抽象类中的所有抽象方法。这一点几乎与JAVA对抽象类的设计思想一模一样。

```typescript
abstract class Animal{
    public constructor(protected name:string){}
    public abstract eat():void
}
class Cat extends Animal {
    eat(){
        console.log(this.name + ' was eat!')
    }
}

let kitty = new Cat('kitty')
kitty.eat()
```

<a id="类的类型"></a>

#### 类的类型

给类加上 TypeScript 的类型很简单，与接口类似：

```ts
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

<a id="流动的类型"></a>

#### 流动的类型

<a id="复制类型和值"></a>

##### 复制类型和值

如果想要复制一个类，错误的办法是：

```ts
class Foo {}

const Bar = Foo;

let bar: Bar; // Error: 不能找到名称 'Bar'
```

正确的方式是利用import关键字进行引用，这里利用Hack方法演示下

```ts
namespace importing {
  export class Foo {}
}

import Bar = importing.Foo;
let bar: Bar; // ok
```

<a id="捕获变量的类型"></a>

##### 捕获变量的类型

在变量类型声明中利用`typeof`来利用其他变量的类型，这允许你告诉编译器，一个变量的类型与其他类型相同。

```typescript
const foo = 123;
const bar: typeof foo; // 捕获了foo的类型。因此bar当前为number类型

bar = 345; // ok
bar = "123"; // error
```

<a id="捕获类成员的类型"></a>

##### 捕获类成员的类型

和捕获变量类型一致，需要将类注解到一个声明变量上，通过这个声明变量就可以捕获成员类型咯

```ts
class Foo{
  foo: string;
}
declare let _foo: Foo;

const bar_1: typeof _foo.foo = 123; // Error
const bar_2: typeof _foo.foo = '123'; // Ok
```

<a id="捕获键的名称"></a>

##### 捕获键的名称

`keyof` 操作符能让你捕获一个类型的键。例如，你可以使用它来捕获变量的键名称，在通过使用 `typeof` 来获取类型之后：

```ts
const colors = {
  red: 'red',
  blue: 'blue'
};

type Colors = keyof typeof colors;

let color: Colors; // color 的类型是 'red' | 'blue'
color = 'red'; // ok
color = 'blue'; // ok
color = 'anythingElse'; // Error
```

这允许你很容易地拥有像字符串枚举+常量这样的类型，如上例所示。

<a id="类与接口"></a>

### 类与接口

接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。而事实上接口还有另外的用途

在TS中类与接口其实是比较容易混淆的盖点，接口是描述对象的形状，而类是描述对象的实际行为。在TS中，类和接口在一起还可以碰撞出更加灿烂的火光。

<a id="类继承接口"></a>

#### 类继承接口

按照Java中的开发思想，一个类只能继承于一个父类。有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

> 在TypeScript中，类实现接口需要把接口中所有的方法都实现，否则会发生报错！

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：

```ts
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

一个类可以实现多个接口：

```ts
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

上例中，`Car` 实现了 `Alarm` 和 `Light` 接口，既能报警，也能开关车灯。

<a id="接口继承接口"></a>

#### 接口继承接口

接口与接口之间可以是继承关系：

```ts
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

这很好理解，`LightableAlarm` 继承了 `Alarm`，除了拥有 `alert` 方法之外，还拥有两个新方法 `lightOn` 和 `lightOff`。

​

<a id="接口继承类"></a>

#### 接口继承类

本质上声明一个类时，还会同时声明一个包含其实例属性和实例方法的同名类型，而该类型本质上和接口一致。因此与其说是“接口继承类”，不如说是“接口继承接口”

```typescript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3}; //还记得指定“形状”的赋值方法吗
```

<a id="泛型"></a>

### 泛型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

例如：

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

上例中，我们在函数名后添加了 `<T>`，其中 `T` 用来指代任意输入的类型，在后面的输入 `value: T` 和输出 `Array<T>` 中即可使用了。

接着在调用的时候，可以指定它具体的类型为 `string`。当然，也可以不手动指定，而让类型推论自动推算出来。

<a id="多个类型参数"></a>

#### 多个类型参数

定义泛型的时候，可以一次定义多个类型的参数：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

<a id="泛型约束"></a>

#### 泛型约束

可以通过`extend` 关键字对泛型的形状进行约束

```typescript
// 例如
function logLength<T>(arg: T):T{
    console.log(arg.length) //error: 类型“T”上不存在属性“length”。
    return arg
}

// 可以改为

interface IShape{
  length:number
}
function logLength<T extends IShape>(arg: T):T{
    console.log(arg.length) //error: 类型“T”上不存在属性“length”。
    return arg
} 
logLength({length: 8}) // 8

// 非规定入参将发生编译错误
logLength(88) //error: 类型“88”的参数不能赋给类型“IShape”的参数
```

<strong>多个泛型类型之间也可以进行约束</strong>

```typescript
function copyFields<T extends U , U>(target:T,source: U):T{
    for(let key in source){
        target[key] = (source as T)[key] 
    }
    return target
}

let x = {a: 1,b:2,c:3}
let y = {b:8}

copyFields(x,y) // { a: 1, b: 8, c: 3 }
```

代码中，既然T收到了U的约束，那么T必须是U的超集。其本质上与受到接口的约束效果一致

<a id="泛型接口"></a>

#### 泛型接口

之前接触过，可以使用接口的方式来定义一个函数学要符合的形状

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch:SearchFunc = function(source:string, subString:string):boolean{
    return source.search(subString) !== -1
}
```

而现在，可以使用泛型来定义接口

```typescript
interface ICreateArrayFun{
    <T>(length:number,value: T):Array<T>
}

let createArray:ICreateArrayFun = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

console.log(createArray(3,true)) // [true,true,true]
```

当然，泛型类型的定义也可以提到接口外面

```typescript
interface ICreateArrayFun<T>{ //将泛型提到此处
    (length:number,value: T):Array<T>
}

// 需要在定义时就进行类型指定
let createArray:ICreateArrayFun<number> = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3,123) // [123,123,123]
createArray(3,true) // error: 类型“true”的参数不能赋给类型“number”的参数。
```

<a id="泛型类"></a>

#### ~泛型类~

~与泛型函数类似，泛型也可以用于类的类型定义中~

<a id="泛型参数的默认类型"></a>

#### 泛型参数的默认类型

在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。（很少用到）

```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

<a id="泛型配合Axios使用"></a>

#### 泛型配合Axios使用

通常将把服务端返回的响应体通过interface来进行声明 `interface.ts`

```ts
// 请求接口数据
export interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { number }
   */
  code: number;

  /**
   * 数据
   * @type { T }
   */
  result: T;

  /**
   * 消息
   * @type { string }
   */
  message: string;
}
```

将API单独抽离成模块时`user.ts`

```ts
import axios from './axios'; // 此处的axios应当是已经处理后（添加通用配置，拦截器等）的axios实例对象
import { ResponseData } from './interface.ts';
import { IRequestParams } from  '@/types/global';

export function fetchUserAccount<T>(params?: IRequestParams) {
	axios.post<ResponseData<T>>('/user/account', params);
}
```

使用该接口

```typescript
import { fetchUserAccount } from './user';

interface IUser {
  name: string;
  age: number;
}

async function test() {
  const user = await fetchUserAccount<IUser>();
	// user 被推断出为
  // {
  //  code: number,
  //  result: { name: string, age: number },
  //  message: string
  // }
}
```

<a id="声明合并"></a>

### 声明合并

和函数重载一样，接口和类也可以重复声明，TS编译阶段会将他们合并到一块

```typescript
interface Person{
  name:string
}
interface Person{
  age:number
}

// 相当于

interface Person{
  name: string;
  age:number;
}
```

多个要合并的接口或者类之间可以有重复的属性，但是属性的类型必须是一致的。否则会发生报错

```typescript
interface Person{
    name:string
    age:string
}
interface Person{
    name:string
    age:number // error: 后续属性声明必须属于同一类型。属性“age”的类型必须为“string”，但此处却为类型“number”
}
```

而方法合并和函数重载规则一致

```ts
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}
```

相当于：

```ts
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

<a id="TypeScript项目"></a>

### TypeScript项目

<a id="编译上下文"></a>

#### 编译上下文

所谓编译上下文指的是TS编译的范围，通过配置文件可以对当前编译上下文中的TS文件提供编译选项，而这个配置文件事实上指的就是`tsconfig.json`

<a id="tsconfig-json"></a>

##### tsconfig.json

开始使用 `tsconfig.json` 是一件比较容易的事，你仅仅需要写下：

```json
{}
```

例如，在项目的根目录下创建一个空 JSON 文件。通过这种方式，TypeScript 将 会把此目录和子目录下的所有 .ts 文件作为编译上下文的一部分，它还会包含一部分默认的编译选项。

<strong>编译选项</strong>

可以通过`compilerOptions`来定制当前编译上下文的编译选项

```json
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块:  'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015', 'ES2020' or 'ESNext'.
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

当配置完毕时，VScode将会提供对TS的即时编译，但是如果想从命令行运行TS编译器，可以通过以下方式：

-   直接运行 `tsc`, 它会从当前目录或者父级目录寻找`tsconfig.json`
-   运行`tsc -p ./path-to-project-directory` ，它会从指定路径进行编译

你也可以显式指定需要编译的文件：

```javascript
{
  "files": [
    "./some/file.ts"
  ]
}
```

你还可以使用 `include` 和 `exclude` 选项来指定需要包含的文件和排除的文件：

```javascript
{
  "include": [
    "./folder"
  ],
  "exclude": [
    "./folder/**/*.spec.ts",
    "./folder/someSubFolder"
  ]
}
```

> <strong>注意</strong>
> 
> 使用 `globs`：`**/*` （一个示例用法：`some/folder/**/*`）意味着匹配所有的文件夹和所有文件（扩展名为 `.ts/.tsx`，当开启了 `allowJs: true` 选项时，扩展名可以是 `.js/.jsx`）。

<a id="声明空间"></a>

#### 声明空间

-   声明空间指的是TS在编译阶段会将类型和变量添加到编译声明空间中
    
-   声明空间可以分为变量声明空间和类型声明空间
    
    -   类型声明空间
        
        通过`interface`定义的接口都会被ts编译器添加到类型声明空间
        
        ```ts
        export interface Person{ //将会提升到类型声明空间
            name:string
            age:number
        }
        ```
        
    -   变量声明空间
        
        类、变量、函数都会被ts编译器添加到变量声明空间中
        
        ```ts
        class Person{ //提升到变量声明空间 && 但是在声明类时如果类型声明空间中没有该类型，则会自动创建一个同名类型，其内容为类型中已声明的属性。
                      //如果类型声明空间中已存在该类型，则利用声明合并规则进行合并
            constructor(public name:string){}
            say(){
                console.log(this.name)
            }
        }
        ```
        
-   全局声明空间的范围是当前编译上下文
    
-   默认声明的将会成为全局的声明空间，加入export后成为局部模块声明空间
    
    \`
    

<a id="文件模块"></a>

#### 文件模块

-   <strong>Typescript <code>模块解析</code>就是指导 ts <code>编译器</code>查找导入（import）内容的<code>流程</code></strong>
-   TS模块解析供有两种策略：
    -   `Classic`: 以前是TypeScript 默认的解析策略，目前仅用作向后兼容
    -   `Node`: 与 NodeJS 模块机制一致的解析策略

<a id="Node模块解析策略"></a>

##### Node模块解析策略

当导入路径不是相对路径时，模块解析将会模仿 [Node 模块解析策略](https://nodejs.org/api/modules.html#modules_all_together)，下面我将给出一个简单例子：

-   当你使用
    
    ```ts
    import * as foo from 'foo'
    ```
    
    ，将会按如下顺序查找模块：ts
    
    -   `./node_modules/foo`
-   `../node_modules/foo`
    
    -   `../../node_modules/foo`
    -   直到系统的根目录
-   当你使用
    
    ```ts
    import * as foo from 'something/foo'
    ```
    
    ，将会按照如下顺序查找内容
    
    -   `./node_modules/something/foo`
-   `../node_modules/something/foo`
    
    -   `../../node_modules/something/foo`
    -   直到系统的根目录
-   当你使用
    
    ```ts
    import xx from './foo'
    ```
    
    将会按照如下顺序查找内容
    

![image-20210106105126793](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210106105126793.png)

优先查找`.ts`后缀 如无则查找 `.d.ts`同名文件

<a id="Classic解析策略"></a>

##### Classic解析策略

-   当你使用文件路径
    
    ```ts
    import xx from './foo'
    ```
    
    将会按照如下顺序查找内容
    
    ![image-20210106110526489](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210106110526489.png)
    
-   当你使用
    
    ```ts
    import xx from 'foo'
    ```
    
    将会按照如下顺序查找内容
    
    ![image-20210106111747235](https://raw.githubusercontent.com/JackyM06/MyPictures/master/image-20210106111747235.png)
    

<a id="重写文件查找策略"></a>

##### 重写文件查找策略

在TypeScript中，可以通过声明全局模块的方法，来绕过文件查找策略

```typescript
// global.d.ts
// 在当前编译上下文作用域内 声明全局模块
declare module 'foo' {
    // some variable declarations
      export var bar: number;
}
```

接着

```typescript
// test.ts
import * as foo from 'foo';
// TypeScript 将假设（在没有做其他查找的情况下）
// foo 是 { bar: number }
```

<a id="动态导入表达式"></a>

#### 动态导入表达式

动态导入表达式是 ECMAScript 的一个新功能，它允许你在程序的任意位置异步加载一个模块，TC39 JavaScript 委员会有一个提案，目前处于第四阶段，它被称为 [import() proposal for JavaScript](https://github.com/tc39/proposal-dynamic-import)。

此外，<strong>webpack</strong> bundler 有一个 [`Code Splitting`](https://webpack.js.org/guides/code-splitting/) 功能，它能允许你将代码拆分为许多块，这些块在将来可被异步下载。因此，你可以在程序中首先提供一个最小的程序启动包，并在将来异步加载其他模块。

这很自然就会让人想到（如果我们工作在 webpack dev 的工作流程中）[TypeScript 2.4 dynamic import expressions](<https://github.com/Microsoft/TypeScript/wiki/What' target=>) 将会把你最终生成的 JavaScript 代码自动分割成很多块。但是这似乎并不容易实现，因为它依赖于我们正在使用的 `tsconfig.json` 配置文件。

webpack 实现代码分割的方式有两种：使用 `import()` （首选，ECMAScript 的提案）和 `require.ensure()` （最后考虑，webpack 具体实现）。因此，我们期望 TypeScript 的输出是保留 `import()` 语句，而不是将其转化为其他任何代码。

让我们来看一个例子，在这个例子中，我们演示了如何配置 webpack 和 TypeScript 2.4 +。

在下面的代码中，我希望懒加载 `moment` 库，同时我也希望使用代码分割的功能，这意味 `moment` 会被分割到一个单独的 JavaScript 文件，当它被使用时，会被异步加载。

```ts
import(/* webpackChunkName: "momentjs" */ 'moment')
  .then(moment => {
    // 懒加载的模块拥有所有的类型，并且能够按期工作
    // 类型检查会工作，代码引用也会工作  :100:
    const time = moment().format();
    console.log('TypeScript >= 2.4.0 Dynamic Import Expression:');
    console.log(time);
  })
  .catch(err => {
    console.log('Failed to load moment', err);
  });
```

这是 `tsconfig.json` 的配置文件：

```javascript
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "lib": [
      "dom",
      "es5",
      "scripthost",
      "es2015.promise"
    ],
    "jsx": "react",
    "declaration": false,
    "sourceMap": true,
    "outDir": "./dist/js",
    "strict": true,
    "moduleResolution": "node",
    "typeRoots": [
      "./node_modules/@types"
    ],
    "types": [
      "node",
      "react",
      "react-dom"
    ]
  }
}
```

> 重要的提示
> 
> -   使用 `"module": "esnext"` 选项：TypeScript 保留 `import()` 语句，该语句用于 Webpack Code Splitting。
> -   进一步了解有关信息，推荐阅读这篇文章：[Dynamic Import Expressions and webpack 2 Code Splitting integration with TypeScript 2.4.](https://blog.josequinto.com/2017/06/29/dynamic-import-expressions-and-webpack-code-splitting-integration-with-typescript-2-4/)

<a id="从JavaScript迁移"></a>

#### 从JavaScript迁移

一般来说，将 JavaScript 代码迁移至 TypeScript 包括以下步骤：

-   添加一个 `tsconfig.json` 文件；
-   把文件扩展名从 `.js` 改成 `.ts`，开始使用 `any` 来减少错误；
-   开始在 TypeScript 中写代码，尽可能的减少 `any` 的使用；
-   回到旧代码，开始添加类型注解，并修复已识别的错误；
-   为第三方 JavaScript 代码定义环境声明(\*.d.ts)。

<a id="参考文章"></a>

### 参考文章

-   [\[TypeScript 入门教程\]](https://ts.xcatliu.com/)
-   [\[深入理解 TypeScript\]](https://jkchao.github.io/typescript-book-chinese/)
-   [\[TypeScript官方教程\]](https://www.tslang.cn/docs/handbook/basic-types.html)
