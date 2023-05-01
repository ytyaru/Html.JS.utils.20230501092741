(function() {
class Type {
    isString(v) { return typeof v === "string" || v instanceof String }
    isBoolean(v) { return 'boolean' === typeof v }
    isNumber(v) { return 'number' === typeof v && !isNaN(v) }
    isInteger(v)   { return this.isNumber(v) && v % 1 === 0 }
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
    isStrs(v) { return Array.isArray(v) && v.every(x=>Type.isString(x)) }
    isNums(v) { return Array.isArray(v) && v.every(x=>Type.isNumber(x)) }
    isInts(v) { return Array.isArray(v) && v.every(x=>Type.isInteger(x)) }
    isFloats(v) { return Array.isArray(v) && v.every(x=>Type.isFloat(x)) }
    isBools(v) { return Array.isArray(v) && v.every(x=>Type.isBoolean(x)) }
    isDates(v) { return Array.isArray(v) && v.every(x=>Type.isDate(x)) }
    isBigInts(v) { return Array.isArray(v) && v.every(x=>Type.isBigInt(x)) }
    isSymbols(v) { return Array.isArray(v) && v.every(x=>Type.Symbol(x)) }
    isEls(v) { return Array.isArray(v) && v.every(x=>Type.Element(x)) }
    isArys(v) { return Array.isArray(v) && v.every(x=>Type.isArray(x)) }
    isObjs(v) { return Array.isArray(v) && v.every(x=>Type.isObject(x)) }
    isFns(v) { return Array.isArray(v) && v.every(x=>Type.isFunction(x)) }
    isInss(v) { return Array.isArray(v) && v.every(x=>Type.isInstances(x)) }
}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
})()
