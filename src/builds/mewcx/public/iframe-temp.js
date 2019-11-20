const iframe = document.getElementById('testIframe');
setTimeout(function() {
  iframe.src = 'browserAction.html#';
}, 2000);
// iframe.onload = function() {
//   iframe.height = '385px';
//   const elem = document.querySelector('#gifbox');
//   elem.parentNode.removeChild(elem);
// };
