# dsv.js

　CSV,TSVなどのテキストからJSのオブジェクト配列を生成する。（標準APIのJSON.parse, JSON.stringifyみたいな奴）

## 概要

```csv
#name,age,birth
#str,int,date
Yamada,12,yyyy-MM-dd
Suzuki,24,yyyy-MM-dd
```

```javascript
const csvTxt = ```
#name,age,birth
#str,int,date
Yamada,12,yyyy-MM-dd
Suzuki,24,yyyy-MM-dd
`
const csv = csvTxt.csv.parse() // Csvクラスのインスタンスを返す
csv.names          // ヘッダ行の名前を返す
csv.types          // ヘッダ行の型を返す
csv.text           // csvTxtの内容を返す（テキストファイルに書き出す時に使う）
csv.text = csvTxt  // 上書きしてパース（ヘッダ行は変更不可）
csv.text += csvTxt // パースして末尾に追加
csv.matrix         // textを二次元配列にした値を返す [['Yamada','12','yyyy-MM-dd'],...]
csv.values         // matrixをオブジェクト配列にして型変換した値を返す  [{name:'Yamada',age:12,birth:new Date('yyyy-MM-dd')},...]
// add(): 一行追加
csv.add('Tanaka,36,yyyy-MM-dd')
csv.add('Tanaka','36','yyyy-MM-dd')
csv.add(['Tanaka','36','yyyy-MM-dd'])
csv.add('Tanaka,36,new Date(yyyy-MM-dd))
csv.add({name:'Abe',age:48,birth:new Date('yyyy-MM-dd')})
const txt = csv.stringify(obj)
```

　その後、以下のようなことがしたいが、本API対象外である。

* sort
* filter
* validate
* table(grid, ui)

```
csv.values.sort((a,b)=>a.age - b.age)
csv.values.filter(obj=>20 <= obj.age)
```
```
const yamada = csv.values.filter(obj=>'Yamada'===obj.name)[0]
yamada.age = 13
csv.stringify(csv)
```

　validateは状況によりけり。TSVに書き込むべき内容とは思えない。

　HTMLでTSVに対応するGUIを作成したい。`input`,`select`,`textarea`,`button`等のUI決定等が必要。
　その前に型変換を定義する必要がある。

## 型

```
undefined
null
boolean,bool
integer,int
float,flt
number,num
bigint
string,str
symbol
function,func,fnc,fn

class
instance

decimal,dec
date
blob            (ArrayBuffer,DataView)[I8,I16,I32,U8,U16,U32,F32,F64]
color

bools
ints
flts
nums
decs
strs
dates
colors
```

```
tsv = Tsv.parse(txt)
tsv.add()
txt = Tsv.stringify(tsv)

obj = Type.parse(str)
str = Type.stringify(obj)

obj = Type.parse(typeName, str)
str = Type.stringify(typeName, obj)

const parser = Type.getTypeParser(typeName)
parser.parse(str)
parser.toString(value)

Type.addParser(new DecimalParser())
Type.addParser(new ColorParser())

class TypeParser {
    constructor(names) { this._names = names }
    get names() { return this._names }
    match(type) {
             if (Type.isStr (type) && Type.isStr (this._names)) { return this._names===type }
        else if (Type.isStr (type) && Type.isStrs(this._names)) { return this._names.some(t=>t===type) }
        else if (Type.isStrs(type) && Type.isStr (this._names)) { return type.some(t=>t===this._names) }
        else if (Type.isStrs(type) && Type.isStrs(this._names)) {
            for (let typ of type) {
                for (let t of this._names) {
                    if (t===typ) { return true }
                }
            }
            return false
        }
        throw new Error(`引数typeは文字列または文字列の配列であるべきです。:${typeof type}: ${type}`)
    }
    parse(str) { throw new Error(`未実装`) }
    stringify(val) { return val.toString() }
}
class UndefinedParser extends TypeParser {
    constructor(names='undefined') { super(names) }
    parse(str) { return undefined }
    stringify(val) { return 'undefined' }
}
class NullParser extends TypeParser {
    constructor(names='null') { super(names) }
    parse(str) { return null }
    stringify(val) { return 'null' }
}
class BooleanParser extends TypeParser {
    constructor(names=['boolean','bool','bln','b']) { super(names) }
    parse(str) { return (['true','1'].some(v=>v===str)) }
}
class IntegerParser extends TypeParser {
    constructor(names=['integer','int','i']) { super(names) }
    parse(str) { return parseInt(str) }
}
class ColorParser extends TypeParser {
    constructor(names=['color','clr']) { super(names) }
    parse(str) { return chroma(str) }
    stringify(val) { return val.hex() }
}

class 
parser(str) {
    const parser = getTypeParser(typeName)
}
type = str.getType()
value = type.parse()
value.toString()
```
```
csv-line-strs
csv-line-ints
```





