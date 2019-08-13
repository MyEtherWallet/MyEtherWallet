((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[49],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/InterfaceBottomText */ "./src/components/InterfaceBottomText/index.js");
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
  components: {
    'interface-bottom-text': _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: {
    domainName: {
      type: String,
      default: ''
    }
  },
  mounted: function mounted() {
    if (this.domainName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "name-forbidden-container" },
    [
      _c("h3", [
        _vm._v(
          _vm._s(_vm.domainName) +
            ".eth " +
            _vm._s(_vm.$t("dapps.ensNotAvailable")) +
            "!"
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
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".name-forbidden-container[data-v-03b04e9a] {\n  padding: 24px 56px;\n  border-radius: 5px;\n}\n@media all and (min-width: calc(414px + 1px)) and (max-width: 1024px) {\n.name-forbidden-container[data-v-03b04e9a] {\n      padding: 20px;\n}\n}\n@media all and (max-width: 414px) {\n.name-forbidden-container[data-v-03b04e9a] {\n      padding: 20px 10px;\n}\n}\n.auction-started[data-v-03b04e9a] {\n  color: #5a78f0;\n  padding: 10px 0 15px;\n}\n.manage-ens-container[data-v-03b04e9a] {\n  border-radius: 5px;\n  grid-area: main;\n  overflow: hidden;\n  padding-bottom: 10px;\n}\n.manage-ens-container > div[data-v-03b04e9a] {\n    background-color: #fff;\n}\n.manage-ens-container .submit-button[data-v-03b04e9a] {\n    margin: 0 auto;\n    text-align: center;\n    width: 300px;\n}\n@media all and (max-width: 414px) {\n.manage-ens-container .submit-button[data-v-03b04e9a] {\n        width: 100%;\n}\n}\n.back-button[data-v-03b04e9a] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 36px 0 25px;\n}\n.back-button button[data-v-03b04e9a] {\n    border-radius: 5px;\n    cursor: pointer;\n    padding: 20px;\n    width: 300px;\n}\n.errored[data-v-03b04e9a] {\n  border: 1px solid #f00 !important;\n  border-radius: 5px;\n  padding: 11px 13px;\n}\n.erroredMsg[data-v-03b04e9a] {\n  color: #f00;\n}\n.name-forbidden-container[data-v-03b04e9a] {\n  min-height: 600px;\n}\n.name-forbidden-container h3[data-v-03b04e9a] {\n    color: #f5a623;\n    font-size: 24px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("082d0986", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue":
/*!************************************************************************************************!*\
  !*** ./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&");
/* harmony import */ var _NameForbiddenENSContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NameForbiddenENSContainer.vue?vue&type=script&lang=js& */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _NameForbiddenENSContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["render"],
  _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "03b04e9a",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('03b04e9a')) {
      api.createRecord('03b04e9a', component.options)
    } else {
      api.reload('03b04e9a', component.options)
    }
    module.hot.accept(/*! ./NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&");
(function () {
      api.rerender('03b04e9a', {
        render: _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************!*\
  !*** ./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=style&index=0&id=03b04e9a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_style_index_0_id_03b04e9a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&":
/*!*****************************************************************************************************************************************************!*\
  !*** ./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& ***!
  \*****************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue?vue&type=template&id=03b04e9a&scoped=true&lang=html&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NameForbiddenENSContainer_vue_vue_type_template_id_03b04e9a_scoped_true_lang_html___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/index.js":
/*!***************************************************************************!*\
  !*** ./src/dapps/ManageENS/containers/NameForbiddenENSContainer/index.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NameForbiddenENSContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NameForbiddenENSContainer */ "./src/dapps/ManageENS/containers/NameForbiddenENSContainer/NameForbiddenENSContainer.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _NameForbiddenENSContainer__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=49.js.map