# 型変換用API自動生成

## 型名と略名

```
undefined
null
boolean,bool
integer,int
float,flt
decimal,dec
number,num
bigint
string,str
blob            (ArrayBuffer,DataView)[I8,I16,I32,U8,U16,U32,F32,F64]
symbol
function,func,fnc,fn
class
instance
```

## 各名前に対応したAPIを自動作成したい

```
isString(v)
isStr(v)
toString(v)
toStr(v)
to(t, v)
```

　こんな感じのAPIを全型分だけ作成したい。

## どうやる？

　まずクラスやメソッドの動的生成ができるのか？　インスタンス生成は動的生成できるか？

* https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
* https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Reflect

# 変換パターン

```
NumberToString
StringToNumber
DateToString
StringToDate
NumberToDate
DateToNumber
ObjectToString
StringToObject
JsonToString
StringToJson
```

```
Type.to(to, value, from)
Type.to('int', value, 'date')    // 日付を整数へ変換する
Type.to('num', value, 'date')    // 日付を数値へ変換する
Type.to('date', value, 'num')    // 数値を日付へ変換する
Type.to('json', value, 'object') // objectをjson(string)へ変換する
Type.to('yaml', value, 'object') // objectをyaml(string)へ変換する
Type.to('object', value, 'json') // json(string)をobjectへ変換する
Type.to('object', value, 'yaml') // yaml(string)をobjectへ変換する
```

　toの第三引数は省略できる場合とできない場合がある。

```
Type.to('num', value, 'date')    // 日付を数値へ変換する

省略できる。
if (Type.isDate(value)) { parser = 
const parser = parsers.get(value)

```
ObjectParser.parse(value, 'json')      // 文字列 value を json として解釈し、object型へ変換する
ObjectParser.stringify(value, 'json')  // object value を json 文字列へ変換する

