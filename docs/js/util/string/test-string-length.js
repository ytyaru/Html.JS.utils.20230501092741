(function() {
class Test {
    constructor() {}
    run() {
        this.testHalfWidthLength1()
        this.testHalfWidthLength2()
        this.testHalfWidthLength3()
        this.testHalfWidthLength4()
        this.testHalfWidthLength5()
        this.testGraphemes()
        this.testGraphemesJaJp()
        this.testGraphemesEnUs()
        this.testWords()
        this.testWordsJaJp()
        this.testWordsEnUs()
        this.testSentences()
        this.testSentencesJaJp()
        this.testSentencesEnUs()
        this.testGetterGraphemes()
        this.testGetterWords()
        this.testGetterSentences()
    }
    #finished() { console.log('%cテスト完了！', `color:green; font-size:24px;`) }
    testHalfWidthLength1() {
        const actual = 'abc'
        const expected = 3
        console.assert(expected===actual.halfWidthLength())
        console.assert(actual.length===actual.halfWidthLength())
    }
    testHalfWidthLength2() {
        const actual = '日本語ですワヨ。'
        const expected = 8 * 2
        console.assert(expected===actual.halfWidthLength())
        console.debug(actual.length, actual.halfWidthLength())
        //console.assert(actual.halfWidthLength() < actual.length)
    }
    testHalfWidthLength3() { // https://blog.jxck.io/entries/2017-03-02/unicode-in-javascript.html
        const actual = '𠮟'
        const expected = 1 * 2
        console.assert(expected===actual.halfWidthLength())
        console.debug(actual.length, actual.halfWidthLength())
        //console.assert(actual.halfWidthLength() < actual.length)
    }
    testHalfWidthLength4() {
        const actual = '😭'
        const expected = 1 * 2
        console.assert(expected===actual.halfWidthLength())
        console.debug(actual.length, actual.halfWidthLength())
        //console.assert(actual.halfWidthLength() < actual.length)
    }
    testHalfWidthLength5() {
        const actual = '👨‍👩‍👧‍👦'
        const expected = 1 * 2
        console.assert(expected===actual.halfWidthLength())
        console.debug(actual.length, actual.halfWidthLength())
        //console.assert(actual.halfWidthLength() < actual.length)
    }
    testGraphemes() {
        const actual = '日本語ですワヨ。'
        const expected = 8
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.graphemes())
            console.assert(expected===actual.graphemes().length)
        }
    }
    testGraphemesJaJp() {
        const actual = '日本語ですワヨ。'
        const expected = 8
        console.debug(actual.length, actual.graphemes())
        console.assert(expected===actual.graphemes('ja-jp').length)
    }
    testGraphemesEnUs() {
        const actual = 'This is a pen.'
        const expected = 14
        console.debug(actual.length, actual.graphemes())
        console.assert(expected===actual.graphemes('en-us').length)
    }
    testWords() {
        const actual = '日本語ですワヨ。'
        const expected = 5
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.words())
            console.assert(expected===actual.words().length)
        }
    }
    testWordsJaJp() {
        const actual = '日本語ですワヨ。'
        const expected = 5
        console.debug(actual.length, actual.words('ja-jp'))
        console.assert(expected===actual.words('ja-jp').length)
    }
    testWordsEnUs() {
        const actual = 'This is a pen.'
        const expected = 8
        console.debug(actual.length, actual.words('en-us'))
        console.assert(expected===actual.words('en-us').length)
    }
    testSentences() {
        const actual = '日本語ですワヨ。'
        const expected = 1
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.sentences())
            console.assert(expected===actual.sentences().length)
        }
    }
    testSentencesJaJp() {
        const actual = '日本語ですワヨ。'
        const expected = 1
        console.debug(actual.length, actual.sentences('ja-jp'))
        console.assert(expected===actual.sentences('ja-jp').length)
    }
    testSentencesEnUs() {
        const actual = 'This is a pen.'
        const expected = 1
        console.debug(actual.length, actual.sentences('en-us'))
        console.assert(expected===actual.sentences('en-us').length)
    }
    testGetterGraphemes() {
        const actual = '日本語ですワヨ。'
        const expected = 8
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.Graphemes)
            console.assert(expected===actual.Graphemes.length)
        }
    }
    testGetterWords() {
        const actual = '日本語ですワヨ。'
        const expected = 5
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.Words)
            console.assert(expected===actual.Words.length)
        }
    }
    testGetterSentences() {
        const actual = '日本語ですワヨ。'
        const expected = 1
        if ('ja'===window.navigator.language) {
            console.debug(actual.length, actual.Sentences)
            console.assert(expected===actual.Sentences.length)
        }
    }





}
new Test().run()
})()
