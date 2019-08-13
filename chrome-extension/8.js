((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[8],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.function.name */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es7.array.includes */ "./node_modules/core-js/modules/es7.array.includes.js");
/* harmony import */ var core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.string.includes */ "./node_modules/core-js/modules/es6.string.includes.js");
/* harmony import */ var core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconDisabled: {
      type: String,
      default: ''
    },
    param: {
      type: String,
      default: ''
    },
    supportedNetworks: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_7__["mapState"])(['network', 'online']), {
    supported: function supported() {
      if (this.online) {
        return this.supportedNetworks.includes(this.network.type.name);
      }
    }
  }),
  methods: {
    navigateTo: function navigateTo() {
      this.$router.push(this.param);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    {
      class: ["dapps-button", _vm.supported ? "" : "disabled"],
      on: { click: _vm.navigateTo }
    },
    [
      _c("img", {
        attrs: { src: _vm.supported ? _vm.icon : _vm.iconDisabled }
      }),
      _c("div", [
        _c("h4", [_vm._v(_vm._s(_vm.title))]),
        _c("p", [_vm._v(_vm._s(_vm.desc))])
      ])
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".dapps-button[data-v-6995a80b] {\n  background: #f1fafa;\n  border: 1px solid #f1fafa;\n  border-radius: 5px;\n  color: #000;\n  cursor: pointer;\n  height: 100%;\n  padding: 40px 20px;\n  text-align: center;\n}\n@media all and (max-width: 650px) {\n.dapps-button[data-v-6995a80b] {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      text-align: left;\n      padding: 10px 20px;\n}\n}\n.dapps-button[data-v-6995a80b]:hover {\n    border: 1px solid #05c0a5;\n    background-color: #c9f2ed;\n}\n@media all and (max-width: 650px) {\n.dapps-button img[data-v-6995a80b] {\n      margin-top: 0;\n      margin-left: -10px;\n      margin-right: 22px;\n      width: 23%;\n      max-width: 90px;\n}\n}\n.dapps-button h4[data-v-6995a80b] {\n    margin-bottom: 5px;\n    font-size: 18px;\n    font-weight: 500;\n}\n.disabled[data-v-6995a80b] {\n  background-color: #fff;\n  border: 1px solid #dadada;\n  color: #dadada;\n  pointer-events: none;\n}\n.disabled p[data-v-6995a80b] {\n    color: #dadada;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("626f5e4d", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/images/icons/button-key.svg":
/*!************************************************!*\
  !*** ./src/assets/images/icons/button-key.svg ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/button-key.svg";

/***/ }),

/***/ "./src/assets/images/icons/dapps/makerdai.svg":
/*!****************************************************!*\
  !*** ./src/assets/images/icons/dapps/makerdai.svg ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/makerdai.svg";

/***/ }),

/***/ "./src/assets/images/icons/domain-hov.svg":
/*!************************************************!*\
  !*** ./src/assets/images/icons/domain-hov.svg ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/domain-hov.svg";

/***/ }),

/***/ "./src/assets/images/icons/domain-sale-hov.svg":
/*!*****************************************************!*\
  !*** ./src/assets/images/icons/domain-sale-hov.svg ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/domain-sale-hov.svg";

/***/ }),

/***/ "./src/assets/images/icons/domain-sale.svg":
/*!*************************************************!*\
  !*** ./src/assets/images/icons/domain-sale.svg ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/domain-sale.svg";

/***/ }),

/***/ "./src/assets/images/icons/domain.svg":
/*!********************************************!*\
  !*** ./src/assets/images/icons/domain.svg ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/domain.svg";

/***/ }),

/***/ "./src/assets/images/icons/eac-hov.svg":
/*!*********************************************!*\
  !*** ./src/assets/images/icons/eac-hov.svg ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/eac-hov.svg";

/***/ }),

/***/ "./src/assets/images/icons/eac.svg":
/*!*****************************************!*\
  !*** ./src/assets/images/icons/eac.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/eac.svg";

/***/ }),

/***/ "./src/dapps/index.js":
/*!****************************!*\
  !*** ./src/dapps/index.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.function.name */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_images_icons_domain_sale_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/assets/images/icons/domain-sale.svg */ "./src/assets/images/icons/domain-sale.svg");
/* harmony import */ var _assets_images_icons_domain_sale_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_domain_sale_svg__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_images_icons_domain_sale_hov_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/assets/images/icons/domain-sale-hov.svg */ "./src/assets/images/icons/domain-sale-hov.svg");
/* harmony import */ var _assets_images_icons_domain_sale_hov_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_domain_sale_hov_svg__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_images_icons_domain_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/assets/images/icons/domain.svg */ "./src/assets/images/icons/domain.svg");
/* harmony import */ var _assets_images_icons_domain_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_domain_svg__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _assets_images_icons_domain_hov_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/assets/images/icons/domain-hov.svg */ "./src/assets/images/icons/domain-hov.svg");
/* harmony import */ var _assets_images_icons_domain_hov_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_domain_hov_svg__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _assets_images_icons_button_key_hover_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/assets/images/icons/button-key-hover.svg */ "./src/assets/images/icons/button-key-hover.svg");
/* harmony import */ var _assets_images_icons_button_key_hover_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_button_key_hover_svg__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _assets_images_icons_button_key_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/assets/images/icons/button-key.svg */ "./src/assets/images/icons/button-key.svg");
/* harmony import */ var _assets_images_icons_button_key_svg__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_button_key_svg__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _assets_images_icons_eac_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/assets/images/icons/eac.svg */ "./src/assets/images/icons/eac.svg");
/* harmony import */ var _assets_images_icons_eac_svg__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_eac_svg__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _assets_images_icons_eac_hov_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/assets/images/icons/eac-hov.svg */ "./src/assets/images/icons/eac-hov.svg");
/* harmony import */ var _assets_images_icons_eac_hov_svg__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_eac_hov_svg__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _assets_images_icons_dapps_makerdai_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/assets/images/icons/dapps/makerdai.svg */ "./src/assets/images/icons/dapps/makerdai.svg");
/* harmony import */ var _assets_images_icons_dapps_makerdai_svg__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_dapps_makerdai_svg__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _networks_types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/networks/types */ "./src/networks/types/index.js");











var dapps = {
  manageEns: {
    route: '/interface/dapps/manage-ens',
    icon: _assets_images_icons_domain_svg__WEBPACK_IMPORTED_MODULE_3___default.a,
    iconDisabled: _assets_images_icons_domain_hov_svg__WEBPACK_IMPORTED_MODULE_4___default.a,
    title: 'interface.ensManager',
    desc: 'interface.registerENSDescShort',
    supportedNetworks: [_networks_types__WEBPACK_IMPORTED_MODULE_10__["ETH"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["GOERLI"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["ROP"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["RIN"].name]
  },
  domainSale: {
    route: '/interface/dapps/name-wallet',
    icon: _assets_images_icons_domain_sale_svg__WEBPACK_IMPORTED_MODULE_1___default.a,
    iconDisabled: _assets_images_icons_domain_sale_hov_svg__WEBPACK_IMPORTED_MODULE_2___default.a,
    title: 'interface.nameYourWallet',
    desc: 'interface.nameYourWalletDesc',
    supportedNetworks: [_networks_types__WEBPACK_IMPORTED_MODULE_10__["ETH"].name]
  },
  secureTransaction: {
    route: '/interface/dapps/secure-transaction',
    icon: _assets_images_icons_button_key_hover_svg__WEBPACK_IMPORTED_MODULE_5___default.a,
    iconDisabled: _assets_images_icons_button_key_svg__WEBPACK_IMPORTED_MODULE_6___default.a,
    title: 'dapps.safesend_title',
    desc: 'dapps.safesend_desc',
    supportedNetworks: [_networks_types__WEBPACK_IMPORTED_MODULE_10__["ETH"].name]
  },
  scheduleTransaction: {
    route: '/interface/dapps/schedule-transaction',
    icon: _assets_images_icons_eac_svg__WEBPACK_IMPORTED_MODULE_7___default.a,
    iconDisabled: _assets_images_icons_eac_hov_svg__WEBPACK_IMPORTED_MODULE_8___default.a,
    title: 'Schedule a transaction',
    desc: 'Schedule a transaction using the decentralized Ethereum Alarm Clock protocol',
    supportedNetworks: [_networks_types__WEBPACK_IMPORTED_MODULE_10__["ETH"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["ROP"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["KOV"].name]
  },
  maker: {
    route: '/interface/dapps/maker-dai',
    icon: _assets_images_icons_dapps_makerdai_svg__WEBPACK_IMPORTED_MODULE_9___default.a,
    iconDisabled: _assets_images_icons_button_key_svg__WEBPACK_IMPORTED_MODULE_6___default.a,
    title: 'dappsMaker.maker_title',
    desc: 'dappsMaker.maker_desc',
    supportedNetworks: [_networks_types__WEBPACK_IMPORTED_MODULE_10__["ETH"].name, _networks_types__WEBPACK_IMPORTED_MODULE_10__["KOV"].name]
  }
};
/* harmony default export */ __webpack_exports__["default"] = (dapps);

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue":
/*!****************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&");
/* harmony import */ var _DappButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DappButtons.vue?vue&type=script&lang=js& */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DappButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "6995a80b",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('6995a80b')) {
      api.createRecord('6995a80b', component.options)
    } else {
      api.reload('6995a80b', component.options)
    }
    module.hot.accept(/*! ./DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&");
(function () {
      api.rerender('6995a80b', {
        render: _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=style&index=0&id=6995a80b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_style_index_0_id_6995a80b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&":
/*!***********************************************************************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& ***!
  \***********************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DappButtons.vue?vue&type=template&id=6995a80b&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue?vue&type=template&id=6995a80b&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DappButtons_vue_vue_type_template_id_6995a80b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/layouts/InterfaceLayout/components/DappButtons/index.js":
/*!*********************************************************************!*\
  !*** ./src/layouts/InterfaceLayout/components/DappButtons/index.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DappButtons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DappButtons */ "./src/layouts/InterfaceLayout/components/DappButtons/DappButtons.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _DappButtons__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=8.js.map