((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[32],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _containers_FooterContainer_affiliates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/containers/FooterContainer/affiliates */ "./src/containers/FooterContainer/affiliates.js");
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
  data: function data() {
    return {
      items: _containers_FooterContainer_affiliates__WEBPACK_IMPORTED_MODULE_0__["default"]
    };
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "hardware-layout" }, [
    _c("div", { staticClass: "page-container" }, [
      _c("div", { staticClass: "hardware-container" }, [
        _c("div", { staticClass: "hardware-text" }, [
          _c("h2", [_vm._v(_vm._s(_vm.$t("buyHardwareWallet.pageTitle")))]),
          _c("p", [
            _vm._v(
              "\n          " +
                _vm._s(_vm.$t("buyHardwareWallet.pageSubTtile")) +
                "\n        "
            )
          ])
        ]),
        _c(
          "div",
          { staticClass: "hardware-items-container" },
          _vm._l(_vm.items, function(item) {
            return item.logo !== ""
              ? _c("div", { key: item.text, staticClass: "hardware-item" }, [
                  _c("div", { staticClass: "hardware-item-text" }, [
                    _c("p", { staticClass: "starting-from" }, [
                      _vm._v(
                        "\n              " +
                          _vm._s(
                            _vm.$t("buyHardwareWallet.priceStartingFrom")
                          ) +
                          "\n            "
                      )
                    ]),
                    _c("div", { staticClass: "price-container" }, [
                      _c("span", [_vm._v(_vm._s(item.currency))]),
                      _c("p", [
                        _vm._v(
                          "\n                " +
                            _vm._s(item.price) +
                            "\n              "
                        )
                      ])
                    ]),
                    _c("p", { staticClass: "item-description" }, [
                      _vm._v(
                        "\n              " +
                          _vm._s(item.description) +
                          "\n            "
                      )
                    ]),
                    _c(
                      "a",
                      {
                        staticClass: "more-info",
                        attrs: {
                          href: item.href,
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }
                      },
                      [
                        _vm._v(
                          "\n              " +
                            _vm._s(_vm.$t("buyHardwareWallet.moreInfo")) +
                            " >\n            "
                        )
                      ]
                    )
                  ]),
                  _c("div", { staticClass: "hardware-item-logo" }, [
                    _c("img", {
                      attrs: {
                        src: __webpack_require__("./src/assets/images/affiliates sync recursive ^\\.\\/.*\\.png$")("./" +
                          item.logo +
                          ".png")
                      }
                    })
                  ])
                ])
              : _vm._e()
          }),
          0
        )
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".hardware-layout[data-v-887fade8] {\n  background-color: #f2f4fa;\n  padding: 100px 0;\n}\n@media all and (max-width: 1024px) {\n.hardware-layout[data-v-887fade8] {\n      padding: 50px 0;\n}\n}\n.hardware-container .hardware-text[data-v-887fade8] {\n  text-align: center;\n  padding-bottom: 50px;\n}\n.hardware-container .hardware-text h2[data-v-887fade8] {\n    color: #003945;\n    font-size: 45px;\n    font-weight: 500;\n    line-height: 60px;\n}\n.hardware-container .hardware-text p[data-v-887fade8] {\n    color: #506175;\n}\n@media all and (max-width: 414px) {\n.hardware-container .hardware-text[data-v-887fade8] {\n      text-align: left;\n}\n.hardware-container .hardware-text h2[data-v-887fade8] {\n        font-size: 25px;\n        font-weight: 600;\n        line-height: 40px;\n}\n}\n.hardware-container .hardware-item[data-v-887fade8] {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #fff;\n  border-radius: 5px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  max-width: 720px;\n  margin: 14px auto;\n  padding: 26px 34px;\n}\n@media all and (max-width: 414px) {\n.hardware-container .hardware-item[data-v-887fade8] {\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: reverse;\n          -ms-flex-direction: column-reverse;\n              flex-direction: column-reverse;\n      padding: 46px 34px;\n}\n}\n.hardware-container .hardware-item .hardware-item-text[data-v-887fade8] {\n    -webkit-box-flex: 1;\n        -ms-flex: 1;\n            flex: 1;\n}\n.hardware-container .hardware-item .hardware-item-text .item-description[data-v-887fade8] {\n      padding-top: 11px;\n}\n.hardware-container .hardware-item .hardware-item-text .starting-from[data-v-887fade8] {\n      color: #999;\n      font-size: 11px;\n}\n.hardware-container .hardware-item .hardware-item-text .price-container[data-v-887fade8] {\n      font-weight: bold;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n}\n.hardware-container .hardware-item .hardware-item-text .price-container p[data-v-887fade8] {\n        color: #0b2840;\n        font-size: 20px;\n}\n.hardware-container .hardware-item .hardware-item-text .price-container span[data-v-887fade8] {\n        margin-right: 3px;\n        color: #0b2840;\n}\n.hardware-container .hardware-item .hardware-item-text .more-info[data-v-887fade8] {\n      font-size: 13px;\n      margin-top: 10px;\n      display: block;\n}\n.hardware-container .hardware-item .hardware-item-logo[data-v-887fade8] {\n    margin-left: 30px;\n}\n@media all and (max-width: 414px) {\n.hardware-container .hardware-item .hardware-item-logo[data-v-887fade8] {\n        margin-left: 0;\n        margin-bottom: 30px;\n}\n}\n.hardware-container .hardware-item .hardware-item-logo img[data-v-887fade8] {\n      max-height: 42px;\n      max-width: 140px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("06ee5944", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/images/affiliates sync recursive ^\\.\\/.*\\.png$":
/*!*********************************************************!*\
  !*** ./src/assets/images/affiliates sync ^\.\/.*\.png$ ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./bitbox.png": "./src/assets/images/affiliates/bitbox.png",
	"./finney.png": "./src/assets/images/affiliates/finney.png",
	"./keepkey.png": "./src/assets/images/affiliates/keepkey.png",
	"./ledger.png": "./src/assets/images/affiliates/ledger.png",
	"./secalot.png": "./src/assets/images/affiliates/secalot.png",
	"./trezor.png": "./src/assets/images/affiliates/trezor.png"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/assets/images/affiliates sync recursive ^\\.\\/.*\\.png$";

/***/ }),

/***/ "./src/assets/images/affiliates/bitbox.png":
/*!*************************************************!*\
  !*** ./src/assets/images/affiliates/bitbox.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/bitbox.png";

/***/ }),

/***/ "./src/assets/images/affiliates/finney.png":
/*!*************************************************!*\
  !*** ./src/assets/images/affiliates/finney.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/finney.png";

/***/ }),

/***/ "./src/assets/images/affiliates/keepkey.png":
/*!**************************************************!*\
  !*** ./src/assets/images/affiliates/keepkey.png ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/keepkey.png";

/***/ }),

/***/ "./src/assets/images/affiliates/ledger.png":
/*!*************************************************!*\
  !*** ./src/assets/images/affiliates/ledger.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/ledger.png";

/***/ }),

/***/ "./src/assets/images/affiliates/secalot.png":
/*!**************************************************!*\
  !*** ./src/assets/images/affiliates/secalot.png ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/assets/images/affiliates/trezor.png":
/*!*************************************************!*\
  !*** ./src/assets/images/affiliates/trezor.png ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/layouts/HardwaresLayout/HardwaresLayout.vue":
/*!*********************************************************!*\
  !*** ./src/layouts/HardwaresLayout/HardwaresLayout.vue ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&");
/* harmony import */ var _HardwaresLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HardwaresLayout.vue?vue&type=script&lang=js& */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _HardwaresLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "887fade8",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('887fade8')) {
      api.createRecord('887fade8', component.options)
    } else {
      api.reload('887fade8', component.options)
    }
    module.hot.accept(/*! ./HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&");
(function () {
      api.rerender('887fade8', {
        render: _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/layouts/HardwaresLayout/HardwaresLayout.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js&":
/*!**********************************************************************************!*\
  !*** ./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&":
/*!*******************************************************************************************************************!*\
  !*** ./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=style&index=0&id=887fade8&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_style_index_0_id_887fade8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&":
/*!****************************************************************************************************!*\
  !*** ./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/HardwaresLayout/HardwaresLayout.vue?vue&type=template&id=887fade8&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HardwaresLayout_vue_vue_type_template_id_887fade8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/layouts/HardwaresLayout/index.js":
/*!**********************************************!*\
  !*** ./src/layouts/HardwaresLayout/index.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HardwaresLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HardwaresLayout */ "./src/layouts/HardwaresLayout/HardwaresLayout.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _HardwaresLayout__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=32.js.map