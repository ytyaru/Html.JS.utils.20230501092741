(function(){
class ElementIdValidator {
    constructor(options) {
        this._ids = new Set(); this._dups = new Map(); 
        this._onValidate = this.#onValidate.bind(this); 
        this._onObserve = this.#invalidFn.bind(this); 
        this._isThrow = false; this._isAlert = false; this._valid = undefined; this._observer = null;
        this.#setOptions(options);
    }
    #setOptions(options) {
        const o = {...this.#defaultOptions, ...options};
        if (o.onValidate){this.onValidate = o.onValidate;}
        if (o.onObserve){this.onObserve = o.onObserve}; 
        this.isThrow = o.isThrow; this.isAlert = o.isAlert;
    }
    get #defaultOptions() { return {
        isThrow: false,
        isAlert: false,
        onValidate: null,
        onObserve: null,
    } }
    get valid() {return this._valid}
    get isThrow() {return this._isThrow}
    set isThrow(v) {if('boolean'===typeof v){this._isThrow=v}}
    get isAlert() {return this._isAlert}
    set isAlert(v) {if('boolean'===typeof v){this._isAlert=v}}
    set onValidate(fn) {if('function'===typeof fn){this._onValidate=fn}}
    set onObserve(fn) {if('function'===typeof fn){this._onObserve=fn}}
    #observe(target=document, fn=undefined) {
        if (this._observer) {this._observer.disconnect();}
        else {this._observer = new MutationObserver(this.#observeCallback.bind(this));}
        this._observer.observe(target, {subtree:true, childList:true, attributes:true, attributeFilter:['id'], attributeOldValue:true});
    }
    validate(target=document) {
        this._ids.clear();
        this._dups.clear();
        for (let el of target.querySelectorAll('[id]')) {
            const id = el.getAttribute('id');
            console.debug(id);
            if (this._ids.has(id)) {
                const count = this._dups.get(id);
                this._dups.set(id, (undefined===count) ? 2 : ++count);
            } else {this._ids.add(id);}
        }
        this._valid = (0===this._dups.size);
        console.debug('this._valid:', this._valid);
        this._onValidate(this._ids, this._dups);
        this.#observe(target);
        return this._valid;
    }
    #onValidate(ids, dups) {(0===dups.size) ? this.#validFn() : this.#invalidFn();}
    #validFn() {console.info('%c id属性値はすべて一意です。', 'color: green; font-size:24px;');}
    #invalidFn() {
        console.error(IdDuplicationError.MESSAGE, this._dups);
        if (this._isThrow) { throw new IdDuplicationError(); }
        if (this._isAlert) { alert(IdDuplicationError.MESSAGE); }
    }
    #observeCallback(records, observer) {
        console.debug('#observeCallback():', records);
        for (const record of records) {
            if ('attributes'===record.type && 'id'===record.attributeName) {
                console.debug(record.attributeName, '属性値は「', record.oldValue, '」から「', record.target.id, '」に変更されました。');
                this._ids.delete(record.oldValue);
                const id = record.target.id;
                if (this._ids.has(id)) {
                    const count = this._dups.get(id);
                    this._dups.set(id, (undefined===count) ? 0 : ++count);
                    this._valid = (0===this._dups.size);
                    this._onObserve(record, observer); // this.#invalidFn();
                } else {this._ids.add(id);}
            }
        }
    }
}
class IdDuplicationError extends Error {
    static MESSAGE = 'HTML要素のid属性値に重複があります！';
    constructor(message='', options={}) {
        super(message || IdDuplicationError.MESSAGE, options); // {cause:e}
        this.name = 'IdDuplicationError';
    }
}
window.ElementIdValidator = ElementIdValidator;
window.IdDuplicationError = IdDuplicationError;
})();
