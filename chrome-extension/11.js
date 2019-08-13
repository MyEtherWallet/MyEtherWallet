((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[11],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ethereumjs-util */ "./node_modules/ethereumjs-util/dist/index.js");
/* harmony import */ var ethereumjs_util__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__);







function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_5__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    signature: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      message: this.signature,
      showMessage: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_7__["mapState"])(['web3'])),
  watch: {
    message: function message(newVal) {
      this.message = newVal;
    },
    signature: function signature(newVal) {
      this.message = newVal;
    }
  },
  methods: {
    copyToClipboard: function copyToClipboard() {
      this.$refs.signature.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    },
    deleteInput: function deleteInput() {
      this.showMessage = false;
      this.message = '';
    },
    verifyMessage: function verifyMessage() {
      try {
        var json = JSON.parse(this.message);
        var hash = Object(ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__["hashPersonalMessage"])(Object(ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__["toBuffer"])(json.msg));
        var sig = Buffer.from(json.sig.replace('0x', ''), 'hex');

        if (sig.length !== 65) {
          _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].responseHandler('Something went wrong!', _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].ERROR);
          return;
        }

        sig[64] = sig[64] === 0 || sig[64] === 1 ? sig[64] + 27 : sig[64];

        if (json.version === '1') {
          hash = this.web3.utils.sha3(json.msg);
        }

        var pubKey = Object(ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__["ecrecover"])(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64));

        if (json.address.replace('0x', '') !== Object(ethereumjs_util__WEBPACK_IMPORTED_MODULE_8__["pubToAddress"])(pubKey).toString('hex')) {
          this.showMessage = false;
          _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].responseHandler('Signer address is different from the derived address!', _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].ERROR);
        } else {
          this.showMessage = true;
        }
      } catch (e) {
        _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].responseHandler(e, _helpers__WEBPACK_IMPORTED_MODULE_6__["Toast"].ERROR);
      }
    }
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/node-libs-browser/node_modules/buffer/index.js */ "./node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "verify-content-container" }, [
    _c("div", { staticClass: "send-form" }, [
      _c("div", { staticClass: "title-container" }, [
        _c("div", { staticClass: "title" }, [
          _c("h4", [_vm._v("Signature:")]),
          _c("div", { staticClass: "copy-buttons" }, [
            _c("span", { on: { click: _vm.deleteInput } }, [
              _vm._v(_vm._s(_vm.$t("common.clear")))
            ]),
            _c("span", { on: { click: _vm.copyToClipboard } }, [
              _vm._v(_vm._s(_vm.$t("common.copy")))
            ])
          ])
        ])
      ]),
      _c("div", { staticClass: "the-form signature" }, [
        _c("textarea", {
          directives: [
            {
              name: "validate",
              rawName: "v-validate",
              value: "required",
              expression: "'required'"
            },
            {
              name: "model",
              rawName: "v-model",
              value: _vm.message,
              expression: "message"
            }
          ],
          ref: "signature",
          staticClass: "custom-textarea-1",
          attrs: { name: "signature" },
          domProps: { value: _vm.message },
          on: {
            input: function($event) {
              if ($event.target.composing) {
                return
              }
              _vm.message = $event.target.value
            }
          }
        })
      ]),
      _c("div", [
        _vm.message !== "" && _vm.showMessage === true
          ? _c("p", { staticClass: "success-message" }, [
              _vm._v(
                "\n        " +
                  _vm._s(JSON.parse(_vm.message).address) +
                  "\n        " +
                  _vm._s(_vm.$t("interface.verifiedMessage")) +
                  ":\n        "
              ),
              JSON.parse(_vm.message).msg.length > 20 ? _c("br") : _vm._e(),
              _c("b", [_vm._v(_vm._s(JSON.parse(_vm.message).msg))])
            ])
          : _vm._e(),
        _vm.errors.has("signature")
          ? _c("p", [_vm._v(_vm._s(_vm.errors.first("signature")))])
          : _vm._e()
      ])
    ]),
    _c("div", { staticClass: "submit-button-container" }, [
      _c("div", { staticClass: "buttons" }, [
        _c(
          "button",
          {
            class: [
              _vm.errors.has("signature") || _vm.message === ""
                ? "disabled"
                : "",
              "submit-button large-round-button-green-filled clickable"
            ],
            on: { click: _vm.verifyMessage }
          },
          [
            _vm._v(
              "\n        " + _vm._s(_vm.$t("common.verifyMessage")) + "\n      "
            )
          ]
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".verify-content-container[data-v-0af36d8f] {\n  background-color: #fff;\n  border-radius: 5px;\n  margin: 0 auto;\n  width: 100%;\n}\n@media all and (min-width: calc(1024px + 1px)) {\n.verify-content-container[data-v-0af36d8f] {\n      padding: 40px;\n}\n}\n@media all and (min-width: calc(414px + 1px)) and (max-width: 1024px) {\n.verify-content-container[data-v-0af36d8f] {\n      padding: 20px;\n}\n}\n@media all and (max-width: 414px) {\n.verify-content-container[data-v-0af36d8f] {\n      padding: 20px 10px;\n}\n}\n.send-form .title-container .title[data-v-0af36d8f] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin-bottom: 10px;\n  padding: 0 8px;\n}\n.send-form .title-container .title .copy-buttons[data-v-0af36d8f] {\n    color: #999;\n    margin-left: auto;\n}\n.send-form .title-container .title .copy-buttons span[data-v-0af36d8f] {\n      cursor: pointer;\n      margin-left: 20px;\n}\n.send-form .signature[data-v-0af36d8f] {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n.send-form .signature input[data-v-0af36d8f] {\n    background-color: #f9f9f9;\n    border: 0;\n    padding: 13px 15px;\n}\n.send-form .signature span[data-v-0af36d8f] {\n    font-size: 20px;\n    font-weight: 600;\n}\n.submit-button-container[data-v-0af36d8f] {\n  margin-top: 60px;\n}\n@media all and (max-width: 414px) {\n.submit-button-container[data-v-0af36d8f] {\n      margin-top: 30px;\n}\n}\n.submit-button-container .bottom-text[data-v-0af36d8f] {\n    text-align: center;\n}\n.submit-button-container .buttons[data-v-0af36d8f] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.submit-button-container .buttons .submit-button[data-v-0af36d8f] {\n      margin: 0 5px;\n      text-align: center;\n      width: 300px;\n}\n@media all and (max-width: 414px) {\n.submit-button-container .buttons .submit-button[data-v-0af36d8f] {\n          width: 100%;\n}\n}\n.success-message[data-v-0af36d8f], .error-message[data-v-0af36d8f] {\n  border-radius: 5px;\n  margin-top: 10px;\n  padding: 20px;\n  text-align: center;\n}\n.success-message[data-v-0af36d8f] {\n  background-color: #f2fafa;\n  border: 1px solid #05c0a5;\n}\n.success-message b[data-v-0af36d8f] {\n    word-wrap: break-word;\n}\n.error-message[data-v-0af36d8f] {\n  background-color: #f00;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("06f99917", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/VerifyMessageInput/VerifyMessageInput.vue":
/*!******************************************************************!*\
  !*** ./src/components/VerifyMessageInput/VerifyMessageInput.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&");
/* harmony import */ var _VerifyMessageInput_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VerifyMessageInput.vue?vue&type=script&lang=js& */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _VerifyMessageInput_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0af36d8f",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('0af36d8f')) {
      api.createRecord('0af36d8f', component.options)
    } else {
      api.reload('0af36d8f', component.options)
    }
    module.hot.accept(/*! ./VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&");
(function () {
      api.rerender('0af36d8f', {
        render: _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/components/VerifyMessageInput/VerifyMessageInput.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&":
/*!****************************************************************************************************************************!*\
  !*** ./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=style&index=0&id=0af36d8f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_style_index_0_id_0af36d8f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&":
/*!*************************************************************************************************************!*\
  !*** ./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/VerifyMessageInput/VerifyMessageInput.vue?vue&type=template&id=0af36d8f&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerifyMessageInput_vue_vue_type_template_id_0af36d8f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/VerifyMessageInput/index.js":
/*!****************************************************!*\
  !*** ./src/components/VerifyMessageInput/index.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VerifyMessageInput__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerifyMessageInput */ "./src/components/VerifyMessageInput/VerifyMessageInput.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _VerifyMessageInput__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=11.js.map