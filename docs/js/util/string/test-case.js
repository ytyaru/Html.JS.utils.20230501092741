class TestCaser {
    constructor() {}
    run() {
        this.testAnother1()
        this.testAnother2()
        this.testStringCaseNames()
        this.testStringCaseName()
        this.testStringIs()
        this.testStringTo()
        this.#finished()
    }
    #finished() { console.log('%cテスト完了！', `color:green; font-size:24px;`) }
    /*
    testSnakeCamel() {
        let actual = 'java_script'
        let expected = 'javaScript'
        console.assert(Snake.toCamel(actual)===expected)
        console.assert(Snake.toCamel(actual, true)==='JavaScript')
        console.assert(Snake.toCamel(actual.toUpperCase())===expected)
        console.assert(Snake.toCamel(actual.toUpperCase(), true)==='JavaScript')
    }
    testSnakeCain() {
        let actual = 'java_script'
        let expected = 'java-script'
        console.assert(Snake.toChain(actual)===expected)
        console.assert(Snake.toChain(actual, true)===expected.toUpperCase())
        console.assert(Snake.toChain(actual.toUpperCase())===expected)
        console.assert(Snake.toChain(actual.toUpperCase(), true)===expected.toUpperCase())
    }
    testSnakeTitle() {
        let actual = 'java_script'
        let expected = 'Java script'
        console.assert(Snake.toTitle(actual)===expected)
        console.assert(Snake.toTitle(actual, null)===expected)
        console.assert(Snake.toTitle(actual, false)===expected.toLowerCase())
        console.assert(Snake.toTitle(actual, true)===expected.toUpperCase())
        console.assert(Snake.toTitle('JAVA_SCRIPT')===expected)
        console.assert(Snake.toTitle('JAVA_SCRIPT', null)===expected)
        console.assert(Snake.toTitle('JAVA_SCRIPT', false)===expected.toLowerCase())
        console.assert(Snake.toTitle('JAVA_SCRIPT', true)===expected.toUpperCase())
    }
    testCamelSnake() {
        let actual = 'javaScript'
        let expected = 'java_script'
        console.assert(Camel.toSnake(actual)===expected)
        console.assert(Camel.toSnake(actual, true)===expected.toUpperCase())
        console.assert(Camel.toSnake('JavaScript')===expected)
        console.assert(Camel.toSnake('JavaScript', true)===expected.toUpperCase())
    }
    testCamelChain() {
        let actual = 'javaScript'
        let expected = 'java-script'
        console.assert(Camel.toChain(actual)===expected)
        console.assert(Camel.toChain(actual, true)===expected.toUpperCase())
        console.assert(Camel.toChain('JavaScript')===expected)
        console.assert(Camel.toChain('JavaScript', true)===expected.toUpperCase())
    }
    testCamelTitle() {
        let actual = 'javaScript'
        let expected = 'Java script'
        console.assert(Camel.toTitle(actual)===expected)
        console.assert(Camel.toTitle(actual, null)===expected)
        console.assert(Camel.toTitle(actual, false)===expected.toLowerCase())
        console.assert(Camel.toTitle(actual, true)===expected.toUpperCase())
        console.assert(Camel.toTitle('JavaScript')===expected)
        console.assert(Camel.toTitle('JavaScript', null)===expected)
        console.assert(Camel.toTitle('JavaScript', false)===expected.toLowerCase())
        console.assert(Camel.toTitle('JavaScript', true)===expected.toUpperCase())
    }
    testChainSnake() {
        let actual = 'java-script'
        let expected = 'java_script'
        console.assert(Chain.toSnake(actual)===expected)
        console.assert(Chain.toSnake(actual, true)===expected.toUpperCase())
        console.assert(Chain.toSnake(actual.toUpperCase())===expected)
        console.assert(Chain.toSnake(actual.toUpperCase(), true)===expected.toUpperCase())
    }
    testChainCamel() {
        let actual = 'java-script'
        let expected = 'javaScript'
        console.assert(Chain.toCamel(actual)===expected)
        console.assert(Chain.toCamel(actual, true)==='JavaScript')
        console.assert(Chain.toCamel(actual.toUpperCase())===expected)
        console.assert(Chain.toCamel(actual.toUpperCase(), true)==='JavaScript')
    }
    testChainTitle() {
        let actual = 'java-script'
        let expected = 'Java script'
        console.assert(Chain.toTitle(actual)===expected)
        console.assert(Chain.toTitle(actual, null)===expected)
        console.assert(Chain.toTitle(actual, false)===expected.toLowerCase())
        console.assert(Chain.toTitle(actual, true)===expected.toUpperCase())
        console.assert(Chain.toTitle(actual.toUpperCase())===expected)
        console.assert(Chain.toTitle(actual.toUpperCase(), null)===expected)
        console.assert(Chain.toTitle(actual.toUpperCase(), false)===expected.toLowerCase())
        console.assert(Chain.toTitle(actual.toUpperCase(), true)===expected.toUpperCase())
    }
    testCaseGetType() {
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        //const expected = [Chain, Constant, Pascal, Snake, Camel, Title]
        const expecteds = [new Chain(), new Constant(), new Pascal(), new Snake(), new Camel(), new Title()]
        for (let i=0; i<actuals.length; i++) {
            console.assert(expecteds[i] instanceof Case.getType(actuals[i]))
        }
    }
    testCaseGetName() {
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        const expecteds = ['Chain', 'Constant', 'Pascal', 'Snake', 'Camel', 'Title']
        for (let i=0; i<actuals.length; i++) {
            console.assert(expecteds[i]===Case.getName(actuals[i]))
        }
    }
    testStringCaseType() {
        const actuals = ['java-script', 'JAVA_SCRIPT', 'JavaScript', 'java_script', 'javaScript', 'Java script']
        const expecteds = [new Chain(), new Constant(), new Pascal(), new Snake(), new Camel(), new Title()]
        for (let i=0; i<actuals.length; i++) {
            console.assert(expecteds[i] instanceof actuals[i].caseType())
        }
    }
    */
    assertError(method, obj, args, e, msg) {
        try { method.call(obj, ...args) }
        catch(err) {
            console.assert(err instanceof e)
            //console.debug(err.message, msg)
            console.assert(err.message===msg)
        }
    }
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
}
new TestCaser().run()
