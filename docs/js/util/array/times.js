//Array.prototype.times = function(num, fn, params) { // num回数だけfnを実行する
Array.times = function(num, fn, params) { // num回数だけfnを実行する
    if (params) { return [...Array(5)].map((_,i)=>fn(i, ...params)) }
    else { return [...Array(5)].map((_,i)=>fn(i)) }
}
console.log(Array.times)
console.log(Array.prototype.times)
