((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[34],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
      items: ['introduction', 'introductionParagraph1', 'introductionParagraph2', 'introductionParagraph3', 'introductionParagraph4', 'theBlockchain', 'theBlockchainParagraph', 'whatWeCollect', 'whatWeCollectParagraph1', 'whatWeCollectSubtitle1', 'whatWeCollectParagraph2', 'whatWeCollectSubtitle2', 'whatWeCollectParagraph3', 'useOfInformation', 'useOfInformationParagraph1', 'useOfInformationParagraph2', 'sharingPersonalInfo', 'sharingPersonalInfoParagraph1', 'sharingPersonalInfoParagraph2', 'sharingPersonalInfoSubtitle', 'sharingPersonalInfoParagraph3', 'linksToOtherSites', 'linksToOtherSitesParagraph', 'mewCommitment', 'mewCommitmentParagraph', 'personalInfoSecurity', 'personalInfoSecurityParagraph', 'personalInfoSecuritySentence1', 'personalInfoSecurityItem1', 'personalInfoSecurityItem2', 'personalInfoSecurityItem3', 'personalInfoSecurityItem4', 'personalInfoSecurityItem5', 'personalInfoSecurityItem6', 'personalInfoSecurityFooter', 'legalBasis', 'legalBasisParagraph', 'legalBasisItem1', 'legalBasisItem2', 'retention', 'retentionParagraph', 'contactInfo', 'contactInfoParagraph', 'changesToPrivacyPolicy', 'changesToPrivacyPolicyParagraph']
    };
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "privacy-policy" }, [
    _c("div", { staticClass: "wrap" }, [
      _c("div", { staticClass: "page-container" }, [
        _c("div", { staticClass: "content-width-limit" }, [
          _c("div", { staticClass: "page-header" }, [
            _c("h1", [_vm._v(_vm._s(_vm.$t("privacyPol.title")))]),
            _c("h6", [_vm._v(_vm._s(_vm.$t("privacyPol.date")))])
          ]),
          _c(
            "div",
            { staticClass: "content" },
            _vm._l(_vm.items, function(item) {
              return _c("div", { key: item }, [
                item.includes("Paragraph") ||
                item.includes("Sentence") ||
                item.includes("Footer")
                  ? _c("p", [
                      _vm._v(
                        "\n              " +
                          _vm._s(_vm.$t("privacyPol." + item)) +
                          "\n              "
                      ),
                      _c(
                        "a",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value:
                                _vm.$t("privacyPol." + item).includes("at:") ||
                                _vm.$t("privacyPol." + item).includes("to:"),
                              expression:
                                "\n                  $t(`privacyPol.${item}`).includes('at:') ||\n                    $t(`privacyPol.${item}`).includes('to:')\n                "
                            }
                          ],
                          attrs: {
                            href: "mailto:support@myetherwallet.com",
                            rel: "noopener noreferrer"
                          }
                        },
                        [
                          _vm._v(
                            "\n                support@myetherwallet.com\n              "
                          )
                        ]
                      )
                    ])
                  : item.includes("Item")
                  ? _c("p", [
                      _vm._v(
                        "\n              " +
                          _vm._s(item[item.length - 1]) +
                          ". " +
                          _vm._s(_vm.$t("privacyPol." + item)) +
                          "\n            "
                      )
                    ])
                  : item.includes("Subtitle")
                  ? _c("h4", [
                      _vm._v(
                        "\n              " +
                          _vm._s(_vm.$t("privacyPol." + item)) +
                          "\n            "
                      )
                    ])
                  : _c("h3", [
                      _vm._v(
                        "\n              " +
                          _vm._s(_vm.$t("privacyPol." + item)) +
                          "\n            "
                      )
                    ])
              ])
            }),
            0
          )
        ])
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../../node_modules/css-loader/lib/url/escape.js */ "./node_modules/css-loader/lib/url/escape.js");
exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".wrap[data-v-396720aa] {\n  background-color: #f2f4fa;\n  background-image: url(" + escape(__webpack_require__(/*! @/assets/images/background/right.png */ "./src/assets/images/background/right.png")) + "), url(" + escape(__webpack_require__(/*! @/assets/images/background/left.png */ "./src/assets/images/background/left.png")) + ");\n  background-position: right top, left 80px;\n  background-repeat: no-repeat, no-repeat;\n  padding: 60px 0;\n}\n.wrap .page-container .content-width-limit[data-v-396720aa] {\n    margin: 0 auto;\n    max-width: 620px;\n}\n.wrap .page-container .page-header[data-v-396720aa] {\n    margin-bottom: 40px;\n    text-align: center;\n}\n.wrap .page-container .page-header p[data-v-396720aa] {\n      margin: 0 auto;\n      max-width: 700px;\n}\n.content[data-v-396720aa] {\n  text-align: center;\n}\n.content p[data-v-396720aa] {\n    font-size: 14px;\n    font-weight: 400;\n    padding: 10px;\n}\n.content h3[data-v-396720aa] {\n    padding-top: 30px;\n    text-align: center;\n}\n.content h4[data-v-396720aa] {\n    padding: 10px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("d2052e2a", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/images/background/left.png":
/*!***********************************************!*\
  !*** ./src/assets/images/background/left.png ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/left.png";

/***/ }),

/***/ "./src/assets/images/background/right.png":
/*!************************************************!*\
  !*** ./src/assets/images/background/right.png ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/right.png";

/***/ }),

/***/ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue":
/*!*****************************************************************!*\
  !*** ./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&");
/* harmony import */ var _PrivacyPolicyLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PrivacyPolicyLayout.vue?vue&type=script&lang=js& */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _PrivacyPolicyLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "396720aa",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('396720aa')) {
      api.createRecord('396720aa', component.options)
    } else {
      api.reload('396720aa', component.options)
    }
    module.hot.accept(/*! ./PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&");
(function () {
      api.rerender('396720aa', {
        render: _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js&":
/*!******************************************************************************************!*\
  !*** ./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&":
/*!***************************************************************************************************************************!*\
  !*** ./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=style&index=0&id=396720aa&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_style_index_0_id_396720aa_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&":
/*!************************************************************************************************************!*\
  !*** ./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& ***!
  \************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue?vue&type=template&id=396720aa&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicyLayout_vue_vue_type_template_id_396720aa_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/layouts/PrivacyPolicyLayout/index.js":
/*!**************************************************!*\
  !*** ./src/layouts/PrivacyPolicyLayout/index.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PrivacyPolicyLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrivacyPolicyLayout */ "./src/layouts/PrivacyPolicyLayout/PrivacyPolicyLayout.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _PrivacyPolicyLayout__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ })

}]);
//# sourceMappingURL=34.js.map