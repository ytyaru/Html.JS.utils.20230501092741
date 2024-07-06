class ObserVal {
    constructor(v, onSet) {
        this._v = v ?? null
        this._o = null
        this._onSet = onSet ?? null
    }
    get v( ) { return this._v }
    set v(v) {
        this._o = this._v
        this._v = v
        console.log(this._v, this._o, this._isFn, this._onSet)
        //if (this._isFn) this._onSet(this._v, this._o)
        if (this._isFn) this._onSet(this)
    }
    back() { this._v = this._o; this._o = null; }
    get onSet( ) { return this._onSet }
    set onSet(v) { if (this.__isFn(v)) this._onSet = v }
    get _isFn() { return this.__isFn(this._onSet) }
    __isFn(v) { return 'function'===typeof v }
}
