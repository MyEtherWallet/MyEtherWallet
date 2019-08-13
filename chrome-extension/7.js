((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[7],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      checkboxChecked: false
    };
  },
  methods: {
    checkBoxClicked: function checkBoxClicked() {
      this.checkboxChecked = !this.checkboxChecked;
      this.$emit('changeStatus', this.checkboxChecked);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.find */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _components_SwapWidget__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/components/SwapWidget */ "./src/components/SwapWidget/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__);









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  return new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(num);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'swap-widget': _components_SwapWidget__WEBPACK_IMPORTED_MODULE_11__["default"],
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__["default"],
    'standard-button': _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_9__["default"]
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
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
          cdpId: ''
        };
      }
    },
    makerManager: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      closable: false,
      modalDetailInformation: false,
      textValues: {},
      mkrToken: {},
      daiToken: {},
      approveMkrButton: {
        title: 'Approve Maker',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      approveDaiButton: {
        title: 'Approve Dai',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        fullWidth: true,
        noMinWidth: true
      },
      closeButton: {
        title: 'Close',
        buttonStyle: 'green',
        fullWidth: true,
        noMinWidth: true
      },
      suppliedFrom: {
        symbol: 'ETH',
        name: 'Ethereum'
      },
      suppliedTo: {
        symbol: 'MKR',
        name: 'Maker'
      },
      suppliedToAmount: 0,
      destAddress: ''
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_8__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    getfeeOwed: function getfeeOwed() {
      var result = this.values.governanceFeeOwed;
      return this.displayFixedValue(result, 8);
    },
    newCollateralRatio: function newCollateralRatio() {
      if (this.values) {
        return this.values.collatRatio;
      }

      return 0;
    },
    newCollateralRatioSafe: function newCollateralRatioSafe() {
      if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }

      return true;
    },
    newLiquidationPrice: function newLiquidationPrice() {
      if (this.values) {
        return this.values.liquidationPrice;
      }

      return 0;
    },
    mkrBalance: function mkrBalance() {
      if (this.mkrToken) {
        return this.mkrToken.balance;
      }

      return 0;
    },
    daiBalance: function daiBalance() {
      if (this.daiToken) {
        return this.daiToken.balance;
      }

      return 0;
    },
    enoughMkr: function enoughMkr() {
      var mkrNeeded = this.values.governanceFeeOwed;

      if (mkrNeeded) {
        return toBigNumber(this.mkrBalance).minus(mkrNeeded).gte(0);
      }

      return false;
    },
    enoughDai: function enoughDai() {
      if (this.values.zeroDebt) return true;
      var daiNeeded = this.values.debtValue;

      if (daiNeeded) {
        return toBigNumber(this.daiBalance).minus(daiNeeded).gte(0);
      }

      return false;
    },
    needsDaiApprove: function needsDaiApprove() {
      if (toBigNumber(this.values.proxyAllowanceDai).gt(0)) {
        if (toBigNumber(this.values.proxyAllowanceDai).lte(this.values.debtValue)) {
          return true;
        }
      }

      return toBigNumber(this.values.proxyAllowanceDai).eq(0);
    },
    needsMkrApprove: function needsMkrApprove() {
      if (toBigNumber(this.values.proxyAllowanceMkr).gt(0)) {
        if (toBigNumber(this.values.proxyAllowanceMkr).lt(this.values.governanceFeeOwed)) {
          return true;
        }
      }

      return toBigNumber(this.values.proxyAllowanceMkr).eq(0);
    },
    canClose: function canClose() {
      return this.enoughMkr && this.enoughDai && !this.needsDaiApprove && !this.needsMkrApprove;
    }
  }),
  watch: {
    tokensWithBalance: function tokensWithBalance() {
      this.getBalances();
    }
  },
  mounted: function () {
    var _mounted = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__["default"])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.destAddress = this.account.address;
              this.getBalances();
              this.$refs.modal.$on('shown',
              /*#__PURE__*/
              Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__["default"])(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _this.getBalances();

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function mounted() {
      return _mounted.apply(this, arguments);
    }

    return mounted;
  }(),
  methods: {
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal: function delayCloseModal() {
      var _this2 = this;

      setTimeout(function () {
        _this2.closeModal();
      }, 200);
    },
    closeCdp: function () {
      var _closeCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.delayCloseModal();
                this.$emit('closeCdp');

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function closeCdp() {
        return _closeCdp.apply(this, arguments);
      }

      return closeCdp;
    }(),
    displayPercentValue: function displayPercentValue(raw) {
      if (!bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a.isBigNumber(raw)) raw = new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(raw);
      return raw.times(100).toString();
    },
    displayFixedValue: function displayFixedValue(raw) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      if (!bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a.isBigNumber(raw)) raw = new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(raw);
      return raw.toFixed(decimals, bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a.ROUND_DOWN).toString();
    },
    maxDai: function maxDai() {
      this.amount = this.values.maxDai;
    },
    currentDai: function currentDai() {
      this.amount = this.values.debtValue;
    },
    getBalances: function getBalances() {
      this.mkrToken = this.tokensWithBalance.find(function (item) {
        return item.symbol === 'MKR';
      });
      this.daiToken = this.tokensWithBalance.find(function (item) {
        return item.symbol === 'DAI';
      });
    },
    getMkr: function getMkr() {
      var _this3 = this;

      var mkrNeeded = this.getfeeOwed;

      if (toBigNumber(this.mkrBalance).lt(mkrNeeded)) {
        this.suppliedToAmount = toBigNumber(mkrNeeded).minus(toBigNumber(this.mkrBalance)).plus(toBigNumber(mkrNeeded).times(0.01)).toNumber();

        if (toBigNumber(this.suppliedToAmount).lt(0.000001)) {
          this.suppliedToAmount = 0.000001;
        }

        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'MKR',
          name: 'Maker'
        };
        this.$nextTick(function () {
          _this3.$refs.swapWidget.$refs.modal.show();
        });
      }
    },
    getDai: function getDai() {
      var _this4 = this;

      var daiNeeded = this.values.debtValue;

      if (toBigNumber(this.daiBalance).lt(daiNeeded)) {
        this.suppliedToAmount = toBigNumber(daiNeeded).minus(toBigNumber(this.daiBalance)).toNumber();

        if (toBigNumber(this.suppliedToAmount).lt(0.000001)) {
          this.suppliedToAmount = 0.000001;
        }

        this.suppliedFrom = {
          symbol: 'ETH',
          name: 'Ethereum'
        };
        this.suppliedTo = {
          symbol: 'DAI',
          name: 'Dai'
        };
        this.$nextTick(function () {
          _this4.$refs.swapWidget.$refs.modal.show();
        });
      }
    },
    approveDai: function () {
      var _approveDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.$emit('approveDai');

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function approveDai() {
        return _approveDai.apply(this, arguments);
      }

      return approveDai;
    }(),
    approveMkr: function () {
      var _approveMkr = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_5__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.$emit('approveMkr');

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function approveMkr() {
        return _approveMkr.apply(this, arguments);
      }

      return approveMkr;
    }()
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../CheckBox */ "./src/dapps/MakerDai/components/CheckBox/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");








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






/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'check-box': _CheckBox__WEBPACK_IMPORTED_MODULE_10__["default"],
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__["default"],
    'standard-button': _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    action: {
      type: String,
      default: ''
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
          cdpId: ''
        };
      }
    },
    destAddressHasProxy: {
      type: Boolean,
      default: false
    },
    destAddressProxy: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {
      address: '',
      amountEth: 0,
      amountDai: 0,
      govFee: 0,
      modalDetailInformation: false,
      checkBoxChecked: false,
      textValues: {},
      mkrToken: {},
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      }
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_7__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    btnActive: function btnActive() {
      return _helpers__WEBPACK_IMPORTED_MODULE_12__["Misc"].isValidETHAddress(this.address) && this.checkBoxChecked;
    }
  }),
  watch: {
    address: function address(newVal) {
      if (_helpers__WEBPACK_IMPORTED_MODULE_12__["Misc"].isValidETHAddress(newVal)) {
        this.$emit('checkForProxy', newVal);
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$refs.modal.$on('shown', function () {
      _this.address = '';
    });
  },
  methods: {
    closeCdp: function closeCdp() {
      this.activeCdp.closeCdp();
    },
    checkBoxClicked: function checkBoxClicked() {
      this.checkBoxChecked = !this.checkBoxChecked;
    },
    displayPercentValue: function displayPercentValue(raw) {
      if (!bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a.isBigNumber(raw)) raw = new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a(raw);
      return raw.times(100).toString();
    },
    displayFixedValue: function displayFixedValue(raw) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      if (!bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a.isBigNumber(raw)) raw = new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a(raw);
      return raw.toFixed(decimals, bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a.ROUND_DOWN).toString();
    },
    moveCdp: function () {
      var _moveCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_helpers__WEBPACK_IMPORTED_MODULE_12__["Misc"].isValidETHAddress(this.address)) {
                  this.$emit('moveCdp', this.address);
                  this.closeModal();
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function moveCdp() {
        return _moveCdp.apply(this, arguments);
      }

      return moveCdp;
    }(),
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "check-box" }, [
    _c(
      "label",
      { staticClass: "check-box-container" },
      [
        _c("input", {
          attrs: { type: "checkbox" },
          on: { click: _vm.checkBoxClicked }
        }),
        _c("span", { staticClass: "checkmark" }),
        _vm._t("terms")
      ],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
          staticClass: "bootstrap-modal nopadding",
          attrs: {
            title: _vm.$t("dappsMaker.closeTitle"),
            centered: "",
            "hide-footer": ""
          }
        },
        [
          _c("swap-widget", {
            ref: "swapWidget",
            attrs: {
              "supplied-from": _vm.suppliedFrom,
              "supplied-to": _vm.suppliedTo,
              "supplied-to-amount": _vm.suppliedToAmount,
              "dest-address": _vm.account.address
            }
          }),
          _c(
            "div",
            { staticClass: "contents" },
            [
              !_vm.enoughMkr
                ? _c("div", { staticClass: "message-container" }, [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm.$t("dappsMaker.notEnoughMkrClose")) +
                        "\n      "
                    )
                  ])
                : _vm._e(),
              !_vm.enoughDai
                ? _c("div", { staticClass: "message-container" }, [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm.$t("dappsMaker.notEnoughDaiClose")) +
                        "\n      "
                    )
                  ])
                : _vm._e(),
              _c("p", { staticClass: "top-text" }, [
                _vm._v(
                  "\n        " +
                    _vm._s(_vm.$t("dappsMaker.closingNotice")) +
                    "\n      "
                )
              ]),
              _c("div", { staticClass: "value-table-container" }, [
                _c("div", { staticClass: "value-table mkr-balance" }, [
                  _c("div", { staticClass: "value-block" }, [
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.$t("dappsMaker.mkrBalance")))])
                    ]),
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.mkrBalance) + " MKR")])
                    ])
                  ]),
                  _c(
                    "p",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: !_vm.enoughMkr,
                          expression: "!enoughMkr"
                        }
                      ],
                      staticClass: "get-mkr",
                      on: {
                        click: function($event) {
                          return _vm.getMkr()
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n            " +
                          _vm._s(_vm.$t("dappsMaker.getMkr")) +
                          "\n          "
                      )
                    ]
                  )
                ]),
                _c("div", { staticClass: "value-table mkr-balance" }, [
                  _c("div", { staticClass: "value-block" }, [
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.$t("dappsMaker.daiBalance")))])
                    ]),
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.daiBalance) + " DAI")])
                    ])
                  ]),
                  _c(
                    "p",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: !_vm.enoughDai,
                          expression: "!enoughDai"
                        }
                      ],
                      staticClass: "get-mkr",
                      on: {
                        click: function($event) {
                          return _vm.getDai()
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n            " +
                          _vm._s(_vm.$t("dappsMaker.getDai")) +
                          "\n          "
                      )
                    ]
                  )
                ]),
                _c("div", { staticClass: "value-table other-values" }, [
                  _c("div", { staticClass: "value-block" }, [
                    _c("p", [
                      _vm._v(_vm._s(_vm.$t("dappsMaker.outstandingDai")))
                    ]),
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.values.debtValue) + " DAI")])
                    ])
                  ]),
                  _c("div", { staticClass: "value-block" }, [
                    _c("p", [
                      _vm._v(
                        "\n              " +
                          _vm._s(
                            _vm.$t("dappsMaker.stabilityFeeInMkr", {
                              value: _vm.displayFixedValue(
                                _vm.displayPercentValue(_vm.values.stabilityFee)
                              )
                            })
                          ) +
                          "\n            "
                      )
                    ]),
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.getfeeOwed) + " MKR")])
                    ])
                  ])
                ])
              ]),
              _c("div", { staticClass: "buttons" }, [
                _vm.needsDaiApprove
                  ? _c(
                      "div",
                      [
                        _c("standard-button", {
                          attrs: { options: _vm.approveDaiButton },
                          nativeOn: {
                            click: function($event) {
                              return _vm.approveDai($event)
                            }
                          }
                        })
                      ],
                      1
                    )
                  : _vm._e(),
                _vm.needsMkrApprove
                  ? _c(
                      "div",
                      [
                        _c("standard-button", {
                          attrs: { options: _vm.approveMkrButton },
                          nativeOn: {
                            click: function($event) {
                              return _vm.approveMkr($event)
                            }
                          }
                        })
                      ],
                      1
                    )
                  : _vm._e()
              ]),
              _c(
                "div",
                { staticClass: "buttons" },
                [
                  _c("standard-button", {
                    attrs: { options: _vm.cancelButton },
                    nativeOn: {
                      click: function($event) {
                        return _vm.closeModal($event)
                      }
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.closeButton,
                      "button-disabled": _vm.canClose ? false : true,
                      "click-function": _vm.closeCdp
                    }
                  })
                ],
                1
              ),
              _c("help-center-button")
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
          staticClass: "bootstrap-modal nopadding",
          attrs: {
            title: _vm.$t("dappsMaker.moveTitle"),
            "hide-footer": "",
            centered: ""
          }
        },
        [
          _c(
            "div",
            { staticClass: "modal-content" },
            [
              _c("p", { staticClass: "top-text" }, [
                _vm._v(
                  "\n        " +
                    _vm._s(_vm.$t("dappsMaker.moveNotice")) +
                    "\n      "
                )
              ]),
              _c("check-box", {
                on: { changeStatus: _vm.checkBoxClicked },
                scopedSlots: _vm._u([
                  {
                    key: "terms",
                    fn: function() {
                      return [
                        _c("p", { staticClass: "checkbox-label" }, [
                          _vm._v(
                            "\n            " +
                              _vm._s(_vm.$t("dappsMaker.understandAndAgree")) +
                              "\n          "
                          )
                        ])
                      ]
                    },
                    proxy: true
                  }
                ])
              }),
              _c("div", { staticClass: "input-container" }, [
                _c("label", [
                  _vm._v(_vm._s(_vm.$t("dappsMaker.moveQuestion")))
                ]),
                _c("div", { staticClass: "input-box" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.address,
                        expression: "address"
                      }
                    ],
                    domProps: { value: _vm.address },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.address = $event.target.value
                      }
                    }
                  })
                ])
              ]),
              _c("div", [
                _vm.destAddressHasProxy
                  ? _c("div", [
                      _c("p", [
                        _vm._v(
                          "\n            " +
                            _vm._s(
                              _vm.$t("dappsMaker.proxyAddress", {
                                value: _vm.destAddressProxy
                              })
                            ) +
                            "\n          "
                        )
                      ]),
                      _vm._v(
                        "\n          " +
                          _vm._s(_vm.$t("dappsMaker.moveWithProxy")) +
                          "\n        "
                      )
                    ])
                  : _vm._e(),
                !_vm.destAddressHasProxy
                  ? _c("div", [
                      _vm._v(
                        "\n          " +
                          _vm._s(_vm.$t("dappsMaker.moveWithoutProxy")) +
                          "\n        "
                      )
                    ])
                  : _vm._e()
              ]),
              _c(
                "div",
                { staticClass: "buttons" },
                [
                  _c("standard-button", {
                    attrs: { options: _vm.cancelButton },
                    nativeOn: {
                      click: function($event) {
                        return _vm.closeModal($event)
                      }
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.submitButton,
                      "button-disabled": _vm.btnActive ? false : true,
                      "click-function": _vm.moveCdp
                    }
                  })
                ],
                1
              ),
              _c("help-center-button")
            ],
            1
          )
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "a[data-v-73bde5fb] {\n  text-decoration: underline;\n}\n.check-box[data-v-73bde5fb] {\n  position: relative;\n}\n\n/* Customize the label (the container) */\n.check-box-container[data-v-73bde5fb] {\n  display: block;\n  position: relative;\n  padding-left: 35px;\n  margin-bottom: 10px;\n  cursor: pointer;\n  font-size: 22px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  line-height: 21px;\n}\n\n/* Hide the browser's default checkbox */\n.check-box-container input[data-v-73bde5fb] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n/* Create a custom checkbox */\n.checkmark[data-v-73bde5fb] {\n  position: absolute;\n  top: -2px;\n  left: 0;\n  height: 25px;\n  width: 25px;\n  background-color: #fff;\n  border-radius: 7px;\n  border: 1px solid #05c0a5;\n}\n\n/* On mouse-over, add a grey background color */\n.check-box-container:hover input ~ .checkmark[data-v-73bde5fb] {\n  background-color: #ccc;\n}\n\n/* When the checkbox is checked, add a blue background */\n.check-box-container input:checked ~ .checkmark[data-v-73bde5fb] {\n  background-color: #05c0a5;\n}\n\n/* Create the checkmark/indicator (hidden when not checked) */\n.checkmark[data-v-73bde5fb]::after {\n  content: '';\n  position: absolute;\n  display: none;\n}\n\n/* Show the checkmark when checked */\n.check-box-container input:checked ~ .checkmark[data-v-73bde5fb]::after {\n  display: block;\n}\n\n/* Style the checkmark/indicator */\n.check-box-container .checkmark[data-v-73bde5fb]::after {\n  left: 9px;\n  top: 6px;\n  width: 5px;\n  height: 10px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".contents[data-v-7d930a89] {\n  padding: 30px;\n}\n.message-container[data-v-7d930a89] {\n  border: 1px solid #ff122f;\n  background-color: #f9d6da;\n  color: #ff122f;\n  font-weight: 600;\n  text-align: center;\n  padding: 20px 5px;\n  border-radius: 4px;\n  margin-bottom: 20px;\n}\n.top-text[data-v-7d930a89] {\n  margin-bottom: 10px;\n}\n.value-table-container[data-v-7d930a89] {\n  margin-bottom: 20px;\n}\n.value-table[data-v-7d930a89] {\n  border-bottom: 1px solid #f0f0f0;\n  padding: 15px 10px;\n}\n.value-table .value-block[data-v-7d930a89] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.value-table .value-block p[data-v-7d930a89] {\n      line-height: 30px;\n}\n.value-table .value-block p b[data-v-7d930a89] {\n        font-weight: 600;\n        font-size: inherit;\n        color: #0b2840;\n        line-height: inherit;\n}\n.value-table .value-block p[data-v-7d930a89]:last-child {\n      margin-left: auto;\n      text-align: right;\n      min-width: 100px;\n}\n.other-values .value-block p[data-v-7d930a89] {\n  line-height: 18px;\n  margin-bottom: 13px;\n}\n.other-values .value-block p[data-v-7d930a89]:last-child {\n    margin-bottom: 0;\n}\n.mkr-balance .value-block p[data-v-7d930a89] {\n  font-size: 16px;\n  color: #0b2840;\n  line-height: 16px;\n}\n.mkr-balance .get-mkr[data-v-7d930a89] {\n  cursor: pointer;\n  color: #05c0a5;\n  font-size: 14px;\n}\n.buttons[data-v-7d930a89] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin-bottom: 20px;\n}\n.buttons > *[data-v-7d930a89] {\n    width: 100%;\n}\n.buttons > *[data-v-7d930a89]:first-child {\n      margin-right: 10px;\n}\n.cc-icon[data-v-7d930a89] {\n  font-size: 36px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".modal-content[data-v-0ecf1402] {\n  padding: 30px;\n}\n.cc-icon[data-v-0ecf1402] {\n  font-size: 36px;\n}\n.top-text[data-v-0ecf1402] {\n  margin-bottom: 10px;\n}\n.input-container[data-v-0ecf1402] {\n  margin-bottom: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.input-container label[data-v-0ecf1402] {\n    color: #0b2840;\n    font-size: 16px;\n    font-weight: 600;\n    padding: 10px 7px;\n}\n.input-container label i[data-v-0ecf1402] {\n      font-size: 14px;\n      margin-right: 2px;\n}\n.input-container label .input-title[data-v-0ecf1402] {\n      font-size: 16px;\n}\n.input-container .input-box[data-v-0ecf1402] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -webkit-box-align: baseline;\n        -ms-flex-align: baseline;\n            align-items: baseline;\n}\n.input-container .input-box.danger[data-v-0ecf1402] {\n      border: 1px solid red;\n}\n.input-container .input-box input[data-v-0ecf1402] {\n      background-color: #f9f9f9;\n      border: 0;\n      font-size: 14px;\n      padding: 20px;\n      width: 100%;\n}\n.input-container .input-box .input-unit[data-v-0ecf1402] {\n      background-color: #f9f9f9;\n      border: 0;\n      font-size: 14px;\n      height: 52px;\n      padding: 17px 22px 20px;\n      width: 10%;\n      color: #999;\n      font-weight: 600;\n}\n.sub-text[data-v-0ecf1402] {\n  padding-bottom: 10px;\n}\n.sub-text .btn[data-v-0ecf1402] {\n    color: #05c0a5;\n}\n.sub-text .btn[data-v-0ecf1402]:hover {\n      cursor: pointer;\n}\n.detail-container[data-v-0ecf1402] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  border-bottom: 2px solid #eaeaea;\n}\n.detail-container .input-container[data-v-0ecf1402] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-bottom: 20px;\n}\n.detail-info[data-v-0ecf1402] {\n  border-bottom: 2px solid #f2f4fa;\n  border-top: 2px solid #f2f4fa;\n  padding: 20px 10px;\n}\n.detail-info .info[data-v-0ecf1402] {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    color: #0c5876;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.detail-info .info .sliding-switch-white[data-v-0ecf1402] {\n      margin-left: auto;\n}\n.detail-info .expended-info[data-v-0ecf1402] {\n    max-height: 0;\n    -webkit-transition: max-height 0.3s ease;\n    transition: max-height 0.3s ease;\n    overflow: hidden;\n}\n.detail-info .expended-info.expended-info-open[data-v-0ecf1402] {\n      max-height: 600px;\n}\n.detail-info .expended-info .padding-container[data-v-0ecf1402] {\n      padding-top: 10px;\n}\n.detail-info .expended-info .grid-block[data-v-0ecf1402] {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      padding: 16px 0;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block[data-v-0ecf1402] {\n          display: block;\n          padding: 16px 0 0 0;\n}\n}\n.detail-info .expended-info .grid-block p[data-v-0ecf1402]:nth-child(even) {\n        max-width: 295px;\n        text-align: right;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block p[data-v-0ecf1402]:nth-child(even) {\n            max-width: initial;\n            text-align: left;\n}\n}\n.buttons[data-v-0ecf1402] {\n  margin-bottom: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n.buttons > *[data-v-0ecf1402] {\n    width: 100%;\n}\n.buttons > *[data-v-0ecf1402]:first-child {\n      margin-right: 10px;\n}\n.time-remaining[data-v-0ecf1402] {\n  text-align: center;\n}\n.time-remaining h1[data-v-0ecf1402] {\n    font-weight: 500;\n    font-size: 50px;\n    color: #ff2f49;\n    margin: 0;\n}\n.value[data-v-0ecf1402] {\n  font-size: 20px;\n  font-weight: 500;\n  margin-bottom: 13px;\n  margin-top: 13px;\n}\n.value span[data-v-0ecf1402] {\n    font-size: 20px;\n    font-weight: 500;\n}\n.block-title[data-v-0ecf1402] {\n  font-size: 15px;\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.address[data-v-0ecf1402] {\n  line-height: 19px;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -ms-word-break: break-all;\n  word-break: break-all;\n  word-break: break-word;\n  -ms-hyphens: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n}\n.swap-detail[data-v-0ecf1402] {\n  display: grid;\n  grid-template-columns: 1fr 80px 1fr;\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.from-address[data-v-0ecf1402],\n.to-address[data-v-0ecf1402] {\n  background-color: #f9f9f9;\n  padding: 20px;\n  border-radius: 5px;\n}\n.right-arrow[data-v-0ecf1402] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n}\n.confirm-send-button[data-v-0ecf1402] {\n  margin-top: 40px;\n  margin-bottom: 20px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.confirm-send-button > li[data-v-0ecf1402] {\n    margin: 0 auto;\n}\n.confirm-send-button > li .provider-address-details[data-v-0ecf1402] {\n      text-align: center;\n      margin-right: 15px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("3d1c7e4a", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("5927b730", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("5b90031f", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue":
/*!*************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CheckBox/CheckBox.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&");
/* harmony import */ var _CheckBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CheckBox.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CheckBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "73bde5fb",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('73bde5fb')) {
      api.createRecord('73bde5fb', component.options)
    } else {
      api.reload('73bde5fb', component.options)
    }
    module.hot.accept(/*! ./CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&");
(function () {
      api.rerender('73bde5fb', {
        render: _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/CheckBox/CheckBox.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&":
/*!***********************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=style&index=0&id=73bde5fb&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_style_index_0_id_73bde5fb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&":
/*!********************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& ***!
  \********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CheckBox/CheckBox.vue?vue&type=template&id=73bde5fb&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CheckBox_vue_vue_type_template_id_73bde5fb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/CheckBox/index.js":
/*!*********************************************************!*\
  !*** ./src/dapps/MakerDai/components/CheckBox/index.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CheckBox */ "./src/dapps/MakerDai/components/CheckBox/CheckBox.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _CheckBox__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue":
/*!***********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&");
/* harmony import */ var _CloseCdpModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CloseCdpModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CloseCdpModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7d930a89",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('7d930a89')) {
      api.createRecord('7d930a89', component.options)
    } else {
      api.reload('7d930a89', component.options)
    }
    module.hot.accept(/*! ./CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&");
(function () {
      api.rerender('7d930a89', {
        render: _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=style&index=0&id=7d930a89&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_style_index_0_id_7d930a89_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&":
/*!******************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& ***!
  \******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue?vue&type=template&id=7d930a89&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseCdpModal_vue_vue_type_template_id_7d930a89_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/CloseCdpModal/index.js":
/*!**************************************************************!*\
  !*** ./src/dapps/MakerDai/components/CloseCdpModal/index.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CloseCdpModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CloseCdpModal */ "./src/dapps/MakerDai/components/CloseCdpModal/CloseCdpModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _CloseCdpModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue":
/*!****************************************************************!*\
  !*** ./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&");
/* harmony import */ var _MoveCdp_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MoveCdp.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _MoveCdp_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "0ecf1402",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('0ecf1402')) {
      api.createRecord('0ecf1402', component.options)
    } else {
      api.reload('0ecf1402', component.options)
    }
    module.hot.accept(/*! ./MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&");
(function () {
      api.rerender('0ecf1402', {
        render: _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&":
/*!**************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=style&index=0&id=0ecf1402&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_style_index_0_id_0ecf1402_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&":
/*!***********************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue?vue&type=template&id=0ecf1402&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoveCdp_vue_vue_type_template_id_0ecf1402_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/MoveCdpModal/index.js":
/*!*************************************************************!*\
  !*** ./src/dapps/MakerDai/components/MoveCdpModal/index.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MoveCdp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MoveCdp */ "./src/dapps/MakerDai/components/MoveCdpModal/MoveCdp.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _MoveCdp__WEBPACK_IMPORTED_MODULE_0__["default"]; });



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
//# sourceMappingURL=7.js.map