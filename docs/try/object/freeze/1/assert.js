class Assert {
    static ok(valueOrFn) {
        console.log(this._getActual(valueOrFn))
        try { if (!this._getActual(valueOrFn)) {this._errorStack(`テスト失敗。真であるべき所が偽である。`, this.ok)} }
        catch (err) {this._errorStack(`テスト失敗。真であるべき所で例外発生した。`, this.ok)}
    }
    static error(type, msg, fn) {
        try { fn() }
        catch(err) {
            if (type.name!==err.name) { console.error(`テスト失敗。エラーの型が違う。\n期待値:${type.name}\n実際値:${err.name}\n`, err) }
            if (!this._matchErrorMessage(msg, err.message)) { console.error(`テスト失敗。エラーメッセージが違う。\n期待値:${msg}\n実際値:${err.message}\n`, err) }
            return true
        }
        this._errorStack(`テスト失敗。エラーになるべき所でエラーにならなかった。`, this.error)
    }
    static _getActual(v) { return this._isFn(v) ? v() : v }
    static _isFn(v) { return 'function'===typeof v }
    static _matchErrorMessage(expected, actual) {
        if (this._isRegExp(expected)) { return expected.test(actual) }
        else if (this._isString(expected)){ return actual===expected }
        else { return false }
    }
    static _isString(v) { return 'string'===typeof v || v instanceof String }
    static _isRegExp(v) { return v instanceof RegExp }
    static _errorStack(msg, caller) {
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, caller ?? this._errorStack);
            console.error(msg, this.stack)
        } else { console.error(msg) }
    }
}
/*
const assertError = (type, msg, fn)=> {
    try { fn() }
    catch(err) {
        //if (!(err instanceof type)) { return new AssertErrorResult([false, 'エラーの型が違う', `${err}`]) }
        if (!(err instanceof type)) { throw new Error(`テスト失敗：エラーの型が期待値と違う。期待値:${type}, 実際値:${err.constructor.name}`) }
        if (!this._assertErrorMessage(msg, err.message)) { return new AssertErrorResult([false, 'エラーメッセージが違う', err.message]) }
        return new AssertErrorResult([true])
    }
    return new AssertErrorResult([false, 'エラーになるべき所でエラーにならなかった'])


    static _assertErrorMessage(expected, actual) {
        if (this._isRegExp(expected)) { if (!expected.test(actual)) { return false } }
        else if (this._isString(expected)){ if (actual!==expected) { return false } }
        return true
    }
    static _isString(v) { return 'string'===typeof v || v instanceof String }
    static _isRegExp(v) { return v instanceof RegExp }

}
*/

