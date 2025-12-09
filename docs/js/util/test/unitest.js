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
const THIS_FILE = 'unitest.js:';
class TestError extends Error {
    constructor(msg, cause) {
        undefined===cause ? super(msg) : super(msg, {cause,cause});
//        super(msg, {cause,cause});
        this.name = 'TestError';
//        this.cause = cause;
    }
}
class AssertError extends Error {
    constructor(msg, cause) {
        undefined===cause ? super(msg) : super(msg, {cause,cause});
//        super(msg, {cause,cause});
        this.name = 'AssertError';
//        this.cause = cause;
//        this.status = status;// exception/fail/pending/success  例外/失敗/保留/成功
    }
}
class Unitest {
    constructor() {
        this._ = {st:new StackTracer()};
    }
    assert(fn) {
        const a = new Assertion();
        this.#define(a, fn); // テストケースの定義
        this.#test(a);       // テストケースの実行
        this.#show(a);       // テストケースの表示
    }
    #define(a, fn) {
        const example = `(a)={a.t(true); a.f(false); a.e(Error, 'msg', ()=>new Error('msg'));}`;
        if (!isFn(fn)) {throw new TestError(`unitest.assert()の引数は関数であるべきです。例: ${example}`)}
        try {fn(a);} catch (e) {throw new TestError('テストケース定義中に例外発生しました。', e)} // コード箇所の表示＆ログの色を青にしたい
        if (0===a._.cases.length) {throw new TestError(`テストケースが一つもありません。次のように実装してください。例: ${example}`)}
        console.log(a._.cases);
    }
    #test(a) {// 全テストを実行する
        console.log(`全テスト数:${a._.cases.length}`);
//        const aFns = a._.cases.filter(c=>c.isAsync);
//        const fns = a._.cases.filter(c=>!c.isAsync);
        const afns = [];
        for (let i=0; i<a._.cases.length; i++) {
            const c = a._.cases[i];
            if (c.isAsync) {afns.push(c)}
            else {this.#case(c)}
        }
        // HTML画面を更新する
        const S=a._.cases.filter(c=>0===c.statusCode).length, F=a._.cases.filter(c=>1===c.statusCode).length, E=a._.cases.filter(c=>2===c.statusCode).length;
        console.log(a._.cases);
        console.log(`同期のみ完了時: ${0<E ? '例外:'+E+' ' : ''}${0<F ? '失敗:'+F+' ' : ''}${0<S ? '成功:'+S : ''}`);

        console.log(afns.length, afns);
        // 非同期テストケースを一括処理（結果を個別にセットする）
        Promise.allSettled(afns.map(a=>a.test())).then((results)=>{
            for (let i=0; i<results.length; i++) {
                let c = afns[i]; // testCaseObject
                c.actual = results[i].value;
                console.log('c.actual:',c.actual);
                if (isB(c.expected)) {// 正常系テスト（指定した真偽値を返すか確認する）
                    if ('fulfilled'===results[i].status) {
                        if (c.expected===c.actual) {c.statusCode=0} // succeed
                        else {
                            c.statusCode=1; // Failed
                            //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)); // Exception テスト中で想定外の例外発生。
//                            c.stacks = (()=>{throw new AssertError(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)})().stack.split('\n'); // Exception テスト中で想定外の例外発生。
                            //const error = this._.st.make(new AssertError(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`));
                            //c.stacks = error.stack;
                            /*
                            const error = this._.st.make(new AssertError(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`));
                            c.error = error;
                            c.msg = error.message;
                            c.stacks = error.stack.split('\n');
                            */
                            c = {...c, ...this.#makeStacks(AssertError, `テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)};
                            Console.fail(c);
                        }
                    } else {//else if ('rejected'===results[i].status) {
                        c.statusCode=2; // Exception
                        //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト例外。真偽値が期待される所で例外発生しました。`, e));
                        //c.stacks = (()=>{new AssertError(`テスト例外。真偽値が期待される所で例外発生しました。`, e)})().stack.split('\n');
                        //c.stacks = this._.st.make(new AssertError(`テスト例外。真偽値が期待される所で例外発生しました。`, results[i].reason));
                        c = {...c, ...this.#makeStacks(AssertError, `テスト例外。真偽値が期待される所で例外発生しました。`, results[i].reason)};
                        Console.exception(c);
                    }// else {throw new Error(`起こり得ない`)}
                } else {// 異常系テスト（指定した例外が発生するか確認する）
                    if ('fulfilled'===results[i].status) {
                        c.statusCode=1; // Failed
                        //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト失敗。例外発生が期待される所で発生しなかった。`));
                        //c.stacks = (()=>{new AssertError(`テスト失敗。例外発生が期待される所で発生しなかった。`)})().stack.split('\n');
                        //c.stacks = this._.st.make(new AssertError(`テスト失敗。例外発生が期待される所で発生しませんでした。`));
                        c = {...c, ...this.#makeStacks(AssertError, `テスト失敗。例外発生が期待される所で発生しませんでした。`)};
                        Console.fail(c);
                    } else {//else if ('rejected'===results[i].status) {
                        const e = results[i].reason;
                        //const isFailedType = e instanceof c.expected.type;
                        const isFailedType = e.constructor.name !== c.expected.type.name;
                        const isFailedMsg = undefined===c.expected.msg
                            ? false
                            : (isS(c.expected.msg)
                                ? e.message===c.expected.msg
                                : e.message.match(c.expected.msg));
                        const msg = (isFailedType ? `テスト失敗。例外の型が違います。\n期待値:${c.expected.type.name}\n実際値:${e.constructor.name}` : '')
                            + (isFailedMsg ? `テスト失敗。例外のメッセージが違います。\n期待値:${c.expected.msg}\n実際値:${e.message}` : '');
                        c.statusCode = msg ? 1 : 0; // Failed/Succeed
                        if (msg) {
                            //c.stacks = this._.st.getErrorStacks(new Assertion(msg));
                            //c.stacks = (()=>{new AssertError(msg)})().split('\n');
                            //c.stacks = this._.st.make(new AssertError(msg, results[i].reason));
                            c = {...c, ...this.#makeStacks(AssertError, msg, results[i].reason)};
                            Console.fail(c);
                        }
                    }
                }
            }
            // HTML画面を更新する
            const S=a._.cases.filter(c=>0===c.statusCode).length, F=a._.cases.filter(c=>1===c.statusCode).length, E=a._.cases.filter(c=>2===c.statusCode).length;
            console.log(a._.cases);
            console.log(`${0<E ? '例外:'+E+' ' : ''}${0<F ? '失敗:'+F+' ' : ''}${0<S ? '成功:'+S : ''}`);
        });
        /*
        for await (let afn of afns) {
            const actual = await afn();
        }
        afns.push(c);
        fns.map((fn,i)=>{
            fn.test()
        });
        */
    }
    #makeStacks(type, msg, cause) {
        const e = this._.st.make(new type(msg, cause));
        return {error:e, msg:e.message, stacks:e.stack.split('\n')}
//        c.error = error;
//        c.msg = error.message;
//        c.stacks = error.stack.split('\n');
    }
    #tryFn(fn) {

    }
    #show() {}
    #case(c) {// c:testCaseObject。cにstaticsを追加したりコンソール表示したりする。
        console.log(`id:${c.id}`, c);
        if (isB(c.expected)) { // 正常系（指定した真偽値を返すか確認する）
            try {
                c.actual = c.test();
                if (c.expected===c.actual) {c.statusCode=0} // succeed
                else {
                    c.statusCode=1; // Failed
                    //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)); // Exception テスト中で想定外の例外発生。
                    //c.stacks = (()=>{new AssertError(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)})().split('\n'); // Exception テスト中で想定外の例外発生。
                    //c.stacks = this._.st.make(new AssertError(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`));
                    c = {...c, ...this.#makeStacks(AssertError, `テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)};
                    Console.fail(c);
                }
                /*
                //if (c.expected!==c.actual) {c.stacks = this._.st.capture(); Console.fail(c);} // Failed テスト失敗。期待値と異なる。
                if (c.expected!==c.actual) { // Failed テスト失敗。期待値と異なる。
                    //c.stacks = this._.st.capture();
                    c.stacks = this._.st.getErrorStacks(new Assertion(`テスト失敗。${c.expected ? '真' : '偽'}が期待される所で${c.actual}になりました。`)); // Exception テスト中で想定外の例外発生。
                    Console.fail(c);
                }
                */
            } catch (e) {
                c.statusCode=2; // Exception
//                        c.stacks = this._.st.getErrorStacks(e); // Exception テスト中で想定外の例外発生。
                //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト例外。真偽値が期待される所で例外発生しました。`, e)); // Exception テスト中で想定外の例外発生。
                //c.stacks = (()=>{new AssertError(`テスト例外。真偽値が期待される所で例外発生しました。`, e)})().split('\n'); // Exception テスト中で想定外の例外発生。
                //c.stacks = this._.st.make(new AssertError(`テスト例外。真偽値が期待される所で例外発生しました。`, e));
                c = {...c, ...this.#makeStacks(AssertError, `テスト例外。真偽値が期待される所で例外発生しました。`, e)};
                Console.exception(c);
            }
        } else {// 異常系（指定した例外が発生するか確認する）
            try {
                c.actual = c.test();
                c.statusCode=1; // Failed
                //c.stacks = this._.st.capture(); // Failed テスト失敗。例外発生が期待される所で発生しなかった。
                //c.stacks = this._.st.getErrorStacks(new Assertion(`テスト失敗。例外発生が期待される所で発生しなかった。`));
                //c.stacks = (()=>{new AssertError(`テスト失敗。例外発生が期待される所で発生しなかった。`)})().split('\n');
//                c.stacks = this._.st.make(new AssertError(`テスト失敗。例外発生が期待される所で発生しなかった。`));
                c = {...c, ...this.#makeStacks(AssertError, `テスト失敗。例外発生が期待される所で発生しなかった。`)};
                Console.fail(c);
            } catch (e) {
                //const isFailedType = e instanceof c.expected.type;
                const isFailedType = e.constructor.name !== c.expected.type.name;
                const isFailedMsg = undefined===c.expected.msg
                    ? false
                    : (isS(c.expected.msg)
                        ? e.message===c.expected.msg
                        : e.message.match(c.expected.msg));
                const msg = (isFailedType ? `テスト失敗。例外の型が違います。\n期待値:${c.expected.type.name}\n実際値:${e.constructor.name}` : '')
                    + (isFailedMsg ? `テスト失敗。例外のメッセージが違います。\n期待値:${c.expected.msg}\n実際値:${e.message}` : '');
                c.statusCode = msg ? 1 : 0; // Failed/Succeed
                if (msg) {
                    //c.stacks = this._.st.getErrorStacks(new Assertion(msg));
                    //c.stacks = (()=>{new AssertError(msg)})().split('\n');
                    //c.stacks = this._.st.make(new AssertError(msg, e));
                    c = {...c, ...this.#makeStacks(AssertError, msg, e)};
                    Console.fail(c);
                }
            }
        }
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
    isCls = (v)=>(isFn(v) && Boolean(v.toString?.().match(/^class /))),
    getTag = (v)=>Object.prototype.toString.call(v),
    isIns = (v)=>null!==v && 'object'===typeof v && 'Object Array'.every(t=>`[object ${t}]`!==getTag(v)),
//    isErrCls = (v) =>isCls(v) && v.prototype instanceof Error,
    isErrCls = (v) =>Error===v||Error.isPrototypeOf(v);
    isErrIns = (v) =>v instanceof Error;
class Assertion {// Unitest.assert((a)=>{})のように利用者は外部からAssertインスタンスとして利用する
    constructor() { // 内部で全テストケースを関数として保持する
        this._ = {id:0, cases:[]};
    }
    t(...args) {this.#makeTestFn(true, ...args)}
    f(...args) {this.#makeTestFn(false, ...args)}
    //e(...args) {this.#makeTestFn(args[0], ...args)}
    e(...args) {this.#makeTestFn(args[0], ...args.slice(1))}
    tc(...args) {}
    fc(...args) {}
    ec(...args) {}
    #getExpected(v, w) {
        if ('boolean'===typeof v || isErrIns(v)) {return v}
        else if (isErrCls(v) && (isS(w) || isReg(w))) {return {errCls:v, msg:w}}
        else {throw new TypeError(`入力値不正。#getExpected()`)}
    }
    #makeTestFn(expected, ...args) {// expected: true/false/new Error('message')/Error + (msg)=>msg.match(/^some$/)/RegExp
        const L = args[args.length-1];
        //const o = {expected:expected, test:isFn(L) ? L : ()=>expected, isAsync:isAFn(0===args.lengt ? false : isAFn(L))};
        /*
        const o = {
            expected: isB(expected) ? expected : ({type:isErrCls(expected) ? expected : expected.constructor, msg:1===args.length ? undefined : args[0]}),
            test: isFn(L) ? L : ()=>expected,
            isAsync:isAFn(0===args.lengt ? false : isAFn(L)),
        };
        */
        console.log('#makeTestFn引数:', expected, ...args, args.length, 0===args.length ? false : isAFn(L));
        console.log(isErrCls(expected) , 1===args.length , isFn(L));
        console.log(expected, isFn(expected), expected.toString?.(), Boolean(expected.toString?.().match(/^class /)), isCls(expected) , expected.prototype instanceof Error);

        if ((isB(expected) && 1===args.length && (isB(L) || isFn(L)))
         || (isErrIns(expected) && 1===args.length && isFn(L))
         || (isErrCls(expected) && 1===args.length && isFn(L))
         || (isErrCls(expected) && 2===args.length && (isS(args[0]) || isReg(args[0])) && isFn(L))) {this._.cases.push({
            id: this._.id++,
            expected: isB(expected) ? expected : ({type:isErrCls(expected) ? expected : expected.constructor, msg:isErrCls(expected) && 1===args.length ? undefined : args[0]}),
            //test: isFn(L) ? L : ()=>expected,
            test: isFn(L) ? L : ()=>args[0],
            isAsync:0===args.length ? false : isAFn(L),
            notFn: (isB(expected) && 1===args.length && isB(L)),
         });}
//         || (isErrCls(expected) && 2===args.length && (isS(args[0]) || isReg(args[0])) && isFn(L))) {this._.cases.push(o);}
        // tc(),fc(),ec()のような複数の引数パターンを持つ方法も追加したい
        else {throw new TypeError(`入力値不正。#makeTestFn(): ${args}`)}
        /*
             if (isB(expected) && 0===args.length) {this._.cases.push({expected:expected, actual:()=>expected, isAsync:false})}
        else if (isB(expected) && 1===args.length && isFn(args[0])) {this._.cases.push({expected:expected, actual:args[0], isAsync:isAFn(args[0])})}
        else if (isErrIns(expected) && 1===args.length && isFn(args[0])) {this._.cases.push({expected:expected, actual:args[0], isAsync:isAFn(args[0])})}
        else if (isErrCls(expected) && 2===args.length && (isS(args[0]) || isReg(args[0])) && isFn(args[1])) {this._.cases.push({expected:expected, actual:args[1], isAsync:isAFn(args[1])})}
        // tc(),fc(),ec()のような複数の引数パターンを持つ方法も追加したい
        else {throw new TypeError(`入力値不正。#makeTestFn()`)}
        */
    }
}

class StackTracer {
    capture(caller) {
        caller = caller ?? this.__getCaller(removeTxt);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, caller ?? this.capture);
            const s = this.stack.split('\n')
            s.shift() // 先頭にある Error 削除
            return this.__delStacks(s)
        } else { return [] } 
    }
    make(err) {
        if (!isErrIns(err)) {throw new TypeError(`errはErrorかそれを継承した型のインスタンスであるべきです。`)}
        try {throw err;} catch(e) {return e}
    }
    /*
    make(err) {
        if (!isErrIns(err)) {throw new TypeError(`errはErrorかそれを継承した型のインスタンスであるべきです。`)}
        try {throw error;} catch(e) {return e.stack.split('\n')}
    }
    */
    /*
    getErrorStacks(err) {
        const errs = this.#recursionCause([err])
        console.log(errs.map(e=>e.stack));
        return errs.map(e=>this.#delStacks(e.stack)).flat()
    }
    */
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
const Status = {
    pending:   {name:'保留', color:{f:'#666666',b:'#CCCCCC'}},
    exception: {name:'例外', color:{f:'#0000AA',b:'#99CCFF'}},
    fail:      {name:'失敗', color:{f:'#AA0000',b:'#FFABCE'}},
    success:   {name:'成功', color:{f:'#008800',b:'#AEFFBD'}},
};
class Console {
    static fail(o) {this.#log('fail', o)}
    static exception(o) {this.#log('exception', o)}
    static #log(status, o) {console.log(`%c${o.msg}\n${this.#testCode(o)}\n${o.stacks.join('\n')}`, `background-color:${Status[status].color.b};color:${Status[status].color.f};`)}
    //static #testCode(o) {return o.notFn ? `対象id:${o.id}` : '対象:' + (isB(o.expected) && !o.isAsync ? `${o.test}`.replace('()=>','') : `${o.test}`);}
    static #testCode(o) {return `対象id:${o.id}` + (o.notFn ? '' : (` コード:` + (isB(o.expected) && !o.isAsync ? `${o.test}`.replace('()=>','') : `${o.test}`)));}



    /*
    static log(status, msg, err, caller) { // status:pending/exception/fail/success、[s,m],[s,m,c],[s,m,e],[s,m,e,c]
        const stacks = (undefined===err || this.__isFn(err)) ? this._captureStacks(this._console) : this._getErrorStacks(err)
        if (['exception','fail'].some(s=>s===status)) {
            console.log(`%c${msg}\n${stacks.join('\n')}`, `background-color:${this._M.stt[status].color.b};color:${this._M.stt[status].color.f};`)
        } else {
            console.log(`${msg}\n${stacks.join('\n')}`)
        }
    }
    */
}
class Show {// テスト結果をHTMLに画面表示する（結果一覧。問題箇所一覧。）

}
window.unitest = new Unitest();
})();
