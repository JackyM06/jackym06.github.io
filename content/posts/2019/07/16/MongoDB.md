---
title: "MongoDB"
pubDatetime: 2019-07-16T10:05:02+08:00
modDatetime: 2019-08-07T20:06:06+08:00
description: "一、起步 MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。 MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。"
categories: ["服务端开发"]
tags: ["Node.js","数据库"]
---

<a id="一、起步"></a>

## 一、起步

-   MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。
-   MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

<a id="二、安装MongoDB"></a>

## 二、安装MongoDB

-   官网下载[地址](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.10-signed.msi)并安装
-   配置安装目录下的bin到环境变量中去
-   如需进行测试可以使用：

```shell
mongod -v
```

<a id="三、打开mongodb数据库"></a>

## 三、打开mongodb数据库

-   在键入mongod命令前需要改对应盘符的根目录下创建`data/db`目录
-   然后键入命令

```shell
D:\> mongod
```

-   保持shell的打开状态

<a id="四、连接mongodb数据库"></a>

## 四、连接mongodb数据库

-   保持mongodb数据库打开状态
-   在命令行中输入

```shell
D:\> mongo
```

<a id="五、常用的命令"></a>

## 五、常用的命令

-   显示mongodb中所有数据库

```shell
show dbs
```

-   显示当前数据库

```shell
db
```

-   切换或创建新数据库

```shell
use 数据库名
```

-   显示当前数据库的所有集合名

```shell
show collections
```

-   显示当前数据库指定集合的所有文档

```shell
db.集合名.find()
```

<a id="六、Node-js中操作MongoDB"></a>

## 六、Node.js中操作MongoDB

<a id="1、使用MongoDB官方的node-mongodb-native"></a>

### 1、使用MongoDB官方的node-mongodb-native

[官方文档](https://github.com/mongodb/node-mongodb-native)

<a id="2-使用Mongoose模块"></a>

### 2.使用Mongoose模块

[中文文档](http://www.mongoosejs.net/)

<a id="2-1-安装Mongoose"></a>

#### 2.1 安装Mongoose

```shell
npm i mongoose
```

<a id="2-2-连接MongoDB"></a>

#### 2.2 连接MongoDB

```javascript
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/数据库名',{useNewUrlParser: true})
```

<a id="2-3-设计数据库表（集合）"></a>

#### 2.3 设计数据库表（集合）

Schema就是一个模板，起到了预先设计数据表的作用。其中required属性为真代表了改字段不可为空

```javascript
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    passworld:{
        type: String,
        required: true
    },
    email:{
        type:String
    }
})
```

<a id="2-4-增加文档"></a>

#### 2.4 增加文档

mongoose.model中的第一个参数为表名，也就是集合名，第二个参数是设计好的表结构。

插入一条name为admin的文档

```javascript
const User = mongoose.model('User',UserSchema) // 相当于User表集合

let Admin = new User({     //单文档
    name:"admin",
    passworld:"123123"
    email:"123@qq.com"
})

Admin.save().than(()=>{      //Promise
    console.log("success!")
},()=>{
    console.log("error")
})
```

<a id="2-5-查找文档"></a>

#### 2.5 查找文档

查找文档的所有方法都是在表集合对象上的，例如上例中的User

| 方法 | 参数 | 功能 |
| --- | --- | --- |
| find | \[{属性:值\[,…\]}\],(err,data)=>{} | 查找满足指定属性=值的文档数组到回调中data，第一个参数省略为无条件查找 |
| findOne | \[{属性:值\[,…\]}\],(err,data)=>{} | 查找满足指定属性=值的第一条文档到回调中data，第一个参数省略为无条件查找 |

例如

```javascript
cat.find({
    name: "milse88"
},(err,cats)=>{
    if(err){
        throw err
    }
    console.log(cats)
})

cat.findOne((err,data)=>{
    if(err){
        throw err
    }
    console.log(data)
})
```

结果为：

```shell
[ { _id: 5d2be43e1fb7af12f0f745a8, name: 'milse88', __v: 0 } ] #数组
{ _id: 5d2be315679a272f2459966c, name: 'milse', __v: 0 }       #对象
```

<a id="2-6-删除文档"></a>

#### 2.6 删除文档

| 方法 | 参数 | 功能 |
| --- | --- | --- |
| deleteOne | \[{属性:值\[,…\]}\],(err,res)=>{} | 查找满足指定属性=值的第一个文档进行删除，第一个参数省略为无条件删除 |
| deleteMany | \[{属性:值\[,…\]}\],(err,res)=>{} | 查找满足指定属性=值的所有文档进行删除，第一个参数省略为无条件查找 |
| remove | \[{属性:值\[,…\]}\],(err,res)=>{} | 查找满足指定属性=值的所有文档进行删除，第一个参数省略为无条件查找 (官方文档中说明改方法以不建议使用)，因此不再举例 |

> -   注意，Moogoose使用正则匹配，所以条件对象中的值可以为正则表达式的形式出现
> -   Model.AIP的回调都是以`(error,result)=>{}`的方式出现

例如：

```javascript
cat.deleteOne({
    name:"milse8"
},(err,res)=>{
    if(err)throw err
    console.log('删除成功！')
    console.log(res)
})

cat.deleteMany({
    name:/milse8/m
},(err,res)=>{
    if(err) throw err
    console.log('删除成功！')
    console.log(res)
})
```

结果:

```shell
删除成功！
{ n: 1, ok: 1, deletedCount: 1 }
删除成功！
{ n: 10, ok: 1, deletedCount: 10 }
```

<a id="2-7-更新文档"></a>

#### 2.7 更新文档

| 方法 | 参数 | 功能 |
| --- | --- | --- |
| updateOne | \[{属性:值\[,…\]}\],{属性:值\[,…\]},(err,res)=>{} | 第一个参数为条件对象，第二个参数为更新对象，找到第一个满足条件的文档，按更新对象进行更新 |
| updateMany | \[{属性:值\[,…\]}\],{属性:值\[,…\]},(err,res)=>{} | 找到所有满足条件的文档，按更新对象进行更新，如第一个条件缺省，则更新数据库中的所有文档 |

例如

```javascript
cat.updateOne({
    name: 'milse1'
},{
    name: 'maojiankai'
},(err,res)=>{
    console.log(res)
})

cat.updateMany({
    name: /milse1/m
},{
    name: 'maojiankai'
},(err,res)=>{
    console.log(res)
})
```

结果

```javascript
{ n: 1, nModified: 1, ok: 1 }
{ n: 10, nModified: 10, ok: 1 }
```

<a id="2-8-设置全局属性"></a>

#### 2.8 设置全局属性

mongoose中提供了设置全局属性的方法，这将运用到含有该属性的方法中去

```javascript
mongoose.set('属性名',值)
```

例如，我们可以将原来的连接数据库方式改为

```javascript
//原来
mongoose.connect('mongoose://localhost/数据库名',{'useNewUrlParser': true})

//改为 ：
mongoose.set('useNewUrlParser',true)
mongoose.connect('mongoose://localhost/数据库名'）
```

-   注：MongoDB Node.js驱动程序重写了用于解析[MongoDB连接字符串](https://docs.mongodb.com/manual/reference/connection-string/)的工具。因为这是一个很大的变化，所以他们将新的连接字符串解析器放在一个标志后面。要打开此选项，请将`useNewUrlParser`选项传递给 [`mongoose.connect()`](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect) 或[`mongoose.createConnection()`](https://mongoosejs.com/docs/api.html#mongoose_Mongoose-createConnection)。
