(function() {
class Css {
    get(key, el) { return getComputedStyle((Type.isDom(el)) ? el : Html.Root).getPropertyValue(key) }
    getInt(key, el) { return parseInt(this.get(key, el)) }
    getFloat(key, el) { return parseFloat(this.get(key, el)) }
    set(key, value, el) { return ((Type.isDom(el)) ? el : Html.Root).style.setProperty(key, value) }
    toggle(key, el) { return el.classList.toggle(key) }
}
window.Css = new Css()
})()

