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
