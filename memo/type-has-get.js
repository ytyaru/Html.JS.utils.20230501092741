# Type.has/get

```javascript
Type.has(obj, key)
Type.get(obj, key)
```

名|内容
--|----
`has`|対象objはkeyの名前でアクセスできるプロパティを持っているか。
`get`|対象objが持つkeyの名前でアクセスできるプロパティを返す。

* 対象obj
    * Type.isObj
    * Type.isIns
    * Type.isCls
    * 他
* 操作
    * has
    * get
* 操作範囲
    * Own（自分自身のみ）
    * 再帰（prototypeを再帰的に見る）
* return
    * 値系
        * Property/PropertyName/PropertyValue
        * Field
    * 関数系
        * Function
        * Method
        * StaticMethod
        * Getter
        * Setter

```javascript
Type.has(obj, key)
Type.hasOwn(obj, key)
```

```javascript
Type.get(obj, key)
Type.getOwn(obj, key)
```

```javascript
Type.[has|get][Own][Property|Member|Field|Fn|Method|StaticMethod|Getter|Setter](obj, key)
```
```javascript
Type.has(obj, key)     // 再帰
Type.hasOwn(obj, key)  // 自分自身のみ

Type.hasProperty(obj, key)    // Objectが持つ全プロパティの中から（Field/Fn/Getter/Setter）
Type.hasOwnProperty(obj, key)

Type.hasMember(obj, key)      // Instance/Classが持つ全プロパティの中から（Field/Method/StaticMethod/Getter/Setter）
Type.hasOwnMember(obj, key)

Type.hasField(obj, key)       // Objectが持つ非関数・非Getter/Setter／Instance/Classが持つ非メソッド・非Getter/Setter
Type.hasOwnField(obj, key)

Type.hasFn(obj, key)
Type.hasOwnFn(obj, key)

Type.hasMethod(obj, key)
Type.hasOwnMethod(obj, key)

Type.has(obj, key)
Type.hasOwn(obj, key)

Type.hasStaticMethod(obj, key)
Type.hasOwnStaticMethod(obj, key)

Type.hasGetter(obj, key)
Type.hasOwnGetter(obj, key)

Type.hasSetter(obj, key)
Type.hasOwnSetter(obj, key)
```
```javascript
Type.get(obj, key)
Type.getOwn(obj, key)

Type.getProperty(obj, key)
Type.getOwnProperty(obj, key)

Type.getMember(obj, key)
Type.getOwnMember(obj, key)

Type.getField(obj, key)
Type.getOwnField(obj, key)

Type.getFn(obj, key)
Type.getOwnFn(obj, key)

Type.getMethod(obj, key)
Type.getOwnMethod(obj, key)

Type.get(obj, key)
Type.getOwn(obj, key)

Type.getStaticMethod(obj, key)
Type.getOwnStaticMethod(obj, key)

Type.getGetter(obj, key)
Type.getOwnGetter(obj, key)

Type.getSetter(obj, key)
Type.getOwnSetter(obj, key)
```

# 見分けが付かないケース

* Fieldの値が`undefined`である
* 指定したキーのFieldが存在しない

　どちらも`undefined`を返してしまう。
　見分けが付かずに困る。
　そこでキーが存在しない場合は、代わりに以下の値を返してはどうか。

```javascript
Symbol('not-exist');
```
　
　継続して`Member`,`Getter`等も探したい場合。
　`Symbol('not-exist')`が返ってきたら継続する。
　`undefined`が返ってきたらFieldの値がそれだったと判断してそれを返す。

　全プロパティで`Symbol('not-exist')`が返った場合。

* 例外を投げる
* `Symbol('not-exist')`を返す

　以下のように定数化すると良さそう。

```javascript
class Type {
  NOT_EXIST = Symbol('not-exist');
}
```
```javascript
Object.defineProperty(Type, 'NOT_EXIST', {get(){return Symbol('not-exist')}})
```

　指定したプロパティがなかった場合の反応は、次の通り。

```javascript
Type.has系  false を返す
Type.get系  Symbol('not-exist') を返す
```

　ふつう`undefined`を返せば良いはず。だが`undefined`な値





Type.has(obj, key)
Type.hasOwn(obj, key)

Type.has[Field/Function/Method/StaticMethod/Getter/Setter](obj, key)
Type.hasOwn[Field/Function/Method/StaticMethod/Getter/Setter](obj, key)

* obj===Object
	* Type.[has/get][Field/Function/Getter/Setter](obj, key)
* obj===Instance
	* Type.[has/get][Field/Method/StaticMethod/Getter/Setter](obj, key)
* obj===Class
	* Type.[has/get][Field/Method/StaticMethod/Getter/Setter](obj, key)



Type.hasProperty(o,n)
Type.getMember(o,n)


class C {}

Object.getPropertyNames(c)

this.getOwnField()
