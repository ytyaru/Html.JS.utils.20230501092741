# Test

　単体テスト用フレームワーク。

```js
const test = new Test()
test.run([
()=>''===new Some().method(),
()=>{ return ''===new Some().method() },
()=>{ try { new Some().methodError() } catch(e) { return true } return false },
()=>{ test.assertError(TypeError, 'ErrorMessage', ()=>new Some().methodError(param)) },
()=>{ test.assertError(TypeError, /ErrorMessageRegExp/, ()=>new Some().methodError(param)) },
])
```

　報告。

```
合格率：
試験数：
合格数：
失格数：

失格行位置：
N コード
N コード
...
```

　オプションで取得・設定できる。

```js
test.FileName
test.Heading = ''
test.Title = ''
test.setHeading(()=>)
test.setTitle(()=>)
```

　クラスにすると面倒くさい。

```js
class SomeTest extends Test {
	constructor() {
		this.cases = [
			()=>''===new Some().method(),
			()=>{ return ''===new Some().method() },
			()=>{ try { new Some().methodError() } catch(e) { return true } return false },
			()=>{ Test.assertError(TypeError, /ErrorMessageRegExp/, new Some(), 'methodError', [params]) },
		]
	}
}
new SomeTest().run()
```

* [console.trace][]
* [Error.stack][]
* [Error.fileName][]
* [Error.lineNumber][]
* [Error.message][]

[console.trace]:https://developer.mozilla.org/ja/docs/Web/API/console/trace
[Error.stack]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/stack
[Error.fileName]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/fileName
[Error.lineNumber]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/lineNumber
[Error.message]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/message


```
AssertError
  メソッドがない
  異なるエラーが発生した（想定外エラー）
  エラーが発生しなかった
  メッセージが違う
```

# 参考

* [console.trace][]
* [Error.stack][]
* [Error.fileName][]
* [Error.lineNumber][]
* [Error.message][]

[console.trace]:https://developer.mozilla.org/ja/docs/Web/API/console/trace
[Error.stack]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/stack
[Error.fileName]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/fileName
[Error.lineNumber]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/lineNumber
[Error.message]:https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error/message

```
AssertError
  メソッドがない
  異なるエラーが発生した（想定外エラー）
  エラーが発生しなかった
  メッセージが違う
```

# 思想

* なるだけ簡単に実装する
* なるだけ短く書けるようにする

　省けそうなもの。

* テストケース名（無名関数の配列を渡してその位置で識別する）
* 結果真偽用メソッド（`assertEqual`等を使わず真偽値を返すようにする）

## ダメだったケース

　エラー系のテストケースを作成するとき、以下のように無名関数にしたかった。が、引数を変数に代入しないとエラーになる仕様だった。冗長で面倒でわかりにくく忘れやすいのでやめた。

main.js
```js
const test = new TestCase()
test.run([
    (msg='A')=>{throw new Error('A')},
    (Error)=>{throw new Error('A')},
    (Error, msg='A')=>{throw new Error('A')},
    (Error, msg='A')=>{new C().throw()},
])
```

　上記を実装すると`Function.arguments`が必要だが、使うとエラーが出た。

test-case.js
```js
    run(tests) {
        const results = []
        this.#setHtml()
        for (let i=0; i<tests.length; i++) {
            // TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
            results.push((2<=tests[i].arguments) ? this.assertError(tests[i].arguments[0], tests[i].arguments[1], tests[i]) : tests[i].call())
        }
```

　なので仕方なく`TestCase.assertError(e, msg, method)`で実装した。以下のように冗長になってしまうが仕方ない。

```js
const test = new Test()
test.run([
()=>{ test.assertError(TypeError, 'ErrorMessage', ()=>new Some().methodError(param)) },
()=>{ test.assertError(TypeError, /ErrorMessageRegExp/, ()=>new Some().methodError(param)) },
])
```

