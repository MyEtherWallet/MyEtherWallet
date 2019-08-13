((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[30],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");
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
  methods: {
    copy: function copy(type) {
      this.$refs.signedMess.select();
      document.execCommand('copy');
      _helpers__WEBPACK_IMPORTED_MODULE_0__["Toast"].responseHandler('Copied!', _helpers__WEBPACK_IMPORTED_MODULE_0__["Toast"].INFO);
      if (type === 'main') this.$refs.signatureModal.hide();
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");
/* harmony import */ var _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/components/InterfaceBottomText */ "./src/components/InterfaceBottomText/index.js");
/* harmony import */ var _components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/InterfaceContainerTitle */ "./src/layouts/InterfaceLayout/components/InterfaceContainerTitle/index.js");
/* harmony import */ var _components_SignatureModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/SignatureModal */ "./src/layouts/InterfaceLayout/components/SignatureModal/index.js");





function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_3__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  name: 'SignMessage',
  components: {
    'interface-bottom-text': _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_6__["default"],
    'interface-container-title': _components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_7__["default"],
    'signature-modal-modal': _components_SignatureModal__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  data: function data() {
    return {
      message: '',
      signature: ''
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_4__["mapState"])(['account', 'web3'])),
  methods: {
    signMessage: function signMessage() {
      var _this = this;

      this.web3.eth.sign(this.message, this.account.address).then(function (_signedMessage) {
        _this.signature = JSON.stringify({
          address: _this.account.address,
          msg: _this.message,
          sig: _signedMessage,
          version: '3',
          signer: _this.account.isHardware ? _this.account.identifier : 'MEW'
        }, null, 2);

        _this.$refs.signatureModal.$refs.signatureModal.show();
      });
    },
    copyToClipboard: function copyToClipboard() {
      this.$refs.signature.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      _helpers__WEBPACK_IMPORTED_MODULE_5__["Toast"].responseHandler('Copied', _helpers__WEBPACK_IMPORTED_MODULE_5__["Toast"].INFO);
    },
    deleteInputText: function deleteInputText() {
      this.signature = '';
      this.message = '';
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    [
      _c(
        "b-modal",
        {
          ref: "signatureModal",
          staticClass: "bootstrap-modal",
          attrs: { "hide-footer": "", centered: "", title: "Signature" }
        },
        [
          _c("div", { staticClass: "modal-contents" }, [
            _c("div", [
              _c("div", { staticClass: "copy-container" }, [
                _c("h4", [_vm._v("Signed Message:")]),
                _c("div", { staticClass: "copy-buttons" }, [
                  _c("span", { on: { click: _vm.copy } }, [
                    _vm._v(_vm._s(_vm.$t("common.copy")))
                  ])
                ])
              ]),
              _c("textarea", {
                ref: "signedMess",
                staticClass: "custom-textarea-1",
                attrs: { name: "message" },
                domProps: { value: _vm.signature }
              }),
              _c("div", { staticClass: "button-container" }, [
                _c(
                  "button",
                  {
                    staticClass:
                      "submit-button large-round-button-green-filled clickable",
                    on: {
                      click: function($event) {
                        return _vm.copy("main")
                      }
                    }
                  },
                  [_vm._v("\n            Copy\n          ")]
                )
              ])
            ])
          ])
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    { staticClass: "sign-message-container" },
    [
      _c("signature-modal-modal", {
        ref: "signatureModal",
        attrs: { signature: _vm.signature }
      }),
      _c("interface-container-title", {
        attrs: { title: _vm.$t("common.signMessage") }
      }),
      _c("div", { staticClass: "content-container" }, [
        _c("div", { staticClass: "send-form" }, [
          _c("p", [_vm._v(_vm._s(_vm.$t("interface.signMessageDesc")))]),
          _c("div", { staticClass: "title-container" }, [
            _c("div", { staticClass: "title" }, [
              _c("h4", [_vm._v(_vm._s(_vm.$t("interface.txSideMenuMessage")))])
            ])
          ]),
          _c("div", { staticClass: "the-form" }, [
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
              staticClass: "custom-textarea-1",
              attrs: { name: "message" },
              domProps: { value: _vm.message },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.message = $event.target.value
                }
              }
            }),
            _c(
              "span",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.errors.has("message"),
                    expression: "errors.has('message')"
                  }
                ]
              },
              [
                _vm._v(
                  "\n          " +
                    _vm._s(_vm.errors.first("message")) +
                    "\n        "
                )
              ]
            )
          ])
        ]),
        _c(
          "div",
          { staticClass: "submit-button-container" },
          [
            _c("div", { staticClass: "buttons" }, [
              _c(
                "button",
                {
                  class: [
                    _vm.message.length > 0 ? "" : "disabled",
                    "submit-button large-round-button-green-filled clickable"
                  ],
                  on: { click: _vm.signMessage }
                },
                [
                  _vm._v(
                    "\n          " +
                      _vm._s(_vm.$t("common.sign")) +
                      "\n        "
                  )
                ]
              )
            ]),
            _c("interface-bottom-text", {
              attrs: {
                "link-text": _vm.$t("interface.helpCenter"),
                question: _vm.$t("interface.haveIssues"),
                link: "https://kb.myetherwallet.com"
              }
            })
          ],
          1
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".copy-container[data-v-83eb2cbe] {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  margin-bottom: 10px;\n}\n.copy-container .copy-buttons[data-v-83eb2cbe] {\n    color: #999;\n    margin-left: auto;\n}\n.copy-container .copy-buttons span[data-v-83eb2cbe] {\n      cursor: pointer;\n      padding: 10px;\n}\n.button-container[data-v-83eb2cbe] {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding-top: 30px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "@media all and (min-width: calc(1024px + 1px)) {\n.form-content-container[data-v-0c5d3c5d] {\n    padding: 40px;\n}\n}\n@media all and (min-width: calc(414px + 1px)) and (max-width: 1024px) {\n.form-content-container[data-v-0c5d3c5d] {\n    padding: 20px;\n}\n}\n@media all and (max-width: 414px) {\n.form-content-container[data-v-0c5d3c5d] {\n    padding: 20px 10px;\n}\n}\n.sign-message-container[data-v-0c5d3c5d] {\n  border-radius: 5px;\n  grid-area: main;\n  overflow: hidden;\n  background: #fff;\n}\n@media all and (max-width: 1024px) {\n.sign-message-container[data-v-0c5d3c5d] {\n      margin-bottom: 10px;\n}\n}\n.content-container[data-v-0c5d3c5d] {\n  padding: 40px 40px;\n}\n@media all and (min-width: calc(414px + 1px)) and (max-width: 1024px) {\n.content-container[data-v-0c5d3c5d] {\n      padding: 20px;\n}\n}\n@media all and (max-width: 414px) {\n.content-container[data-v-0c5d3c5d] {\n      padding: 10px;\n}\n}\n.content-container .title-container[data-v-0c5d3c5d] {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    margin-bottom: 5px;\n}\n.sign-message-container .send-form .form-block[data-v-0c5d3c5d] {\n  border-radius: 5px;\n}\n.sign-message-container .send-form .form-block .the-form[data-v-0c5d3c5d] {\n    background-color: #f9f9f9;\n    border-radius: 5px;\n}\n.select-contract .dropdown-toggle[data-v-0c5d3c5d] {\n  border: 0;\n  display: none;\n}\n.inner-side-menu[data-v-0c5d3c5d] {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-gap: 40px;\n}\n@media all and (max-width: 700px) {\n.inner-side-menu[data-v-0c5d3c5d] {\n      grid-template-columns: 1fr;\n}\n}\np[data-v-0c5d3c5d] {\n  margin-bottom: 40px;\n  padding: 0 8px;\n}\n.sign-message-container .send-form[data-v-0c5d3c5d] {\n  margin-bottom: 30px;\n}\n.sign-message-container .send-form .title-container .title[data-v-0c5d3c5d] {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    margin-bottom: 10px;\n    padding: 0 8px;\n    width: 100%;\n}\n.sign-message-container .send-form .title-container .title h4[data-v-0c5d3c5d] {\n      margin-right: 7px;\n}\n.sign-message-container .send-form .title-container .title .copy-buttons[data-v-0c5d3c5d] {\n      color: #999;\n      margin-left: auto;\n}\n.sign-message-container .submit-button-container[data-v-0c5d3c5d] {\n  margin-top: 60px;\n}\n@media all and (max-width: 414px) {\n.sign-message-container .submit-button-container[data-v-0c5d3c5d] {\n      margin-top: 30px;\n}\n}\n.sign-message-container .submit-button-container .bottom-text[data-v-0c5d3c5d] {\n    text-align: center;\n}\n.sign-message-container .submit-button-container .buttons[data-v-0c5d3c5d] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.sign-message-container .submit-button-container .buttons .submit-button[data-v-0c5d3c5d] {\n      margin: 0 5px;\n      text-align: center;\n      min-width: 300px;\n}\n@media all and (max-width: 414px) {\n.sign-message-container .submit-button-container .buttons .submit-button[data-v-0c5d3c5d] {\n          width: 100%;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("4ecb7fc2", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("10ea5cde", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue":
/*!**********************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&");
/* harmony import */ var _SignatureModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SignatureModal.vue?vue&type=script&lang=js& */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SignatureModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "83eb2cbe",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('83eb2cbe')) {
      api.createRecord('83eb2cbe', component.options)
    } else {
      api.reload('83eb2cbe', component.options)
    }
    module.hot.accept(/*! ./SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&");
(function () {
      api.rerender('83eb2cbe', {
        render: _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=style&index=0&id=83eb2cbe&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_style_index_0_id_83eb2cbe_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&":
/*!*****************************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& ***!
  \*****************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue?vue&type=template&id=83eb2cbe&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignatureModal_vue_vue_type_template_id_83eb2cbe_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/SignatureModal/index.js":
/*!************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/SignatureModal/index.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignatureModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignatureModal */ "./src/layouts/InterfaceLayout/components/SignatureModal/SignatureModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _SignatureModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue":
/*!**********************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&");
/* harmony import */ var _SignMessageContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SignMessageContainer.vue?vue&type=script&lang=js& */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SignMessageContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0c5d3c5d",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('0c5d3c5d')) {
      api.createRecord('0c5d3c5d', component.options)
    } else {
      api.reload('0c5d3c5d', component.options)
    }
    module.hot.accept(/*! ./SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&");
(function () {
      api.rerender('0c5d3c5d', {
        render: _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=style&index=0&id=0c5d3c5d&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_style_index_0_id_0c5d3c5d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&":
/*!*****************************************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& ***!
  \*****************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue?vue&type=template&id=0c5d3c5d&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SignMessageContainer_vue_vue_type_template_id_0c5d3c5d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/index.js":
/*!******************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/containers/SignMessageContainer/index.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SignMessageContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignMessageContainer */ "./src/layouts/InterfaceLayout/containers/SignMessageContainer/SignMessageContainer.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _SignMessageContainer__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=30.js.map