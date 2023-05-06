//https://github.com/angus-c/just/blob/master/packages/collection-compare/index.cjs
(function(){
function compare(value1, value2) {
  if (value1 === value2) { return true; }
  /* eslint-disable no-self-compare */
  // if both values are NaNs return true
  if (value1 !== value1 && value2 !== value2) { return true; }
  if (
    typeof value1 != typeof value2 || // primitive != primitive wrapper
    {}.toString.call(value1) != {}.toString.call(value2) // check for other (maybe nullish) objects
  ) { return false; }
  if (value1 !== Object(value1)) { return false; } // non equal primitives
  if (!value1) { return false; }
  if (Array.isArray(value1)) { return compareArrays(value1, value2); }
  if ({}.toString.call(value1) == '[object Set]') {
    return compareArrays(Array.from(value1), Array.from(value2));
  }
  if ({}.toString.call(value1) == '[object Object]') {
    return compareObjects(value1, value2);
  }
  return compareNativeSubtypes(value1, value2);
}
function compareNativeSubtypes(value1, value2) { return value1.toString() === value2.toString(); }// e.g. Function, RegExp, Date
function compareArrays(value1, value2) {
  var len = value1.length;
  if (len != value2.length) { return false; }
  for (var i = 0; i < len; i++) { if (!compare(value1[i], value2[i])) { return false; } }
  return true;
}
function compareObjects(value1, value2) {
  var keys1 = Object.keys(value1);
  var len = keys1.length;
  if (len != Object.keys(value2).length) { return false; }
  for (var i = 0; i < len; i++) {
    var key1 = keys1[i];
    if (!(value2.hasOwnProperty(key1) && compare(value1[key1], value2[key1]))) { return false; }
  }
  return true;
}
window.compare = compare
})()

