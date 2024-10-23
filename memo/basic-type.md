# Type

　基本的な型について。

<!-- more -->

type|params|和
----|------|--
integer|bit-size, sign(正数のみ,負数のみ,正数負数両方)|整数
ordinal|bit-size, start(0,1), limit|序数
float|bit-size, sign|浮動少数
decimal|precision(精度,桁), rounding(丸め方法)|固定少数
fraction|denominator(分母bottom), numerator(分子top)
string|charset(文字セット), length(バイト長), size(字数), lang(言語), newline(改行コード), format(書式)
datetime|UTC
date|UTC
time|UTC
timespan|
file|bytes, byte-order(endianness. big/little), serialize/deserialize

```javascript
new Fraction(1, 2)
new Fraction('1/2')
.top        // 1
.bottom     // 2
.float      // 0.5
.ints       // [1,2]
.str        // '1/2'
.toString() // '1/2'
.toFloat()  // 0.5
.toInts()   // [1, 2]
```
```javascript
class Fraction {
    constructor(top, bottom, options) {
        this.top = top;
        this.bottom = bottom;
        this._within = options.hasOwnProperty('within') ? !!options.within : false
        this._canZero = options.hasOwnProperty('canZero') ? !!options.canZero : false
    }
    get top() { return this._top }
    get bottom() { return this._bottom }
    get float() { return this._top / this._bottom }
    get str() { return `${this._top}/${this._bottom}` }
    get ints() { return [this._top, this._bottom] }
    get rate() { return this.top===this.bottom ? 100 : (0===this.top ? 0 : this.float*100)}  // N%
    get ratio() { return 1===this.top ? this.bottom : this.bottom/this.top } // 1:N
//    set top(v) { if (Number.isInteger(v) && 0<=v) { this._top = v } else {throw new TypeError()} }
    set top(v) {
        if (Number.isInteger(v)) {
            if (this._within && this._bottom < v) {throw new RangeError('Top is over bottom.')}
            else if (0===v && !this._canZero) {throw new RangeError('Zero can't be assigned for top.')}
            else {this._top = v}
        } else {throw new TypeError('Top is not integer.')} }
    set bottom(v) { if (Number.isInteger(v) && 0<v) { this._bottom = v } else {throw new TypeError('Bottom is not positive integer.')} }
    eq(v) { this.throwType(v); return this.top === v.top && this.bottom === v.bottom: }
    g(v) { this.throwType(v); return v.float < this.float; }
    l(v) { this.throwType(v); return this.float < v.float; }
    ge(v) { this.throwType(v); return v.float <= this.float; }
    le(v) { this.throwType(v); return this.float <= v.float; }
    throwType(v) {if(Fraction!==v.constructor){throw new TypeError()}}
}
```

```javascript
class Ratio {
    constructor(o) { // o:{width:100,height:200}, o:{砂糖:100,油:200,小麦粉:300}

    }
    get value() { return this._value }
    get ratio() {
        const gcd = this.gcd(...[...Object.entries(this._value)])
        return [...Object.entries(this._value)].map(([k,v])=>[k,Math.floor(v/gcd)]).toObject()
    }
    #gcd2(x,y){return x % y ? gcd(y, x % y) : y} // 最大公約数
    gcd(...args) {
        var f = (a, b) => b ? f(b, a % b) : a;
        var ans = args[0];
        for (var i=1; i<args.length; i++) { ans = f(ans, args[i]); }
        return ans;
    }
}
```

https://tech-blog.s-yoshiki.com/entry/63



# 一般的な操作

* 型
	* 宣言
		* 変数
			* immutable  x=0; x,y=1,2; x,y=0; x=0;y=0;
			* mutable    x:0; x,y:1,2; x,y:0; x:0;y:0;
		* 関数
			* (引数)=>一行の式
			* fnX(引数){複数行の式。最後に参照した値を返す}
		* class
			* class 名前 : 継承名, ... {実装}
			* ins=new Cls{x:1,y:2}
	* 比較
		* 一致
			* 型    eqT  =T  T  =:
			* 値    eqV  =V  V  =@
			* 参照  eqR  =R  R  =&
		* 不一致
			* 型    neT  !T     !:
			* 値    neV  !V     !@
			* 参照  neR  !R     !&
		* 大小
			* 値    g,l,ge,le
        * 範囲内    within,without
		* 候補一致  some,every
	* 変換（boxing）  to
	* シリアライズ    serialize
	* 生成            create
	* 削除            delete, -
	* 取得            get
	* 置換（代入）    set,replace
	* 追加            add,append,prepend, +
	* 挿入            insert
	* 移動            move


* 変数
* 関数
* 構造体
* クラス
* データ構造
	* tuple（固定長配列）
	* list（変長配列）
		* stack
		* queue
	* grid（２次元list）
	* table（型付list）
	* graph（関係triple）



