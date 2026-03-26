(function(){
const isObj = (v)=>'object'===typeof v && null!==v && Object===v?.constructor;
const formatListeners = (listeners)=>{
    if (Array.isArray(listeners) && listeners.every(l=>Array.isArray(l))) {return listeners}
    else if (isObj(listeners)) {return Object.entries(listeners).reduce((a,[k,v],i)=>{a.push([k, ...(Array.isArray(v) ? v : [v])]);return a}, []);
    } else {throw new TypeError(`listeners属性値は配列かObjectのみ有効です。[['click',(e)=>alert('A'), true]], {click:[(e)=>alert('A'), true]}, {click:(e)=>alert('A')}の三通りあります。引数は順にイベント名、コールバック関数、useCaptureフラグです。`)}
};
const tag = (ns, name, ...args) => {
    const [{is, ...props}, ...children] = 0<args.length && 'object'===typeof args[0] && '[object Object]'===Object.prototype.toString.call(args[0]) ? args : [{}, ...args];
    const dom = ns ? document.createElementNS(ns, name, {is}) : document.createElement(name, {is})
    for (let [k, v] of Object.entries(props)) {
        if ('listeners'===k) {formatListeners(props[k]).forEach(l=>{dom.listen(...l)})}
        else {dom.setAttribute(k, v);}
    }
    dom.append(...children.map(c=>c));
    return dom;
}
const handler = ns => ({get: (_, name) => tag.bind(undefined, ns, name)})
window.Dom = {tags: new Proxy(ns => new Proxy(tag, handler(ns)), handler()),
    q:(...args)=>document.querySelector(...args),
    qs:(...args)=>document.querySelectorAll(...args),
    qa:(...args)=>[...document.querySelectorAll(...args)],
};
})();
