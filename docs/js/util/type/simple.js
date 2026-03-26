/* シンプルな型チェック（守備範囲: 組込、一部WebAPI）
*/
(function(){
const isPrimitive = (v)=>v!==Object(v);
const isReference = (v)=>v===Object(v);
const PrimClss = [Boolean, Number, BigInt, String, Symbol];
const PrimClsNms = Object.freeze({Boolean:'Bln', Number:'Num', BigInt:'Big', String:'Str', Symbol:'Sym'});
const isGenerics = (g)=>{
    if (g) {
        const M = (PrimClss.some(C=>g===C)
            ? `is${getPrimClsNms[g]}`
            : (Type.isCls(g)
                ? `isIns`
                : (()=>{throw new TypeError(`gはプリミティブ型かクラス型であるべきです。`)})());
        return v.every(e=>Type[M](e,g));
    } else {return true}
}
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
    // リファレンス型
    Ref: isReference,
    Mod: (v)=>null!==v && 'Module'===v[Symbol.toStringTag];
    Cls: (v)=>'function'===typeof v && /^\s*class\s+/.test(v.toString());
    Ins: (v, C)=>Type.isExe(v) && Object.getPrototypeOf(v) !== Object.prototype && !Array.isArray(val) && (Type.isCls(C) ? v instanceof C : (undefined===C ? null : (()=>{throw new TypeError(`第二引数はクラス型であるべきです。`)}))),
    Ary: (v, g)=>Array.isArray(v) && isGenerics(g),
    BlkAry: (v)=>Array.isArray(v) && 0===v.length,
    Exe: (v)=>'function'===typeof v,

    NaN: (v)=>Number.isNaN(v),
    ErrCls: (v)=>Error===v||Error.isPrototypeOf(v),
    ErrIns: (v)=>v instanceof Error,


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

