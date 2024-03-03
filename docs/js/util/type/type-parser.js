(function() {
function isStr (v) { return typeof v === 'string' || v instanceof String }
function isStrs(v) { return Array.isArray(v) && v.every(x=>isStr(x)) }
class Id {
    constructor(names) { this._names = names }
    get names() { return this._names }
    match(names) {
             if (isStr (names) && isStr (this._names)) { return this._names===names }
        else if (isStr (names) && isStrs(this._names)) { return this._names.some(t=>t===names) }
        else if (isStrs(names) && isStr (this._names)) { return names.some(t=>t===this._names) }
        else if (isStrs(names) && isStrs(this._names)) {
            for (let typ of names) {
                for (let t of this._names) {
                    if (t===typ) { return true }
                }
            }
            return false
        }
        throw new Error(`引数namesは文字列または文字列の配列であるべきです。:${typeof names}: ${names}`)
    }
}
class TypeParser extends Id {
    constructor(names) { super(names) }
    is(val) {
        if (isStr (this._names)) { return typeof val===this._names }
        if (isStrs(this._names)) { return typeof val===this._names[0] }
        return false
    }
    parse(str) { throw new Error(`未実装`) }
    stringify(val) { return val.toString() }
}
class FixTypeParser extends TypeParser {
    constructor(type) { super(String(type)); this._type=type;  }
    is(val) { console.log(val, this._type);return val===this._type }
    parse(str) { return this._type }
    stringify(val) { return String(type) }
}
class UndefinedParser extends FixTypeParser { constructor(type=undefined) { super(type) } }
class NullParser extends FixTypeParser { constructor(type=null) { super(type) } }
class ObjectParser extends TypeParser {
    constructor(names='object,obj'.split(',')) { super(names) }
    is(v) {
        if (!ObjectParser.isObjectLike(v) || ObjectParser.getTag(v) != '[object Object]') { return false }
        if (Object.getPrototypeOf(v) === null) { return true }
        let proto = v
        while (Object.getPrototypeOf(proto) !== null) { proto = Object.getPrototypeOf(proto) }
        return Object.getPrototypeOf(v) === proto
    }
    static isObjectLike(v) { return typeof v === 'object' && v !== null }
    static getTag(v) { return (v == null) ? (v === undefined ? '[object Undefined]' : '[object Null]') : toString.call(v) }
    //parse(str) { return eval?.(`"use strict";(${str})`) } }
    parse(str, format='object') {
        switch(format) {
            case 'object': return eval?.(`"use strict";(${str})`)
            case 'json': return JSON.parse(str)
            case 'yaml': return jsyaml.load(str)
            case 'toml': throw new Error(`未実装`)
            case 'xml':  throw new Error(`未実装`)
            case 'csv':  throw new Error(`未実装`)
            case 'tsv':  throw new Error(`未実装`)
            case 'ssv':  throw new Error(`未実装`)
            default: return JSON.parse(str)
        }
    }
    stringify(val, format='object') {
        switch(format) {
            case 'object': return JSON.stringify(val)
            case 'json': return JSON.stringify(val)
            case 'yaml': return jsyaml.dump(str)
            case 'toml': throw new Error(`未実装`)
            case 'xml':  throw new Error(`未実装`)
            case 'csv':  throw new Error(`未実装`)
            case 'tsv':  throw new Error(`未実装`)
            case 'ssv':  throw new Error(`未実装`)
            default: return JSON.stringify(val)
        }
    }
}
class BooleanParser extends TypeParser {
    constructor(names='boolean,bool,bln,b'.split(',')) { super(names) }
    parse(str) { return 'true,t,1'.split(',').some(v=>v===str) }
}
class NumberParser extends TypeParser {
    constructor(names='number,num'.split(',')) { super(names) }
    is(v) { return ('number'===typeof v && !isNaN(v)) || (ObjectParser.isObjectLike(v) && ObjectParser.getTag(v)=='[object Number]') } // https://github.com/lodash/lodash/blob/master/isNumber.js
    parse(str) { return Number(str) }
}
class IntegerParser extends NumberParser {
    constructor(names='integer,int,i'.split(','), base=10) { super(names); this._base=base; }
    is(v)   { return super.is(v) && v % 1 === 0 }
    parse(str) { return parserInt(str, this._base) }
    stringify(val) { return val.toString(this._base) }
}
class BinParser extends IntegerParser { constructor(names='binary,bin'.split(',')) { super(names, 2) } }
class OctParser extends IntegerParser { constructor(names='octral,oct'.split(',')) { super(names, 8) } }
class HexParser extends IntegerParser { constructor(names='hex') { super(names, 16) } }
class Base32Parser extends IntegerParser { constructor(names='base32') { super(names, 32) } }
class Base36Parser extends IntegerParser { constructor(names='base36') { super(names, 36) } }
class StringParser extends TypeParser {
    constructor(names='string,str,s'.split(',')) { super(names) }
    static is (v) { return typeof v === 'string' || v instanceof String }
    static iss(v) { return Array.isArray(v) && v.every(x=>isStr(x)) }
    is(v) { return StringParser.is(v) }
    parse(str) { return ((str.hasOwnProperty('toString')) ? str.toString() : String(str)) }
    stringify(val) { return this.parse(val) }
}
class Base64Parser extends StringParser {
    constructor(names='base64') { super(names, 36) }
    parse(str) { return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(str))) }
    stringify(val) { return new TextDecoder().decode(new Uint8Array(Array.prototype.map.call(atob(val), c=>c.charCodeAt()))) }
}
class FloatParser extends NumberParser {
    constructor(names='float,flt,f'.split(',')) { super(names); }
    is(v) { return super.is(v) && (v % 1 !== 0 || 0===v) }
    parse(str) { return parserFloat(str) }
}
class BigIntParser extends TypeParser {
    constructor(names='bigint,BigInt,bi'.split(',')) { super(names) }
    parse(str) { return BigInt(str) }
}
class SymbolParser extends TypeParser {
    constructor(names='symbol,sym'.split(',')) { super(names) }
    parse(str) { return Symbol(str) }
}
class FunctionParser extends TypeParser {
    constructor(names='function,func,fnc,fn'.split(',')) { super(names) }
    parse(str, params) { return ((isStrs(params)) ? new Function(...params, str) : new Function(str)) }
}
class ClassParser extends TypeParser {
    constructor(names='class,cls'.split(',')) { super(names) }
    //is(val) { console.log(super.is(val), typeof val, val); return (super.is(val) && val.new.target) }
    //is(val) { console.log(val, typeof val, super.is(val)); return super.is(val) }
    is(val) { return 'function'===typeof val && val.toString().match(/^class /) }
    parse(str) { return Function(`return (${str})`)() }
    //parse(str) { return this.#getClass(str) }
    //#getClass(className) { return Function(`return (${className})`)() }
    //#getClass(name) { return Function('return (' + classname + ')')() }
    getClass(className) { return Function(`return (${className})`)() }
}
class InstanceParser extends TypeParser {
    constructor(names='instance,ins'.split(',')) { super(names); this._clsP=new ClassParser(); }
    is(v, cls) { console.log(v, cls); return (v instanceof cls) }
    //is(v) { return v instanceof cls }
    /*
    is(v) {
        console.log(v)
        if (undefined===v || null===v) { return false }
        console.log(`v.hasOwnProperty('constructor'):`, v.hasOwnProperty('constructor'), v.constructor.name)
//        console.log(`v.prototype.hasOwnProperty('constructor'):`, v.prototype.hasOwnProperty('constructor'), v.constructor.name)
        //if (!v.hasOwnProperty('constructor')) { return false }
//        if (!v.prototype.hasOwnProperty('constructor')) { return false }
        if (!Type.isStr(v.constructor.name)) { return false }
//        if (!v.hasOwnProperty('new')) { return false }
//        if (!v.new.target) { return false }
        //return v instanceof this._clsP.getClass(v.constructor.name)
        return v instanceof v.constructor
    }
    */
    parse(str, params) {
        const cls = this._clsP.parse(str)
        return ((Array.isArray(params)) ? new cls() : new cls(params)) 
    }
}
// 特殊クラス
//class BlobParser extends TypeParser { constructor(names='blob') { super(names) } } // Base64で代用する
class DateTimeParser extends TypeParser { // day.js/date-fns  Temporalが実装されるまでの間どうするか。文字列として扱うか
    constructor(names='datetime,DateTime,dt'.split(',')) { super(names); this._regex = /\d{4,}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/; }
    is(v) { return v && v.getMonth && typeof v.getMonth === 'function' && Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v) } // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
    parse(str) {
        if (this._regex.match(str)) { return new Date(str) }
        throw new Error(`引数エラー。引数の文字列 ${str} は日付に変換できませんでした。書式 ${this._regex} に従ってください。`)
    }
    stringify(val, s1='-', s2='T', s3=':') {
        if (!this.is(val)) { throw new Error(`引数型エラー。引数の型はDate型であるべきです。: ${typeof val} : ${val}`) }
        const [y,m,d,H,M,S] = this.getYmdHmsStr()
        return `${y}${s1}${m}${s1}${d}${s2}${H}${s3}${M}${s3}${S}`
    }
    getYmdHms() { return [
        val.getFullYear(),
        val.getMonth() + 1,
        val.getDate(),
        val.getHours(),
        val.getMinutes(),
        val.getSeconds(),
    ]}
    getYmdHmsStr() { return this.getYmdHms().map((v,i)=>(0===i) ? v.toString() : v.toString().padStart(2)) }
}
class DateParser extends DateTimeParser { // day.js/date-fns  Temporalが実装されるまでの間どうするか。文字列として扱うか
    constructor(names='date') { super(names); this._regex = /\d{4,}-\d{2}-\d{2}/; }
    parse(str) {
        if (this._regex.match(str)) { return new Date(`${str}T00:00:00`) }
        throw new Error(`引数エラー。引数の文字列 ${str} は日付に変換できませんでした。書式 ${this._regex} に従ってください。`)
    }
    stringify(val, _='-') {
        if (!this.is(val)) { throw new Error(`引数型エラー。引数の型はDate型であるべきです。: ${typeof val} : ${val}`) }
        const [y,m,d,H,M,S] = this.getYmdHmsStr()
        return `${y}${_}${m}${_}${d}`
    }
}
class TimeParser extends DateTimeParser { // day.js/date-fns  Temporalが実装されるまでの間どうするか。文字列として扱うか
    constructor(names='time') { super(names); this._regex = /\d{2}:\d{2}:\d{2}/; }
    parse(str) {
        if (this._regex.match(str)) { return new Date(`2000-01-01T${str}`) }
        throw new Error(`引数エラー。引数の文字列 ${str} は日付に変換できませんでした。書式 ${this._regex} に従ってください。`)
    }
    stringify(val, _=':') {
        if (!this.is(val)) { throw new Error(`引数型エラー。引数の型はDate型であるべきです。: ${typeof val} : ${val}`) }
        const [y,m,d,H,M,S] = this.getYmdHmsStr()
        return `${H}${_}${M}${_}${S}`
    }
}
class DurationParser extends TypeParser { // day.js/date-fns  Temporalが実装されるまでの間どうするか。文字列として扱うか
    constructor(names='duration,dur'.split(',')) { super(names); this._regex = /P(\d{1,}Y)?(\d{1,}M)?(\d{1,}D)?(T)?(\d{1,}H)?(\d{1,}M)?(\d{1,}S)?/; }
    parse(str) {
        const m = this._regex.match(str)
        if (m) { return this.values(m) }
//        if (m) { return {y:m[1], m:m[2], d:m[3], H:m[4], M:m[5], S:m[6]} }
        throw new Error(`引数エラー。引数の文字列 ${str} は期間に変換できませんでした。書式 ${this._regex} に従ってください。`)
    }
    values(m) { return 'y,m,d,H,M,S'.split(',').reduce((o,k,i)=>o[k]=m[i+1], {}) }
    stringify(v) {
        const T = (('H,M,S'.split(',').some(k=>v.hasOwnProperty(k))) ? 'T' : '')
        const ymd = 'y,m,d'.split(',').map(k=>((v.hasOwnProperty(k)) ? v[k]+k.toUpperCase() : null))
        const hms = 'H,M,S'.split(',').map(k=>((v.hasOwnProperty(k)) ? v[k]+k.toUpperCase() : null))
        return `P${ymd}${T}${hms}`
    }
}
class ColorParser extends TypeParser {
    constructor(names='color,clr'.split(',')) { super(names) }
    parse(str) { return chroma(str) }
    stringify(val) { return val.hex() }
}
class DecimalParser extends TypeParser {
    constructor(names='decimal,dec'.split(',')) { super(names) }
    parse(str) { return new Decimal(str) }
}
/*
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
*/
class TypeParsers {
    constructor() {this._parsers=[];}
    get parsers() { return this._parsers }
    get names() { return this.parsers.map(p=>p.names).flat() }
    add(parser) {
        if (this.parsers.some(p=>p.match(parser.names))) { throw new Error(`追加失敗。指定パーサ ${parser.constractor.name} の names ${parser.names} は既存パーサと重複しています。`) }
        //if (this._parsers.match(parser.names)) { throw new Error(`追加失敗。指定パーサ ${parser.constractor.name} の names ${parser.names} は既存パーサと重複しています。`) }
        this._parsers.push(parser)
    }
    get(typeName) {
        const parsers = this._parsers.filter(p=>p.match(typeName))
        if (1===parsers.length) { return parsers[0] }
        if (0===parsers.length) { return null }
        if (1<parsers.length) { throw new Error(`論理エラー。typeName:${typeName}に一致するパーサが複数あります。`) }
    }
}
class TypeClass {
    constructor(parsers) { this._parsers=new TypeParsers(); }
    get parsers() { return this._parsers }
    is(typeName, value) { return this._parsers.get(typeName).is(value) }
    parse(typeName, value) { return this._parsers.get(typeName).parse(value) }
    stringify(typeName, value) { return this._parsers.get(typeName).stringify(value) }
}
const type = new TypeClass()
type.parsers.add(new UndefinedParser())
type.parsers.add(new NullParser())
type.parsers.add(new BooleanParser())
type.parsers.add(new IntegerParser())
type.parsers.add(new BinParser())
type.parsers.add(new OctParser())
type.parsers.add(new HexParser())
type.parsers.add(new Base32Parser())
type.parsers.add(new Base36Parser())
type.parsers.add(new Base64Parser())
type.parsers.add(new FloatParser())
type.parsers.add(new NumberParser())
type.parsers.add(new BigIntParser())
type.parsers.add(new StringParser())
type.parsers.add(new SymbolParser())
type.parsers.add(new FunctionParser())
type.parsers.add(new ClassParser())
type.parsers.add(new InstanceParser())
type.parsers.add(new DateTimeParser())
type.parsers.add(new DateParser())
type.parsers.add(new TimeParser())
type.parsers.add(new DurationParser())
type.parsers.add(new ColorParser())
type.parsers.add(new DecimalParser())
for (let p of type.parsers.parsers) {
    const names = ((Array.isArray(p.names)) ? p.names : ((isStr(p.names)) ? [p.names] : null))
    console.log(names, isStrs(names))
    if (!isStrs(names)) { continue }
    console.log(type, type.prototype, )
    for (let n of names) { console.log(n, `is${n.Pascal}`);type[`is${n.Pascal}`] = function(v, p1) { return p.is(v, p1) } }
    //for (let n of names) { console.log(n, `is${n}`);type[`is${n}`] = function(v) { return p.is(v) } }
    //for (let n of names) { const name = (('bigint'===n) ? 'BigInt' : n.Pascal); console.log(n, `is${name}`);type[`is${name}`] = function(v) { return p.is(v) } }
    /*
    for (let n of names) {
        type[`is${n.Pascal}`] = function(v) { return p.is(v) }
        if ('bigint'===n) { type[`isBigInt`] = function(v) { return p.is(v) } }
    }
    */
}
window.Type = type
/*
class TypeParser {
    constructor(names) { this._names = names }
    get names() { return this._names }
    match(type) {
             if (isStr (type) && isStr (this._names)) { return this._names===type }
        else if (isStr (type) && isStrs(this._names)) { return this._names.some(t=>t===type) }
        else if (isStrs(type) && isStr (this._names)) { return type.some(t=>t===this._names) }
        else if (isStrs(type) && isStrs(this._names)) {
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

window.Type = type
//    #call(name, v) {
//        if (this.hasOwnProperty(name)) { return this[name](v) }
//        this[this._names]
//    }
    isString(v) { return typeof v === "string" || v instanceof String }
    isBoolean(v) { return 'boolean' === typeof v }
    //isNumber(v) { return 'number' === typeof v && !isNaN(v) }
    //isNumber(v) { return Number.isFinite(v) } // new Number(1) が false になってしまう
    isNumber(v) { return ('number'===typeof v && !isNaN(v)) || (this.#isObjectLike(v) && this.#getTag(v)=='[object Number]') } // https://github.com/lodash/lodash/blob/master/isNumber.js
    isInteger(v)   { return this.isNumber(v) && v % 1 === 0 }
    isPositiveInteger(v)   { return this.isInteger(v) && 0<=v }
    isNegativeInteger(v)   { return this.isInteger(v) && v<0 }
    isFloat(v) { return this.isNumber(v) && (v % 1 !== 0 || 0===v) }
    isDate(v) { return v && v.getMonth && typeof v.getMonth === 'function' && Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v) } // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
    isBigInt(v) { return 'bigint' === typeof v }
    isSymbol(v) { return 'symbol' === typeof v }
    isElement(v) {
        try { return v instanceof HTMLElement; }
        catch(e){
            return (typeof v==="object") &&
                (v.nodeType===1) && (typeof v.style === "object") &&
                (typeof v.ownerDocument ==="object");
        }
    }
    isArray(v) { return Array.isArray(v) }
    isObject(v) { // https://github.com/lodash/lodash/blob/master/isPlainObject.js
        if (!this.#isObjectLike(v) || this.#getTag(v) != '[object Object]') { return false }
        if (Object.getPrototypeOf(v) === null) { return true }
        let proto = v
        while (Object.getPrototypeOf(proto) !== null) { proto = Object.getPrototypeOf(proto) }
        return Object.getPrototypeOf(v) === proto
    }
    #isObjectLike(v) { return typeof v === 'object' && v !== null }
    #getTag(v) { return (v == null) ? (v === undefined ? '[object Undefined]' : '[object Null]') : toString.call(v) }
    isFunction(v) { return typeof v === 'function' }
    isInstance(ins, cls) { return ins instanceof cls }

    isStr(v) { return this.isString(v) }
    isBool(v) { return this.isBoolean(v) }
    isNum(v) { return this.isNumber(v) }
    isInt(v) { return this.isInteger(v) }
    isPosInt(v) { return this.isPositiveInteger(v) }
    isNegInt(v) { return this.isNegativeInteger(v) }
    isEl(v) { return this.isElement(v) }
    isAry(v) { return this.isArray(v) }
    isObj(v) { return this.isObject(v) }
    isFn(v) { return this.isFunction(v) }
    isIns(ins, cls) { return ins instanceof cls }

    isS(v) { return this.isString(v) }
    isB(v) { return this.isBoolean(v) }
    isN(v) { return this.isNumber(v) }
    isI(v) { return this.isInteger(v) }
    isF(v) { return this.isFloat(v) }
    isD(v) { return this.isDate(v) }
    isE(v) { return this.isElement(v) }
    isA(v) { return this.isArray(v) }
    isO(v) { return this.isObject(v) }

    // array<T>
    isStrings(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNumbers(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isIntegers(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isPositiveIntegers(v) { return Array.isArray(v) && v.every(x=>this.isPositiveInteger(x)) }
    isNegativeIntegers(v) { return Array.isArray(v) && v.every(x=>this.isNegativeInteger(x)) }
    isFloats(v) { return Array.isArray(v) && v.every(x=>this.isFloat(x)) }
    isBooleans(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isDates(v) { return Array.isArray(v) && v.every(x=>this.isDate(x)) }
    isBigInts(v) { return Array.isArray(v) && v.every(x=>this.isBigInt(x)) }
    isSymbols(v) { return Array.isArray(v) && v.every(x=>this.isSymbol(x)) }
    isElements(v) { return Array.isArray(v) && v.every(x=>this.isElement(x)) }
    isArrays(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjects(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFunctions(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    // array<T> short
    isStrs(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNums(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isInts(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isBools(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isEls(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isArys(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjs(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFns(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    // array<T> short
    isSs(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNs(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isIs(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isFs(v) { return Array.isArray(v) && v.every(x=>this.isFloat(x)) }
    isDs(v) { return Array.isArray(v) && v.every(x=>this.isDate(x)) }
    isBs(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isEs(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isAs(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isOs(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }

    to(type, value) { // boxing  value:型変換したい値, type:型名(typeof)
        switch(type.toLowerCase()) {
            case 'undefined': return undefined
            case 'null': return null
            case 'object': return {}
            case 'array': return []
            case 'boolean': return ((value) ? (['true','1'].some(v=>v===value.toString().toLowerCase())) : false)
            case 'number': return Number(value)
            case 'integer': return parseInt(value)
            case 'float': return parseFloat(value)
            case 'string': return String(value)
            case 'bigint': return BigInt(value)
            case 'symbol': return Symbol(value)
            case 'function': return new Function(value)
            case 'class': return Function(`return (${value})`)() // value: Class名（new ClassName()） 未定義エラーになる…
            default: throw new Error('typeは次のいずれかのみ有効です:undefined,null,object,array,boolean,number,integer,float,string,bigint,symbol,function,class')
//            default: return Function('return (' + classname + ')')()
        }
    }

}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
*/
})()
