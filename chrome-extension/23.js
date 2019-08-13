((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[23],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    title: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    hidebottomborder: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      expanded: false
    };
  },
  methods: {
    optionExpanded: function optionExpanded() {
      this.expanded = !this.expanded;
      this.$emit('expanded', this.expanded);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_LoadingSign__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/components/LoadingSign */ "./src/components/LoadingSign/index.js");
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
    'loading-sign': _components_LoadingSign__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: {
    loadingmessage: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {};
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.number.constructor */ "./node_modules/core-js/modules/es6.number.constructor.js");
/* harmony import */ var core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_number_constructor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/components/ExpendingOption */ "./src/components/ExpendingOption/index.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");

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
  components: {
    'expending-option': _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_1__["default"],
    'standard-button': _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  props: {
    opencdp: {
      type: Function,
      default: function _default() {}
    },
    liquidationPrice: {
      type: Number,
      default: 0
    },
    collatRatio: {
      type: String,
      default: 'Error'
    },
    liquidationPenalty: {
      type: String,
      default: 'Error'
    },
    minRatio: {
      type: String,
      default: 'Error'
    },
    currentPrice: {
      type: String,
      default: 'Error'
    },
    collateral: {
      type: String,
      default: 'Error'
    },
    generate: {
      type: String,
      default: 'Error'
    }
  },
  data: function data() {
    return {
      confirmButton: {
        title: this.$t('dappsMaker.confirmAndCreate'),
        buttonStyle: 'green',
        helpCenter: true
      }
    };
  },
  computed: {},
  watch: {},
  mounted: function mounted() {},
  methods: {
    confirmClicked: function confirmClicked() {
      this.opencdp();
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ethjs-unit */ "./node_modules/ethjs-unit/lib/index.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ethjs_unit__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _layouts_InterfaceLayout_components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/layouts/InterfaceLayout/components/InterfaceContainerTitle */ "./src/layouts/InterfaceLayout/components/InterfaceContainerTitle/index.js");
/* harmony import */ var _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/components/InterfaceBottomText */ "./src/components/InterfaceBottomText/index.js");
/* harmony import */ var _components_Blockie__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/components/Blockie */ "./src/components/Blockie/index.js");
/* harmony import */ var _components_DaiConfirmationModal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../components/DaiConfirmationModal */ "./src/dapps/MakerDai/components/DaiConfirmationModal/index.js");
/* harmony import */ var _components_LoadingOverlay__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/components/LoadingOverlay */ "./src/components/LoadingOverlay/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../helpers */ "./src/dapps/MakerDai/helpers.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(bignumber_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _assets_images_etc_single_arrow_svg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/assets/images/etc/single-arrow.svg */ "./src/assets/images/etc/single-arrow.svg");
/* harmony import */ var _assets_images_etc_single_arrow_svg__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_assets_images_etc_single_arrow_svg__WEBPACK_IMPORTED_MODULE_16__);








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











var toBigNumber = function toBigNumber(num) {
  return new bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a(num);
};

var bnOver = function bnOver(one, two, three) {
  return toBigNumber(one).times(toBigNumber(two)).div(toBigNumber(three));
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'interface-container-title': _layouts_InterfaceLayout_components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_9__["default"],
    'interface-bottom-text': _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_10__["default"],
    blockie: _components_Blockie__WEBPACK_IMPORTED_MODULE_11__["default"],
    'dai-confirmation-modal': _components_DaiConfirmationModal__WEBPACK_IMPORTED_MODULE_12__["default"],
    'loading-overlay': _components_LoadingOverlay__WEBPACK_IMPORTED_MODULE_13__["default"]
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    getBalance: {
      type: Function,
      default: function _default() {}
    },
    highestGas: {
      type: String,
      default: '0'
    },
    ethPrice: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    pethPrice: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    liquidationPenalty: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    stabilityFee: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    liquidationRatio: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    wethToPethRatio: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    pethMin: {
      type: bignumber_js__WEBPACK_IMPORTED_MODULE_15___default.a,
      default: toBigNumber(0)
    },
    priceService: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    cdpService: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    proxyService: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    buildEmpty: {
      type: Function,
      default: function _default() {}
    },
    values: {
      type: Object,
      default: function _default() {
        return {
          maxPethDraw: '',
          maxEthDraw: '',
          maxUsdDraw: '',
          ethCollateral: '',
          pethCollateral: '',
          usdCollateral: '',
          debtValue: '',
          maxDai: '',
          collateralRatio: '',
          cdpId: '',
          stabilityFee: '',
          minEth: '',
          liquidationRatio: '',
          wethToPethRatio: '',
          liquidationPenalty: '',
          targetPrice: '',
          pethPrice: ''
        };
      }
    }
  },
  data: function data() {
    return {
      arrowImage: _assets_images_etc_single_arrow_svg__WEBPACK_IMPORTED_MODULE_16___default.a,
      daiPrice: 0,
      priceFloor: 0,
      ethQty: 0,
      daiQty: 0,
      txInfo: {},
      loading: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_7__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    validInputs: function validInputs() {
      if (toBigNumber(this.ethQty).isNaN() || toBigNumber(this.daiQty).isNaN()) return false;

      if (toBigNumber(this.ethQty).gt(0)) {
        if (toBigNumber(this.ethQty).lte(this.values.minEth)) return false;
        if (toBigNumber(this.maxDaiDraw).lte(toBigNumber(this.daiQty))) return false;
        if (toBigNumber(this.collatRatio).lte(1.501)) return false;
        return toBigNumber(ethjs_unit__WEBPACK_IMPORTED_MODULE_8___default.a.toWei(this.ethQty, 'ether').toString()).lte(this.account.balance);
      }

      return false;
    },
    hasEnoughEth: function hasEnoughEth() {
      if (toBigNumber(this.ethQty).isNaN()) return false;
      return toBigNumber(ethjs_unit__WEBPACK_IMPORTED_MODULE_8___default.a.toWei(this.ethQty, 'ether').toString()).lte(this.account.balance);
    },
    atSetFloor: function atSetFloor() {
      if (this.priceFloor <= 0) return 0;
      return bnOver(this.ethPrice, this.liquidationRatio, this.priceFloor);
    },
    collatRatio: function collatRatio() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.calcCollatRatio(this.ethQty, this.daiQty);
    },
    liquidationPrice: function liquidationPrice() {
      if (this.daiQty <= 0 || this.ethQty <= 0) return 0;
      return this.calcLiquidationPrice(this.ethQty, this.daiQty);
    },
    maxDaiDraw: function maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      var bufferVal = this.calcDaiDraw(this.ethQty).times(0.01);
      return toBigNumber(this.calcDaiDraw(this.ethQty)).minus(bufferVal);
    },
    minEthDeposit: function minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return this.calcMinEthDeposit(this.daiQty);
    },
    risky: function risky() {
      var collRatio = this.collatRatio;

      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(2);
      }

      return false;
    },
    veryRisky: function veryRisky() {
      var collRatio = this.collatRatio;

      if (toBigNumber(collRatio).gt(0)) {
        return toBigNumber(collRatio).lte(1.75);
      }

      return false;
    },
    depositInPeth: function depositInPeth() {
      if (this.ethQty <= 0) return 0;
      return this.toPeth(this.ethQty);
    },
    minEth: function minEth() {
      if (this.wethToPethRatio) {
        return toBigNumber(this.pethMin).times(this.wethToPethRatio);
      }

      return '--';
    }
  }),
  mounted: function () {
    var _mounted = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.buildEmptyInstance();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function mounted() {
      return _mounted.apply(this, arguments);
    }

    return mounted;
  }(),
  methods: {
    buildEmptyInstance: function () {
      var _buildEmptyInstance = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.buildEmpty();

              case 2:
                this.makerCDP = _context2.sent;
                this.$forceUpdate();

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function buildEmptyInstance() {
        return _buildEmptyInstance.apply(this, arguments);
      }

      return buildEmptyInstance;
    }(),
    displayPercentValue: _helpers__WEBPACK_IMPORTED_MODULE_14__["displayPercentValue"],
    displayFixedValue: _helpers__WEBPACK_IMPORTED_MODULE_14__["displayFixedValue"],
    displayFixedPercent: _helpers__WEBPACK_IMPORTED_MODULE_14__["displayFixedPercent"],
    openCdp: function () {
      var _openCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.loading = true;

                if (!(this.ethQty <= 0)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", 0);

              case 3:
                setTimeout(function () {
                  _this.loading = false;
                }, 5000); // [Note from David to Steve] This should be implemented on TX core.
                // Close DAI confirmation modal

                this.$eventHub.$on('showTxConfirmModal', function () {
                  _this.$emit('cdpOpened');

                  if (_this.loading) {
                    _this.$refs.daiconfirmation.$refs.modal.hide();

                    _this.loading = false;
                  }
                });
                _context3.next = 7;
                return this.makerCDP.openCdp(this.ethQty, this.daiQty);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function openCdp() {
        return _openCdp.apply(this, arguments);
      }

      return openCdp;
    }(),
    openDaiConfirmation: function openDaiConfirmation() {
      this.$refs.daiconfirmation.$refs.modal.show();
    },
    toUSD: function toUSD(eth) {
      if (eth === undefined || eth === null) return toBigNumber(0);
      var toUsd = this.ethPrice.times(toBigNumber(eth));

      if (toUsd.lt(0)) {
        return toBigNumber(0);
      }

      return toUsd;
    },
    toPeth: function toPeth(eth) {
      if (!toBigNumber(eth).eq(0)) {
        return toBigNumber(eth).div(this.wethToPethRatio);
      }

      return toBigNumber(0);
    },
    fromPeth: function fromPeth(peth) {
      if (!toBigNumber(peth).eq(0)) {
        return toBigNumber(peth).times(this.wethToPethRatio);
      }

      return toBigNumber(0);
    },
    calcMinCollatRatio: function calcMinCollatRatio(priceFloor) {
      return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
    },
    calcDaiDraw: function calcDaiDraw(ethQty) {
      var ethPrice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.ethPrice;
      var liquidationRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.liquidationRatio;
      if (ethQty <= 0) return 0;
      return bnOver(ethPrice, toBigNumber(ethQty), liquidationRatio);
    },
    calcMinEthDeposit: function calcMinEthDeposit(daiQty) {
      var ethPrice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.ethPrice;
      var liquidationRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.liquidationRatio;
      if (daiQty <= 0) return 0;
      return bnOver(liquidationRatio, daiQty, ethPrice);
    },
    calcCollatRatio: function calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      return bnOver(this.ethPrice, ethQty, daiQty);
    },
    calcLiquidationPrice: function calcLiquidationPrice(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return 0;
      var getInt = parseInt(this.ethPrice);

      for (var i = getInt; i > 0; i--) {
        var atValue = bnOver(i, ethQty, daiQty).lte(this.liquidationRatio);

        if (atValue) {
          return i;
        }
      }

      for (var _i = 100; _i > 0; _i--) {
        var _atValue = bnOver(_i / 100, ethQty, daiQty).lte(this.liquidationRatio);

        if (_atValue) {
          return _i / 100;
        }
      }

      return 0;
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      staticClass: "expending-option",
      class: _vm.hidebottomborder ? "hide-bottom-border" : ""
    },
    [
      _c("div", { staticClass: "title-bar-container" }, [
        _c("div", { staticClass: "input-title" }, [_vm._v(_vm._s(_vm.title))]),
        _vm.buttonText !== ""
          ? _c("div", { staticClass: "button-text" }, [
              _vm._v(_vm._s(_vm.buttonText))
            ])
          : _vm._e(),
        _c("div", { staticClass: "switch sliding-switch-white" }, [
          _c("label", { staticClass: "switch" }, [
            _c("input", {
              attrs: { type: "checkbox" },
              on: { click: _vm.optionExpanded }
            }),
            _c("span", { staticClass: "slider round" })
          ])
        ])
      ]),
      _c(
        "div",
        {
          staticClass: "contnet-container",
          class: _vm.expanded ? "expanded" : ""
        },
        [_c("div", { staticClass: "content-block" }, [_vm._t("default")], 2)]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "loading-overlay" }, [
    _c(
      "div",
      { staticClass: "loading-sign" },
      [
        _c("loading-sign", {
          attrs: { loadingmessage1: _vm.loadingmessage, color: "white" }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "modal-container" },
    [
      _c(
        "b-modal",
        {
          ref: "modal",
          staticClass: "bootstrap-modal bootstrap-modal-wide padding-40-20",
          attrs: {
            title: _vm.$t("dappsMaker.DAIConfirmation"),
            centered: "",
            "hide-footer": ""
          }
        },
        [
          _c("div", { staticClass: "modal-content-container" }, [
            _c("div", { staticClass: "tx-amount" }, [
              _c("div", [
                _c("div", { staticClass: "interface__block-title" }, [
                  _vm._v(
                    "\n            " +
                      _vm._s(_vm.$t("dappsMaker.collateral")) +
                      "\n          "
                  )
                ]),
                _c("div", { staticClass: "amount-block" }, [
                  _c("div", { staticClass: "icon" }, [
                    _c("img", {
                      attrs: {
                        src: __webpack_require__(/*! @/assets/images/currency/eth.svg */ "./src/assets/images/currency/eth.svg")
                      }
                    })
                  ]),
                  _c("div", { staticClass: "amount" }, [
                    _vm._v(_vm._s(_vm.collateral)),
                    _c("span", [_vm._v("ETH")])
                  ])
                ])
              ]),
              _c("div", { staticClass: "arrow" }, [
                _c("img", {
                  attrs: {
                    src: __webpack_require__(/*! @/assets/images/icons/right-arrow.svg */ "./src/assets/images/icons/right-arrow.svg")
                  }
                })
              ]),
              _c("div", [
                _c("div", { staticClass: "interface__block-title" }, [
                  _vm._v(
                    "\n            " +
                      _vm._s(_vm.$t("dappsMaker.generate")) +
                      "\n          "
                  )
                ]),
                _c("div", { staticClass: "amount-block" }, [
                  _c("div", { staticClass: "icon" }, [
                    _c("img", {
                      attrs: {
                        src: __webpack_require__(/*! @/assets/images/currency/coins/AllImages/DAI.svg */ "./src/assets/images/currency/coins/AllImages/DAI.svg")
                      }
                    })
                  ]),
                  _c("div", { staticClass: "amount" }, [
                    _vm._v(_vm._s(_vm.generate)),
                    _c("span", [_vm._v("DAI")])
                  ])
                ])
              ])
            ]),
            _c(
              "div",
              { staticClass: "detail-info" },
              [
                _c(
                  "expending-option",
                  { attrs: { title: _vm.$t("dappsMaker.details") } },
                  [
                    _c("ul", [
                      _c("li", [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.liquidPrice")) +
                              " (ETH/USD)"
                          )
                        ]),
                        _c("p", { staticClass: "bold" }, [
                          _vm._v(_vm._s(_vm.liquidationPrice) + " USD")
                        ])
                      ]),
                      _c("li", [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.currentPrice")) +
                              " (ETH/USD)"
                          )
                        ]),
                        _c("p", [_vm._v(_vm._s(_vm.currentPrice) + " USD")])
                      ]),
                      _c("li", [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.liquidationPenalty"))
                          )
                        ]),
                        _c("p", [_vm._v(_vm._s(_vm.liquidationPenalty) + "%")])
                      ]),
                      _c("li", [
                        _c("p", [
                          _vm._v(_vm._s(_vm.$t("dappsMaker.collateralRatio")))
                        ]),
                        _c("p", { staticClass: "bold" }, [
                          _vm._v(_vm._s(_vm.collatRatio) + " %")
                        ])
                      ]),
                      _c("li", [
                        _c("p", [
                          _vm._v(_vm._s(_vm.$t("dappsMaker.minimumRatio")))
                        ]),
                        _c("p", [_vm._v(_vm._s(_vm.minRatio) + "%")])
                      ])
                    ])
                  ]
                )
              ],
              1
            ),
            _c(
              "div",
              { staticClass: "button-container" },
              [
                _c("standard-button", {
                  attrs: { options: _vm.confirmButton },
                  nativeOn: {
                    click: function($event) {
                      return _vm.confirmClicked($event)
                    }
                  }
                })
              ],
              1
            )
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

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "container-maker" },
    [
      _c("dai-confirmation-modal", {
        ref: "daiconfirmation",
        attrs: {
          opencdp: _vm.openCdp,
          txinfo: _vm.txInfo,
          "liquidation-price": _vm.liquidationPrice,
          "collat-ratio": _vm.displayFixedPercent(_vm.collatRatio),
          "liquidation-penalty": _vm.displayPercentValue(
            _vm.liquidationPenalty
          ),
          "min-ratio": _vm.displayPercentValue(_vm.liquidationRatio),
          "current-price": _vm.displayFixedValue(_vm.ethPrice, 2),
          collateral: _vm.ethQty.toString(),
          generate: _vm.daiQty.toString()
        }
      }),
      _vm.loading
        ? _c("loading-overlay", {
            attrs: { loadingmessage: _vm.$t("dappsMaker.creatingMessage") }
          })
        : _vm._e(),
      _c("div", { staticClass: "manage-container" }, [
        _c("p", { staticClass: "top-title" }, [
          _vm._v(
            "\n      " + _vm._s(_vm.$t("dappsMaker.maker_title")) + "\n    "
          )
        ]),
        _c("p", { staticClass: "top-title-sub" }, [
          _vm._v(
            "\n      " + _vm._s(_vm.$t("dappsMaker.createInstruct")) + "\n    "
          )
        ]),
        _c("div", { staticClass: "currency-ops-new" }, [
          _c("div", { staticClass: "currency-picker-container" }, [
            _c("div", { staticClass: "interface__block-title" }, [
              _vm._v(
                "\n          " +
                  _vm._s(_vm.$t("dappsMaker.collateral")) +
                  "\n        "
              )
            ]),
            _vm._m(0),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.ethQty,
                  expression: "ethQty"
                }
              ],
              class: [
                !_vm.hasEnoughEth ? "red-border" : "",
                "currency-picker-container",
                "dropdown-text-container",
                "dropdown-container"
              ],
              domProps: { value: _vm.ethQty },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.ethQty = $event.target.value
                }
              }
            }),
            _c("div", { staticClass: "input-block-message" }, [
              !_vm.hasEnoughEth
                ? _c("p", { staticClass: "red-text" }, [
                    _vm._v("Not enough ETH")
                  ])
                : _vm._e(),
              _c("p", [
                _vm._v(
                  "\n            " +
                    _vm._s(_vm.$t("dappsMaker.minCollat")) +
                    "\n            "
                ),
                _c("b", [_vm._v(_vm._s(_vm.displayFixedValue(_vm.minEth, 6)))]),
                _vm._v(" ETH\n          ")
              ]),
              _c("p", [
                _vm._v(
                  _vm._s(_vm.displayFixedValue(_vm.depositInPeth, 6)) + " PETH"
                )
              ])
            ])
          ]),
          _c("div", { staticClass: "arrow" }, [
            _c("img", { attrs: { src: _vm.arrowImage } })
          ]),
          _c("div", [
            _c("div", { staticClass: "interface__block-title" }, [
              _vm._v(
                "\n          " +
                  _vm._s(_vm.$t("dappsMaker.generate")) +
                  "\n        "
              )
            ]),
            _vm._m(1),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.daiQty,
                  expression: "daiQty"
                }
              ],
              class: [
                _vm.veryRisky ? "red-border" : "",
                _vm.risky && !_vm.veryRisky ? "orange-border" : "",
                "currency-picker-container",
                "dropdown-text-container",
                "dropdown-container"
              ],
              domProps: { value: _vm.daiQty },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.daiQty = $event.target.value
                }
              }
            }),
            _c("div", { staticClass: "input-block-message" }, [
              _c("p", [
                _vm._v(
                  "\n            " +
                    _vm._s(_vm.$t("dappsMaker.maxGenerate")) +
                    "\n            "
                ),
                _c("b", [
                  _vm._v(_vm._s(_vm.displayFixedValue(_vm.maxDaiDraw, 6)))
                ]),
                _vm._v(" DAI\n          ")
              ])
            ])
          ])
        ]),
        _c("div", { staticClass: "cdp-info-block cdp-info-entry" }, [
          _c("ul", [
            _c("li", [
              _c("p", [_vm._v(_vm._s(_vm.$t("dappsMaker.minEthReq")))]),
              _c("p", [
                _vm._v(_vm._s(_vm.displayFixedValue(_vm.minEth, 6)) + " ETH")
              ])
            ]),
            _c("li", [
              _c("p", [_vm._v(_vm._s(_vm.$t("dappsMaker.liquidPrice")))]),
              _c("p", [
                _c("b", [_vm._v(_vm._s(_vm.liquidationPrice))]),
                _vm._v(" USD\n          ")
              ])
            ]),
            _c("li", [
              _c("p", [_vm._v(_vm._s(_vm.$t("dappsMaker.currentPriceInfo")))]),
              _c("p", [
                _vm._v(_vm._s(_vm.displayFixedValue(_vm.ethPrice, 2)) + " USD")
              ])
            ]),
            _c("li", [
              _c("p", [
                _vm._v(_vm._s(_vm.$t("dappsMaker.liquidationPenalty")))
              ]),
              _c("p", [
                _vm._v(
                  _vm._s(_vm.displayPercentValue(_vm.liquidationPenalty)) + "%"
                )
              ])
            ]),
            _c("li", [
              _c("p", [_vm._v(_vm._s(_vm.$t("dappsMaker.collateralRatio")))]),
              _c(
                "p",
                {
                  class: [
                    _vm.veryRisky ? "red-text" : "",
                    _vm.risky && !_vm.veryRisky ? "orange-text" : ""
                  ]
                },
                [
                  _c("b", [
                    _vm._v(
                      _vm._s(_vm.displayFixedPercent(_vm.collatRatio)) + "%"
                    )
                  ])
                ]
              )
            ]),
            _c("li", [
              _c("p", [_vm._v(_vm._s(_vm.$t("dappsMaker.minimumRatio")))]),
              _c("p", [
                _vm._v(
                  _vm._s(_vm.displayPercentValue(_vm.liquidationRatio)) + "%"
                )
              ])
            ])
          ])
        ]),
        _c("div", { staticClass: "cdp-info-block cdp-info-entry" }, [
          _c("ul", [
            _c("li", [
              _c("p", [
                _vm._v(
                  "\n            " +
                    _vm._s(
                      _vm.$t("dappsMaker.stabilityFeeInMkr", {
                        value: _vm
                          .displayFixedPercent(_vm.stabilityFee)
                          .toString()
                      })
                    ) +
                    "\n          "
                )
              ])
            ])
          ])
        ]),
        _c("div", { staticClass: "buttons-container" }, [
          _c(
            "div",
            {
              class: [
                _vm.validInputs ? "" : "disabled",
                "submit-button large-round-button-green-filled"
              ],
              on: { click: _vm.openDaiConfirmation }
            },
            [
              _vm._v(
                "\n        " +
                  _vm._s(_vm.$t("dappsMaker.collatAndGenerate")) +
                  "\n      "
              )
            ]
          )
        ])
      ])
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "dropdown-text-container dropdown-container" },
      [
        _c("p", [
          _c("span", { staticClass: "cc ETH cc-icon currency-symbol" }),
          _vm._v("\n            ETH\n            "),
          _c("span", { staticClass: "subname" }, [_vm._v("- Ethereum ")])
        ])
      ]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "dropdown-text-container dropdown-container" },
      [
        _c("p", [
          _c("span", {
            staticClass: "cc DAI cc-icon cc-icon-dai currency-symbol"
          }),
          _vm._v("\n            DAI\n            "),
          _c("span", { staticClass: "subname" }, [_vm._v("- Maker DAI ")])
        ])
      ]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".expending-option[data-v-64b82083] {\n  border-top: 2px solid #f9f9f9;\n  border-bottom: 2px solid #f9f9f9;\n  padding: 20px 0;\n}\n.expending-option.hide-bottom-border[data-v-64b82083] {\n    border-bottom: 0;\n}\n.title-bar-container[data-v-64b82083] {\n  position: relative;\n  padding: 0 10px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.title-bar-container .input-title[data-v-64b82083] {\n    font-weight: 600;\n    font-size: 16px;\n    line-height: initial;\n    margin-right: 8px;\n    color: #212529;\n}\n.title-bar-container .button-text[data-v-64b82083] {\n    font-weight: 400;\n    font-size: 16px;\n    position: absolute;\n    right: 75px;\n    top: 2px;\n    color: #05c0a5;\n}\n.title-bar-container .switch[data-v-64b82083] {\n    margin-left: auto;\n}\n.contnet-container[data-v-64b82083] {\n  max-height: 0;\n  overflow: hidden;\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.contnet-container.expanded[data-v-64b82083] {\n    max-height: 800px;\n}\n.contnet-container .content-block[data-v-64b82083] {\n    padding-top: 20px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".loading-overlay[data-v-035bcc0f] {\n  position: fixed;\n  z-index: 999999;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.729412);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.text[data-v-035bcc0f] {\n  color: white;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".tx-amount[data-v-768e5b9b] {\n  display: grid;\n  grid-template-columns: 1fr 100px 1fr;\n}\n@media all and (max-width: 700px) {\n.tx-amount[data-v-768e5b9b] {\n      display: block;\n}\n}\n.arrow[data-v-768e5b9b] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.arrow img[data-v-768e5b9b] {\n    margin-top: 30px;\n    height: 20px;\n}\n@media all and (max-width: 700px) {\n.arrow[data-v-768e5b9b] {\n      padding: 10px 0;\n}\n.arrow img[data-v-768e5b9b] {\n        -webkit-transform: rotate(90deg);\n                transform: rotate(90deg);\n}\n}\n.amount-block[data-v-768e5b9b] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #f2fafa;\n  padding: 20px;\n}\n.amount-block .amount[data-v-768e5b9b] {\n    font-size: 20px;\n    font-weight: 500;\n    color: #003945;\n}\n.amount-block .amount span[data-v-768e5b9b] {\n      color: #536d8b;\n      font-size: 20px;\n      margin-left: 10px;\n}\n.amount-block .icon[data-v-768e5b9b] {\n    margin-right: 15px;\n}\n.amount-block .icon img[data-v-768e5b9b] {\n      height: 26px;\n      width: 26px;\n}\n.detail-info[data-v-768e5b9b] {\n  margin-top: 30px;\n}\n.detail-info ul[data-v-768e5b9b] {\n    padding: 0 10px;\n}\n.detail-info ul li[data-v-768e5b9b] {\n      padding: 10px 0;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: start;\n          -ms-flex-align: start;\n              align-items: flex-start;\n}\n.detail-info ul li p[data-v-768e5b9b]:nth-child(2) {\n        margin-left: auto;\n        text-align: right;\n        min-width: 120px;\n}\n.detail-info ul li .bold[data-v-768e5b9b] {\n        font-weight: 600;\n}\n.button-container[data-v-768e5b9b] {\n  margin-top: 40px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  text-align: center;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".currency-picker-container[data-v-5dbdd13f] {\n  margin-bottom: 5px;\n  min-width: 150px;\n  position: relative;\n}\n.top-title[data-v-5dbdd13f] {\n  padding-left: 0;\n  padding-bottom: 0;\n  font-size: 20px;\n  line-height: 30px;\n}\n.top-title-sub[data-v-5dbdd13f] {\n  margin-bottom: 20px;\n  line-height: 17px;\n}\n.orange-border[data-v-5dbdd13f] {\n  border: orange 1px solid !important;\n}\n.orange-text[data-v-5dbdd13f] {\n  color: orange;\n}\n.red-border[data-v-5dbdd13f] {\n  border: red 1px solid !important;\n}\n.red-text[data-v-5dbdd13f] {\n  color: red;\n}\n.subname[data-v-5dbdd13f] {\n  color: #b2bfc9;\n}\n.dropdown-container[data-v-5dbdd13f] {\n  border-radius: 4px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: relative;\n}\n.dropdown-container .currency-symbol[data-v-5dbdd13f] {\n    width: 40px;\n    margin-right: 0;\n}\n.dropdown-container .currency-symbol.cc-icon-dai[data-v-5dbdd13f]::before {\n      background-color: #fff;\n      border-radius: 100%;\n}\n.dropdown-container p[data-v-5dbdd13f] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.dropdown-text-container[data-v-5dbdd13f], .dropdown-text-container-white[data-v-5dbdd13f] {\n  margin-bottom: 5px;\n  border: 1px solid #fff;\n  border-bottom: 0;\n  border-radius: 4px;\n  cursor: pointer;\n  padding: 13px 15px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  width: 100%;\n}\n.dropdown-text-container i[data-v-5dbdd13f], .dropdown-text-container-white i[data-v-5dbdd13f] {\n    position: absolute;\n    right: 20px;\n    top: 20px;\n}\n.dropdown-text-container p[data-v-5dbdd13f], .dropdown-text-container-white p[data-v-5dbdd13f] {\n    padding-right: 15px;\n}\n.dropdown-text-container[data-v-5dbdd13f] {\n  background-color: #f9f9f9;\n}\n.dropdown-text-container-white[data-v-5dbdd13f] {\n  background-color: #fff;\n}\n.cc-icon[data-v-5dbdd13f] {\n  font-size: 26px;\n}\n.container-maker[data-v-5dbdd13f] {\n  border-radius: 5px;\n  overflow: hidden;\n}\n.container-maker .manage-container[data-v-5dbdd13f] {\n    padding: 40px;\n}\n@media all and (max-width: 700px) {\n.container-maker .manage-container[data-v-5dbdd13f] {\n        padding: 20px;\n}\n}\n.container-maker .manage-container .currency-label[data-v-5dbdd13f] {\n      margin-bottom: 15px;\n}\n.container-maker .manage-container .cdp-info-block[data-v-5dbdd13f] {\n      padding-top: 20px;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-orient: vertical;\n      -webkit-box-direction: normal;\n          -ms-flex-direction: column;\n              flex-direction: column;\n}\n.container-maker .manage-container .cdp-info-entry[data-v-5dbdd13f] {\n      -webkit-box-pack: justify;\n          -ms-flex-pack: justify;\n              justify-content: space-between;\n      position: relative;\n      padding: 17px;\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      padding-left: 10px;\n      padding-right: 10px;\n}\n.container-maker .manage-container .cdp-info-entry[data-v-5dbdd13f]::before {\n        margin: auto;\n        -webkit-box-sizing: initial;\n                box-sizing: initial;\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        content: '';\n        width: 100%;\n        border-top: 1px solid #e0e0e0;\n}\n.container-maker .manage-container .cdp-info-entry > ul[data-v-5dbdd13f] {\n        display: block;\n        width: 100%;\n}\n.container-maker .manage-container .cdp-info-entry > ul > li[data-v-5dbdd13f] {\n          display: -webkit-box;\n          display: -ms-flexbox;\n          display: flex;\n          -webkit-box-align: center;\n              -ms-flex-align: center;\n                  align-items: center;\n          padding: 5px 0;\n}\n.container-maker .manage-container .cdp-info-entry > ul > li p[data-v-5dbdd13f]:nth-child(1) {\n            min-width: 100px;\n}\n.container-maker .manage-container .cdp-info-entry > ul > li p[data-v-5dbdd13f]:nth-child(2) {\n            margin-left: auto;\n            word-break: break-all;\n}\n.container-maker .manage-container .cdp-info-entry > ul > li p:nth-child(2) a[data-v-5dbdd13f] {\n              color: #5a78f0;\n}\n.container-maker .buttons-container[data-v-5dbdd13f] {\n    margin-top: 60px;\n    margin-bottom: 60px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -ms-flex-line-pack: justify;\n        align-content: space-between;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n@media all and (max-width: 414px) {\n.container-maker .buttons-container[data-v-5dbdd13f] {\n        margin-top: 30px;\n}\n}\n.container-maker .buttons-container button[data-v-5dbdd13f] {\n      margin: auto;\n      text-align: center;\n      border-radius: 5px;\n      cursor: pointer;\n      padding: 20px;\n      width: 260px;\n}\n@media all and (max-width: 414px) {\n.container-maker .buttons-container button[data-v-5dbdd13f] {\n          width: 100%;\n}\n}\n.container-maker .buttons-container .submit-btn[data-v-5dbdd13f] {\n      width: 260px;\n      height: 62px;\n      border-radius: 4px;\n      background-color: #05c0a5;\n      color: #fff;\n}\n.container-maker .buttons-container .cancel-btn[data-v-5dbdd13f] {\n      background-color: #fff;\n      width: 189px;\n      height: 62px;\n      border-radius: 4px;\n      border: solid 1px #506175;\n      color: #506175;\n}\n.currency-ops-new[data-v-5dbdd13f] {\n  display: grid;\n  grid-template-columns: 1fr 100px 1fr;\n  margin-bottom: 20px;\n}\n@media all and (max-width: 700px) {\n.currency-ops-new[data-v-5dbdd13f] {\n      display: block;\n}\n}\n.arrow[data-v-5dbdd13f] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n@media all and (max-width: 700px) {\n.arrow[data-v-5dbdd13f] {\n      margin: 30px 0;\n}\n}\n.arrow img[data-v-5dbdd13f] {\n    height: 20px;\n    margin-top: -10px;\n}\n@media all and (max-width: 700px) {\n.arrow img[data-v-5dbdd13f] {\n        -webkit-transform: rotate(90deg);\n                transform: rotate(90deg);\n}\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("dd13ded6", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("16761ccb", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("49a46c8a", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("0b49f983", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/assets/images/icons/right-arrow.svg":
/*!*************************************************!*\
  !*** ./src/assets/images/icons/right-arrow.svg ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/right-arrow.svg";

/***/ }),

/***/ "./src/components/ExpendingOption/ExpendingOption.vue":
/*!************************************************************!*\
  !*** ./src/components/ExpendingOption/ExpendingOption.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& */ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&");
/* harmony import */ var _ExpendingOption_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExpendingOption.vue?vue&type=script&lang=js& */ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& */ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ExpendingOption_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "64b82083",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('64b82083')) {
      api.createRecord('64b82083', component.options)
    } else {
      api.reload('64b82083', component.options)
    }
    module.hot.accept(/*! ./ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& */ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& */ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&");
(function () {
      api.rerender('64b82083', {
        render: _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/components/ExpendingOption/ExpendingOption.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&":
/*!**********************************************************************************************************************!*\
  !*** ./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=style&index=0&id=64b82083&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_style_index_0_id_64b82083_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ExpendingOption/ExpendingOption.vue?vue&type=template&id=64b82083&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExpendingOption_vue_vue_type_template_id_64b82083_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/ExpendingOption/index.js":
/*!*************************************************!*\
  !*** ./src/components/ExpendingOption/index.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ExpendingOption__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExpendingOption */ "./src/components/ExpendingOption/ExpendingOption.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _ExpendingOption__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/components/LoadingOverlay/LoadingOverlay.vue":
/*!**********************************************************!*\
  !*** ./src/components/LoadingOverlay/LoadingOverlay.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& */ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&");
/* harmony import */ var _LoadingOverlay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoadingOverlay.vue?vue&type=script&lang=js& */ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& */ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _LoadingOverlay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "035bcc0f",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('035bcc0f')) {
      api.createRecord('035bcc0f', component.options)
    } else {
      api.reload('035bcc0f', component.options)
    }
    module.hot.accept(/*! ./LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& */ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& */ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&");
(function () {
      api.rerender('035bcc0f', {
        render: _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/components/LoadingOverlay/LoadingOverlay.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&":
/*!********************************************************************************************************************!*\
  !*** ./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=style&index=0&id=035bcc0f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_style_index_0_id_035bcc0f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&":
/*!*****************************************************************************************************!*\
  !*** ./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/LoadingOverlay/LoadingOverlay.vue?vue&type=template&id=035bcc0f&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoadingOverlay_vue_vue_type_template_id_035bcc0f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/components/LoadingOverlay/index.js":
/*!************************************************!*\
  !*** ./src/components/LoadingOverlay/index.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LoadingOverlay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LoadingOverlay */ "./src/components/LoadingOverlay/LoadingOverlay.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _LoadingOverlay__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue":
/*!*************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&");
/* harmony import */ var _DaiConfirmationModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DaiConfirmationModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DaiConfirmationModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "768e5b9b",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('768e5b9b')) {
      api.createRecord('768e5b9b', component.options)
    } else {
      api.reload('768e5b9b', component.options)
    }
    module.hot.accept(/*! ./DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&");
(function () {
      api.rerender('768e5b9b', {
        render: _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=style&index=0&id=768e5b9b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_style_index_0_id_768e5b9b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&":
/*!********************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& ***!
  \********************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue?vue&type=template&id=768e5b9b&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DaiConfirmationModal_vue_vue_type_template_id_768e5b9b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/DaiConfirmationModal/index.js":
/*!*********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DaiConfirmationModal/index.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DaiConfirmationModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DaiConfirmationModal */ "./src/dapps/MakerDai/components/DaiConfirmationModal/DaiConfirmationModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _DaiConfirmationModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue":
/*!***************************************************************!*\
  !*** ./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&");
/* harmony import */ var _CreateCDP_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateCDP.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CreateCDP_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "5dbdd13f",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('5dbdd13f')) {
      api.createRecord('5dbdd13f', component.options)
    } else {
      api.reload('5dbdd13f', component.options)
    }
    module.hot.accept(/*! ./CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&");
(function () {
      api.rerender('5dbdd13f', {
        render: _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&":
/*!*************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=style&index=0&id=5dbdd13f&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_style_index_0_id_5dbdd13f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&":
/*!**********************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& ***!
  \**********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue?vue&type=template&id=5dbdd13f&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateCDP_vue_vue_type_template_id_5dbdd13f_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/containers/CreateCDP/index.js":
/*!**********************************************************!*\
  !*** ./src/dapps/MakerDai/containers/CreateCDP/index.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreateCDP__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateCDP */ "./src/dapps/MakerDai/containers/CreateCDP/CreateCDP.vue");

/* harmony default export */ __webpack_exports__["default"] = (_CreateCDP__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/dapps/MakerDai/helpers.js":
/*!***************************************!*\
  !*** ./src/dapps/MakerDai/helpers.js ***!
  \***************************************/
/*! exports provided: displayPercentValue, displayFixedValue, displayFixedPercent, maxDai, maxPethDraw, maxEthDraw, calcCollatRatio, calcLiquidationPrice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayPercentValue", function() { return displayPercentValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayFixedValue", function() { return displayFixedValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayFixedPercent", function() { return displayFixedPercent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxDai", function() { return maxDai; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxPethDraw", function() { return maxPethDraw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxEthDraw", function() { return maxEthDraw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calcCollatRatio", function() { return calcCollatRatio; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calcLiquidationPrice", function() { return calcLiquidationPrice; });
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bignumber_js__WEBPACK_IMPORTED_MODULE_1__);



var toBigNumber = function toBigNumber(num) {
  return new bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a(num);
};

var bnOver = function bnOver(one, two, three) {
  return toBigNumber(one).times(toBigNumber(two)).div(toBigNumber(three));
};

function displayPercentValue(raw) {
  if (!bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a.isBigNumber(raw)) raw = new bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a(raw);
  return raw.times(100).toString();
}
function displayFixedValue(raw) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a.isBigNumber(raw)) raw = new bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a(raw);
  if (!isFinite(raw) || isNaN(raw)) return '--';
  if (round) return raw.toFixed(decimals, bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a.ROUND_DOWN).toString();
  return raw.toFixed(decimals).toString();
}
function displayFixedPercent(raw) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var value = displayFixedValue(displayPercentValue(raw), decimals, round);

  if (isFinite(value) && new bignumber_js__WEBPACK_IMPORTED_MODULE_1___default.a(value).gt(0)) {
    return value;
  }

  return '--';
} // Calculations

function maxDai(ethPrice, ethCollateral, liquidationRatio, debtValue) {
  return bnOver(toBigNumber(ethPrice), toBigNumber(ethCollateral), toBigNumber(liquidationRatio)).minus(toBigNumber(debtValue));
}
function maxPethDraw(pethCollateral, liquidationRatio, debtValue, pethPrice) {
  var pethMin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return toBigNumber(pethCollateral).minus(bnOver(toBigNumber(liquidationRatio).plus(0.001), toBigNumber(debtValue), toBigNumber(pethPrice))).minus(toBigNumber(pethMin).times(1.0));
}
function maxEthDraw(ethCollateral, liquidationRatio, debtValue, ethPrice) {
  var minEth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return toBigNumber(ethCollateral).minus(bnOver(toBigNumber(liquidationRatio), toBigNumber(debtValue), toBigNumber(ethPrice))).minus(toBigNumber(minEth).times(1.0));
}
function calcCollatRatio(ethQty, daiQty, ethPrice) {
  return bnOver(toBigNumber(ethPrice), ethQty, daiQty);
}
function calcLiquidationPrice(ethQty, daiQty, ethPrice, liquidationRatio) {
  var getInt = parseInt(ethPrice);

  for (var i = getInt; i > 0; i--) {
    var atValue = bnOver(i, ethQty, daiQty).lte(toBigNumber(liquidationRatio));

    if (atValue) {
      return i;
    }
  }

  for (var _i = 100; _i > 0; _i--) {
    var _atValue = bnOver(_i / 100, ethQty, daiQty).lte(toBigNumber(liquidationRatio));

    if (_atValue) {
      return _i / 100;
    }
  }

  return 0;
}

/***/ })

}]);
//# sourceMappingURL=23.js.map