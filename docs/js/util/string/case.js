(function() {
String.prototype.capitalize = function(str) { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
class _StringCase {
    constructor() {
        this.cases = {
            'chain':    {delimiter:'-', method:'toLowerCase', target:'all'},
            'snake':    {delimiter:'_', method:'toLowerCase', target:'all'},
            'camel':    {delimiter:'',  method:'capitalize',  target:'word2'},
            'pascal':   {delimiter:'',  method:'capitalize',  target:'word'},
            'constant': {delimiter:'_', method:'toUpperCase', target:'all'},
            'title':    {delimiter:' ', method:'capitalize',  target:'all'},
        }
    }
    get Names() { return Object.keys(this.cases) }
    isChain(str) {return /^[a-z][a-z0-9\-]+$/g.test(str)}
    isSnake(str) {return /^[a-z][a-z0-9_]+$/g.test(str)}
    isCamel(str) {return /^[a-z][a-zA-Z0-9]+$/g.test(str)}
    isPascal(str) {return /^[A-Z][a-zA-Z0-9]+$/g.test(str)}
    isConstant(str) {return /^[A-Z_][A-Z0-9_]+$/g.test(str)}
    isTitle(str) {return (str.includes(' ') && /^[A-Z]+$/g.test(str[0]))}
    getType(str) {
        if (this.isChain(str)) { return this.cases.chain }
        else if (this.isConstant(str)) { return this.cases.constant } // upper snake
        else if (this.isPascal(str)) { return this.cases.pascal }     // upper camel
        else if (this.isSnake(str)) { return this.cases.snake }
        else if (this.isCamel(str)) { return this.cases.camel }
        else if (this.isTitle(str)) { return this.cases.title }
        else { return null }
    }
    getName(str) {
        if (this.isChain(str)) { return 'chain' }
        else if (this.isConstant(str)) { return 'constant' } // upper snake
        else if (this.isPascal(str)) { return 'pascal' }     // upper camel
        else if (this.isSnake(str)) { return 'snake' }
        else if (this.isCamel(str)) { return 'camel' }
        else if (this.isTitle(str)) { return 'title' }
        else { return '' }
    }
    toChain(str) {return this.to(str, this.cases.chain)}
    toSnake(str) {return this.to(str, this.cases.snake)}
    toCamel(str) {return this.to(str, this.cases.camel)}
    toPascal(str) {return this.to(str, this.cases.pascal)}
    toConstant(str) {return this.to(str, this.cases.constant)}
    toTitle(str) {return this.to(str, this.cases.title)}
    to(str, to) {
        const from = this.getType(str)
        if (!from) { throw new Error(`入力strは次のいずれかのケースであるべきです。${this.Names.join(',')}`) }
        if (!to) { throw new Error(`出力ケースは次のいずれかであるべきです。${this.Names.join(',')}`) }
        if (from===to) { return str }
        return this.#join(this.#split(str, from), to)
    }
    #split(str, from) { return (1===from.delimiter.length) ? str.split(from.delimiter) : str.split(/(?=[A-Z])/) }
    #join(words, to) {
        if ('all' === to.target) { return words.join(to.delimiter)[to.method]() }
        else if ('word'===to.target) { return words.map(w=>w[to.method]()).join(to.delimiter) }
        else if ('word2'===to.target) { return [words[0].toLowerCase(), ...words.slice(1).map(w=>w[to.method]())].join(to.delimiter) }
        else { throw new Error('引数to(Case)のtargetはall,word,word2のいずれかであるべきです。') }
    }
}
window.StringCase = new _StringCase()
String.prototype.caseNames = function() { return StringCase.Names }
String.prototype.caseName = function() { return StringCase.getName(this) }
String.prototype.isChain = function() { return StringCase.isChain(this) }
String.prototype.isConstant = function() { return StringCase.isConstant(this) }
String.prototype.isPascal = function() { return StringCase.isPascal(this) }
String.prototype.isSnake = function() { return StringCase.isSnake(this) }
String.prototype.isCamel = function() { return StringCase.isCamel(this) }
String.prototype.isTitle = function() { return StringCase.isTitle(this) }
String.prototype.toChain = function() { return StringCase.toChain(this) }
String.prototype.toConstant = function() { return StringCase.toConstant(this) }
String.prototype.toPascal = function() { return StringCase.toPascal(this) }
String.prototype.toSnake = function() { return StringCase.toSnake(this) }
String.prototype.toCamel = function() { return StringCase.toCamel(this) }
String.prototype.toTitle = function() { return StringCase.toTitle(this) }
})()
