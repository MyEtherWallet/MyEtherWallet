webpackHotUpdate("cxWeb3",{

/***/ "./src/builds/mewcx/cxHelpers/cxWeb3.js":
/*!**********************************************!*\
  !*** ./src/builds/mewcx/cxHelpers/cxWeb3.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/core-js/modules/es6.array.iterator.js */ "./node_modules/core-js/modules/es6.array.iterator.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/core-js/modules/es6.promise.js */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_promise_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_object_assign_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/core-js/modules/es6.object.assign.js */ "./node_modules/core-js/modules/es6.object.assign.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_object_assign_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es6_object_assign_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es7_promise_finally_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/core-js/modules/es7.promise.finally.js */ "./node_modules/core-js/modules/es7.promise.finally.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es7_promise_finally_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_core_js_modules_es7_promise_finally_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! web3 */ "./node_modules/web3/src/index.js");
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(web3__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wallets_web3_provider_providers_mew_cx_web3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/wallets/web3-provider/providers/mew-cx-web3 */ "./src/wallets/web3-provider/providers/mew-cx-web3.js");
/* harmony import */ var _cxEvents__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cxEvents */ "./src/builds/mewcx/cxHelpers/cxEvents.js");








var url = 'https://api.myetherwallet.com/eth';
var web3 = new web3__WEBPACK_IMPORTED_MODULE_5___default.a(new _wallets_web3_provider_providers_mew_cx_web3__WEBPACK_IMPORTED_MODULE_6__["MewCxWeb3"](url));
var ethereum = new _wallets_web3_provider_providers_mew_cx_web3__WEBPACK_IMPORTED_MODULE_6__["MewCxEthereum"](url).setMaxListeners(25);
web3.currentProvider.isMew = true;

if (window.hasOwnProperty('web3') && !window.web3.currentProvider.hasOwnProperty('isMew')) {
  var event = new CustomEvent(_cxEvents__WEBPACK_IMPORTED_MODULE_7__["WEB3_DETECTED"].replace('{{id}}', window.extensionID));
  window.dispatchEvent(event);
} else if (!window.hasOwnProperty('web3')) {
  window.web3 = web3;
  window.ethereum = ethereum;
}

/***/ })

})
//# sourceMappingURL=cxWeb3.ca47b452035feac31ff6.hot-update.js.map