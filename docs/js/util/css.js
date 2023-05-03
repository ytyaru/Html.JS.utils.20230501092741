(function() {
class Css {
    get(key, el) { return getComputedStyle(this.#getEl(el)).getPropertyValue(key) }
    getInt(key, el) { return parseInt(this.get(key, this.#getEl(el))) }
    getFloat(key, el) { return parseFloat(this.get(key, this.#getEl(el))) }
    set(key, value, el) { return this.#getEl(el).style.setProperty(key, value) }
    toggle(key, el) { return this.#getEl(el).classList.toggle(key) }
    #getEl(el) {
        if (Type.isElement(el)) { return el }
        else if (Type.isString(el)) {
            const e = document.querySelector(el)
            if (e) { return e }
            else { throw new InvalidArgumentError(`引数elがString型のときはdocument.querySelector()のqueryとして要素を取得できる値であるべきです。`) }
        } else { return Html.Root }
    }
}
window.Css = new Css()
})()

