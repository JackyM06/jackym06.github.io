---
title: "深入理解Promise"
pubDatetime: 2020-08-17T17:55:40+08:00
description: "通过超时控制、手写 Promise 和 Ajax 封装，进一步理解链式调用、异常传播与 async/await"
categories: ["前端基础"]
tags: ["JavaScript"]
---

> ES6提供的Promise对象是异步控制相较于回调的更好的一种方法。包括ES8提供的asyncFunction本质上也是基于Promise和生成器的结合，因此在已经了解Promise对象的常用API基础上，更加深入的去了解如何使用Promise去解决一些常见的难题对于开发将会有一些帮助。

<strong>文章阅读前，希望读者已经对Promise的使用及相关api有了一定的了解 。[ <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise" target="_blank" rel="noopener">快速学习Promise</a> ]</strong>

<a id="一、如何对Promise异步任务进行超时监听"></a>

## 一、如何对Promise异步任务进行超时监听

<a id="任务描述"></a>

### 任务描述

作为一道开胃小菜，这个问题还是不难解决的。平时对于一些异步任务很有可能需要进行超时监听，那么如何利用`Promise`来进行超时监听/监控呢？

<a id="解决方案"></a>

### 解决方案

```javascript
// 封装一个严格任务函数，第一个参数为promise对象，第二个参数为判定的超时标准，默认3s
function strictTack(promise,delay = 3){
  // 函数返回一个超时基准promise对象
  let promiseTimeout = function(delay){
    return new Promise((res,rej)=>{
      setTimeout(()=>{
        rej(new Error("运行超时！"))
      },1000 * delay)
    })
  }
  // race，参数数组内的promise并发执行，一旦其中有一个promise对象产生判决就会终止其余的promise对象
  return Promise.race([promise,promiseTimeout(delay)])
}
// 异步任务p1
let p1 = new Promise((res,rej)=>{
  setTimeout(()=>{
    res("p1 was resoved")
  },1000 * 2)
})

// 异步任务p2
let p2 = new Promise((res,rej)=>{
  setTimeout(()=>{
    res("p2 was resoved")
  },1000 * 4)
})

strictTack(p1)
.then(e=>{
  console.log(e)// p1 was resoved
}).catch(err=>{
  console.log(err)
}) 

strictTack(p2)
.then(e=>{
  console.log(e)
}).catch(err=>{
  console.log(err) // Error:运行超时！
})
```

<a id="任务总结"></a>

### 任务总结

对于这个问题来说，核心部分就是利用好`Promise.race`这个API，因为使用它所执行的的`Promise`对象中的异步任务都是“竞态”的，只接受第一个发生判决的Promise对象。那么此时采用超时基准`promise`对象配合`race`正好巧妙的解决了超时监听的问题。

<a id="二、如何自己实现一个Promise"></a>

## 二、如何自己实现一个Promise

<a id="任务描述-1"></a>

### 任务描述

这种具有一定难bian度tai的题目一般会在面试中遇到，那么如何手动实现一个Promise（或部分功能）？

<a id="解决方案-1"></a>

### 解决方案

1.  `V 0.1`初步版本的Promise (不支持正规Promise的链式调用)
    
    ```javascript
    class PromisePolyfill{
      constructor(exector = ()=>{}){
        this.status = 'pending' // promise当前状态
        this.reason = undefined // 用户回显到reject函数的值
        this.value = undefined // 用户回显到resolve函数的值
        // 成功事件回调队列
        this.onFulfilledCallBacks = []
        // 失败事件回调队列
        this.onRejectedCallBacks = []
        
        //实现resolve函数
        let resolve = (value)=>{
          if(this.status === 'pending'){
            this.value = value
            this.status = 'fulfilled'
            this.onFulfilledCallBacks.map(e=>e())
          }
        }
    
        // 实现reject函数
        let reject = (reason)=>{
          if(this.status === 'pending'){
            this.reason = reason
            this.status = 'rejected'
            this.onRejectedCallBacks.map(e=>e())
          }
        }
    
        try{
          // 运行执行器
          exector(resolve,reject)
        }catch(err){
          reject(err)
        }
      }
    
      then(onFulfilled,onRejected){
        // 同步情况
        if(this.status === 'fulfilled' && onFulfilled){
          onFulfilled(this.value)
        }
        if(this.status === 'rejected' && onRejected){
          onRejected(this.reason)
        }
        // 异步情况
        if(this.status === 'pending'){
          // 将任务成功回调加入到成功队列中
          onFulfilled && this.onFulfilledCallBacks.push(()=>{
            onFulfilled(this.value)
          })
           // 将任务失败回调加入到失败队列中
          onRejected && this.onRejectedCallBacks.push(()=>{
            onRejected(this.reason)
          })
        }
        return this
      }
        
      catch(onRejected){
            // 将任务失败回调加入到失败队列中
        onRejected && this.onRejectedCallBacks.push(()=>{
          onRejected(this.reason)
        })
        return this
      }
    }
    ```
    
2.  `V 0.2`支持链式调用，但是未实现Promise的相关`API` – `all、race、reject、resolve`
    
    ```javascript
    class PromisePolyfill{
      constructor(exector = ()=>{}){
        this.status = 'pending' // promise当前状态
        this.reason = undefined // 用户回显到reject函数的值
        this.value = undefined // 用户回显到resolve函数的值
        // 成功事件回调队列
        this.onFulfilledCallBacks = []
        // 失败事件回调队列
        this.onRejectedCallBacks = []
        
        //实现resolve函数
        let resolve = (value)=>{
          if(this.status === 'pending'){
            this.value = value
            this.status = 'fulfilled'
            this.onFulfilledCallBacks.map(e=>e())
          }
        }
    
        // 实现reject函数
        let reject = (reason)=>{
          if(this.status === 'pending'){
            this.reason = reason
            this.status = 'rejected'
            this.onRejectedCallBacks.map(e=>e())
          }
        }
    
        try{
          // 运行执行器
          exector(resolve,reject)
        }catch(err){
          reject(err)
        }
      }
    
      then(onFulfilled,onRejected){
    
        let promise2 = new PromisePolyfill((resolve, reject)=>{
          if(this.status === 'fulfilled' && onFulfilled){
            let x = onFulfilled(this.value)
            // resolvePromise函数，处理自己return的promise和默认的promise2的关系
            resolvePromise(promise2, x, resolve, reject)
          }
          if(this.status === 'rejected' && onRejected){
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          }
          // 异步情况
          if(this.status === 'pending'){
            // 将任务成功回调加入到成功队列中
            onFulfilled && this.onFulfilledCallBacks.push(()=>{
              let x = onFulfilled(this.value)
              // resolvePromise函数，处理自己return的promise和默认的promise2的关系
              resolvePromise(promise2, x, resolve, reject)
            })
             // 将任务失败回调加入到失败队列中
            onRejected && this.onRejectedCallBacks.push(()=>{
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            })
          }
        })
        return promise2
      }
    }
    function resolvePromise(promise2, x, resolve, reject){
      // 循环引用报错
      if(x === promise2){
        // reject报错
        return reject(new TypeError('Chaining cycle detected for promise'));
      }
      // 防止多次调用
      let called;
      // x不是null 且x是对象或者函数
      if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
          // A+规定，声明then = x的then方法
          let then = x.then;
          // 如果then是函数，就默认是promise了
          if (typeof then === 'function') { 
            // 就让then执行 第一个参数是this   后面是成功的回调 和 失败的回调
            then.call(x, y => {
              // 成功和失败只能调用一个
              if (called) return;
              called = true;
              // resolve的结果依旧是promise 那就继续解析
              resolvePromise(promise2, y, resolve, reject);
            }, err => {
              // 成功和失败只能调用一个
              if (called) return;
              called = true;
              reject(err);// 失败了就失败了
            })
          } else {
            resolve(x); // 直接成功即可
          }
        } catch (e) {
          // 也属于失败
          if (called) return;
          called = true;
          // 取then出错了那就不要在继续执行了
          reject(e); 
        }
      } else {
        resolve(x);
      }
    }
    ```
    
3.  在`v0.2`基础上封装相关API
    
    -   `all(iterable)` 这个方法接受一个promise数组，返回一个新的promise对象，该promise对象在iterable参数对象里所有的promise对象都成功的时候才会触发成功，一旦有任何一个iterable里面的promise对象失败则立即触发该promise对象的失败。
    
    ```javascript
    PromisePolyfill.all = function (promises){
      function processData (){
        let Arr = []
        let i = 0
        return function (index,data,resolve){
          Arr[index] = data
          i++
          if(i === promises.length){
            resolve(Arr)
          }
        }
      }
      let process = processData()
      return new PromisePolyfill((resolve,reject)=>{
        promises.map((promise,index) => {
          promise.then(data=>{
            process(index,data,resolve)
          },reject)
        })
      })
    }
    ```
    
    -   `race(iterable)` 这个方法接受一个promise数组。当iterable参数里的任意一个子promise被成功或失败后，父promise马上也会用子promise的成功返回值或失败详情作为参数调用父promise绑定的相应句柄，并返回该promise对象。
    
    ```javascript
    PromisePolyfill.race = function(promises){
      return new PromisePolyfill((resolve,reject)=>{
        promises.map(promise=>{
          promise.then(resolve,reject)
        })
      })
    }
    ```
    
    -   `resolve(value)` 返回一个状态由给定value决定的Promise对象。如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。
    
    ```javascript
    PromisePolyfill.resolve = function(data){
      return new PromisePolyfill((resolve,reject)=>{
        resolve(data)
      })
    }
    ```
    
    -   `reject(value)` 返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法
    
    ```javascript
    PromisePolyfill.reject = function(data){
      return new PromisePolyfill((resolve,reject)=>{
      	reject(data)
      })
    }
    ```
    

<a id="三、手写一个Promise的Ajax函数"></a>

## 三、手写一个Promise的Ajax函数

<a id="任务描述-2"></a>

### 任务描述

老生常谈的问题了，面试官喜欢问的问题。主要思想实现出来就好了

<a id="解决方案-2"></a>

### 解决方案

```javascript
function ajax (params){
    return new Promise((resolve,reject)=>{
        let request = new XMLHttpRequset()
        //设置请求方式和请求地址
    	request.open(params.type || 'get',params.url)
    	
        request.onreadystatechange = ()=>{
            //当请求返回响应时
            if(request.readyState === 4){
                // 默认情况下返回200意味着请求成功
                if(request.status === 200){
                    resolve(JSON.parse(request.responseText))
                }else{
                    reject(JSON.parse(request.responseText))
                }
            }
        }
        //携带请求头发送请求
        request.send(params.data || null)
    })
}
```

<a id="四、理论部分"></a>

## 四、理论部分

<a id="关于then和catch的返回值"></a>

### 关于then和catch的返回值

如果自己去实现了一次`Promise`对象之后会发现，`then`和`catch`如果没有返回一个标准的promise对象时，将会默认返回一个`Promise.resolve(基本值)`，即使你没有写任何`return`语句。

```javascript
let p1 = new Promise((res,rej)=>{
  setTimeout(()=>{
    // rej("p1 was rejected")
    res("p1 was resoved")
  },1000 * 2)
})

p1.then(res=>{
  console.log("Then1:"+res)
}).then(res=>{
  console.log("Then2:"+res)
  return 'Hello'
}).catch(err=>{
  console.log("Error1:"+err)
  return Promise.reject("Error For Catch 1")
}).then(res=>{
  console.log("Then3:"+res)
  return Promise.reject('ERROR For Then 3')
}).then(res=>{
  console.log("Then4:"+res)
}).catch(err=>{
  console.log("Error2:"+err)
}).then(res=>{
  console.log("Then5:"+res)
})

/*
结果
Then1:p1 was rejected
Then2:undefined
Then3:Hello
Error2:ERROR For Then 3
Then5:undefined
*/
```

经过分析不难发现，对于一个`Promise`中的链式调用的顺序是这样的：

1.  对于一个`then/catch`，默认返回为一个`resolve`
2.  当返回一个`reject`时，将调用当前节点往后的最近的`catch`节点中的回调（跳过中间的`then`）
3.  如果当前节点并没有返回`reject` 但是恰巧后面的节点就是是`catch`，那么将会跳过这个（或连续几个）`catch`，直接到后面最近的`then`节点

<strong>以上为现象，原理请参考第二节<code>Promise</code>的实现</strong>

<a id="关于async-Function-async-await"></a>

### 关于async Function (<em>async/await</em>)

`asyncFunction`是ES8中提出的更好的异步解决方案，实际用起来也确实如此。那么`asyncFunction`与`Promise`之间存在什么样的关系呢？

\[ <strong><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function" target="_blank" rel="noopener">快速学习async Function</a></strong> \]

```javascript
async function fetch(){
  console.log("Fetch is RUNING") // 立即输出Fetch is RUNING
  let  data1 = await new Promise((res,rej)=>{
    setTimeout(()=>{
      res(1)
    },1000 * 2)
  })
  console.log(data1) //时间线至少2s后打印1
  let  data2 = await new Promise((res,rej)=>{
    setTimeout(()=>{
      res(2)
    },1000 * 5)
  })
  console.log(data2) // 时间线至少2+5=7s后打印2
  console.log(data1+data2) // 紧接着上一句执行，打印 3
}
fetch()
```

上例中展示了<em>async/await</em>的基本用法和执行过程

1.  第一句同步打印任务可以直接输出。
2.  第二句遇到`await`,将会等待当前<em>await<em>任务返回</em>Promise.resolve<em>后才会继续执行下一句。这种模式和生成器的模式非常相像，</em>async/await<em>优于生成器的地方就是，生成器需要手动</em>next<em>才能进行下一步，而</em>async/await<em>是自动</em>next</em>,显然实现上要更为复杂。
3.  依次类推…

> 从这个例子中可以看出，多个<em>await</em>产生的异步任务是逐个执行的，而不是并发。所以想要实现多异步任务并发控制，仍然需要使用`Promise.all或者Promise.race`。

接下来，再来看个例子

```javascript
async function fetch(){
  let  data1 = await new Promise((res,rej)=>{
    setTimeout(()=>{
      res(1)
    },1000 * 2)
  })
  let  data2 = await new Promise((res,rej)=>{
    setTimeout(()=>{
      res(2)
    },1000 * 5)
  })
  return data1 + data2
}

fetch().then(res=>{
  console.log(res) // 至少7s后输出 3
})
```

你没看错，<em>asyncFunction</em>将会默认返回一个<em>Promise</em>对象，和<em>Promise.prototype.then</em>返回<em>Promise</em>的效果一致

到这儿不难看出<em>Promise</em>的重要性了吧，现在的主要异步任务控制方式实际上都没有离开<em>Promise</em>。
