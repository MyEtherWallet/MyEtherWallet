const iframe = document.getElementById('testIframe');
const queryString = window.location.hash
  .substr(2, window.location.hash.length)
  .split('&');
const objParams = {};
queryString.forEach(item => {
  const newItem = item.split('=');
  objParams[newItem[0]] = newItem[1];
});

const to = objParams['navigate-to'];
delete objParams['navigate-to'];
const newQuery = Object.keys(objParams)
  .map(k => k + '=' + objParams[k])
  .join('&');

setTimeout(function () {
  iframe.src = `popup.html#/${to}?${newQuery}`;
}, 2000);
iframe.onload = function () {
  iframe.height = '465px';
  const elem = document.querySelector('#gifbox');
  elem.parentNode.removeChild(elem);
};
