(function() {
class Type {
    isString(v) { return typeof v === "string" || v instanceof String }
    isBool(v) { return 'boolean' === typeof v }
    isNumber(v) { return 'number' === typeof v && NaN !== v }
    isInt(v)   { return Number(n) === n && n % 1 === 0 }
    isFloat(v) { return Number(n) === n && n % 1 !== 0 }
    isBigInt(v) { return 'bigint' === typeof v }
    isSymbol(v) { return 'symbol' === typeof v }
    isDom(v) {
        try { return v instanceof HTMLElement; }
        catch(e){
            return (typeof v==="object") &&
                (v.nodeType===1) && (typeof v.style === "object") &&
                (typeof v.ownerDocument ==="object");
        }
    }
}
window.Type = new Type()
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
})()
