class ObserVal {
    constructor(v, onSet) {
        this._v = v ?? null
        this._o = null
        this._onSet = onSet ?? null
    }
    get v( ) { return this._v }
    set v(v) { this._set(v); this._runOnSet(); }
    get onSet( ) { return this._onSet }
    set onSet(v) { if (this._isFn(v)) this._onSet = v }
    _set(v) { this._o = this._v; this._v = v; }
    _back() { this._v = this._o; this._o = null; console.log('_back()', this._v, this._o); }
    _runOnSet() { if (this._isFnOnSet) this._onSet(this) }
    get _isFnOnSet() { return this._isFn(this._onSet) }
    _isFn(v) { return 'function'===typeof v }
}
class ValidVal extends ObserVal {
    constructor(v, onValidate, onSet) {
        super(v, onSet)
        this._onValidate = onValidate ?? null
    }
    get onValidate( ) { return this._onValidate }
    set onValidate(v) { if (this._isFn(v)) this._onValidate = v }
    get v() { return super.v } // setだけオーバーライド不可 https://qiita.com/mohayonao/items/63c14384c734a6e0d599
    set v(v) {
        this._set(v)
        this._rollback()
        this._runOnSet()
    }
    _rollback() { if (this._onValidate && !this._runOnValidate()) { this._back() } }
    _runOnValidate(v) { if (this._isFnOnValidate) return this._onValidate(v ?? this.v) }
    get _isFnOnValidate() { return this._isFn(this._onValidate) }
}
class SomeVal extends ValidVal {
    constructor(v, whitelist, onSet) {
        super(v, null, onSet)
        this._whitelist = []
        this.whilelist = whitelist
        this._initV(v)
    }
    get whitelist( ) { return this._whitelist }
    //set whitelist(v) { if (Array.isArray(v)) { this._whitelist = v; this._setOnValidate(); this._initV(); } }
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
    //constructor(min, max) { this._min = min ?? 0; this._max = max ?? 0; }
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
    constructor(v, min, max, onSet) {
        super(v, null, onSet)
        this.setRange(min, max)
        this._ON_VALID = (v)=> this._range.isRange(v)
        this._range = new Range(min, max)
        console.log(this._range)
        //if (!this._range.isValid) { this._range = null; console.warn(`Out of range. 範囲不正です。`); }
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
/*
class RangeVal extends ObserVal {
    constructor(v, range, onSet) {
        super(v, null, onSet)
        this._range = this._validRange(range) ? range : null
        this._setOnValidate()
    }
    _validRange(v) { return v instanceof Range && v.isValid }
    _setOnValidate() { if (!this.onValidate && this._range) { this.onValidate = (v)=> this.range.isRange(v) } }
    _initV() { this._v = (this._range) ? this._range.min : null }
}
*/
