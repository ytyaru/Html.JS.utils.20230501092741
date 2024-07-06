# 糖衣構文の作成

　条件文や繰り返し文の糖衣構文を作成する。

<!-- more -->

構文|JavaScript
----|----------
条件式|`if, else if, else`, `switch`
繰り返し|`for`, `while`

# 条件式

## `if`文

```javascript
if (真偽値) { 文; }
...
```
```javascript
if (真偽値) { 文; }
else { 文; }
```
```javascript
if (真偽値) { 文; }
else if (真偽値) { 文; }
...
```
```javascript
if (真偽値) { 文; }
else if (真偽値) { 文; }
...
else { 文; }
```

## `switch`文

```javascript
switch (値) {
  case 値: 文; break;
  ...
  default: 文;
}
```

# 繰り返し文

## `for`文

```javascript
for (let i=初期値; i<上限値; i++) {
  文;
}
```

### `for of`文

```javascript
for (let 要素値 of イテレータ) {
  文;
}
```

### `for await`文

```javascript
for (let 要素値 of イテレータ) {
  文;
}
```

### iterator

### generator

## `while`文

```javascript
while (真偽値) {
  文;
}
```


# 糖衣構文

```javascript
let R = ifs(真偽値1, 結果値1, 真偽値2, 結果値2, ...)
```
```javascript
let R = ifel(真偽値1, 結果値1, 真偽値2, 結果値2, ..., 上記以外時値)
```
```javascript
let S = new State('start', {
  start: {msg:'開始'},
  middle: {msg:'途中'},
  end: {msg:'完了'},
})
S.value = 'middle'
let R = S.match({
  start: (v)=>`${v.msg}しました。`,
  middle:(v)=>`${v.msg}です。`,
  end:   (v)=>`${v.msg}しました。終わり。`,
  _:     (v)=>`異常値です。コード見直してね。`,
})
```
```javascript
let S = new State({
  0:   {msg:'不正値(下限未満)'},
  30:  {msg:'赤点'},
  60:  {msg:'平均'},
  100: {msg:'優良'},
  _:   {msg:'不正値(上限超過)'}
})
S.value = 50
let R = S.match({
    0:(v)=>`${v.msg}です。整数値(0〜100)のみ受け付けます。低すぎるよ。`,
   30:(v)=>`${v.msg}です。使えない子…`,
   60:(v)=>`${v.msg}です。凡人め。`,
  100:(v)=>`${v.msg}です。偉い！`,
    _:(v)=>`${v.msg}です。整数値(0〜100)のみ受け付けます。高すぎるよ。`,
})
```

　上記を条件文で実装すると面倒になる。以下の通り。

```javascript
     if (      this.value <   0) { return `不正値(下限未満)` }
else if ( 0 <= this.value <  30) { return `赤点` }
else if (30 <= this.value <  60) { return `平均` }
else if (60 <= this.value <=100) { return `優良` }
else                             { return `不正値(上限超過)` }
```

　もうこれだけで面倒なのに、さらに以下が必要となる。

```javascript
function match(v) {
       if (      v <   0) { return `不正値(下限未満)` }
  else if ( 0 <= v <  30) { return `赤点` }
  else if (30 <= v <  60) { return `平均` }
  else if (60 <= v <=100) { return `優良` }
  else                    { return `不正値(上限超過)` }
}
function result(v,R) {
       if (      v <   0) { return `${R}です。整数値(0〜100)のみ受け付けます。低すぎるよ。` }
  else if ( 0 <= v <  30) { return `${R}です。使えない子…` }
  else if (30 <= v <  60) { return `${R}です。凡人め。` }
  else if (60 <= v <=100) { return `${R}です。偉い！` }
  else                    { return `${R}です。整数値(0〜100)のみ受け付けます。高すぎるよ。` }
}
let R = result(50, match(50))
```

　パターンごとに別々の処理が必要だと、こうなる。（コード例の場合はテキストを返しているだけなので共通化できるけどね）


　`State`クラスの場合、`value`をセットするときディスクリプタを仕掛けると良いかもしれない。

```javascript
class State {
  constructor() {
    this.value = null
  }
}
```

