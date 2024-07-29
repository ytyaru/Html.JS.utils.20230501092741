# Function

　関数には4つの型がある。それぞれ定義、呼出の方法が異なる。

`constructor.name`|宣言|関数式|アロー関数式|呼出方法
------------------|----|------|------------|--------
`Function`|`function fn(...args) { return 1 }`|`const fn = function(...args) {return 1}`|`(...args)=>1`|`fn()`
`GeneratorFunction`|`function *fn(...args) { yield 1 }`|-|-|`for (let item of fn()) {...}`
`AsyncFunction`|`async function fn(...args) { return 1 }`|`const fn = async function(...args) {return 1}`||`async(...args)=>1`|`await fn()`<br>`fn().then(ret=>ret).catch(e=>{throw e}).finally(()=>{})`
`AsyncGeneratorFunction`|`async function *fn(...args) { yield 1 }`|-|-|`for await (let item of fn()) {...}`

　特に`await`で関数呼出するときは呼出元の文脈が`async`でないと使用不可能。

```javascript
(async()=>{
  await aFn();
})()
```

　呼出元を`async`にすると、さらにその呼出元も`async`にせねばならず、その影響範囲は最初の呼出元にまで波及してしまう。新規作成ならまだしも、既存コードの修正が必要となると問題だ。あまりに修正範囲が広すぎてバグを作り込むリスクにもなる。よって`async`な関数を作成すること自体が憚られる。そこで`Promise.then()`により従来のコールバック関数による定義で実装したい。ただ、その呼出が冗長かつ複雑。次のようになる。実行後の処理がコールバック関数である。

```javascript
aFn().then(ret=>{
  // 実行完了後の処理
})
.catch(e=>{throw e}) // 実行時例外発生時の処理
.finally(()=>{})     // 正常・例外いずれも最後に必ず実行する処理
```

　コールバック関数が、さらにコールバック関数を求めていたら？　さらにネストすることになる。こうしてネストが次々に深くなっていく。いわゆるコールバック関数地獄である。

　コールバック関数地獄を回避するために`async`/`await`構文が作られた。しかし、それは呼出元が`async`でないと使えない。修正するにしても影響範囲が広すぎて大変だし、バグの温床になりかねない。よって最初から`async`/`await`を使わない方法が欲しい。それを今回開発したい。

```javascript
Function.prototype.run(fn/aFn)
Function.prototype.gen(gFn/aGFn)
Function.prototype.catch(fn, catch, finally)
Function.prototype.finally(fn, finally, catch)
```

`run(fn, cbFn, finally, catch)`|`fn`が`async`の場合は`Promise.then()`で解決する。
`*gen(fn, cbFn, finally, catch)`|`run`のジェネレータ関数版。戻り値は`return`でなく`yield`になる。


　さらに関数には次のようなパターンもある。

種別|呼出方法
----|--------
`constructor`|`Reflect.construct(obj, args)`
`getter`|`Reflect.get(obj, args)`
`setter`|`Reflect.set(obj, args)`

　`run()`ではこのような種別における呼出方法の区別をラップしたい。

種別|宣言|関数式|アロー関数式|呼出方法
----|----|------|------------|--------
`Function`|`function fn(...args) { return 1 }`|`const fn = function(...args) {return 1}`|`(...args)=>1`|`fn()`
`GeneratorFunction`|`function *fn(...args) { yield 1 }`|-|-|`for (let item of fn()) {...}`
`AsyncFunction`|`async function fn(...args) { return 1 }`|`const fn = async function(...args) {return 1}`||`async(...args)=>1`|`await fn()`<br>`fn().then(ret=>ret).catch(e=>{throw e}).finally(()=>{})`
`AsyncGeneratorFunction`|`async function *fn(...args) { yield 1 }`|-|-|`for await (let item of fn()) {...}`
`constructor`|-|-|-|`Reflect.construct(obj, args)`
`getter`|-|-|-|`Reflect.get(obj, args)`
`setter`|-|-|-|`Reflect.set(obj, args)`

　つまり任意のcallableな関数オブジェクト7種の呼出を、`fn.run(...args, cbFn, (...cbFnArgs)=>{}, (e)=>{}, ()=>{})`のような単一APIに統一したい。

```javascript
fn(...args)
for (let item of fn(...args)) {...}
fn(...args).then(ret=>ret).catch(e=>{throw e}).finally(()=>{})
for await (let item of fn(...args)) {...}
Reflect.construct(obj, args)
Reflect.get(obj, args)
Reflect.set(obj, args)
```

　APIはどのような名前にすべきか。

候補|意味
----|----
`run()`|実行する
`sync()`|同期する
`gen()`|ジェネレートする
`syncGen()`|同期しジェネレートする

　APIはどのような構造にすべきか。

```javascript
fn.run(args)
fn.run(args, finally)
fn.run(args, catch)
fn.run(args, catch, finally)
```
```javascript
fn.run(args)
.catch(e=>{})

fn.run(args)
.finally(()=>)

fn.run(args)
.catch(e=>{})
.finally(()=>)
```

　まずは`sync()`を作るとよいかもしれない。すなわち`AsyncFunction`のみを対象とした同期化である。

```javascript
Promise.prototype.sync(aFn(Promise,this), args, cbFn, catch, finally)
```

　ただ上記は以下と同じである。`catch`,`finally`の有無パターンを考えると糖衣構文にならないケースもありうる。

```javascript
Promise.then(ret=>{cbFn(ret)})
.catch(e=>{})
.finally(()=>{})
```

```javascript
const p = new Promise(...)
p(args).sync(cbFn)
p(args).sync(cbFn, catchFn)
p(args).sync(cbFn, null, finallyFn)
```
```javascript
const p = new Promise(...)

p(args).sync(cbFn)

p(args).sync(cbFn)
.catch((e)=>catchFn(e))

p(args).sync(cbFn)
.finally(()=>finallyFn())

p(args).sync(cbFn)
.catch((e)=>catchFn(e))
.finally(()=>finallyFn())
```

　こうなると`then().catch().finally()`を置き換えただけで意味がない。

　同期関数でも同様の構造が書けるようなAPIを作るといいかもしれない。

　なんらかのコールバック関数を求める関数`syncFn(cbFn)`があったとする。その場合、コールバック関数`cbFn`は最後に`'Completed'`文字列を返すとき、その実装をPromiseで書くと以下のようになる。

```javascript
const p = new Promise((resolve, reject)=>{
    try { syncFn(()=>resolve('Completed')) }
    catch (e) { reject(e) }
})
p.then(ret=>{console.log(ret)})
.catch(e=>{throw e})
.finally(()=>console.log('Fin'))
```

　つまり`catch`,`finally`式を設定したいすべての関数は`Promise`でラップすればよい。ただこの場合、`syncFn`や`cbFn`に引数が渡せない。そこで引数を渡せるようなラッパーを作りたい。

```javascript
Function.prototype.promise = function(args) {
    const p = new Promise((resolve, reject)=>{
        try { resolve(syncFn()) }
        catch (e) { reject(e) }
    })
}
function fn(v) { return v+1 }
fn.promise(1)
.then(ret=>console.log(`v=${v}`))
.catch(e=>{throw e})
```

```javascript
Function.prototype.sync = function(args, cbFn, catchFn, finallyFn) {
    const p = new Promise((resolve, reject)=>{
        try { resolve(this(...args)) }
        catch (e) { reject(e) }
    })
    p.then(ret=>{cbFn(ret)})
    .catch((e)=>catchFn(e))
    .finally(()=>finallyFn())
}

function fn(v) { return v+1 }
fn.sync(1, ()=>console.log(`v=${v}`), (e)=>{throw e}, ()=>console.log(`fin.`))
fn.sync(1)
fn.sync(1, ()=>console.log(`v=${v}`))
fn.sync(1, ()=>console.log(`v=${v}`), (e)=>{throw e})
fn.sync(1, ()=>console.log(`v=${v}`), (e)=>{throw e}, ()=>console.log(`fin.`))
fn.sync(1, ()=>console.log(`v=${v}`), null, ()=>console.log(`fin.`))
fn.sync(1, null, (e)=>{throw e}, ()=>console.log(`fin.`))
fn.sync(1, null, null, ()=>console.log(`fin.`))
fn.sync(1, null, (e)=>{throw e}, null)
```

　関数自身がPromiseをラップする`sync`関数を作るようにすると、あとの`catch`,`finally`はPromiseに任せられる。

```javascript
Function.prototype.sync = function(args) {
    return new Promise((resolve, reject)=>{
        try { resolve(this(...args)) }
        catch (e) { reject(e) }
    })
}
```
```javascript
fn.sync(1)

fn.sync(1)
fn.sync(1).then(ret=>{})
fn.sync(1).catch(e=>{})
fn.sync(1).finally(e=>{})
fn.sync(1).then(ret=>{}).catch(e=>{})
fn.sync(1).then(ret=>{}).finally(e=>{})
fn.sync(1).catch(e=>{}).finally(e=>{})
```

　もし関数自身が`AsyncPromise`なら最初からPromiseなのでそのまま自分自身を返す。

```javascript
Function.prototype.sync = function(args) {
    if ('AsyncFunction'===this.constructor.name) { return this }
    if ('Function'===this.constructor.name) { return this }
    return new Promise((resolve, reject)=>{
        try { resolve(this(...args)) }
        catch (e) { reject(e) }
    })
}
```
```javascript
Function.prototype.syncGen = function*(args) {
    if ('AsyncGeneratorFunction'===this.constructor.name) { return this }
    if ('GeneratorFunction'===this.constructor.name) {
        for (let item this) {
            yield new Promise((resolve, reject)=>{
                try { resolve(this(...args)) }
                catch (e) { reject(e) }
            })
        }
    }
}
```




```javascript
Function.prototype.promise = function(args, cbArgs, resolve, reject) {
    const p = new Promise((resolve, reject)=>{
        try { resolve(syncFn()) }
        catch (e) { reject(e) }
    })
}
```




```javascript
Function.prototype.promise = function(args, cbArgs, resolve, reject) {
    try { syncFn(()=>resolve('Completed')) }
    catch (e) { reject(e) }
}
```

```javascript
Function.prototype.promise = function(args, cbArgs, resolve, reject) {
    const p = new Promise((resolve, reject)=>{
        try { resolve(syncFn()) }
        catch (e) { reject(e) }
    })

    this(...args)
    try {
        syncFn(()=>resolve('Completed'))
    }
    catch (e) { reject(e) }
}
```




