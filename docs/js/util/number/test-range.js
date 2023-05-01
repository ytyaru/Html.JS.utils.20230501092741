(function(){
class Test {
    constructor() {}
    run() {
        /*
        this.testAnother1()
        this.testAnother2()
        this.testStringCaseNames()
        this.testStringCaseName()
        this.testStringIs()
        this.testStringTo()
        */
        this.testIsRange()
        this.testIsRangeError()
        this.testIsRangeMinus()

        this.#finished()
    }
    #finished() { console.log('%cテスト完了！', `color:green; font-size:24px;`) }
    testIsRange() {
        const n = 5
        console.assert(n.isRange(5,5))
        console.assert(n.isRange(5,6))
        console.assert(n.isRange(6,5))
        console.assert(n.isRange(5,4))
        console.assert(n.isRange(4,5))
        //console.assert(5.isRange(5,5))
        //console.assert(5.isRange(5,6))
        //console.assert(5.isRange(6,5))
    }
    testIsRangeError() {
        const n = 5
        console.assert(!n.isRange(4,4))
        console.assert(!n.isRange(6,6))
    }
    testIsRangeMinus() {
        const n = -3
        console.assert(n.isRange(-3,-3))
        console.assert(n.isRange(-3,-4))
        console.assert(n.isRange(-4,-3))
        console.assert(n.isRange(-2,-3))
        console.assert(n.isRange(-3,-2))
        console.assert(n.isRange(-2,-4))
        console.assert(n.isRange(-4,-2))
    }
    /*
    assertError(method, obj, args, e, msg) {
        try { method.call(obj, ...args) }
        catch(err) {
            console.assert(err instanceof e)
            //console.debug(err.message, msg)
            console.assert(err.message===msg)
            return
        }
        throw new Error('例外発生すべき所で例外発生しなかった。')
    }
    */
    /*
    testAnother1() { // 略語の連続した大文字も単語区切りとして分割されてしまうので注意
        let actual = 'toHTML'
        let expected = 'to_h_t_m_l'
        this.assertError(actual.toSnake, actual, [], Error, '入力strは次のいずれかのケースであるべきです。chain,snake,camel,pascal,constant,title')
        //console.assert(Camel.toSnake(actual)===expected)
        console.assert(actual.toSnake()===expected)
        actual = 'toHtml' // キャメルケースにするなら略語としての大文字でなく単語の区切りとして大文字を使うこと
        expected = 'to_html'
        //console.assert(Camel.toSnake(actual)===expected)
        console.assert(actual.toSnake()===expected)
    }
    testAnother2() { // 先頭に区切り文字がある場合、先頭が大文字になってしまう（pythonはprivateを意味するため__をプレフィクスにする。その場合キャメルにすると先頭が大文字になってしまう。大文字小文字は第二引数でのみ決定すべきでは？　また、先頭と末尾についた区切り文字は消去すべきかそのまま付与すべきか？キャメルとしては消去が正しいはず。pythonの__は特殊ケースとして考えないことにする。あくまで単語の区切りとして解釈する）
        let actual = '_to_html'
        let expected = 'ToHtml'
        this.assertError(actual.toSnake, actual, [], Error, '入力strは次のいずれかのケースであるべきです。chain,snake,camel,pascal,constant,title')
//        console.assert(actual.toCamel()===expected)
//        console.assert('___to_html'.toCamel()===expected)
//        console.assert('___to___html'.toCamel()===expected)
//        console.assert('___to___html___'.toCamel()===expected)
        actual = '-to-html'
        expected = 'ToHtml'
        this.assertError(actual.toCamel, actual, [], Error, '入力strは次のいずれかのケースであるべきです。chain,snake,camel,pascal,constant,title')
//        console.assert(actual.toCamel()===expected)
//        console.assert('---to-html'.toCamel()===expected)
//        console.assert('---to---html'.toCamel()===expected)
//        console.assert('---to---html---'.toCamel()===expected)
    }
    // そもそも単語の区切りが曖昧。
    // username, user-name
    // password, pass-word
    // txid, tx-id
    // キャメルケースのとき略語を大文字にすると単語の境界がわからなくなる。略語は一単語とし先頭大文字でほかは小文字にすること。
    // html, HTML, Html
    // HTMLReader, HtmlReader, html-reader


    testStringCaseNames() {
        const expecteds = ['chain', 'constant', 'pascal', 'snake', 'camel', 'title'].sort()
        const actuals = ''.caseNames().sort()
        for (let i=0; i<expecteds.length; i++) { console.assert(expecteds[i]===actuals[i]) }
    }
    testStringCaseName() {
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        //const expecteds = ['Chain', 'Constant', 'Pascal', 'Snake', 'Camel', 'Title']
        const expecteds = ['chain', 'constant', 'pascal', 'snake', 'camel', 'title']
        for (let i=0; i<actuals.length; i++) {
            //console.debug(actuals[i], expecteds[i], actuals[i].caseName())
            console.assert(expecteds[i]===actuals[i].caseName())
        }
    }
    testStringIs() {
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        const ids = ['Chain', 'Constant', 'Pascal', 'Snake', 'Camel', 'Title']
        for (let i=0; i<ids.length; i++) {
            for (let a=0; a<actuals.length; a++) {
                const expected = (i===a) ? actuals[a][`is${ids[i]}`]() : !actuals[a][`is${ids[i]}`]()
                //console.debug(i, a, actuals[a], `is${ids[i]}`, actuals[a][`is${ids[i]}`], expected)
                console.assert(expected)
            }
        }
    }
    testStringTo() {
        const ids = ['Chain', 'Constant', 'Pascal', 'Snake', 'Camel', 'Title']
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        const expecteds = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        for (let i=0; i<ids.length; i++) {
            for (let a=0; a<actuals.length; a++) {
                if (i===a) {continue}
                console.debug(i, a, `expected:${expecteds[i]}`, 'actual:'+actuals[a][`to${ids[i]}`](), `${actuals[a].caseName()}.to${ids[i]}('${actuals[a]}')`)
                console.assert(expecteds[i]===actuals[a][`to${ids[i]}`]())
            }
        }
    }
    */
}
new Test().run()
})()
