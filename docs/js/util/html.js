(function() {
class Html {
    constructor() {
        this.parser = new DOMParser()
//        this.parser.parseFromString(html, 'text/xml')
        this.serializer = new XMLSerializer()
//        this.serializer.serializeToString(doc);
    }
    // get
    get Url() { return location.href }
    get Doc() { return document.documentElement }
    get Root() { return document.querySelector(':root') }
    get Body() { return document.body }
    get Main() { return document.querySelector('main:not([hidden])') }
    get Header() { return document.querySelector('header') }
    get Footer() { return document.querySelector('footer') }
    next(el) { return el.nextElementSibling }
    prev(el) { return el.previousElementSibling }
    parent(el) { return el.parentElement; }
    children(el) { return el.children }
    child(i) { return el.children[(i && i<=0 && i<el.children.length) ? i : 0] }
    broser(el, i) {
        const prop = (0<i) ? 'nextElementSibling' : 'previousElementSibling'
        //[...Array(Math.abs(i))].forEach(()=>el=el[prop])
        for (let c=0; c<Math.abs(i); c++) { el = el[prop] }
        return el
    }
    get(query) { return document.querySelector(query) }
    gets(query) { return [...document.querySelectorAll(query)] }
    // insert
    prepend(addEl, el) { el.parentElement.insertBefore(addEl, el) }
    append(addEl, el) { el.parentElement.insertBefore(addEl, el.nextElementSibling) }
    insert(addEl, el, i) { el.parentElement.insertBefore(addEl, this.broser(el, i)) }
    insertChild(addEl, el, i) { el.insertBefore(addEl, el.children[i]) }
    // create
    create(tagName, attrs, text) {
        const el = document.createElement(tagName)
        if (attrs) { for (let key of Object.keys(attrs)) { el[key] = attrs[key] } }
        if (text) {  el.textContent = text }
        return el
    }
    generate(tagName, attrs, text) { return this.toString(this.create(tagName, attrs, text)) }
    toString(el) { return this.serializer.serializeToString(el) }
    toDom(str) { return this.parser.parseFromString(str, 'text/xml') }
    // attr
    attr(el, key, value) { (value) ? el.setAttribute(key, value) : el.getAttribute(key) }
    attrInt(el, key, value) { return parseInt(this.attr(el, key, value)) }
    attrFloat(el, key, value) { return parseFloat(this.attr(el, key, value)) }
}
window.Html = new Html()
})()
