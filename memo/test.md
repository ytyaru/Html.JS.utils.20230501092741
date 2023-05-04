# Test

　単体テスト用フレームワーク。

```js
const test = new Test()
test.run([
()=>''===new Some().method(),
()=>{ return ''===new Some().method() },
()=>{ try { new Some().methodError() } catch(e) { return true } return false },
()=>{ Test.assertError(TypeError, /ErrorMessageRegExp/, new Some(), 'methodError', [params]) },
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

