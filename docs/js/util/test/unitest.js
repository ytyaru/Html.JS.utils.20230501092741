(function(){
/*
<script src="unitest.js"></script>
<script defer>
Unitest.darked; // ダークモード
Unitest.lighted; // ライトモード
Unitest.automated; // 実行した時刻で自動的にダーク／ライトを設定する（デフォルト）
Unitest.assert((a)=>{
    a.t(true);
    a.t(async()=>true);
    a.f(false);
    a.f(async()=>false);
    a.e(Error, 'message', ()=>{throw new Error(`message`)});
    a.e(Error, 'message', async()=>{throw new Error(`message`)});
    // 複数テストケースがある場合
    a.t([0,1], (...args)=>'number'===typeof args[0]);
    a.t([['A',0],['B',1]], (...args)=>1===(new Map([args])).size);
    a.t(()=>[['A',0],['B',1]], (...args)=>1===(new Map([args])).size);
    a.t(async()=>[['A',0],['B',1]], async(...args)=>1===(new Map([args])).size);
    a.e(TypeError, 'message', [0,1], (...args)=>{throw new TypeError('message')});
    a.e(TypeError, 'message', ()=>[0,1], (...args)=>{throw new TypeError('message')});
    a.e(TypeError, 'message', async()=>[0,1], async(...args)=>{throw new TypeError('message')});
});
</script>
*/
static THIS_FILE = 'unitest.js:';
class Unitest {
    static assert(fn) {
        const a = new Assertion();
        fn(a);         // テストケースの定義
        this.#test(a); // テストケースの実行
        this.#show(a); // テストケースの表示
    }
    static #test(a) {// 全テストを実行する
        const aFns = a._.cases.filter(c=>c.isAsync);
        const fns = a._.cases.filter(c=>!c.isAsync);
        fns.map(fn=>fn.actual());
    }
    static #tryFn(fn) {

    }
}
/*
const isB = (v)=>'boolean'===typeof v;
const isFn = (v)=>'function'===typeof v;
const isAFn = (v)=>isFn(v) && v.constructor.name === 'AsyncFunction';
const isCls = (v)=>(isFn(v) && (!!v.toString?.().match(/^class /)));
const getTag = (v)=>Object.prototype.toString.call(v);
const isIns = (v)=>null!==v && 'object'===typeof v && 'Object Array'.every(t=>`[object ${t}]`!==getTag(v));
const isErrCls = (v) =>isCls(v) && v.prototype instanceof Error;
const isErrIns = (v) =>v instanceof Error;
*/
const isB = (v)=>'boolean'===typeof v,
    isS = (v)=>'string'===typeof v,
    isReg = (v)=>v instanceof RegExp,
    isFn = (v)=>'function'===typeof v,
    isAFn = (v)=>isFn(v) && v.constructor.name === 'AsyncFunction',
    isCls = (v)=>(isFn(v) && (!!v.toString?.().match(/^class /))),
    getTag = (v)=>Object.prototype.toString.call(v),
    isIns = (v)=>null!==v && 'object'===typeof v && 'Object Array'.every(t=>`[object ${t}]`!==getTag(v)),
    isErrCls = (v) =>isCls(v) && v.prototype instanceof Error,
    isErrIns = (v) =>v instanceof Error;
class Assertion {// Unitest.assert((a)=>{})のように利用者は外部からAssertインスタンスとして利用する
    constructor() { // 内部で全テストケースを関数として保持する
        this._ = {cases:[]};
    }
    t() {}
    f() {}
    e() {}
    tc() {}
    fc() {}
    ec() {}
    #getExpected(v, w) {
        if ('boolean'===typeof v || isErrIns(v)) {return v}
        else if (isErrCls(v) && (isS(w) || isReg(w))) {return {errCls:v, msg:w}}
        else {throw new TypeError(`入力値不正。#getExpected()`)}
    }
    #makeTestFn(expected, ...args) {// expected: true/false/new Error('message')/Error + (msg)=>msg.match(/^some$/)/RegExp
             if (1===args.length && isB(args[0])) {this._.cases.push({expected:expected, actual:()=>args[0], isAsync:false})}
        else if (1===args.length && isFn(args[0])) {this._.cases.push({expected:expected, actual:()=>args[0], isAsync:isAFn(args[0])})}
        else if (3===args.length && isErrCls(args[0]) && (isS(args[1]) || isReg(args[1])) && isFn(args[2])) {this._.cases.push({expected:expected, actual:args[2], isAsync:isAFn(args[2])})}
        // tc(),fc(),ec()のような複数の引数パターンを持つ方法も追加したい
        else {throw new TypeError(`入力値不正。#makeTestFn()`)}
    }
}

class StackTracer {
    capture(caller) {
//        caller = caller ?? this.__getCaller(removeTxt);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, caller ?? this.capture);
            const s = this.stack.split('\n')
            s.shift() // 先頭にある Error 削除
            return this.__delStacks(s)
        } else { return [] } 
    }
    #getErrorStacks(err) {
        const errs = this.#recursionCause([err])
        return errs.map(e=>this.#delStacks(e.stack)).flat()
    }
    #recursionCause(errs) {
        const last = errs[errs.length-1]
        if (last.hasOwnProperty('cause') && last.cause) {
            errs.push(last.cause)
            return this.#recursionCause(errs)
        } else { return errs }
    }
    #delStacks(stacks) {
        //const s = Array.isArray(stacks) ? stacks : (this.__isStr(stacks) ? stacks.split('\n') : null)
        const s = Array.isArray(stacks) ? stacks : (isS(stacks) ? stacks.split('\n') : null)
        if (null===s) { throw new AssertError(`内部エラー。#delStacksの引数は文字列かその配列であるべきです。`, 'exception') }
        return s.filter(line=>-1===line.indexOf(THIS_FILE))
    }
    __isGenealogy(a, e) { // aがeの系譜（同一または子孫クラス）であれば真を返す
        if (a instanceof e || a.constructor.name === e.constructor.name) { return true }
        if (a.prototype) { return this.__isGenealogy(a.prototype, e) }
        return false
    }
    __getCaller(removeTxt) {
        const error = new Error();
        const stack = error.stack || '';
        const stacks = stack.split('\n');
        const callerIndex = stacks.findIndex(line => line.includes('__getCaller'));
        if (!removeTxt) {removeTxt=THIS_FILE} // このファイル名が含まれるスタックトレースは削除する
        return (stacks[callerIndex]) ? this.#delStacks(stacks.slice(callerIndex)).join('\n') : 'Unknown'
    }
}
class Show {// テスト結果をHTMLに画面表示する（結果一覧。問題箇所一覧。）

}

})();
