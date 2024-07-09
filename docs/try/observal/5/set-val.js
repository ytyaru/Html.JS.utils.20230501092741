/*
class Settable = superClass =>
    class extends superClass {
        constructor(v) { this._v = v }
        get v( ) { return this._v }
        set v(v) { this._v = v }
        _isFn(v) { return 'function'===typeof v }
        static _onSetDefault(v, o) { return v } // v:今回代入要求値, o:前回代入された値, return そのままの値を返す
    }
}
// idによって各プロパティやメソッドの名前を変更したいが、その仕組みがない
class HasCallable = (superClass, id) =>
    class extends superClass {
        constructor(v) { this._v = v }
        _isFn(v) { return 'function'===typeof v }
        static _onSetDefault(v, o) { return v } // v:今回代入要求値, o:前回代入された値, return そのままの値を返す
    }
*/
class FixVal { constructor(v) { this._v = v } get v() { return this._v } }
class _Val { // 共通部分
    constructor(v) { this._v = v }
    get v( ) { return this._v }
    set v(v) { this._v = v }
    _isFn(v) { return 'function'===typeof v }
    static _onSetDefault(v, o) { return v } // v:今回代入要求値, o:前回代入された値, return そのままの値を返す
    static defaultMethods = { // n:現在値, i:入力値, o:旧値
        onBegin:      (i,o)=>undefined, // 最初に実行する
        onValidate:   (i,o)=>true,      // 入力値の妥当性を確認する（真偽値を返す）
        onSet:        (i,o)=>v,         // 代入する値を返す（onValidateが真を返した場合）
        onSetDefault: (i,o)=>o,         // 代入する値を返す（onValidateが偽を返した場合）初期値/前回値/条件内値など妥当値を返す
        onValid:    (n,i,o)=>undefined, // 妥当値を代入した後に実行する（onSet後）
        onInvalid:  (n,i,o)=>undefined, // 妥当値を代入した後に実行する（onSetDefault後）
        onChanged:  (n,i,o)=>undefined, // 前回値と妥当値が異なる場合に実行する
        onEnd:      (n,i,o)=>undefined, // 最後に実行する
    }
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
class IfSetVal extends _Val { // onIfが真を返した時だけ代入する。それ以外は無視する。
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
class IfElSetVal extends IfSetVal { // onIfが真を返した時だけ代入する。それ以外はonElを実行する。
    constructor(v, onIf, onEl) {
        super(v, onIf)
        this.onEl = onEl
        this.v = v
    }
    get onEl( ) { return this._onEl }
    set onEl(v) {
        if (undefined===v) { this._onEl = IfElSetVal._onElDefault }
        else if (null===v || this._isFn(v)) { this._onEl = v }
        else {} // 無視
    }
    get v() { return this._v }
    set v(v) { if (this._runOnIf(v)) { this._v = v } else { this._runOnEl(v, this._v) } }
    _runOnEl(v) { if (this._isFnOnEl) return this._onEl(v, this.v) }
    get _isFnOnEl() { return this._isFn(this._onEl) }
    static _onElDefault(v, o) { } // v:今回代入要求値, o:前回代入された値, return: 何もせず無視する
}
class IfFinSetVal extends IfSetVal { // onIfが真を返した時だけ代入する。onIfの真偽に関わらず必ずonFinを実行する。
    constructor(v, onIf, onFin) {
        super(v, onIf)
        this.onFin = onFin
        this.v = v
    }
    get onFin( ) { return this._onFin }
    set onFin(v) {
        if (undefined===v) { this._onFin = _onFinDefault }
        else if (null===v || this._isFn(v)) { this._onFin = v }
        else {} // 無視
    }
    get v() { return this._v }
    set v(v) { if (this._runOnIfSet(v)) { this._v = v } this._runOnFin(v, this._v); }
    _runOnFin(v) { if (this._isFnOnFin) return this._onFin(v, this.v) }
    get _isFnOnFin() { return this._isFn(this._onFin) }
    static _onFinDefault(v, o) { } // v:今回代入要求値, o:前回代入された値, return: 何もせず無視する
}
class IfElFinSetVal extends IfElSetVal { // onIfが真を返した時だけ代入し,それ以外はonElを実行し,onIfの真偽に関わらずonFinを実行する
    constructor(v, onIf, onEl, onFin) {
        super(v, onIf, onEl)
        this.onFin = onFin
        this.v = v
    }
    get onFin( ) { return this._onFin }
    set onFin(v) {
        if (undefined===v) { this._onFin = _onFinDefault }
        else if (null===v || this._isFn(v)) { this._onFin = v }
        else {} // 無視
    }
    get v() { return this._v }
    set v(v) { super.v = v; this._runOnFin(v, this._v); }
    _runOnFin(v) { if (this._isFnOnFin) return this._onFin(v, this.v) }
    get _isFnOnFin() { return this._isFn(this._onFin) }
    static _onFinDefault(v, o) { } // v:今回代入要求値, o:前回代入された値, return: 何もせず無視する
}

class ValidVal extends _Val {
    constructor(v, options) { // {onValidate:(v,o)=>console.log(), onChanged:(
        super(v)
        RunFnMixer.addFns(this, 'Begin,Validate,Set,SetDefault,Valid,Invalid,Changed,End'.split(','))
//        RunFnMixer.addFns(this, 'Validate,Valid,Invalid,Set,SetDefault,Changed,Fin'.split(','))
//        super._addFns(this, 'Validate,Valid,Invalid,Set,SetDefault,Changed,Fin'.split(','))
//        #setup()
    }
    get v( ) { return this._v }
    set v(i) {
        const o = this._v
        this._runOnBegin(i, o)
        if (this._runOnValidate(i, o)) {        // input, old
            this._v = this._runOnSet(i, o)      // input, old
            this._runOnValid(this._v, i, o)     // now, input, old（現在値, 入力値, 旧値）
        } else {
            this._v = this._runOnSetDefault(i, o) // デフォルト値を返す（代入条件式が真を返す値）初期/前回/条件内値
            this._runOnInvalid(this._v, i, o)   // now, input, old（現在値, 入力値, 旧値）
        }
        if (o!==this._v) { this._runOnChanged(this._v, i, o) }
        this._runOnEnd(this._v, i, o)
    }

    /*
    set v(v) {
        const o = this._v
        this._runOnBegin(v, o)
        if (this._runOnValidate(v, o)) {        // input, old
            this._v = this._runOnSet(v, o)      // input, old
            this._runOnValid(this._v, v, o)     // now, input, old（現在値, 入力値, 旧値）
        } else {
            this._v = this._runOnSetDefault(v, o) // デフォルト値を返す（代入条件式が真を返す値）初期/前回/条件内値
            this._runOnInvalid(this._v, v, o)   // now, input, old（現在値, 入力値, 旧値）
        }
        if (o!==this._v) { this._runOnChanged(this._v, v, o) }
        this._runOnEnd(this._v, v, o)
    }
    */
    /*
    set v(v) {
        const o = this._v
        if (this.onValidate(v, o)) {
            this._v = this.onSet(v, o)
            this.onValid(v, this._v, o) // input, now, old
        } else {
            this._v = this.onSetDefault(v, o) // デフォルト値を返す（代入条件式が真を返す値）初期/前回/条件内値
            this.onInvalid(v, this._v, o)
        }
        if (o!==this._v) { this.onChanged(v, this._v, o) }
        this.onFin(v, this._v, o)
    }
    #setup() {
        this._onSet = ValidVal._onSetDefault
        this._onSetDefault = ValidVal._onSetDefaultDefault
        this._onValidate = ValidVal._onValidateDefault
        this._onValid = ValidVal._onValidDefault
        this._onInvalid = ValidVal._onInvalidDefault
        this._onChanged = ValidVal._onChangedDefault
    }
    _runOnFin(v) { if (this._isFnOnFin) return this._onFin(v, this.v) }
    get _isFnOnFin() { return this._isFn(this._onFin) }
    static _onFinDefault(v, o) { } // v:今回代入要求値, o:前回代入された値, return: 何もせず無視する

    static _onSetDefault(v,o) { return v }
    static _onSetDefaultDefault(v,o) { return o }
    static _onValidateDefault(v,o) { return true }
    static _onValidDefault(v,o) { return v }
    static _onInvalidDefault(v,o) { }
    static _onChangedDefault(v,o) { }
    static _onFinDefault(v,o) { }
    */
}
class RunFnMixer {
    static addFns(o, names) { for (let name of names) { this.addFn(o, name) } } // o:追加対象object, names:追加する名前配列
    static addFn(o, name) {
        const cName = this.#capitalize(name)
        const pName = `_on${cName}`
        //this.#addProp(o, pName)
        this.#addProp(o, pName, _Val.defaultMethods[`on${cName}`])
        this.#addRunOn(o, `_runOn${cName}`)
        this.#addIsFnOn(o, `_isFn${cName}`, cName)
//        this.#addOnInit(o, `_on${cName}_Init`, cName) // _Init の部分は name に使う値だと名前重複する恐れ有り（Default等）
//        this.#addProp(o, pName, this[`_on${cName}_Init`])
    }
    static #addProp(o, pName, value=null, writable=true, enumerable=true, configurable=false) {
        Object.defineProperty(o, pName, {
            value: value,
            writable: writable,         // value を書き換え可能か
            enumerable: enumerable,     // Object.assign, Spread構文[...], for in, Object.key, で列挙されるか
            configurable: configurable, // オブジェクトから削除可能か。value,writable以外(enumerable,configurable)を変更可能か
        });
    }
    static #addIsFnOn(o, name, cName) {
        Object.defineProperty(o, name, {
            get( ) { return this._isFn(this[`_on${cName}`]) },
        });
    }
    static #addRunOn(o, name, cName, writable=true, enumerable=true, configurable=false) {
        //this.#addProp(o, name, (v)=>this[`_isFnOn${cName}`] ? this[`_on${cName}`](v, this._v) : undefined)
        //this.#addProp(o, name, (v)=>o[`_isFnOn${cName}`] ? o[`_on${cName}`](v, o._v) : undefined)
        this.#addProp(o, name, (v)=>o[`_isFnOn${cName}`] ? o[`_on${cName}`](v, o._v) : undefined)
    }
    /*
    static #addOnInit(o, name, cName, writable=true, enumerable=true, configurable=false) {
        //this.#addProp(o.prototype, name, RunFnMixer[`_on${cName}Default`])
//        console.log(o, o.prototype)
        //this.#addProp(o.prototype, name, this[`_on${cName}Default`])
        //this.#addProp(o, name, this[`_on${cName}Init`])
        //this.#addProp(o, name, RunFnMixer[`_on${cName}_Init`])
        this.#addProp(o, name, _Val.defaultMethods[`on${cName}`])
    }
    */
    /*
    #addRunOn(o, name, cName, writable=true, enumerable=true, configurable=false) {
        Object.defineProperty(o, name, {
            //value: (v)=>{if (this._isFnOnFin) return this._onFin(v, this.v)},
            value: (v)=>this.[`_isFnOn${cName}`] ? this[`_on${cName}`](v, this._v) : undefined,
            writable: writable,         // value を書き換え可能か
            enumerable: enumerable,     // Object.assign, Spread構文[...], for in, Object.key, で列挙されるか
            configurable: configurable, // オブジェクトから削除可能か。value,writable以外(enumerable,configurable)を変更可能か
        });
    }
    #addOnDefault(o, name, value=null, writable=true, enumerable=true, configurable=false) {
        Object.defineProperty(o.prototype, name, {
//            value: value,
            value: RunFnMixer[`_on${cName}Default`],
            writable: writable,         // value を書き換え可能か
            enumerable: enumerable,     // Object.assign, Spread構文[...], for in, Object.key, で列挙されるか
            configurable: configurable, // オブジェクトから削除可能か。value,writable以外(enumerable,configurable)を変更可能か
        });
    }
    */
    static #capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }
    /*
    static _onSet_Init(i,o) { return i }
    static _onSetDefault_Init(i,o) { return o }
    static _onValidate_Init(i,o) { return true }
    static _onValid_Init(n,i,o) { }
    static _onInvalid_Init(n,i,o) { }
    static _onChanged_Init(n,i,o) { }
    static _onFin_Init(n,i,o) { }
    */
//    static _onIfDefault(v,o) { return true }
//    static _onElDefault(v,o) { }

    /*
    #addMethod(o, name, isStatic, value=null, writable=true, enumerable=true, configurable=false) {
        Object.defineProperty(isStatic ? o.prototype : o, name, {
            value: value,
            writable: writable,         // value を書き換え可能か
            enumerable: enumerable,     // Object.assign, Spread構文[...], for in, Object.key, で列挙されるか
            configurable: configurable, // オブジェクトから削除可能か。value,writable以外(enumerable,configurable)を変更可能か
        });
    }
    #addSGetter(o, setter, getter) {
        Object.defineProperty(o, name, {
            get( ) { return this[pName] },
            set(v) { this[pName] = v },
        });
    }
    //#capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '' }
    */
}

/*
    _onValidate = _onValidateDefault
    get onValidate() { return this._onValidate }
    onValidate(v, o) {

    }
*/

/*
class AddFn {
    add(o, name, fn) {
        
    }
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
*/
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

