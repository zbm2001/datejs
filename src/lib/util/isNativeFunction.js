import typeOf from './typeOf';

var sPop = Array.prototype.pop + '',
  sNativeCode = sPop.slice(sPop.indexOf('{'));

export default function isNativeFunction(func) {
  return typeOf(func) === 'Function' && sNativeCode === (func += '').slice(func.indexOf('{'));
}