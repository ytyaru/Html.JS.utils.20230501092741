/* シンプルな型チェック（守備範囲: 組込、一部WebAPI）
*/
(function(){
const getId = (v)=>Object.prototype.toString.call(v).slice(8, -1);
const getTag = (v)=>{
//    const tag = Object.prototype.toString.call(v);
//    const name = tag.slice(8, -1); // [object ...] のうち...だけを取得する
    const name = getId(v);
    if (isPrimitive(v)) {return `Primitive<${name}>`}
    else if (Type.isMod(v)) {return `Module`}
    else if (Type.isCls(v)) {return `Class<${v.name}>`}
    else if (Type.isObj(v)) {return `Object`}
    else if (Type.isAry(v)) {return `Array`}
    else if (Type.isMap(v)) {return `Map`}
    else if (Type.isSet(v)) {return `Set`}
    else if (Type.isItr(v)) {return `Iterator`}
    else if (Type.isGen(v)) {return `Generator`}
    else if (Type.isAGFn(v)) {return `AsyncGeneratorFunction`}
    else if (Type.isGFn(v)) {return `GeneratorFunction`}
    else if (Type.isAFn(v)) {return `AsyncFunction`}
    else if (Type.isFn(v)) {return `Function`}
    else if (Type.isIns(v)) {return `Instance<${v.constructor.name}>`}
    else {return name}
}
const isPrimitive = (v)=>v!==Object(v);
const isReference = (v)=>v===Object(v);
const PrimClss = [Boolean, Number, BigInt, String, Symbol];
const PrimClsNms = Object.freeze({Boolean:'Bln', Number:'Num', BigInt:'Big', String:'Str', Symbol:'Sym'});
const isGenerics = (v,g)=>{
    if (g) {
        const M = (PrimClss.some(C=>g===C)
            ? `is${getPrimClsNms[g]}`
            : (Type.isCls(g)
                ? `isIns`
                : (()=>{throw new TypeError(`gはプリミティブ型かクラス型であるべきです。`)})());
        return v.every(e=>Type[M](e,g));
    } else {return true}
}
const exeTypes = {// executableTypes
    AsyncFunction: (async()=>{}).constructor,
    GeneratorFunction: (function*(){yield undefined;}).constructor,
    AsyncGeneratorFunction: (async function*(){yield undefined;}).constructor,
};
// タグを取得する（Object.prototype.toString.call(v)）
// Type.tagOf(v); // "[object Boolean]" のうち Boolean を返す（undefinedだとReferenceErrorになるので注意）
const data = {
    // プリミティブ型
    Prim: isPrimitive,
    Und: (v)=>undefined===v,
    Nul: (v)=>null===v,
    Bln: (v)=>'boolean'===typeof v,
    Num: (v)=>'number'===typeof v,
    Big: (v)=>'bigint'===typeof v,
    Str: (v)=>'string'===typeof v,
    Sym: (v)=>'symbol'===typeof v,
    NaN: (v)=>Number.isNaN(v),
    Int: (v)=>Number.isSafeInteger(v),
    Flt: (v)=>Number.isFinite(v) && Number.MIN_SAFE_INTEGER<=v && v<=Number.MAX_SAFE_INTEGER,
    Inf: (v)=>[Infinity, -Infinity].some(x=>x===v),
    PosInf: (v)=>Infinity===v,
    NegInf: (v)=>-Infinity===v,
    Zero: (v)=>0===v,
    PosInt: (v)=>Type.isInt(v) && 0<=v,
    NegInt: (v)=>Type.isInt(v) && v<0,
    BlkStr: (v)=>''===v,
    NaN: (v)=>Number.isNaN(v),
    // リファレンス型
    Ref: isReference,
    Mod: (v)=>null!==v && 'Module'===v[Symbol.toStringTag];
    Cls: (v)=>'function'===typeof v && /^\s*class\s+/.test(v.toString());
    Ins: (v, C)=>Type.isExe(v) && Object.getPrototypeOf(v) !== Object.prototype && !Array.isArray(val) && (Type.isCls(C) ? v instanceof C : (undefined===C ? null : (()=>{throw new TypeError(`第二引数はクラス型であるべきです。`)}))),
    Obj: (v)=>,
    Ary: (v, g)=>Array.isArray(v) && isGenerics(v,g),
    BlkAry: (v)=>Array.isArray(v) && 0===v.length,
    Map: (v, C)=>v instanceof Map && Type.isCls(C) ? isGenerics([...v.values()],g) : true,
    Set: (v, C)=>v instanceof Set && Type.isCls(C) ? isGenerics([...v.values()],g) : true,

    ErrCls: (v)=>Error===v||Error.isPrototypeOf(v),
    ErrIns: (v)=>v instanceof Error,

    Exe: (v)=>'function'===typeof v,
    Fn: (v)=>'function'===typeof v && 'G A AG'.split(' ').every(n=>!Type[`is${n}Fn`](v)),
    GFn: (v)=>v instanceof exeTypes.GeneratorFunction,
    AFn: (v)=>v instanceof exeTypes.AsyncFunction,
    AGFn: (v)=>v instanceof exeTypes.AsyncGeneratorFunction,

    Promise: (v)=>v instanceof Promise,
    Itr: (v)=>!Type.isUnd(v) && !Type.isNul(v) && 'function'===typeof v[Symbol.iterator],
    Gen: (v)=>'Generator'===getId(v),
}
];
class Type {

Type.isPrim/Ref(v);
Type.isUnd/Nul/Bln/Num/Big/Str/Sym(v);
Type.isMod/Cls/Ins/Des/Exe/Obj/Ary/Map/Set/(v);

Type.isNaN() {}
Type.isErrCls() {}
Type.isErrIns() {}
}
window.Type = Type;
})();

