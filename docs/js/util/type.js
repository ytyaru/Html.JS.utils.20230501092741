(function() {
class Type {
    constructor() {
        this._names = new Map()
        //this._names.set('String', {func:this.isString, alias:['Str', 'S']})
        this._names.set('String', ['Str', 'S'])
        this._names.set('Boolean', ['Bool', 'B'])
        this._names.set('Number', ['Num', 'N'])
        this._names.set('Integer', ['Int', 'I'])
        this._names.set('Float', ['F'])
        this._names.set('Date', ['D'])
        this._names.set('BigInt', [])
        this._names.set('Symbol', [])
        this._names.set('Element', ['Elm', 'El', 'E'])
        this._names.set('Array', ['Ary', 'A'])
        this._names.set('Object', ['Obj', 'O'])
        this._names.set('Function', ['Func', 'Fun', 'Fn'])
    }
//    #call(name, v) {
//        if (this.hasOwnProperty(name)) { return this[name](v) }
//        this[this._names]
//    }
    isString(v) { return typeof v === "string" || v instanceof String }
    isBoolean(v) { return 'boolean' === typeof v }
    isNumber(v) { return 'number' === typeof v && !isNaN(v) }
    isInteger(v)   { return this.isNumber(v) && v % 1 === 0 }
    isPositiveInteger(v)   { return this.isInteger(v) && 0<=v }
    isNegativeInteger(v)   { return this.isInteger(v) && v<0 }
    isFloat(v) { return this.isNumber(v) && v % 1 !== 0 }
    isDate(v) { return date && date.getMonth && typeof date.getMonth === 'function' && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date) } // https://stackoverflow.com/questions/643782/how-to-check-whether-an-object-is-a-date
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
    isObject(v) { return v !== null && typeof v === 'object' }
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
    isFloats(v) { return Array.isArray(v) && v.every(x=>this.isFloat(x)) }
    isBooleans(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isDates(v) { return Array.isArray(v) && v.every(x=>this.isDate(x)) }
    isBigInts(v) { return Array.isArray(v) && v.every(x=>this.isBigInt(x)) }
    isSymbols(v) { return Array.isArray(v) && v.every(x=>this.isSymbol(x)) }
    isElements(v) { return Array.isArray(v) && v.every(x=>this.isElement(x)) }
    isArrays(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjects(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFunctions(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    isInstances(v) { return Array.isArray(v) && v.every(x=>this.isInstances(x)) }
    // array<T> short
    isStrs(v) { return Array.isArray(v) && v.every(x=>this.isString(x)) }
    isNums(v) { return Array.isArray(v) && v.every(x=>this.isNumber(x)) }
    isInts(v) { return Array.isArray(v) && v.every(x=>this.isInteger(x)) }
    isBools(v) { return Array.isArray(v) && v.every(x=>this.isBoolean(x)) }
    isEls(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isArys(v) { return Array.isArray(v) && v.every(x=>this.isArray(x)) }
    isObjs(v) { return Array.isArray(v) && v.every(x=>this.isObject(x)) }
    isFns(v) { return Array.isArray(v) && v.every(x=>this.isFunction(x)) }
    isInss(v) { return Array.isArray(v) && v.every(x=>this.isInstances(x)) }
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
}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
})()
