class FixVal { constructor(v) { this._v = v } get v() { return this._v } }
class _Val { // 共通部分
    constructor(v) { this._v = v }
    get v( ) { return this._v }
    set v(v) { this._v = v }
    _isFn(v) { return 'function'===typeof v }
    static _onSetDefault(v, o) { return v } // v:今回代入要求値, o:前回代入された値, return そのままの値を返す
}
class SetVal extends _Val{
    constructor(v, onSet) {
        super(v)
        this._onSet = onSet
        this._onSet = this._isFn(onSet) ? onSet : _Val._onSetDefault
        this.v = v
    }
    get v( ) { return this._v }
    set v(v) { if (this._isFnOnSet) { this._v = this._onSet(v, this._v) } }
    get onSet( ) { return this._onSet }
    set onSet(v) { if (this._isFn(v)) this._onSet = v }
    get _isFnOnSet() { return this._isFn(this._onSet) }
}
class IfSetVal extends _Val {
    constructor(v, onIf) {
        super(v)
        this.onIf = onIf
        this.v = v
    }
    get onIf( ) { return this._onIf }
    set onIf(v) {
        if (undefined===v) { this._onIf = IfSetVal._onIfDefault }
        else if (null===v || this._isFn(v)) { this._onIf = v }
        else {} // 無視
    }
    get v() { return this._v } // setだけオーバーライド不可 https://qiita.com/mohayonao/items/63c14384c734a6e0d599
    set v(v) { if (this._runOnIf(v)) { super.v = v } }
    _runOnIf(v) { if (this._isFnOnIf) return this._onIf(v, this.v) }
    get _isFnOnIf() { return this._isFn(this._onIf) }
    static _onIfDefault(v, o) { return true } // v:今回代入要求値, o:前回代入された値, return: 必ずセットする
}
class IfElSetVal extends IfSetVal {
    constructor(v, onIfSet, onElSet) {
        super(v, onIfSet)
        this.onElSet = onElSet
        this.v = v
    }
    get onElSet( ) { return this._onElSet }
    set onElSet(v) {
        if (undefined===v) { this._onElSet = _onElSetDefault }
        else if (null===v || this._isFn(v)) { this._onElSet = v }
        else {} // 無視
    }
    get v() { return this._v } // setだけオーバーライド不可 https://qiita.com/mohayonao/items/63c14384c734a6e0d599
    set v(v) { if (this._runOnIfSet(v)) { this._v = v } else { this._runOnElSet(v, this._v) } }
    _runOnElSet(v) { if (this._isFnOnElSet) return this._onElSet(v, this.v) }
    get _isFnOnElSet() { return this._isFn(this._onElSet) }
    static _onElDefault(v, o) { } // v:今回代入要求値, o:前回代入された値, return: 何もせず無視する
}
class ChangedVal extends _Val{
    constructor(v, onChanged) {
        super(v)
        this._o = undefined
        this.onChanged = onChanged
        this.v = v
        this._o = undefined
    }
    get v( ) { return this._v }
    set v(v) {
        this._o = this._v
        this._v = v
        if (this._o!==this._v) { this._runOnChanged() }
    }
    get onChanged( ) { return this._onChanged }
    set onChanged(v) { if (this._isFn(v)) this._onChanged = v }
    get _isFnOnChanged() { return this._isFn(this._onChanged) }
    _runOnChanged() { if (this._isFnOnChanged) return this._onChanged(this._v, this._o) }
}
class SetChangedVal extends SetVal {
    constructor(v, onSet, onChanged) {
        super(v, onSet)     // 初回はonChangedが呼ばれない（oとvが同値になるから）
        this._o = undefined // プロパティ作成
        this.onChanged = onChanged
        this.v = v          // 初回はonChangedが呼ばれない（oとvが同値になるから）
        this._o = undefined // 初回のみ未定義に設定
    }
    get v( ) { return this._v }
    set v(v) {
        this._o = this._v   // 初回はonChangedが呼ばれない（oとvが同値になるから）
        super.v = v
        if (this._o!==this._v) { this._runOnChanged() }
    }
    get onChanged( ) { return this._onChanged }
    set onChanged(v) { if (this._isFn(v)) this._onChanged = v }
    get _isFnOnChanged() { return this._isFn(this._onChanged) }
    _runOnChanged() { if (this._isFnOnChanged) return this._onChanged(this._v, this._o) }
}
class IfSetChangedVal extends IfSetVal {
    constructor(v, onIfSet, onChanged) {
        super(v, onIfSet)
        this._o = undefined
        this.onChanged = onChanged
        this.v = v
        this._o = undefined
    }
    get v( ) { return this._v }
    set v(v) {
        if (this._runOnIfSet(v)) {
            this._o = this._v
            this._v = v
            if (this._o!==this._v) { this._runOnChanged() }
        }
    }
    get onChanged( ) { return this._onChanged }
    set onChanged(v) { if (this._isFn(v)) this._onChanged = v }
    get _isFnOnChanged() { return this._isFn(this._onChanged) }
    _runOnChanged() { if (this._isFnOnChanged) return this._onChanged(this._v, this._o) }
}
class ValidVal extends _Val {
    constructor(v, onValidate) {
        super(v)
        this.onValidate = onValidate 
        this.v = v
    }
    get onValidate( ) { return this._onValidate }
    set onValidate(v) { if (this._isFn(v)) this._onValidate = v }
    get v() { return super.v } // setだけオーバーライド不可 https://qiita.com/mohayonao/items/63c14384c734a6e0d599
    set v(v) {
        if (this._runOnValidate(v)) { super.v = v }
    }
    _runOnValidate(v) { if (this._isFnOnValidate) return this._onValidate(v ?? this.v) }
    get _isFnOnValidate() { return this._isFn(this._onValidate) }
}
class SomeVal extends ValidVal {
    constructor(v, whitelist) {
        super(v, undefined)
        this._whitelist = []
        this.whilelist = whitelist
        this._initV(v)
    }
    get whitelist( ) { return this._whitelist }
    set whitelist(v) {
        if (Array.isArray(v)) {
            this._whitelist = v
            this._setOnValidate()
            this._initV()
        }
    }
    get _hasWhitelist() { return 0 < this._whitelist.length }
    _initV(v) { this._v = (this._hasWhitelist) ? this._whitelist[0] : v ?? null }
    _setOnValidate() { if (!this.onValidate) { this.onValidate = (v)=>this._whitelist.some(l=>l===v) } }
}
class Range {
    constructor(min, max) { this._min = min; this._max = max; }
    get min( ) { return this._min }
    get max( ) { return this._max }
    set min(v) { this._min = v }
    set max(v) { this._max = v }
    get isValid() { return [this._min,this._max].every(v=>Number.isFinite(v)) && this._min <= this._max }
    isRange(v) { return this.min <= v && v <= this.max }
    set(min, max) { this._min = min; this._max = max; }
}
class RangeVal extends ValidVal {
    constructor(v, min, max) {
        super(v, null)
        this.setRange(min, max)
        this._ON_VALID = (v)=> this._range.isRange(v)
        this._range = new Range(min, max)
        console.log(this._range)
        if (!this._range.isValid) { console.warn(`Out of range. 範囲不正です。`); }
        this._setOnValidate()
    }
    _initV() { this._v = (this._range) ? this._range.min : null }
    setRange(min, max) {
        if (this._range instanceof Range) { this._range.set(min, max); }
        else { this._range = new Range(min, max) }
        this._setOnValidate()
        console.log(this._range, this.onValidate)
    }
    get min( ) { return this._range.min }
    get max( ) { return this._range.max }
    set min(v) { this._range.min = v; this._setOnValidate(); }
    set max(v) { this._range.max = v; this._setOnValidate(); }
    _setOnValidate() { if (!this.onValidate) { this.onValidate = this._range.isValid ? this._ON_VALID : null } }
}

