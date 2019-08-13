((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[18],{

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

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/toConsumableArray.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es7.array.includes */ "./node_modules/core-js/modules/es7.array.includes.js");
/* harmony import */ var core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_array_includes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.string.includes */ "./node_modules/core-js/modules/es6.string.includes.js");
/* harmony import */ var core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_includes__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es6.function.name */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _layouts_InterfaceLayout_components_BackButton__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/layouts/InterfaceLayout/components/BackButton */ "./src/layouts/InterfaceLayout/components/BackButton/index.js");
/* harmony import */ var _layouts_InterfaceLayout_components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/layouts/InterfaceLayout/components/InterfaceContainerTitle */ "./src/layouts/InterfaceLayout/components/InterfaceContainerTitle/index.js");
/* harmony import */ var _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/components/InterfaceBottomText */ "./src/components/InterfaceBottomText/index.js");
/* harmony import */ var _components_Blockie__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/components/Blockie */ "./src/components/Blockie/index.js");
/* harmony import */ var _components_CloseCdpModal__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/CloseCdpModal */ "./src/dapps/MakerDai/components/CloseCdpModal/index.js");
/* harmony import */ var _components_MoveCdpModal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/MoveCdpModal */ "./src/dapps/MakerDai/components/MoveCdpModal/index.js");
/* harmony import */ var _components_GenerateModal__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/GenerateModal */ "./src/dapps/MakerDai/components/GenerateModal/index.js");
/* harmony import */ var _components_DepositModal__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/DepositModal */ "./src/dapps/MakerDai/components/DepositModal/index.js");
/* harmony import */ var _components_WithdrawModal__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/WithdrawModal */ "./src/dapps/MakerDai/components/WithdrawModal/index.js");
/* harmony import */ var _components_PaybackModal__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/PaybackModal */ "./src/dapps/MakerDai/components/PaybackModal/index.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(bignumber_js__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _makerdao_dai__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @makerdao/dai */ "./node_modules/@makerdao/dai/dist/src/index.js");
/* harmony import */ var _makerdao_dai__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(_makerdao_dai__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");
/* harmony import */ var _MakerCDP__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./MakerCDP */ "./src/dapps/MakerDai/MakerCDP.js");
/* harmony import */ var _helpers_addressUtils__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @/helpers/addressUtils */ "./src/helpers/addressUtils.js");
/* harmony import */ var mew_maker_plugin__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! mew-maker-plugin */ "./node_modules/mew-maker-plugin/src/index.js");












function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_10__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

















var MKR = _makerdao_dai__WEBPACK_IMPORTED_MODULE_23___default.a.MKR,
    DAI = _makerdao_dai__WEBPACK_IMPORTED_MODULE_23___default.a.DAI;

var toBigNumber = function toBigNumber(num) {
  return new bignumber_js__WEBPACK_IMPORTED_MODULE_22___default.a(num);
};

var bnOver = function bnOver(one, two, three) {
  return toBigNumber(one).times(toBigNumber(two)).div(toBigNumber(three));
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'interface-container-title': _layouts_InterfaceLayout_components_InterfaceContainerTitle__WEBPACK_IMPORTED_MODULE_13__["default"],
    'interface-bottom-text': _components_InterfaceBottomText__WEBPACK_IMPORTED_MODULE_14__["default"],
    'generate-modal': _components_GenerateModal__WEBPACK_IMPORTED_MODULE_18__["default"],
    'deposit-modal': _components_DepositModal__WEBPACK_IMPORTED_MODULE_19__["default"],
    'withdraw-modal': _components_WithdrawModal__WEBPACK_IMPORTED_MODULE_20__["default"],
    'payback-modal': _components_PaybackModal__WEBPACK_IMPORTED_MODULE_21__["default"],
    blockie: _components_Blockie__WEBPACK_IMPORTED_MODULE_15__["default"],
    'back-button': _layouts_InterfaceLayout_components_BackButton__WEBPACK_IMPORTED_MODULE_12__["default"],
    'close-cdp-modal': _components_CloseCdpModal__WEBPACK_IMPORTED_MODULE_16__["default"],
    'move-cdp-modal': _components_MoveCdpModal__WEBPACK_IMPORTED_MODULE_17__["default"]
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
    }
  },
  data: function data() {
    return {
      destAddressProxy: '',
      destAddressHasProxy: false,
      afterUpdate: [],
      allCdpIds: [],
      activeCdp: {},
      activeValues: {
        maxPethDraw: toBigNumber(0),
        maxEthDraw: toBigNumber(0),
        maxUsdDraw: toBigNumber(0),
        ethCollateral: toBigNumber(0),
        pethCollateral: toBigNumber(0),
        usdCollateral: toBigNumber(0),
        debtValue: toBigNumber(0),
        maxDai: toBigNumber(0),
        collateralRatio: toBigNumber(0),
        minEth: toBigNumber(0),
        cdpId: '--'
      },
      availableCdps: {},
      cdps: [],
      cdpsWithoutProxy: [],
      cdpService: {},
      cdpDetailsLoaded: false,
      currentProxy: null,
      currentCdpId: '',
      creatingCdp: false,
      daiPrice: 0,
      daiQty: 0,
      ethPrice: toBigNumber(0),
      ethQty: 0,
      liquidationRatio: toBigNumber(0),
      liquidationPenalty: toBigNumber(0),
      makerActive: false,
      makerCdp: {},
      makerManager: {},
      migrationInProgress: {},
      openCloseModal: false,
      openMoveModal: false,
      proxyService: {},
      proxyAddress: null,
      pethPrice: toBigNumber(0),
      pethMin: toBigNumber(0),
      priceService: {},
      priceFloor: 0,
      stabilityFee: toBigNumber(0),
      sysVars: {},
      sysServices: {},
      targetPrice: 0,
      valuesUpdated: 0,
      wethToPethRatio: toBigNumber(0)
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_11__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    maxDaiDraw: function maxDaiDraw() {
      if (this.ethQty <= 0) return 0;
      return bnOver(this.ethPrice, this.ethQty, this.liquidationRatio);
    },
    minEthDeposit: function minEthDeposit() {
      if (this.daiQty <= 0) return 0;
      return bnOver(this.liquidationRatio, this.daiQty, this.ethPrice);
    },
    showMoveOrClose: function showMoveOrClose() {
      return this.$route.name === 'manage' || this.$route.name === 'migrate';
    },
    showManage: function showManage() {
      return this.listCdps || this.cdps.length >= 1 && this.cdpsWithoutProxy.length >= 1;
    },
    showRefresh: function showRefresh() {
      return this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0;
    },
    onCreate: function onCreate() {
      return this.$route.name === 'create';
    },
    showCreateProxy: function showCreateProxy() {
      if (this.showCdpMigrateButtons) {
        return false;
      }

      return !this.hasProxy && !this.onCreate;
    },
    showCdpMigrateButtons: function showCdpMigrateButtons() {
      return this.hasProxy && this.cdpsWithoutProxy.length >= 1;
    },
    listCdps: function listCdps() {
      return this.cdps.length > 1 || this.cdpsWithoutProxy.length > 1;
    },
    hasProxy: function hasProxy() {
      return this.proxyAddress !== null;
    },
    currentProxyAddress: function currentProxyAddress() {
      return this.proxyAddress;
    }
  }),
  watch: Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_10__["default"])({}, 'account.address', function accountAddress() {
    this.makerActive = false;
    this.setup();
  }),
  destroyed: function destroyed() {
    this.priceService = {};
    this.cdpService = {};
    this.proxyService = {};
    this.availableCdps = {};
    this.activeCdp = {};
    this.makerCdp = {};
    this.sysVars = {};
    this.sysServices = {};
  },
  mounted: function () {
    var _mounted = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.setup();

            case 2:
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
    modalHidden: function modalHidden() {
      this.openCloseModal = false;
      this.openMoveModal = false;
    },
    gotoHome: function gotoHome() {
      this.$router.push({
        name: 'Maker'
      });
    },
    gotoCreate: function gotoCreate() {
      if (this.$route.path.includes('maker-dai')) {
        this.activeValues = this.systemValues;
        this.$router.push({
          name: 'create'
        });
      }
    },
    goToManage: function goToManage() {
      if (this.$route.path.includes('maker-dai')) {
        if (this.cdps.length === 1) {
          this.$router.push({
            name: 'manage',
            params: {
              cdpId: this.cdps[0]
            }
          });
        } else if (this.cdpsWithoutProxy.length === 1) {
          this.$router.push({
            name: 'migrate',
            params: {
              cdpId: this.cdpsWithoutProxy[0]
            }
          });
        } else if (this.showManage) {
          // The listing screen may not work and can be removed
          this.$router.push({
            name: 'select'
          });
        } else {
          this.gotoCreate();
        }
      }
    },
    openManage: function openManage(cdpId) {
      if (this.$route.path.includes('maker-dai')) {
        this.setupCdpManage(cdpId);
        this.$router.push({
          name: 'manage',
          params: {
            cdpId: cdpId
          }
        });
      }
    },
    openMigrate: function openMigrate(cdpId) {
      if (this.$route.path.includes('maker-dai')) {
        this.setupCdpManage(cdpId);
        this.$router.push({
          name: 'migrate',
          params: {
            cdpId: cdpId
          }
        });
      }
    },
    showDeposit: function showDeposit() {
      this.$refs.deposit.$refs.modal.show();
    },
    showWithdraw: function showWithdraw() {
      this.$refs.withdraw.$refs.modal.show();
    },
    showPayback: function showPayback() {
      this.$refs.payback.$refs.modal.show();
    },
    showGenerate: function showGenerate() {
      this.$refs.generate.$refs.modal.show();
    },
    showClose: function showClose() {
      var _this = this;

      this.$refs.closeCdp.$refs.modal.$on('hidden', function () {
        _this.$emit('modalHidden');
      });
      this.$refs.closeCdp.$refs.modal.show();
    },
    showMove: function showMove() {
      var _this2 = this;

      this.$refs.moveCdp.$refs.modal.$on('hidden', function () {
        _this2.$emit('modalHidden');
      });
      this.destAddressHasProxy = false;
      this.$refs.moveCdp.$refs.modal.show();
    },
    setup: function () {
      var _setup = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var web3, _self, MewMakerPlugin, minEth, _ref2, withProxy, withoutProxy;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.activeCdps = {};
                this.currentCdp = {};
                web3 = this.web3;
                _self = this;
                this.gotoHome();
                MewMakerPlugin = Object(mew_maker_plugin__WEBPACK_IMPORTED_MODULE_27__["default"])(web3, _self.account.address,
                /*#__PURE__*/
                Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2() {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!_self.$route.path.includes('maker-dai')) {
                            _context2.next = 3;
                            break;
                          }

                          _context2.next = 3;
                          return _self.doUpdate();

                        case 3:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                })));
                _context3.next = 8;
                return _makerdao_dai__WEBPACK_IMPORTED_MODULE_23___default.a.create('inject', {
                  provider: {
                    inject: web3.currentProvider
                  },
                  plugins: [MewMakerPlugin],
                  accounts: {
                    myLedger1: {
                      type: 'mew'
                    }
                  }
                });

              case 8:
                this.maker = _context3.sent;
                _context3.next = 11;
                return this.maker.authenticate();

              case 11:
                this._priceService = this.maker.service('price');
                _context3.next = 14;
                return this.maker.service('cdp');

              case 14:
                this._cdpService = _context3.sent;
                _context3.next = 17;
                return this.maker.service('proxy');

              case 17:
                this._proxyService = _context3.sent;
                _context3.next = 20;
                return this.maker.service('token');

              case 20:
                this._tokenService = _context3.sent;
                this.pethMin = toBigNumber(0.005);
                _context3.t0 = toBigNumber;
                _context3.next = 25;
                return this._priceService.getEthPrice();

              case 25:
                _context3.t1 = _context3.sent.toNumber();
                this.ethPrice = (0, _context3.t0)(_context3.t1);
                _context3.t2 = toBigNumber;
                _context3.next = 30;
                return this._priceService.getPethPrice();

              case 30:
                _context3.t3 = _context3.sent.toNumber();
                this.pethPrice = (0, _context3.t2)(_context3.t3);
                _context3.t4 = toBigNumber;
                _context3.next = 35;
                return this._priceService.getPethPrice();

              case 35:
                _context3.t5 = _context3.sent.toNumber();
                this._targetPrice = (0, _context3.t4)(_context3.t5);
                _context3.t6 = toBigNumber;
                _context3.next = 40;
                return this._cdpService.getLiquidationRatio();

              case 40:
                _context3.t7 = _context3.sent;
                this.liquidationRatio = (0, _context3.t6)(_context3.t7);
                _context3.t8 = toBigNumber;
                _context3.next = 45;
                return this._cdpService.getLiquidationPenalty();

              case 45:
                _context3.t9 = _context3.sent;
                this.liquidationPenalty = (0, _context3.t8)(_context3.t9);
                _context3.t10 = toBigNumber;
                _context3.next = 50;
                return this._cdpService.getAnnualGovernanceFee();

              case 50:
                _context3.t11 = _context3.sent;
                this.stabilityFee = (0, _context3.t10)(_context3.t11);
                _context3.t12 = toBigNumber;
                _context3.next = 55;
                return this._priceService.getWethToPethRatio();

              case 55:
                _context3.t13 = _context3.sent;
                this.wethToPethRatio = (0, _context3.t12)(_context3.t13);
                _context3.next = 59;
                return this._proxyService.currentProxy();

              case 59:
                this.proxyAddress = _context3.sent;
                this.daiToken = this._tokenService.getToken(DAI);
                _context3.next = 63;
                return this.daiToken.balance();

              case 63:
                this.daiBalance = _context3.sent.toBigNumber();
                this.mkrToken = this._tokenService.getToken(MKR);
                _context3.next = 67;
                return this.mkrToken.balance();

              case 67:
                this.mkrBalance = _context3.sent.toBigNumber();
                minEth = toBigNumber(this.pethMin).times(this.wethToPethRatio);
                this.systemValues = {
                  stabilityFee: this.stabilityFee,
                  minEth: minEth,
                  liquidationRatio: this.liquidationRatio,
                  wethToPethRatio: this.wethToPethRatio,
                  liquidationPenalty: this.liquidationPenalty,
                  targetPrice: this._targetPrice,
                  pethPrice: this.pethPrice
                };
                _context3.next = 72;
                return this.checkAllowances();

              case 72:
                _context3.next = 74;
                return this.locateCdps();

              case 74:
                _ref2 = _context3.sent;
                withProxy = _ref2.withProxy;
                withoutProxy = _ref2.withoutProxy;
                this.cdps = withProxy;
                this.cdpsWithoutProxy = withoutProxy;

                if (!(this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0)) {
                  _context3.next = 82;
                  break;
                }

                _context3.next = 82;
                return this.loadCdpDetails();

              case 82:
                this.currentProxy = this.getProxy();

                if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
                  this.cdpDetailsLoaded = true;
                  this.makerActive = true;

                  if (this.$route.name !== 'create' && this.$route.path.includes('maker-dai')) {
                    this.goToManage();
                  }
                } else {
                  this.gotoCreate();
                }

              case 84:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setup() {
        return _setup.apply(this, arguments);
      }

      return setup;
    }(),
    buildEmpty: function () {
      var _buildEmpty = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.buildCdpObject(null);

              case 2:
                return _context4.abrupt("return", _context4.sent);

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function buildEmpty() {
        return _buildEmpty.apply(this, arguments);
      }

      return buildEmpty;
    }(),
    addCdp: function addCdp() {
      this.creatingCdp = true;
    },
    removeCdp: function removeCdp(vals) {
      try {
        delete this.availableCdps[vals.id];
        _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].responseHandler('CDP Closed', _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].INFO);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    },
    migrateCdpExternal: function () {
      var _migrateCdpExternal = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(cdpId) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.afterUpdate.push(this.goToManage);
                _context5.next = 3;
                return this.migrateCdp(cdpId);

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function migrateCdpExternal(_x) {
        return _migrateCdpExternal.apply(this, arguments);
      }

      return migrateCdpExternal;
    }(),
    refreshExternal: function () {
      var _refreshExternal = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.doUpdate();

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function refreshExternal() {
        return _refreshExternal.apply(this, arguments);
      }

      return refreshExternal;
    }(),
    refresh: function () {
      var _refresh = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.doUpdate();

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function refresh() {
        return _refresh.apply(this, arguments);
      }

      return refresh;
    }(),
    doUpdate: function () {
      var _doUpdate = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var _this3 = this;

        var afterClose, afterOpen, _loop, idProp, runAfterUpdate;

        return regeneratorRuntime.wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.getProxy();

              case 2:
                this.proxyAddress = _context9.sent;
                afterClose = false;
                afterOpen = this.$route.name === 'create';
                _context9.next = 7;
                return this.updateActiveCdp();

              case 7:
                _loop =
                /*#__PURE__*/
                regeneratorRuntime.mark(function _loop(idProp) {
                  return regeneratorRuntime.wrap(function _loop$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          if (!_this3.activeCdps[idProp].needsUpdate) {
                            _context8.next = 16;
                            break;
                          }

                          if (!_this3.activeCdps[idProp].closing) {
                            _context8.next = 8;
                            break;
                          }

                          afterClose = true;
                          delete _this3.activeCdps[idProp];
                          _this3.cdps = _this3.cdps.filter(function (item) {
                            return item !== idProp;
                          });
                          _this3.cdpsWithoutProxy = _this3.cdpsWithoutProxy.filter(function (item) {
                            return item !== idProp;
                          });
                          _context8.next = 16;
                          break;

                        case 8:
                          if (!_this3.activeCdps[idProp].opening) {
                            _context8.next = 13;
                            break;
                          }

                          _context8.next = 11;
                          return _this3.activeCdps[idProp].updateValues();

                        case 11:
                          _context8.next = 16;
                          break;

                        case 13:
                          _context8.next = 15;
                          return _this3.activeCdps[idProp].update();

                        case 15:
                          _this3.activeCdps[idProp] = _context8.sent;

                        case 16:
                          if (!(idProp === _this3.currentCdpId)) {
                            _context8.next = 21;
                            break;
                          }

                          _context8.next = 19;
                          return _this3.currentCdp.update();

                        case 19:
                          _context8.next = 21;
                          return _this3.setupCdpManage(_this3.currentCdpId);

                        case 21:
                        case "end":
                          return _context8.stop();
                      }
                    }
                  }, _loop);
                });
                _context9.t0 = regeneratorRuntime.keys(this.activeCdps);

              case 9:
                if ((_context9.t1 = _context9.t0()).done) {
                  _context9.next = 14;
                  break;
                }

                idProp = _context9.t1.value;
                return _context9.delegateYield(_loop(idProp), "t2", 12);

              case 12:
                _context9.next = 9;
                break;

              case 14:
                _context9.next = 16;
                return this.daiToken.balance();

              case 16:
                this.daiBalance = _context9.sent.toBigNumber();
                _context9.next = 19;
                return this.mkrToken.balance();

              case 19:
                this.mkrBalance = _context9.sent.toBigNumber();
                _context9.next = 22;
                return this.checkAllowances();

              case 22:
                if (Object.keys(this.activeCdps).includes(this.currentCdpId)) {
                  _context9.next = 29;
                  break;
                }

                _context9.next = 25;
                return this.loadCdpDetails();

              case 25:
                _context9.next = 27;
                return this.setupCdpManage(this.currentCdpId);

              case 27:
                _context9.next = 31;
                break;

              case 29:
                _context9.next = 31;
                return this.setupCdpManage(this.currentCdpId);

              case 31:
                runAfterUpdate = function runAfterUpdate() {
                  if (_this3.afterUpdate.length > 0) {
                    var fn = _this3.afterUpdate.pop();

                    fn();
                    runAfterUpdate();
                  }
                };

                runAfterUpdate();

                if (afterClose || afterOpen || this.creatingCdp) {
                  if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
                    this.goToManage();
                  } else {
                    this.gotoCreate();
                  }
                }

                if (!this.creatingCdp) {
                  _context9.next = 41;
                  break;
                }

                this.creatingCdp = false;
                _context9.next = 38;
                return this.updateActiveCdp();

              case 38:
                _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].responseHandler('CDP Created', _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].INFO);
                _context9.next = 43;
                break;

              case 41:
                this.valuesUpdated++;
                _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].responseHandler('CDP Updated', _helpers__WEBPACK_IMPORTED_MODULE_24__["Toast"].INFO);

              case 43:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee8, this);
      }));

      function doUpdate() {
        return _doUpdate.apply(this, arguments);
      }

      return doUpdate;
    }(),
    checkAllowances: function () {
      var _checkAllowances = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!this.proxyAddress) {
                  _context10.next = 7;
                  break;
                }

                _context10.next = 3;
                return this.daiToken.allowance(this.account.address, this.proxyAddress);

              case 3:
                this._proxyAllowanceDai = _context10.sent.toBigNumber();
                _context10.next = 6;
                return this.mkrToken.allowance(this.account.address, this.proxyAddress);

              case 6:
                this._proxyAllowanceMkr = _context10.sent.toBigNumber();

              case 7:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee9, this);
      }));

      function checkAllowances() {
        return _checkAllowances.apply(this, arguments);
      }

      return checkAllowances;
    }(),
    setupCdpManage: function () {
      var _setupCdpManage = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(cdpId) {
        return regeneratorRuntime.wrap(function _callee10$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!this.allCdpIds.includes(cdpId) && this.allCdpIds.length > 0) {
                  cdpId = this.allCdpIds[0];
                }

                if (!(this.allCdpIds.length === 0)) {
                  _context11.next = 5;
                  break;
                }

                this.activeValues = this.systemValues;
                _context11.next = 9;
                break;

              case 5:
                this.currentCdpId = cdpId;
                _context11.next = 8;
                return this.getValuesForManage(cdpId);

              case 8:
                this.activeValues = _context11.sent;

              case 9:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee10, this);
      }));

      function setupCdpManage(_x2) {
        return _setupCdpManage.apply(this, arguments);
      }

      return setupCdpManage;
    }(),
    getValuesForManage: function () {
      var _getValuesForManage = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(cdpId) {
        var currentCdp, _proxyAllowanceDai, _proxyAllowanceMkr, toPeth, systemValues;

        return regeneratorRuntime.wrap(function _callee11$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                currentCdp = this.activeCdps[cdpId];
                this.currentCdp = currentCdp;
                _proxyAllowanceDai = this._proxyAllowanceDai;
                _proxyAllowanceMkr = this._proxyAllowanceMkr;
                toPeth = this.toPeth;
                systemValues = this.systemValues;
                return _context12.abrupt("return", _objectSpread({}, systemValues, {
                  cdpId: cdpId,
                  maxPethDraw: currentCdp.maxPethDraw,
                  maxEthDraw: currentCdp.maxEthDraw,
                  maxUsdDraw: currentCdp.maxUsdDraw,
                  ethCollateral: currentCdp.ethCollateral,
                  pethCollateral: currentCdp.pethCollateral,
                  usdCollateral: currentCdp.usdCollateral,
                  debtValue: currentCdp.debtValue,
                  maxDai: currentCdp.maxDai,
                  collateralRatio: currentCdp.collatRatio,
                  liquidationPrice: currentCdp.liquidationPrice,
                  minEth: currentCdp.minEth,
                  isSafe: false,
                  governanceFeeOwed: currentCdp.governanceFeeOwed,
                  ethCollateralNum: currentCdp.ethCollateralNum,
                  toPeth: toPeth,
                  proxyAllowanceDai: _proxyAllowanceDai,
                  proxyAllowanceMkr: _proxyAllowanceMkr,
                  zeroDebt: currentCdp.zeroDebt
                }));

              case 7:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee11, this);
      }));

      function getValuesForManage(_x3) {
        return _getValuesForManage.apply(this, arguments);
      }

      return getValuesForManage;
    }(),
    locateCdps: function () {
      var _locateCdps = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                this.cdpsWithoutProxy = [];
                _context13.next = 3;
                return this.locateCdpsWithoutProxy();

              case 3:
                this.cdpsWithoutProxy = _context13.sent;
                this.cdps = [];
                _context13.next = 7;
                return this.locateCdpsProxy();

              case 7:
                this.cdps = _context13.sent;
                this.allCdpIds = [].concat(Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__["default"])(this.cdpsWithoutProxy), Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__["default"])(this.cdps));
                return _context13.abrupt("return", {
                  withProxy: this.cdps,
                  withoutProxy: this.cdpsWithoutProxy
                });

              case 10:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee12, this);
      }));

      function locateCdps() {
        return _locateCdps.apply(this, arguments);
      }

      return locateCdps;
    }(),
    locateCdpsWithoutProxy: function () {
      var _locateCdpsWithoutProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13() {
        var directCdps, directCdpsCheckSum;
        return regeneratorRuntime.wrap(function _callee13$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this._cdpService.getCdpIds(this.account.address);

              case 2:
                directCdps = _context14.sent;
                _context14.next = 5;
                return this._cdpService.getCdpIds(Object(_helpers_addressUtils__WEBPACK_IMPORTED_MODULE_26__["toChecksumAddress"])(this.account.address));

              case 5:
                directCdpsCheckSum = _context14.sent;
                return _context14.abrupt("return", directCdps.concat(directCdpsCheckSum));

              case 7:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee13, this);
      }));

      function locateCdpsWithoutProxy() {
        return _locateCdpsWithoutProxy.apply(this, arguments);
      }

      return locateCdpsWithoutProxy;
    }(),
    locateCdpsProxy: function () {
      var _locateCdpsProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.getProxy();

              case 2:
                this.proxyAddress = _context15.sent;
                _context15.next = 5;
                return this._cdpService.getCdpIds(this.proxyAddress);

              case 5:
                return _context15.abrupt("return", _context15.sent);

              case 6:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee14, this);
      }));

      function locateCdpsProxy() {
        return _locateCdpsProxy.apply(this, arguments);
      }

      return locateCdpsProxy;
    }(),
    updateActiveCdp: function () {
      var _updateActiveCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15() {
        var _this4 = this;

        var currentCdpIds, newCdps, newCdpsWithoutProxy, removedCdps, i, _i;

        return regeneratorRuntime.wrap(function _callee15$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                currentCdpIds = Object.keys(this.activeCdps);
                _context16.next = 3;
                return this.locateCdps();

              case 3:
                newCdps = this.cdps.filter(function (item) {
                  return !Object.keys(_this4.activeCdps).includes(item.toString());
                });
                newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(function (item) {
                  return !Object.keys(_this4.activeCdps).includes(item.toString());
                });
                removedCdps = currentCdpIds.filter(function (item) {
                  return !(_this4.cdps.includes(item.toString()) || _this4.cdpsWithoutProxy.includes(item.toString()));
                });

                if (removedCdps.length > 0) {
                  removedCdps.forEach(function (item) {
                    return delete _this4.activeCdps[item];
                  });
                }

                if (!(newCdps.length > 0)) {
                  _context16.next = 16;
                  break;
                }

                i = 0;

              case 9:
                if (!(i < newCdps.length)) {
                  _context16.next = 16;
                  break;
                }

                _context16.next = 12;
                return this.buildCdpObject(newCdps[i]);

              case 12:
                this.activeCdps[newCdps[i]] = _context16.sent;

              case 13:
                i++;
                _context16.next = 9;
                break;

              case 16:
                if (!(newCdpsWithoutProxy.length > 0)) {
                  _context16.next = 25;
                  break;
                }

                _i = 0;

              case 18:
                if (!(_i < newCdpsWithoutProxy.length)) {
                  _context16.next = 25;
                  break;
                }

                _context16.next = 21;
                return this.buildCdpObject(newCdpsWithoutProxy[_i], {
                  noProxy: true
                });

              case 21:
                this.activeCdps[newCdpsWithoutProxy[_i]] = _context16.sent;

              case 22:
                _i++;
                _context16.next = 18;
                break;

              case 25:
                if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
                  this.gotoCreate();
                }

              case 26:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee15, this);
      }));

      function updateActiveCdp() {
        return _updateActiveCdp.apply(this, arguments);
      }

      return updateActiveCdp;
    }(),
    loadCdpDetails: function () {
      var _loadCdpDetails = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee16() {
        var i, _i2;

        return regeneratorRuntime.wrap(function _callee16$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < this.cdps.length)) {
                  _context17.next = 8;
                  break;
                }

                _context17.next = 4;
                return this.buildCdpObject(this.cdps[i]);

              case 4:
                this.activeCdps[this.cdps[i]] = _context17.sent;

              case 5:
                i++;
                _context17.next = 1;
                break;

              case 8:
                _i2 = 0;

              case 9:
                if (!(_i2 < this.cdpsWithoutProxy.length)) {
                  _context17.next = 16;
                  break;
                }

                _context17.next = 12;
                return this.buildCdpObject(this.cdpsWithoutProxy[_i2], {
                  noProxy: true
                });

              case 12:
                this.activeCdps[this.cdpsWithoutProxy[_i2]] = _context17.sent;

              case 13:
                _i2++;
                _context17.next = 9;
                break;

              case 16:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee16, this);
      }));

      function loadCdpDetails() {
        return _loadCdpDetails.apply(this, arguments);
      }

      return loadCdpDetails;
    }(),
    buildCdpObject: function () {
      var _buildCdpObject = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee17(cdpId) {
        var options,
            sysVars,
            services,
            makerCDP,
            _args18 = arguments;
        return regeneratorRuntime.wrap(function _callee17$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                options = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : {};
                sysVars = _objectSpread({}, options, {
                  _proxyAddress: this.proxyAddress,
                  liquidationPenalty: this.liquidationPenalty,
                  stabilityFee: this.stabilityFee,
                  ethPrice: this.ethPrice,
                  _pethPrice: this.pethPrice,
                  wethToPethRatio: this.wethToPethRatio,
                  _targetPrice: this._targetPrice,
                  liquidationRatio: this.liquidationRatio,
                  proxyAllowanceDai: this.proxyAllowanceDai,
                  proxyAllowanceMkr: this.proxyAllowanceMkr,
                  _daiToken: this._daiToken,
                  daiBalance: this.daiBalance,
                  _mkrToken: this._mkrToken,
                  mkrBalance: this.mkrBalance,
                  minEth: this.minEth,
                  pethMin: this.pethMin
                });

                if (!this.cdpsWithoutProxy.includes(cdpId)) {
                  _context18.next = 8;
                  break;
                }

                _context18.next = 5;
                return this.getMakerCdp(cdpId, false);

              case 5:
                this.cdp = _context18.sent;
                _context18.next = 17;
                break;

              case 8:
                if (!this.cdps.includes(cdpId)) {
                  _context18.next = 14;
                  break;
                }

                _context18.next = 11;
                return this.getMakerCdp(cdpId, this.proxyAddress);

              case 11:
                this.cdp = _context18.sent;
                _context18.next = 17;
                break;

              case 14:
                _context18.next = 16;
                return this.getMakerCdp(cdpId, false);

              case 16:
                this.cdp = _context18.sent;

              case 17:
                services = {
                  _proxyService: this._proxyService,
                  priceService: this.priceService,
                  _cdpService: this._cdpService,
                  doUpdate: this.doUpdate,
                  getProxy: this.getProxy,
                  hasProxy: this.hasProxy,
                  getCdp: this.getMakerCdp,
                  toPeth: this.toPeth,
                  toUSD: this.toUSD,
                  _proxyAddress: this.proxyAddress,
                  liquidationPenalty: this.liquidationPenalty,
                  stabilityFee: this.stabilityFee,
                  ethPrice: this.ethPrice,
                  _pethPrice: this.pethPrice,
                  wethToPethRatio: this.wethToPethRatio,
                  _targetPrice: this._targetPrice,
                  liquidationRatio: this.liquidationRatio,
                  proxyAllowanceDai: this.proxyAllowanceDai,
                  proxyAllowanceMkr: this.proxyAllowanceMkr,
                  _daiToken: this._daiToken,
                  daiBalance: this.daiBalance,
                  _mkrToken: this._mkrToken,
                  mkrBalance: this.mkrBalance,
                  minEth: this.minEth,
                  pethMin: this.pethMin
                };
                makerCDP = new _MakerCDP__WEBPACK_IMPORTED_MODULE_25__["default"](cdpId, this.web3, services, sysVars);

                if (!cdpId) {
                  _context18.next = 23;
                  break;
                }

                _context18.next = 22;
                return makerCDP.init(cdpId);

              case 22:
                return _context18.abrupt("return", _context18.sent);

              case 23:
                return _context18.abrupt("return", makerCDP);

              case 24:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee17, this);
      }));

      function buildCdpObject(_x4) {
        return _buildCdpObject.apply(this, arguments);
      }

      return buildCdpObject;
    }(),
    getProxy: function () {
      var _getProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee18() {
        return regeneratorRuntime.wrap(function _callee18$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this._proxyService.currentProxy();

              case 2:
                this.proxyAddress = _context19.sent;

                if (this.proxyAddress) {
                  _context19.next = 8;
                  break;
                }

                _context19.next = 6;
                return this._proxyService.getProxyAddress(this.account.address);

              case 6:
                this.proxyAddress = _context19.sent;
                if (this.proxyAddress) this.noProxy = false;

              case 8:
                return _context19.abrupt("return", this.proxyAddress);

              case 9:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee18, this);
      }));

      function getProxy() {
        return _getProxy.apply(this, arguments);
      }

      return getProxy;
    }(),
    lockEth: function lockEth(val) {
      this.currentCdp.lockEth(val);
    },
    wipeDai: function wipeDai(val) {
      this.currentCdp.wipeDai(val);
    },
    freeEth: function freeEth(val) {
      if (val[1] === null) {
        this.currentCdp.freeEth(val[0]);
      } else {
        this.currentCdp.freeEth(val[0], val[1]);
      }
    },
    drawDai: function drawDai(val) {
      if (val[1] === null) {
        this.currentCdp.drawDai(val[0]);
      } else {
        this.currentCdp.drawDai(val[0], val[1]);
      }
    },
    closeCdp: function closeCdp() {
      this.currentCdp.closeCdp();
    },
    checkIfDestAddressHasProxy: function checkIfDestAddressHasProxy(val) {
      var _this5 = this;

      this.currentCdp.checkIfDestAddressHasProxy(val).then(function (result) {
        _this5.destAddressProxy = result;
        _this5.destAddressHasProxy = result !== null;
      }).catch(function (err) {
        throw err;
      });
    },
    moveCdp: function moveCdp(val) {
      this.currentCdp.moveCdp(val);
    },
    calcCollatRatioDaiChg: function calcCollatRatioDaiChg(daiQty) {
      return toBigNumber(this.currentCdp.calcCollatRatio(this.currentCdp.ethCollateral, daiQty));
    },
    calcCollatRatioEthChg: function calcCollatRatioEthChg(ethQty) {
      return toBigNumber(this.currentCdp.calcCollatRatio(ethQty, this.currentCdp.debtValue));
    },
    calcLiquidationPriceDaiChg: function calcLiquidationPriceDaiChg(daiQty) {
      return toBigNumber(this.currentCdp.calcLiquidationPrice(this.currentCdp.ethCollateral, daiQty));
    },
    calcLiquidationPriceEthChg: function calcLiquidationPriceEthChg(ethQty) {
      return toBigNumber(this.currentCdp.calcLiquidationPrice(ethQty, this.currentCdp.debtValue));
    },
    approveDai: function () {
      var _approveDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee19() {
        return regeneratorRuntime.wrap(function _callee19$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this._tokenService.getToken(DAI).approveUnlimited(this.proxyAddress);

              case 2:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee19, this);
      }));

      function approveDai() {
        return _approveDai.apply(this, arguments);
      }

      return approveDai;
    }(),
    approveMkr: function () {
      var _approveMkr = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee20() {
        return regeneratorRuntime.wrap(function _callee20$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                this._tokenService.getToken(MKR).approveUnlimited(this.proxyAddress);

              case 1:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee20, this);
      }));

      function approveMkr() {
        return _approveMkr.apply(this, arguments);
      }

      return approveMkr;
    }(),
    hasCdp: function hasCdp(cdpId) {
      return Object.keys(this.activeCdps).includes(toBigNumber(cdpId).toString());
    },
    getCdp: function getCdp(cdpId) {
      return this.activeCdps[cdpId];
    },
    getMakerCdp: function () {
      var _getMakerCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee21(cdpId) {
        return regeneratorRuntime.wrap(function _callee21$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                if (!(cdpId === null)) {
                  _context22.next = 2;
                  break;
                }

                return _context22.abrupt("return");

              case 2:
                if (!this.cdpsWithoutProxy.includes(cdpId)) {
                  _context22.next = 8;
                  break;
                }

                _context22.next = 5;
                return this.maker.getCdp(cdpId, false);

              case 5:
                return _context22.abrupt("return", _context22.sent);

              case 8:
                if (!(this.cdps.includes(cdpId) && this.proxyAddress)) {
                  _context22.next = 14;
                  break;
                }

                _context22.next = 11;
                return this.maker.getCdp(cdpId, this.proxyAddress);

              case 11:
                return _context22.abrupt("return", _context22.sent);

              case 14:
                if (!this.proxyAddress) {
                  _context22.next = 18;
                  break;
                }

                _context22.next = 17;
                return this.maker.getCdp(cdpId, this.proxyAddress);

              case 17:
                return _context22.abrupt("return", _context22.sent);

              case 18:
                _context22.next = 20;
                return this.maker.getCdp(cdpId, false);

              case 20:
                return _context22.abrupt("return", _context22.sent);

              case 21:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee21, this);
      }));

      function getMakerCdp(_x5) {
        return _getMakerCdp.apply(this, arguments);
      }

      return getMakerCdp;
    }(),
    buildProxy: function () {
      var _buildProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee22() {
        return regeneratorRuntime.wrap(function _callee22$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this.getProxy();

              case 2:
                this.proxyAddress = _context23.sent;

                if (this.proxyAddress) {
                  _context23.next = 10;
                  break;
                }

                _context23.next = 6;
                return this._proxyService.build();

              case 6:
                _context23.next = 8;
                return this._proxyService.currentProxy();

              case 8:
                this.proxyAddress = _context23.sent;
                return _context23.abrupt("return", this.proxyAddress);

              case 10:
                _context23.next = 12;
                return this._proxyService.currentProxy();

              case 12:
                this.proxyAddress = _context23.sent;
                return _context23.abrupt("return", this.proxyAddress);

              case 14:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee22, this);
      }));

      function buildProxy() {
        return _buildProxy.apply(this, arguments);
      }

      return buildProxy;
    }(),
    migrateCdp: function () {
      var _migrateCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_8__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee23(cdpId) {
        var currentProxy;
        return regeneratorRuntime.wrap(function _callee23$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return this.getProxy();

              case 2:
                currentProxy = _context24.sent;

                if (!currentProxy) {
                  _context24.next = 6;
                  break;
                }

                _context24.next = 6;
                return this._cdpService.give(cdpId, currentProxy);

              case 6:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee23, this);
      }));

      function migrateCdp(_x6) {
        return _migrateCdp.apply(this, arguments);
      }

      return migrateCdp;
    }(),
    // Calculations
    minEth: function minEth() {
      if (this.wethToPethRatio) {
        return toBigNumber(this.pethMin).times(this.wethToPethRatio);
      }

      return '--';
    },
    toUSD: function toUSD(eth) {
      if (eth === undefined || eth === null) return toBigNumber(0);
      return this.ethPrice.times(toBigNumber(eth));
    },
    toPeth: function toPeth(eth) {
      if (!toBigNumber(eth).eq(0)) {
        return toBigNumber(eth).div(this.wethToPethRatio);
      }

      return toBigNumber(0);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ethjs-unit */ "./node_modules/ethjs-unit/lib/index.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ethjs_unit__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../CheckBox */ "./src/dapps/MakerDai/components/CheckBox/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../helpers */ "./src/dapps/MakerDai/helpers.js");







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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  return new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a(num);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__["default"],
    'check-box': _CheckBox__WEBPACK_IMPORTED_MODULE_10__["default"],
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
    calcCollatRatioEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true
      }
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_6__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    amountPresent: function amountPresent() {
      return (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0);
    },
    hasEnoughEth: function hasEnoughEth() {
      if (this.amount || this.amount !== '') {
        var asEth = ethjs_unit__WEBPACK_IMPORTED_MODULE_7___default.a.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }

      return true;
    },
    canWithdrawEthAmount: function canWithdrawEthAmount() {
      if (this.amount || this.amount !== '') {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.ethCollateral));
      }

      return false;
    },
    canProceed: function canProceed() {
      if (toBigNumber(this.amount).lte(0)) return false;
      var ratio = toBigNumber(this.newCollateralRatio);
      var ratioOk = ratio.gt(1.5) || ratio.eq(0);
      return this.hasEnoughEth && (ratioOk || this.riskyBypass);
    },
    newCollateralRatio: function newCollateralRatio() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(toBigNumber(this.values.ethCollateral).plus(this.amount));
      } else if (this.values) {
        return this.values.collatRatio;
      }

      return 0;
    },
    newCollateralRatioSafe: function newCollateralRatioSafe() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(toBigNumber(this.values.ethCollateral).plus(this.amount)).gte(2);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }

      return true;
    },
    newCollateralRatioInvalid: function newCollateralRatioInvalid() {
      if (this.values && this.amount > 0) {
        return this.calcCollatRatioEthChg(toBigNumber(this.values.ethCollateral).plus(this.amount)).lte(1.5);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).lte(1.5);
      }

      return true;
    },
    newLiquidationPrice: function newLiquidationPrice() {
      if (this.values && this.amount > 0) {
        return this.calcLiquidationPriceEthChg(toBigNumber(this.values.ethCollateral).plus(toBigNumber(this.amount)));
      } else if (this.values) {
        return this.values.liquidationPrice;
      }

      return 0;
    }
  }),
  watch: {},
  mounted: function mounted() {
    var _this = this;

    this.$refs.modal.$on('shown', function () {
      _this.amount = 0;
    });
  },
  methods: {
    submitBtn: function submitBtn() {
      if (!this.canProceed) return;
      this.lockEth();
    },
    checkBoxClicked: function checkBoxClicked() {
      this.riskyBypass = !this.riskyBypass;
    },
    displayPercentValue: _helpers__WEBPACK_IMPORTED_MODULE_12__["displayPercentValue"],
    displayFixedValue: _helpers__WEBPACK_IMPORTED_MODULE_12__["displayFixedValue"],
    notZero: function notZero(val) {
      return toBigNumber(val).gt(0);
    },
    currentDai: function currentDai() {
      this.amount = this.values.debtValue;
    },
    lockEth: function () {
      var _lockEth = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (toBigNumber(this.amount).gte(0)) {
                  this.delayCloseModal();
                  this.$emit('lockEth', this.amount);
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function lockEth() {
        return _lockEth.apply(this, arguments);
      }

      return lockEth;
    }(),
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal: function delayCloseModal() {
      var _this2 = this;

      setTimeout(function () {
        _this2.closeModal();
      }, 200);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ethjs-unit */ "./node_modules/ethjs-unit/lib/index.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ethjs_unit__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/ExpendingOption */ "./src/components/ExpendingOption/index.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../CheckBox */ "./src/dapps/MakerDai/components/CheckBox/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../helpers */ "./src/dapps/MakerDai/helpers.js");







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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__["default"],
    'check-box': _CheckBox__WEBPACK_IMPORTED_MODULE_11__["default"],
    'expending-option': _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_8__["default"],
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
    calcCollatRatioEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      generateButton: {
        title: 'Generate',
        buttonStyle: 'green',
        noMinWidth: true
      }
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_6__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    amountPresent: function amountPresent() {
      return (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0);
    },
    canCompute: function canCompute() {
      return this.values && this.amountPresent;
    },
    allOk: function allOk() {
      if (this.amountPresent) {
        return this.newCollateralRatioSafe && this.canGenerateDaiAmount;
      }

      return true;
    },
    showWarning: function showWarning() {
      return !this.newCollateralRatioInvalid && this.canGenerateDaiAmount && this.riskyBypass;
    },
    newTotal: function newTotal() {
      return toBigNumber(this.values.debtValue).plus(this.amount);
    },
    hasEnoughEth: function hasEnoughEth() {
      if (this.canCompute) {
        var asEth = ethjs_unit__WEBPACK_IMPORTED_MODULE_7___default.a.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }

      return true;
    },
    canGenerateDaiAmount: function canGenerateDaiAmount() {
      if (this.canCompute && !toBigNumber(this.amount).isNaN()) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.maxDai));
      }

      return true;
    },
    canProceed: function canProceed() {
      if (this.canCompute) {
        if (toBigNumber(this.amount).lte(0)) return false;
        return this.newCollateralRatioSafe && this.canGenerateDaiAmount || !this.newCollateralRatioInvalid && this.canGenerateDaiAmount && this.riskyBypass;
      }

      return false;
    },
    calcCollateralRatio: function calcCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioDaiChg(toBigNumber(this.values.debtValue).plus(this.amount));
      }

      if (this.values) {
        return this.values.collateralRatio;
      }
    },
    newCollateralRatio: function newCollateralRatio() {
      if (this.canCompute || this.values) {
        return this.displayFixedPercent(this.calcCollateralRatio);
      }

      return '--';
    },
    newCollateralRatioSafe: function newCollateralRatioSafe() {
      if (this.canCompute) {
        return this.calcCollateralRatio.gte(2);
      }

      return true;
    },
    newCollateralRatioInvalid: function newCollateralRatioInvalid() {
      if (this.canCompute) {
        return this.calcCollateralRatio.lte(1.5);
      }

      return true;
    },
    newLiquidationPrice: function newLiquidationPrice() {
      if (this.canCompute) {
        return this.calcLiquidationPriceDaiChg(toBigNumber(this.values.debtValue).plus(this.amount));
      } else if (this.values) {
        return this.values.liquidationPrice;
      }

      return 0;
    }
  }),
  methods: {
    submitBtn: function submitBtn() {
      if (!this.canProceed) return;
      this.drawDai();
    },
    checkBoxClicked: function checkBoxClicked(checked) {
      this.riskyBypass = checked;
    },
    displayPercentValue: _helpers__WEBPACK_IMPORTED_MODULE_13__["displayPercentValue"],
    displayFixedValue: _helpers__WEBPACK_IMPORTED_MODULE_13__["displayFixedValue"],
    displayFixedPercent: _helpers__WEBPACK_IMPORTED_MODULE_13__["displayFixedPercent"],
    notZero: function notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxDai: function maxDai() {
      this.amount = toBigNumber(this.values.maxDai).minus(toBigNumber(this.values.maxDai).times(0.01));
      this.$forceUpdate();
    },
    currentDai: function currentDai() {
      this.amount = this.values.debtValue;
    },
    drawDai: function () {
      var _drawDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (toBigNumber(this.amount).gte(0)) {
                  this.delayCloseModal();

                  if (this.newCollateralRatioSafe) {
                    this.$emit('drawDai', [this.amount, null]);
                  } else {
                    this.$emit('drawDai', [this.amount, this.riskyBypass]);
                  }
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function drawDai() {
        return _drawDai.apply(this, arguments);
      }

      return drawDai;
    }(),
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal: function delayCloseModal() {
      var _this = this;

      setTimeout(function () {
        _this.closeModal();
      }, 200);
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ethjs-unit */ "./node_modules/ethjs-unit/lib/index.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ethjs_unit__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/ExpendingOption */ "./src/components/ExpendingOption/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../CheckBox */ "./src/dapps/MakerDai/components/CheckBox/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../helpers */ "./src/dapps/MakerDai/helpers.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_SwapWidget__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/components/SwapWidget */ "./src/components/SwapWidget/index.js");








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










var toBigNumber = function toBigNumber(num) {
  return new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(num);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'swap-widget': _components_SwapWidget__WEBPACK_IMPORTED_MODULE_15__["default"],
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_10__["default"],
    'check-box': _CheckBox__WEBPACK_IMPORTED_MODULE_11__["default"],
    'expending-option': _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_9__["default"],
    'standard-button': _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_14__["default"]
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
    calcCollatRatioEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      mkrToken: {},
      daiToken: {},
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true,
        fullWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      },
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
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_7__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    amountPresent: function amountPresent() {
      return (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0);
    },
    canCompute: function canCompute() {
      return this.values && this.amountPresent;
    },
    allOk: function allOk() {
      if (this.amountPresent) {
        return this.newCollateralRatioSafe && this.canGenerateDaiAmount;
      }

      return true;
    },
    hasEnoughEth: function hasEnoughEth() {
      if (this.canCompute) {
        var asEth = ethjs_unit__WEBPACK_IMPORTED_MODULE_8___default.a.fromWei(this.account.balance, 'ether');
        return toBigNumber(this.amount).lte(toBigNumber(asEth));
      }

      return true;
    },
    paybackFee: function paybackFee() {
      if (this.canCompute) {
        return toBigNumber(this.amount).div(this.values.debtValue).times(this.values.governanceFeeOwed);
      }

      return 0;
    },
    hasEnoughMkr: function hasEnoughMkr() {
      if (this.canCompute) {
        return toBigNumber(this.mkrBalance).gte(toBigNumber(this.paybackFee));
      }

      return true;
    },
    hasEnoughDai: function hasEnoughDai() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(toBigNumber(this.daiBalance));
      }

      return true;
    },
    canWithdrawEthAmount: function canWithdrawEthAmount() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.ethCollateral));
      }

      return false;
    },
    canGenerateDaiAmount: function canGenerateDaiAmount() {
      if (this.canCompute) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.maxDai));
      }

      return true;
    },
    canProceed: function canProceed() {
      return this.hasEnoughDai;
    },
    calcCollateralRatio: function calcCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioDaiChg(toBigNumber(this.values.debtValue).minus(this.amount));
      }

      if (this.values) {
        return this.values.collateralRatio;
      }

      return '--';
    },
    newCollateralRatio: function newCollateralRatio() {
      if (this.amount > 0) {
        return this.calcCollateralRatio;
      } else if (this.values) {
        return this.values.collatRatio;
      }

      return '--';
    },
    newCollateralRatioSafe: function newCollateralRatioSafe() {
      if (this.amount > 0) {
        if (this.calcCollateralRatio.lte(new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(0.000009))) {
          return true;
        }

        return this.calcCollateralRatio.gte(2);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).gte(2);
      }

      return true;
    },
    newCollateralRatioInvalid: function newCollateralRatioInvalid() {
      if (this.amount > 0) {
        // If less than a very small number
        if (this.calcCollateralRatio.lte(new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_12___default.a(0.000009))) {
          return true;
        }

        return this.calcCollateralRatio.gte(1.5);
      } else if (this.values) {
        return toBigNumber(this.values.collatRatio).lte(1.5);
      }

      return true;
    },
    newLiquidationPrice: function newLiquidationPrice() {
      if (this.values.debtValue && this.amount > 0) {
        return this.calcLiquidationPriceDaiChg(toBigNumber(this.values.debtValue).minus(this.amount));
      } else if (this.values.liquidationPrice) {
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
    needsDaiApprove: function needsDaiApprove() {
      if (toBigNumber(this.values.proxyAllowanceDai).gt(0)) {
        if (toBigNumber(this.values.proxyAllowanceDai).lt(this.values.debtValue)) {
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
    }
  }),
  watch: {},
  mounted: function mounted() {
    var _this = this;

    this.$refs.modal.$on('shown', function () {
      _this.amount = 0;

      _this.getBalances();
    });
  },
  methods: {
    submitBtn: function submitBtn() {
      if (!this.canProceed) return;
      this.wipeDai();
    },
    checkBoxClicked: function checkBoxClicked() {
      this.riskyBypass = !this.riskyBypass;
    },
    displayPercentValue: _helpers__WEBPACK_IMPORTED_MODULE_13__["displayPercentValue"],
    displayFixedValue: _helpers__WEBPACK_IMPORTED_MODULE_13__["displayFixedValue"],
    notZero: function notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxDai: function maxDai() {
      this.amount = toBigNumber(this.values.maxDai).minus(toBigNumber(this.values.maxDai).times(0.01));
    },
    currentDai: function currentDai() {
      this.amount = this.values.debtValue;
    },
    wipeDai: function () {
      var _wipeDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (toBigNumber(this.amount).gte(0)) {
                  this.delayCloseModal();

                  if (toBigNumber(this.amount).gt(this.values.debtValue)) {
                    this.$emit('wipeDai', this.values.debtValue);
                  } else {
                    this.$emit('wipeDai', this.amount);
                  }
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function wipeDai() {
        return _wipeDai.apply(this, arguments);
      }

      return wipeDai;
    }(),
    getBalances: function getBalances() {
      this.mkrToken = this.tokensWithBalance.find(function (item) {
        return item.symbol === 'MKR';
      });
      this.daiToken = this.tokensWithBalance.find(function (item) {
        return item.symbol === 'DAI';
      });
    },
    getMkr: function getMkr() {
      var _this2 = this;

      var mkrNeeded = this.paybackFee;

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
          _this2.$refs.swapWidget.$refs.modal.show();
        });
      }
    },
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal: function delayCloseModal() {
      var _this3 = this;

      setTimeout(function () {
        _this3.closeModal();
      }, 200);
    },
    approveDai: function () {
      var _approveDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.$emit('approveDai');

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function approveDai() {
        return _approveDai.apply(this, arguments);
      }

      return approveDai;
    }(),
    approveMkr: function () {
      var _approveMkr = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.$emit('approveMkr');

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function approveMkr() {
        return _approveMkr.apply(this, arguments);
      }

      return approveMkr;
    }()
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************/
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
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/components/ExpendingOption */ "./src/components/ExpendingOption/index.js");
/* harmony import */ var _components_Buttons_StandardButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/Buttons/StandardButton */ "./src/components/Buttons/StandardButton/index.js");
/* harmony import */ var _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/Buttons/HelpCenterButton */ "./src/components/Buttons/HelpCenterButton/index.js");
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../CheckBox */ "./src/dapps/MakerDai/components/CheckBox/index.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! bignumber.js/bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../helpers */ "./src/dapps/MakerDai/helpers.js");







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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  return new bignumber_js_bignumber_js__WEBPACK_IMPORTED_MODULE_11___default.a(num);
};

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'help-center-button': _components_Buttons_HelpCenterButton__WEBPACK_IMPORTED_MODULE_9__["default"],
    'check-box': _CheckBox__WEBPACK_IMPORTED_MODULE_10__["default"],
    'expending-option': _components_ExpendingOption__WEBPACK_IMPORTED_MODULE_7__["default"],
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
    calcCollatRatioEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceEthChg: {
      type: Function,
      default: function _default() {}
    },
    calcCollatRatioDaiChg: {
      type: Function,
      default: function _default() {}
    },
    calcLiquidationPriceDaiChg: {
      type: Function,
      default: function _default() {}
    }
  },
  data: function data() {
    return {
      amount: 0,
      amountEth: 0,
      amountDai: 0,
      riskyBypass: false,
      modalDetailInformation: false,
      textValues: {},
      fiatCurrency: 'USD',
      digitalCurrency: 'ETH',
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true
      },
      submitButton: {
        title: 'Submit',
        buttonStyle: 'green',
        noMinWidth: true
      }
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_6__["mapState"])(['account', 'gasPrice', 'web3', 'network', 'ens']), {
    amountPresent: function amountPresent() {
      return (this.amount || this.amount !== '') && !toBigNumber(this.amount).lte(0);
    },
    canCompute: function canCompute() {
      return this.values && this.amountPresent;
    },
    canWithdrawEthNotice: function canWithdrawEthNotice() {
      if (this.amountPresent) {
        return !toBigNumber(this.amount).lte(toBigNumber(this.values.maxEthDraw));
      }

      return false;
    },
    canWithdrawEthAmount: function canWithdrawEthAmount() {
      if (this.amountPresent) {
        return toBigNumber(this.amount).lte(toBigNumber(this.values.ethCollateral));
      }

      return false;
    },
    canProceed: function canProceed() {
      if (this.amountPresent) {
        if (toBigNumber(this.amount).lte(0)) return false;
        return this.newCollateralRatioSafe && this.canWithdrawEthAmount || !this.newCollateralRatioInvalid && this.canWithdrawEthAmount && this.riskyBypass;
      }

      return false;
    },
    calcCollateralRatio: function calcCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioDaiChg(toBigNumber(this.values.debtValue).plus(this.amount));
      }

      if (this.values) {
        return this.values.collateralRatio;
      }
    },
    newCollateralRatio: function newCollateralRatio() {
      if (this.canCompute) {
        return this.calcCollatRatioEthChg(toBigNumber(this.values.ethCollateral).minus(this.amount));
      } else if (this.values) {
        return this.values.collatRatio;
      }

      return '--';
    },
    newCollateralRatioSafe: function newCollateralRatioSafe() {
      if (this.canCompute) {
        if (this.values.zeroDebt) return true;
        return this.newCollateralRatio.gte(2);
      }

      return true;
    },
    newCollateralRatioInvalid: function newCollateralRatioInvalid() {
      if (this.canCompute) {
        if (this.values.zeroDebt) return false;
        return this.newCollateralRatio.lte(1.5);
      }

      return true;
    },
    newLiquidationPrice: function newLiquidationPrice() {
      if (this.canCompute) {
        return this.calcLiquidationPriceEthChg(toBigNumber(this.values.ethCollateral).minus(this.amount));
      } else if (this.values) {
        return this.values.liquidationPrice;
      }

      return 0;
    }
  }),
  watch: {},
  mounted: function mounted() {
    var _this = this;

    this.$refs.modal.$on('shown', function () {
      _this.amount = 0;
    });
    this.$refs.modal.$on('hidden', function () {
      _this.amount = 0;
    });
  },
  methods: {
    submitBtn: function submitBtn() {
      if (!this.canProceed) return;
      this.freeEth();
    },
    checkBoxClicked: function checkBoxClicked(checked) {
      this.riskyBypass = checked;
    },
    displayPercentValue: _helpers__WEBPACK_IMPORTED_MODULE_12__["displayPercentValue"],
    displayFixedValue: _helpers__WEBPACK_IMPORTED_MODULE_12__["displayFixedValue"],
    notZero: function notZero(val) {
      return toBigNumber(val).gt(0);
    },
    maxWithdraw: function maxWithdraw() {
      this.amount = this.values.maxEthDraw;
      this.$forceUpdate();
    },
    currentDai: function currentDai() {
      this.amount = this.values.debtValue;
    },
    freeEth: function () {
      var _freeEth = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_3__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (toBigNumber(this.amount).gte(0)) {
                  this.delayCloseModal();

                  if (this.newCollateralRatioSafe) {
                    this.$emit('freeEth', [this.amount, null]);
                  } else {
                    this.$emit('freeEth', [this.amount, this.riskyBypass]);
                  }
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function freeEth() {
        return _freeEth.apply(this, arguments);
      }

      return freeEth;
    }(),
    closeModal: function closeModal() {
      this.$refs.modal.hide();
    },
    delayCloseModal: function delayCloseModal() {
      var _this2 = this;

      setTimeout(function () {
        _this2.closeModal();
      }, 200);
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

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      _c("deposit-modal", {
        ref: "deposit",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: { lockEth: _vm.lockEth }
      }),
      _c("generate-modal", {
        ref: "generate",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: { drawDai: _vm.drawDai }
      }),
      _c("withdraw-modal", {
        ref: "withdraw",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: {
          approveDai: _vm.approveDai,
          approveMkr: _vm.approveMkr,
          freeEth: _vm.freeEth
        }
      }),
      _c("payback-modal", {
        ref: "payback",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: {
          approveDai: _vm.approveDai,
          approveMkr: _vm.approveMkr,
          wipeDai: _vm.wipeDai
        }
      }),
      _c("close-cdp-modal", {
        ref: "closeCdp",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: {
          approveDai: _vm.approveDai,
          approveMkr: _vm.approveMkr,
          closeCdp: _vm.closeCdp
        }
      }),
      _c("move-cdp-modal", {
        ref: "moveCdp",
        attrs: {
          values: _vm.activeValues,
          "calc-collat-ratio-dai-chg": _vm.calcCollatRatioDaiChg,
          "calc-collat-ratio-eth-chg": _vm.calcCollatRatioEthChg,
          "calc-liquidation-price-eth-chg": _vm.calcLiquidationPriceEthChg,
          "calc-liquidation-price-dai-chg": _vm.calcLiquidationPriceDaiChg,
          "dest-address-has-proxy": _vm.destAddressHasProxy,
          "dest-address-proxy": _vm.destAddressProxy,
          "tokens-with-balance": _vm.tokensWithBalance
        },
        on: {
          moveCdp: _vm.moveCdp,
          checkForProxy: _vm.checkIfDestAddressHasProxy
        }
      }),
      _c("interface-container-title", {
        attrs: { title: "MAKER" },
        scopedSlots: _vm._u([
          {
            key: "right",
            fn: function() {
              return [
                _c(
                  "div",
                  {
                    staticStyle: { "padding-left": "20px", cursor: "pointer" }
                  },
                  [
                    _c("i", {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.showRefresh,
                          expression: "showRefresh"
                        }
                      ],
                      staticClass: "fa fa-refresh",
                      on: { click: _vm.refreshExternal }
                    })
                  ]
                ),
                _vm.showMoveOrClose
                  ? _c("div", { staticClass: "header-buttons-container" }, [
                      _c("div", { staticClass: "inner-container" }, [
                        _c(
                          "button",
                          {
                            staticClass: "move-btn",
                            on: { click: _vm.showMove }
                          },
                          [
                            _c("h4", [
                              _vm._v(_vm._s(_vm.$t("dappsMaker.moveTitle")))
                            ])
                          ]
                        ),
                        !(
                          (!_vm.hasProxy && !_vm.onCreate) ||
                          _vm.showCdpMigrateButtons
                        )
                          ? _c("div", [
                              _c(
                                "button",
                                {
                                  staticClass: "close-btn",
                                  on: { click: _vm.showClose }
                                },
                                [
                                  _c("h4", [
                                    _vm._v(
                                      _vm._s(_vm.$t("dappsMaker.closeTitle"))
                                    )
                                  ])
                                ]
                              )
                            ])
                          : _vm._e()
                      ])
                    ])
                  : _vm._e()
              ]
            },
            proxy: true
          }
        ])
      }),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.makerActive,
              expression: "makerActive"
            }
          ],
          staticClass: "buttons-container"
        },
        [
          _vm.showCreateProxy
            ? _c("div", [
                _c(
                  "div",
                  {
                    staticClass: "dapps-button",
                    on: { click: _vm.buildProxy }
                  },
                  [_c("h4", [_vm._v(_vm._s(_vm.$t("dappsMaker.createProxy")))])]
                )
              ])
            : _vm._e(),
          _vm.showCreateProxy
            ? _c("div", { staticClass: "proxy-container" }, [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.$t("dappsMaker.proxyInstructions")) +
                    "\n    "
                )
              ])
            : _vm._e(),
          _vm.showCdpMigrateButtons
            ? _c(
                "div",
                _vm._l(_vm.cdpsWithoutProxy, function(value, idx) {
                  return _c("div", { key: idx + value }, [
                    _c("div", { staticClass: "dapps-button" }, [
                      _c(
                        "div",
                        {
                          on: {
                            click: function($event) {
                              return _vm.migrateCdpExternal(value)
                            }
                          }
                        },
                        [
                          _c("h4", [
                            _vm._v(
                              "\n              " +
                                _vm._s(
                                  _vm.$t("dappsMaker.migrateCdp", {
                                    value: value
                                  })
                                ) +
                                "\n            "
                            )
                          ])
                        ]
                      )
                    ])
                  ])
                }),
                0
              )
            : _vm._e(),
          _vm.showCdpMigrateButtons
            ? _c("div", { staticClass: "proxy-container" }, [
                _vm._v(
                  "\n      " +
                    _vm._s(_vm.$t("dappsMaker.migrateInstructions")) +
                    "\n    "
                )
              ])
            : _vm._e()
        ]
      ),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.makerActive,
              expression: "makerActive"
            }
          ],
          staticClass: "buttons-container"
        },
        [
          _vm.showCreateProxy && _vm.cdpsWithoutProxy.length > 1
            ? _c(
                "div",
                _vm._l(_vm.cdpsWithoutProxy, function(value, idx) {
                  return _c("div", { key: idx + value }, [
                    _c(
                      "div",
                      {
                        class: [
                          "dapps-button",
                          _vm.activeValues.cdpId === value ? "active" : ""
                        ]
                      },
                      [
                        _c(
                          "div",
                          {
                            on: {
                              click: function($event) {
                                return _vm.openMigrate(value)
                              }
                            }
                          },
                          [_c("h4", [_vm._v("CDP #" + _vm._s(value))])]
                        )
                      ]
                    )
                  ])
                }),
                0
              )
            : _vm._e()
        ]
      ),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.makerActive && _vm.listCdps,
              expression: "makerActive && listCdps"
            }
          ],
          staticClass: "buttons-container"
        },
        _vm._l(_vm.cdps, function(value, idx) {
          return _c("div", { key: idx + value }, [
            _c(
              "div",
              {
                class: [
                  "dapps-button",
                  _vm.activeValues.cdpId === value ? "active" : ""
                ]
              },
              [
                _c(
                  "div",
                  {
                    on: {
                      click: function($event) {
                        return _vm.openManage(value)
                      }
                    }
                  },
                  [_c("h4", [_vm._v("CDP #" + _vm._s(value))])]
                )
              ]
            )
          ])
        }),
        0
      ),
      _c("router-view", {
        attrs: {
          "build-empty": _vm.buildEmpty,
          "maker-active": _vm.makerActive,
          "eth-price": _vm.ethPrice,
          "peth-price": _vm.pethPrice,
          "peth-min": _vm.pethMin,
          "weth-to-peth-ratio": _vm.wethToPethRatio,
          "liquidation-penalty": _vm.liquidationPenalty,
          "stability-fee": _vm.stabilityFee,
          "liquidation-ratio": _vm.liquidationRatio,
          "price-service": _vm.priceService,
          "cdp-service": _vm.cdpService,
          "proxy-service": _vm.proxyService,
          cdps: _vm.cdps,
          "cdp-details-loaded": _vm.cdpDetailsLoaded,
          "tokens-with-balance": _vm.tokensWithBalance,
          "migration-in-progress": _vm.migrationInProgress,
          "open-close-modal": _vm.openCloseModal,
          "open-move-modal": _vm.openMoveModal,
          "values-updated": _vm.valuesUpdated,
          values: _vm.activeValues,
          "get-cdp": _vm.getCdp,
          "has-cdp": _vm.hasCdp
        },
        on: {
          activeCdpId: _vm.setupCdpManage,
          cdpOpened: _vm.addCdp,
          cdpClosed: _vm.removeCdp,
          modalHidden: _vm.modalHidden,
          managerUpdate: _vm.doUpdate,
          showWithdraw: _vm.showWithdraw,
          showPayback: _vm.showPayback,
          showGenerate: _vm.showGenerate,
          showDeposit: _vm.showDeposit,
          migrateCdp: _vm.migrateCdpExternal
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
            title: _vm.$t("dappsMaker.depositTitle"),
            centered: "",
            "hide-footer": ""
          }
        },
        [
          _c(
            "div",
            { staticClass: "modal-content-container" },
            [
              _c("div", { staticClass: "inputs-container" }, [
                _c("div", { staticClass: "input-container" }, [
                  _c("div", { staticClass: "interface__block-title" }, [
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.$t("dappsMaker.depositQuestion")) +
                        "\n          "
                    )
                  ]),
                  _c(
                    "div",
                    { class: ["input-box", _vm.hasEnoughEth ? "" : "danger"] },
                    [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.amount,
                            expression: "amount"
                          }
                        ],
                        domProps: { value: _vm.amount },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.amount = $event.target.value
                          }
                        }
                      }),
                      _c("span", { staticClass: "input-unit" }, [
                        _vm._v(_vm._s(_vm.digitalCurrency))
                      ])
                    ]
                  ),
                  _c("div", { staticClass: "sub-text" }, [
                    !_vm.hasEnoughEth
                      ? _c("p", { staticClass: "above-max" }, [
                          _vm._v(
                            "\n              " +
                              _vm._s(_vm.$t("dappsMaker.notEnoughEth")) +
                              "\n            "
                          )
                        ])
                      : _vm._e(),
                    _c(
                      "div",
                      { staticClass: "peth" },
                      [
                        _c("p", [
                          _vm._v(
                            "\n                " +
                              _vm._s(
                                _vm.values.toPeth
                                  ? _vm.displayFixedValue(
                                      _vm.values.toPeth(_vm.amount),
                                      5,
                                      false
                                    )
                                  : 0
                              ) +
                              "\n                PETH\n              "
                          )
                        ]),
                        _c("popover", {
                          attrs: { popcontent: "$t('dappsMaker.pethPopover')" }
                        })
                      ],
                      1
                    )
                  ])
                ])
              ]),
              _c("div", { staticClass: "detail-info" }, [
                _c("div", { staticClass: "info" }, [
                  _c("h4", [_vm._v(_vm._s(_vm.$t("dappsMaker.DetailInfo")))]),
                  _c("div", { staticClass: "sliding-switch-white" }, [
                    _c("label", { staticClass: "switch" }, [
                      _c("input", {
                        attrs: { type: "checkbox" },
                        on: {
                          click: function($event) {
                            _vm.modalDetailInformation = !_vm.modalDetailInformation
                          }
                        }
                      }),
                      _c("span", { staticClass: "slider round" })
                    ])
                  ])
                ]),
                _c(
                  "div",
                  {
                    staticClass: "expended-info",
                    class: _vm.modalDetailInformation && "expended-info-open"
                  },
                  [
                    _c("div", { staticClass: "padding-container" }, [
                      _c("div", { staticClass: "grid-block" }, [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.currentlyDeposited"))
                          )
                        ]),
                        _c("p", [
                          _c("b", [
                            _vm._v(
                              _vm._s(
                                _vm.displayFixedValue(
                                  _vm.values.ethCollateral,
                                  5
                                )
                              )
                            )
                          ]),
                          _vm._v(
                            "\n                " +
                              _vm._s(_vm.digitalCurrency) +
                              "\n              "
                          )
                        ])
                      ]),
                      _c("div", { staticClass: "grid-block" }, [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.projectedLiquidation"))
                          )
                        ]),
                        _c("p", [
                          _c("b", [
                            _vm._v(
                              _vm._s(
                                _vm.displayFixedValue(
                                  _vm.newLiquidationPrice,
                                  2
                                )
                              )
                            )
                          ]),
                          _vm._v(
                            "\n                " +
                              _vm._s(_vm.fiatCurrency) +
                              "\n              "
                          )
                        ])
                      ]),
                      _c("div", { staticClass: "grid-block" }, [
                        _c("p", [
                          _vm._v(
                            _vm._s(_vm.$t("dappsMaker.projectedCollatRatio"))
                          )
                        ]),
                        _c("p", [
                          _c("b", [
                            _vm._v(
                              _vm._s(
                                _vm.displayFixedValue(
                                  _vm.displayPercentValue(
                                    _vm.newCollateralRatio
                                  ),
                                  3
                                )
                              ) + "%"
                            )
                          ])
                        ])
                      ])
                    ])
                  ]
                )
              ]),
              _c(
                "div",
                { staticClass: "buttons" },
                [
                  _c("standard-button", {
                    attrs: {
                      options: _vm.cancelButton,
                      "click-function": _vm.closeModal
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.submitButton,
                      "button-disabled": _vm.canProceed ? false : true,
                      "click-function": _vm.submitBtn
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

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& ***!
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
            title: _vm.$t("dappsMaker.generateTitle"),
            centered: "",
            "hide-footer": ""
          }
        },
        [
          _c(
            "div",
            { staticClass: "contents" },
            [
              _c("div", { staticClass: "inputs" }, [
                _c("div", { staticClass: "interface__block-title" }, [
                  _vm._v(
                    "\n          " +
                      _vm._s(_vm.$t("dappsMaker.generateQuestion")) +
                      "\n        "
                  )
                ]),
                _c("div", { staticClass: "top-buttons" }, [
                  _c("p", { staticClass: "total" }, [
                    _c("span", [_vm._v(_vm._s(_vm.$t("dappsMaker.total")))]),
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.newTotal) +
                        "\n            DAI\n          "
                    )
                  ]),
                  _c("p", { staticClass: "max", on: { click: _vm.maxDai } }, [
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.$t("dappsMaker.maxBalance")) +
                        "\n          "
                    )
                  ])
                ]),
                _c("div", { class: ["input-box", _vm.allOk ? "" : "danger"] }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.amount,
                        expression: "amount"
                      }
                    ],
                    domProps: { value: _vm.amount },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.amount = $event.target.value
                      }
                    }
                  }),
                  _c("p", { staticClass: "input-unit" }, [_vm._v("DAI")])
                ]),
                _c("div", { staticClass: "sub-text" }, [
                  !_vm.canGenerateDaiAmount
                    ? _c("p", { staticClass: "above-max" }, [
                        _vm._v(
                          "\n            " +
                            _vm._s(_vm.$t("dappsMaker.aboveMaxDai")) +
                            "\n          "
                        )
                      ])
                    : _vm._e(),
                  _c("p", [
                    _vm._v(
                      "\n            " +
                        _vm._s(
                          _vm.$t("dappsMaker.collateralRatioVal", {
                            value: _vm.newCollateralRatio
                          })
                        ) +
                        "\n          "
                    )
                  ])
                ])
              ]),
              _c("expending-option", { attrs: { title: "Details" } }, [
                _c("div", { staticClass: "detail-container" }, [
                  _c("div", { staticClass: "grid-block" }, [
                    _c("p", [
                      _vm._v(_vm._s(_vm.$t("dappsMaker.maxGenerateAvailable")))
                    ]),
                    _c("p", [
                      _c("b", [
                        _vm._v(
                          "\n                " +
                            _vm._s(
                              _vm.values.maxDai
                                ? _vm.displayFixedValue(_vm.values.maxDai)
                                : 0
                            ) +
                            "\n              "
                        )
                      ]),
                      _vm._v("\n              DAI\n            ")
                    ])
                  ]),
                  _c("div", { staticClass: "grid-block" }, [
                    _c("p", [
                      _vm._v(_vm._s(_vm.$t("dappsMaker.projectedLiquidation")))
                    ]),
                    _c("p", [
                      _c("b", [
                        _vm._v(
                          _vm._s(
                            _vm.displayFixedValue(_vm.newLiquidationPrice, 2)
                          )
                        )
                      ]),
                      _vm._v(
                        "\n              " +
                          _vm._s(_vm.fiatCurrency) +
                          "\n            "
                      )
                    ])
                  ]),
                  _c("div", { staticClass: "grid-block" }, [
                    _c("p", [
                      _vm._v(_vm._s(_vm.$t("dappsMaker.projectedCollatRatio")))
                    ]),
                    _c("p", [
                      _c("b", [_vm._v(_vm._s(_vm.newCollateralRatio) + "%")])
                    ])
                  ])
                ])
              ]),
              !_vm.newCollateralRatioSafe && _vm.notZero(_vm.amount)
                ? _c("div", { staticClass: "warning-confirmation" }, [
                    _c("div", { staticClass: "grid-block" }, [
                      _c("div", { staticClass: "sign" }, [_vm._v("⚠️")]),
                      _c(
                        "div",
                        { staticClass: "text-content" },
                        [
                          _c("p", { staticClass: "title" }, [
                            _vm._v(_vm._s(_vm.$t("dappsMaker.caution")))
                          ]),
                          _c("p", { staticClass: "warning-details" }, [
                            _vm._v(
                              "\n              " +
                                _vm._s(
                                  _vm.$t("dappsMaker.liquidationRisk", {
                                    value: _vm.newCollateralRatio
                                  })
                                ) +
                                "\n            "
                            )
                          ]),
                          _c("check-box", {
                            on: { changeStatus: _vm.checkBoxClicked },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "terms",
                                  fn: function() {
                                    return [
                                      _c(
                                        "p",
                                        { staticClass: "checkbox-label" },
                                        [
                                          _vm._v(
                                            "\n                  " +
                                              _vm._s(
                                                _vm.$t(
                                                  "dappsMaker.understandAndAgree"
                                                )
                                              ) +
                                              "\n                "
                                          )
                                        ]
                                      )
                                    ]
                                  },
                                  proxy: true
                                }
                              ],
                              null,
                              false,
                              2709117078
                            )
                          })
                        ],
                        1
                      )
                    ])
                  ])
                : _vm._e(),
              _c(
                "div",
                { staticClass: "buttons" },
                [
                  _c("standard-button", {
                    attrs: {
                      options: _vm.cancelButton,
                      "click-function": _vm.closeModal
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.generateButton,
                      "button-disabled": _vm.canProceed ? false : true,
                      "click-function": _vm.submitBtn
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

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
            title: _vm.$t("dappsMaker.paybackTitle"),
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
              _c("p", { staticClass: "top-message" }, [
                _vm._v(
                  "\n        " +
                    _vm._s(_vm.$t("dappsMaker.paybackNotice")) +
                    "\n      "
                )
              ]),
              !_vm.hasEnoughMkr
                ? _c("div", [
                    _c("div", { staticClass: "value-block" }, [
                      _c("p", [
                        _c("b", [
                          _vm._v(_vm._s(_vm.$t("dappsMaker.mkrBalance")))
                        ])
                      ]),
                      _c("p", [
                        _c("b", [_vm._v(_vm._s(_vm.mkrBalance) + " MKR")])
                      ])
                    ]),
                    _c(
                      "p",
                      {
                        staticClass: "get-mkr",
                        on: {
                          click: function($event) {
                            return _vm.getMkr()
                          }
                        }
                      },
                      [
                        _vm._v(
                          "\n          " +
                            _vm._s(_vm.$t("dappsMaker.getMkr")) +
                            "\n        "
                        )
                      ]
                    )
                  ])
                : _vm._e(),
              _c("div", { staticClass: "input-container" }, [
                _c("div", { staticClass: "top-buttons" }, [
                  _c("p", { on: { click: _vm.currentDai } }, [
                    _vm._v(_vm._s(_vm.$t("dappsMaker.setMax")))
                  ])
                ]),
                _c(
                  "div",
                  { class: ["dai-amount", _vm.hasEnoughDai ? "" : "danger"] },
                  [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.amount,
                          expression: "amount"
                        }
                      ],
                      domProps: { value: _vm.amount },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.amount = $event.target.value
                        }
                      }
                    }),
                    _c("p", { staticClass: "floating-text" }, [_vm._v("DAI")])
                  ]
                )
              ]),
              _c(
                "expending-option",
                { attrs: { title: "Detail Information" } },
                [
                  _c("ul", { staticClass: "details" }, [
                    _c("li", [
                      _c("p", [
                        _vm._v(_vm._s(_vm.$t("dappsMaker.outstandingDai")))
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.values.debtValue
                                ? _vm.displayFixedValue(_vm.values.debtValue, 3)
                                : 0
                            )
                          )
                        ]),
                        _vm._v("\n              DAI\n            ")
                      ])
                    ]),
                    _c("li", [
                      _c("p", [
                        _vm._v(_vm._s(_vm.$t("dappsMaker.stabilityFeeOwed")))
                      ]),
                      _c("p", [
                        _c("b", [_vm._v(_vm._s(_vm.values.governanceFeeOwed))]),
                        _vm._v(" MKR\n            ")
                      ])
                    ]),
                    _c("li", [
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.$t("dappsMaker.projectedLiquidation"))
                        )
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.displayFixedValue(_vm.newLiquidationPrice, 2)
                            )
                          )
                        ]),
                        _vm._v(
                          "\n              " +
                            _vm._s(_vm.fiatCurrency) +
                            "\n            "
                        )
                      ])
                    ]),
                    _c("li", [
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.$t("dappsMaker.projectedCollatRatio"))
                        )
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.displayFixedValue(
                                _vm.displayPercentValue(_vm.newCollateralRatio),
                                3
                              )
                            ) + "%"
                          )
                        ])
                      ])
                    ])
                  ])
                ]
              ),
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
                    attrs: {
                      options: _vm.cancelButton,
                      "click-function": _vm.closeModal
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.submitButton,
                      "button-disabled": _vm.canProceed ? false : true,
                      "click-function": _vm.submitBtn
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

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& ***!
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
            title: _vm.$t("dappsMaker.withdrawTitle"),
            centered: "",
            "hide-footer": ""
          }
        },
        [
          _c(
            "div",
            { staticClass: "modal-content-container" },
            [
              _c("div", { staticClass: "inputs-container" }, [
                _c("div", { staticClass: "input-container" }, [
                  _c("p", { staticClass: "message" }, [
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.$t("dappsMaker.withdrawNotice")) +
                        "\n          "
                    )
                  ]),
                  _c("label", [
                    _vm._v(" " + _vm._s(_vm.$t("dappsMaker.withdrawQuestion")))
                  ]),
                  _c("div", { staticClass: "top-buttons" }, [
                    _c(
                      "p",
                      {
                        staticClass: "max-withdraw",
                        on: { click: _vm.maxWithdraw }
                      },
                      [
                        _vm._v(
                          "\n              " +
                            _vm._s(_vm.$t("dappsMaker.maxWithdraw")) +
                            "\n            "
                        )
                      ]
                    )
                  ]),
                  _c(
                    "div",
                    {
                      class: [
                        "input-box",
                        _vm.newCollateralRatioSafe ? "" : "danger"
                      ]
                    },
                    [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.amount,
                            expression: "amount"
                          }
                        ],
                        domProps: { value: _vm.amount },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.amount = $event.target.value
                          }
                        }
                      }),
                      _c("span", { staticClass: "input-unit" }, [
                        _vm._v(_vm._s(_vm.digitalCurrency))
                      ])
                    ]
                  ),
                  _c("div", { staticClass: "sub-text" }, [
                    _vm.canWithdrawEthNotice
                      ? _c("p", { staticClass: "above-max" }, [
                          _vm._v(
                            "\n              " +
                              _vm._s(_vm.$t("dappsMaker.overMaxWithdraw")) +
                              "\n            "
                          )
                        ])
                      : _vm._e(),
                    _c(
                      "div",
                      { staticClass: "peth" },
                      [
                        _c("p", { staticClass: "peth-value" }, [
                          _vm._v(
                            "\n                " +
                              _vm._s(
                                _vm.values.toPeth
                                  ? _vm.displayFixedValue(
                                      _vm.values.toPeth(_vm.amount),
                                      5,
                                      false
                                    )
                                  : 0
                              ) +
                              "\n                PETH\n              "
                          )
                        ]),
                        _c("popover", {
                          attrs: {
                            popcontent: _vm.$t("dappsMaker.pethPopover")
                          }
                        })
                      ],
                      1
                    )
                  ])
                ])
              ]),
              _c(
                "expending-option",
                { attrs: { title: "Detail Information" } },
                [
                  _c("div", { staticClass: "padding-container" }, [
                    _c("div", { staticClass: "grid-block" }, [
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.$t("dappsMaker.maxWithdrawAvailable"))
                        )
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.values.maxDai
                                ? _vm.displayFixedValue(
                                    _vm.values.maxEthDraw,
                                    5
                                  )
                                : 0
                            )
                          )
                        ]),
                        _vm._v(
                          "\n              " +
                            _vm._s(_vm.digitalCurrency) +
                            "\n            "
                        )
                      ])
                    ]),
                    _c("div", { staticClass: "grid-block" }, [
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.$t("dappsMaker.projectedLiquidation"))
                        )
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.displayFixedValue(_vm.newLiquidationPrice, 2)
                            )
                          )
                        ]),
                        _vm._v(
                          "\n              " +
                            _vm._s(_vm.fiatCurrency) +
                            "\n            "
                        )
                      ])
                    ]),
                    _c("div", { staticClass: "grid-block" }, [
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.$t("dappsMaker.projectedCollatRatio"))
                        )
                      ]),
                      _c("p", [
                        _c("b", [
                          _vm._v(
                            _vm._s(
                              _vm.displayFixedValue(
                                _vm.displayPercentValue(_vm.newCollateralRatio),
                                3
                              )
                            ) + "%"
                          )
                        ])
                      ])
                    ])
                  ])
                ]
              ),
              !_vm.newCollateralRatioSafe && _vm.notZero(_vm.amount)
                ? _c("div", { staticClass: "warning-confirmation" }, [
                    _c("div", { staticClass: "grid-block" }, [
                      _c("div", { staticClass: "sign" }, [_vm._v("⚠️")]),
                      _c(
                        "div",
                        { staticClass: "text-content" },
                        [
                          _c("p", { staticClass: "title" }, [
                            _vm._v(_vm._s(_vm.$t("dappsMaker.caution")))
                          ]),
                          _c("p", { staticClass: "warning-details" }, [
                            _vm._v(
                              "\n              " +
                                _vm._s(
                                  _vm.$t("dappsMaker.liquidationRisk", {
                                    value: _vm.displayFixedValue(
                                      _vm.displayPercentValue(
                                        _vm.newCollateralRatio
                                      )
                                    )
                                  })
                                ) +
                                "\n            "
                            )
                          ]),
                          _c("check-box", {
                            on: { changeStatus: _vm.checkBoxClicked },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "terms",
                                  fn: function() {
                                    return [
                                      _c(
                                        "p",
                                        { staticClass: "checkbox-label" },
                                        [
                                          _vm._v(
                                            "\n                  " +
                                              _vm._s(
                                                _vm.$t(
                                                  "dappsMaker.understandAndAgree"
                                                )
                                              ) +
                                              "\n                "
                                          )
                                        ]
                                      )
                                    ]
                                  },
                                  proxy: true
                                }
                              ],
                              null,
                              false,
                              2709117078
                            )
                          })
                        ],
                        1
                      )
                    ])
                  ])
                : _vm._e(),
              _c(
                "div",
                { staticClass: "buttons" },
                [
                  _c("standard-button", {
                    attrs: {
                      options: _vm.cancelButton,
                      "click-function": _vm.closeModal
                    }
                  }),
                  _c("standard-button", {
                    attrs: {
                      options: _vm.submitButton,
                      "button-disabled": _vm.canProceed ? false : true,
                      "click-function": _vm.submitBtn
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

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".container-maker[data-v-284aac6d] {\n  border-radius: 5px;\n  grid-area: main;\n  overflow: hidden;\n}\n.container-maker > div[data-v-284aac6d] {\n    background: #fff;\n}\n.header-buttons-container[data-v-284aac6d] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: absolute;\n  top: 16px;\n  right: 100px;\n}\n@media all and (max-width: 600px) {\n.header-buttons-container[data-v-284aac6d] {\n      top: 79px;\n      left: 8px;\n}\n}\n.header-buttons-container .inner-container[data-v-284aac6d] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.header-buttons-container .inner-container button[data-v-284aac6d] {\n      margin-left: 10px;\n      text-align: center;\n      border-radius: 5px;\n      cursor: pointer;\n      display: block;\n}\n.header-buttons-container .inner-container .move-btn[data-v-284aac6d] {\n      background-color: #fff;\n      width: 120px;\n      height: 34px;\n      border-radius: 4px;\n      border: solid 1px #05c0a5;\n      color: #05c0a5;\n}\n.header-buttons-container .inner-container .close-btn[data-v-284aac6d] {\n      background-color: #fff;\n      width: 120px;\n      height: 34px;\n      border-radius: 4px;\n      border: solid 1px #e96071;\n      color: #e96071;\n}\n.dapps-button[data-v-284aac6d] {\n  background: #f1fafa;\n  border: 1px solid #f1fafa;\n  border-radius: 5px;\n  color: #000;\n  cursor: pointer;\n  height: 100%;\n  padding: 10px 5px;\n  text-align: center;\n}\n@media all and (max-width: 650px) {\n.dapps-button[data-v-284aac6d] {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      text-align: left;\n      padding: 5px 10px;\n}\n}\n.dapps-button[data-v-284aac6d]:hover {\n    border: 1px solid #05c0a5;\n    background-color: #c9f2ed;\n}\n.dapps-button.active[data-v-284aac6d] {\n    border: 1px solid #05c0a5;\n}\n@media all and (max-width: 650px) {\n.dapps-button img[data-v-284aac6d] {\n      margin-top: 0;\n      margin-left: -10px;\n      margin-right: 5px;\n}\n}\n.dapps-button h4[data-v-284aac6d] {\n    margin-bottom: 5px;\n    font-size: 18px;\n    font-weight: 500;\n}\n.disabled[data-v-284aac6d] {\n  background-color: #fff;\n  border: 1px solid #dadada;\n  color: #dadada;\n  pointer-events: none;\n}\n.disabled p[data-v-284aac6d] {\n    color: #dadada;\n}\n.dapps-container[data-v-284aac6d] {\n  min-height: 15px;\n}\n.proxy-container[data-v-284aac6d] {\n  color: #000;\n  height: 100%;\n  padding: 10px 5px;\n  grid-column: 2 / 5;\n}\n@media all and (max-width: 650px) {\n.proxy-container[data-v-284aac6d] {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -webkit-box-align: center;\n          -ms-flex-align: center;\n              align-items: center;\n      text-align: left;\n      padding: 5px 10px;\n}\n}\n@media all and (max-width: 650px) {\n.proxy-container img[data-v-284aac6d] {\n      margin-top: 0;\n      margin-left: -10px;\n      margin-right: 5px;\n}\n}\n.proxy-container h4[data-v-284aac6d] {\n    margin-bottom: 5px;\n    font-size: 18px;\n    font-weight: 500;\n}\n.buttons-container[data-v-284aac6d] {\n  display: grid;\n  grid-column-gap: 5px;\n  grid-row-gap: 5px;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  padding: 10px;\n}\n@media all and (max-width: 650px) {\n.buttons-container > *[data-v-284aac6d] {\n      margin-bottom: 10px;\n}\n}\n.buttons-container > *[data-v-284aac6d]:last-child {\n    margin-bottom: 0;\n}\n@media all and (min-width: calc(414px + 1px)) and (max-width: 1024px) {\n.buttons-container[data-v-284aac6d] {\n      padding: 20px;\n}\n}\n@media all and (max-width: 650px) {\n.buttons-container[data-v-284aac6d] {\n      display: block;\n      padding: 10px;\n}\n}\n.select-contract .dropdown-toggle[data-v-284aac6d] {\n  border: 0;\n  display: none;\n}\n.container-maker[data-v-284aac6d] {\n  margin-bottom: 10px;\n}\n.container-maker .Collateralize-Gene[data-v-284aac6d] {\n    width: 341px;\n    height: 22px;\n    font-family: AvenirNext;\n    font-size: 16px;\n    font-weight: 600;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    color: #0b2840;\n}\n.container-maker .Please-text-somethin[data-v-284aac6d] {\n    width: 535px;\n    height: 51px;\n    font-family: AvenirNext;\n    font-size: 14px;\n    font-weight: normal;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    color: #506175;\n}\n.container-maker .Please-text-somethin .text-style-1[data-v-284aac6d] {\n    font-family: PingFangSC;\n}\n.container-maker .Collateral[data-v-284aac6d] {\n    width: 199px;\n    height: 22px;\n    font-family: AvenirNext;\n    font-size: 16px;\n    font-weight: 600;\n    font-style: normal;\n    font-stretch: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    color: #0b2840;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".modal-content-container[data-v-14929f7b] {\n  padding: 30px 30px;\n}\n.cc-icon[data-v-14929f7b] {\n  font-size: 36px;\n}\n.inputs-container[data-v-14929f7b] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.inputs-container .input-container[data-v-14929f7b] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-bottom: 20px;\n}\n.inputs-container .input-container label[data-v-14929f7b] {\n      color: #0b2840;\n      font-size: 16px;\n      font-weight: 600;\n      padding: 10px 7px;\n}\n.inputs-container .input-container label i[data-v-14929f7b] {\n        font-size: 14px;\n        margin-right: 2px;\n}\n.inputs-container .input-container label .input-title[data-v-14929f7b] {\n        font-size: 16px;\n}\n.inputs-container .input-container .input-box[data-v-14929f7b] {\n      position: relative;\n      margin-bottom: 20px;\n      border-radius: 4px;\n}\n.inputs-container .input-container .input-box.danger[data-v-14929f7b] {\n        border: 1px solid red;\n}\n.inputs-container .input-container .input-box input[data-v-14929f7b] {\n        border-radius: 4px;\n        background-color: #f9f9f9;\n        border: 0;\n        font-size: 14px;\n        padding: 20px;\n        padding-right: 80px;\n        width: 100%;\n}\n.inputs-container .input-container .input-box .input-unit[data-v-14929f7b] {\n        font-size: 14px;\n        color: #b2bfc9;\n        font-weight: 500;\n        position: absolute;\n        right: 20px;\n        top: 20px;\n}\n.sub-text[data-v-14929f7b] {\n  padding: 0 10px;\n  padding-bottom: 10px;\n}\n.sub-text .peth[data-v-14929f7b] {\n    padding: 0 10px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding-bottom: 10px;\n}\n.sub-text .peth p[data-v-14929f7b] {\n      margin-right: 5px;\n}\n.sub-text .above-max[data-v-14929f7b] {\n    margin-bottom: 2px;\n    color: #f00;\n    font-weight: 600;\n}\n.detail-container[data-v-14929f7b] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  border-bottom: 2px solid #eaeaea;\n}\n.detail-container .input-container[data-v-14929f7b] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-bottom: 20px;\n}\n.detail-info[data-v-14929f7b] {\n  border-bottom: 2px solid #f2f4fa;\n  border-top: 2px solid #f2f4fa;\n  padding: 20px 10px;\n}\n.detail-info .info[data-v-14929f7b] {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    color: #0b2840;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.detail-info .info .sliding-switch-white[data-v-14929f7b] {\n      margin-left: auto;\n}\n.detail-info .expended-info[data-v-14929f7b] {\n    max-height: 0;\n    -webkit-transition: max-height 0.3s ease;\n    transition: max-height 0.3s ease;\n    overflow: hidden;\n}\n.detail-info .expended-info.expended-info-open[data-v-14929f7b] {\n      max-height: 600px;\n}\n.detail-info .expended-info .padding-container[data-v-14929f7b] {\n      padding-top: 10px;\n}\n.detail-info .expended-info .grid-block[data-v-14929f7b] {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      padding: 16px 0;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block[data-v-14929f7b] {\n          display: block;\n          padding: 16px 0 0 0;\n}\n}\n.detail-info .expended-info .grid-block p[data-v-14929f7b]:nth-child(even) {\n        max-width: 295px;\n        text-align: right;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block p[data-v-14929f7b]:nth-child(even) {\n            max-width: initial;\n            text-align: left;\n}\n}\n.buttons[data-v-14929f7b] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.buttons > *[data-v-14929f7b] {\n    width: 100%;\n}\n.buttons > *[data-v-14929f7b]:first-child {\n      margin-right: 10px;\n}\n.buttons-container[data-v-14929f7b] {\n  margin-top: 60px;\n  margin-bottom: 60px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n@media all and (max-width: 414px) {\n.buttons-container[data-v-14929f7b] {\n      margin-top: 30px;\n}\n}\n.buttons-container div[data-v-14929f7b] {\n    margin: auto;\n    text-align: center;\n    border-radius: 5px;\n    cursor: pointer;\n    padding: 20px;\n    width: 260px;\n}\n@media all and (max-width: 414px) {\n.buttons-container div[data-v-14929f7b] {\n        width: 100%;\n}\n}\n.buttons-container .btn[data-v-14929f7b] {\n    border-radius: 4px;\n    margin: 0 5px;\n}\n.buttons-container .submit-btn[data-v-14929f7b] {\n    background-color: #05c0a5;\n    border: solid 1px #05c0a5;\n    color: #fff;\n}\n.buttons-container .submit-btn.disable[data-v-14929f7b] {\n      background-color: #506175;\n      border: solid 1px #506175;\n      cursor: not-allowed;\n}\n.buttons-container .cancel-btn[data-v-14929f7b] {\n    background-color: #fff;\n    border-radius: 4px;\n    border: solid 1px #506175;\n    color: #506175;\n}\n.time-remaining[data-v-14929f7b] {\n  text-align: center;\n}\n.time-remaining h1[data-v-14929f7b] {\n    font-weight: 500;\n    font-size: 50px;\n    color: #ff2f49;\n    margin: 0;\n}\n.value[data-v-14929f7b] {\n  font-size: 20px;\n  font-weight: 500;\n  margin-bottom: 13px;\n  margin-top: 13px;\n}\n.value span[data-v-14929f7b] {\n    font-size: 20px;\n    font-weight: 500;\n}\n.block-title[data-v-14929f7b] {\n  font-size: 15px;\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.address[data-v-14929f7b] {\n  line-height: 19px;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -ms-word-break: break-all;\n  word-break: break-all;\n  word-break: break-word;\n  -ms-hyphens: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n}\n.swap-detail[data-v-14929f7b] {\n  display: grid;\n  grid-template-columns: 1fr 80px 1fr;\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.from-address[data-v-14929f7b],\n.to-address[data-v-14929f7b] {\n  background-color: #f9f9f9;\n  padding: 20px;\n  border-radius: 5px;\n}\n.right-arrow[data-v-14929f7b] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n}\n.confirm-send-button[data-v-14929f7b] {\n  margin-top: 40px;\n  margin-bottom: 20px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.confirm-send-button > li[data-v-14929f7b] {\n    margin: 0 auto;\n}\n.confirm-send-button > li .provider-address-details[data-v-14929f7b] {\n      text-align: center;\n      margin-right: 15px;\n}\n.check-box[data-v-14929f7b] {\n  position: relative;\n}\n\n/* Customize the label (the container) */\n.check-box-container[data-v-14929f7b] {\n  display: block;\n  position: relative;\n  padding-left: 35px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  font-size: 22px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  line-height: 21px;\n}\n\n/* Hide the browser's default checkbox */\n.check-box-container input[data-v-14929f7b] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n/* Create a custom checkbox */\n.checkmark[data-v-14929f7b] {\n  position: absolute;\n  top: 2px;\n  left: 0;\n  height: 25px;\n  width: 25px;\n  background-color: #eee;\n  border-radius: 7px;\n}\n\n/* On mouse-over, add a grey background color */\n.check-box-container:hover input ~ .checkmark[data-v-14929f7b] {\n  background-color: #ccc;\n}\n\n/* When the checkbox is checked, add a blue background */\n.check-box-container input:checked ~ .checkmark[data-v-14929f7b] {\n  background-color: #05c0a5;\n}\n\n/* Create the checkmark/indicator (hidden when not checked) */\n.checkmark[data-v-14929f7b]::after {\n  content: '';\n  position: absolute;\n  display: none;\n}\n\n/* Show the checkmark when checked */\n.check-box-container input:checked ~ .checkmark[data-v-14929f7b]::after {\n  display: block;\n}\n\n/* Style the checkmark/indicator */\n.check-box-container .checkmark[data-v-14929f7b]::after {\n  left: 10px;\n  top: 7px;\n  width: 5px;\n  height: 10px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".contents[data-v-3d926dcd] {\n  padding: 30px;\n}\n.top-buttons[data-v-3d926dcd] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0 10px;\n}\n.top-buttons .total span[data-v-3d926dcd] {\n    font-weight: 500;\n}\n.top-buttons .max[data-v-3d926dcd] {\n    margin-left: auto;\n    color: #05c0a5;\n    margin-bottom: 2px;\n    font-weight: 500;\n    cursor: pointer;\n}\n.top-buttons .max span[data-v-3d926dcd] {\n      color: initial;\n      font-weight: 400;\n}\n.input-box[data-v-3d926dcd] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: baseline;\n      -ms-flex-align: baseline;\n          align-items: baseline;\n  margin-bottom: 15px;\n  position: relative;\n}\n.input-box.danger[data-v-3d926dcd] {\n    border: 1px solid red;\n    border-radius: 4px;\n}\n.input-box input[data-v-3d926dcd] {\n    border-radius: 4px;\n    background-color: #f9f9f9;\n    border: 0;\n    font-size: 14px;\n    padding: 20px;\n    padding-right: 70px;\n    width: 100%;\n}\n.input-box .input-unit[data-v-3d926dcd] {\n    position: absolute;\n    top: 3px;\n    right: 20px;\n    background-color: #f9f9f9;\n    border: 0;\n    font-size: 14px;\n    height: 52px;\n    padding: 17px 22px 20px;\n    width: 10%;\n    color: #999;\n    font-weight: 500;\n}\n.sub-text[data-v-3d926dcd] {\n  margin-bottom: 20px;\n  padding: 0 0 0 10px;\n}\n.sub-text .above-max[data-v-3d926dcd] {\n    margin-bottom: 2px;\n    color: #f00;\n    font-weight: 600;\n}\n.detail-container[data-v-3d926dcd] {\n  padding: 0 10px;\n}\n.detail-container .grid-block[data-v-3d926dcd] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n    padding: 10px 0;\n}\n.detail-container .grid-block p[data-v-3d926dcd] {\n      line-height: 20px;\n}\n.detail-container .grid-block p[data-v-3d926dcd]:last-child {\n      margin-left: auto;\n      min-width: 100px;\n      text-align: right;\n}\n.buttons[data-v-3d926dcd] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.buttons > *[data-v-3d926dcd] {\n    width: 100%;\n}\n.buttons > *[data-v-3d926dcd]:first-child {\n      margin-right: 10px;\n}\n.cc-icon[data-v-3d926dcd] {\n  font-size: 36px;\n}\n.warning-confirmation[data-v-3d926dcd] {\n  margin-top: 20px;\n  border: 1px solid #f5a623;\n  background-color: #fff6e6;\n  padding: 20px;\n  border-radius: 4px;\n}\n.warning-confirmation .grid-block[data-v-3d926dcd] {\n    display: grid;\n    grid-template-columns: 60px 1fr;\n}\n.warning-confirmation .grid-block .sign[data-v-3d926dcd] {\n      font-size: 30px;\n}\n.warning-confirmation .grid-block .text-content .title[data-v-3d926dcd] {\n      font-size: 18px;\n      font-weight: 600;\n      margin: 0;\n      padding: 0;\n}\n.warning-confirmation .grid-block .text-content .warning-details[data-v-3d926dcd] {\n      margin-top: 5px;\n      color: #0b2840;\n      margin-bottom: 10px;\n      font-size: 14px;\n}\n.warning-confirmation .grid-block .text-content .checkbox-label[data-v-3d926dcd] {\n      color: #05c0a5;\n      font-weight: 500;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".contents[data-v-8261b84a] {\n  padding: 30px;\n}\n.top-message[data-v-8261b84a] {\n  margin-bottom: 20px;\n}\n.input-container[data-v-8261b84a] {\n  margin-bottom: 20px;\n}\n.input-container .dai-amount[data-v-8261b84a] {\n    position: relative;\n}\n.input-container .dai-amount input[data-v-8261b84a] {\n      background-color: #f9f9f9;\n      border: 0;\n      font-size: 14px;\n      padding: 20px;\n      width: 100%;\n      padding-right: 70px;\n}\n.input-container .dai-amount .floating-text[data-v-8261b84a] {\n      position: absolute;\n      right: 20px;\n      top: 20px;\n      color: #999;\n      font-weight: 500;\n}\n.input-container .dai-amount .btn[data-v-8261b84a] {\n      color: #05c0a5;\n      cursor: pointer;\n}\n.input-container .top-buttons[data-v-8261b84a] {\n    padding: 0 10px;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.input-container .top-buttons p[data-v-8261b84a] {\n      margin-left: auto;\n      font-weight: 500;\n      color: #05c0a5;\n      cursor: pointer;\n}\n.details li[data-v-8261b84a] {\n  padding: 10px 10px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n}\n.details li p[data-v-8261b84a] {\n    line-height: 16px;\n}\n.details li p[data-v-8261b84a]:nth-child(2) {\n    margin-left: auto;\n    min-width: 100px;\n    text-align: right;\n}\n.buttons[data-v-8261b84a] {\n  margin: 20px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.buttons > *[data-v-8261b84a] {\n    width: 100%;\n}\n.buttons > *[data-v-8261b84a]:first-child {\n      margin-right: 10px;\n}\n.cc-icon[data-v-8261b84a] {\n  font-size: 36px;\n}\n.sub-text[data-v-8261b84a] {\n  padding-bottom: 10px;\n}\n.sub-text .btn[data-v-8261b84a] {\n    color: #05c0a5;\n}\n.sub-text .btn[data-v-8261b84a]:hover {\n      cursor: pointer;\n}\n.detail-container[data-v-8261b84a] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  border-bottom: 2px solid #eaeaea;\n}\n.detail-container .input-container[data-v-8261b84a] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-bottom: 20px;\n}\n.detail-info[data-v-8261b84a] {\n  border-bottom: 2px solid #f2f4fa;\n  border-top: 2px solid #f2f4fa;\n  padding: 20px 10px;\n}\n.detail-info .info[data-v-8261b84a] {\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    color: #0c5876;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.detail-info .info .sliding-switch-white[data-v-8261b84a] {\n      margin-left: auto;\n}\n.detail-info .expended-info[data-v-8261b84a] {\n    max-height: 0;\n    -webkit-transition: max-height 0.3s ease;\n    transition: max-height 0.3s ease;\n    overflow: hidden;\n}\n.detail-info .expended-info.expended-info-open[data-v-8261b84a] {\n      max-height: 600px;\n}\n.detail-info .expended-info .padding-container[data-v-8261b84a] {\n      padding-top: 10px;\n}\n.detail-info .expended-info .grid-block[data-v-8261b84a] {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      padding: 16px 0;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block[data-v-8261b84a] {\n          display: block;\n          padding: 16px 0 0 0;\n}\n}\n.detail-info .expended-info .grid-block p[data-v-8261b84a]:nth-child(even) {\n        max-width: 295px;\n        text-align: right;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n}\n@media all and (max-width: 500px) {\n.detail-info .expended-info .grid-block p[data-v-8261b84a]:nth-child(even) {\n            max-width: initial;\n            text-align: left;\n}\n}\n.value-block[data-v-8261b84a] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n}\n.value-block p[data-v-8261b84a] {\n    line-height: 30px;\n}\n.value-block p b[data-v-8261b84a] {\n      font-weight: 600;\n      font-size: inherit;\n      color: #0b2840;\n      line-height: inherit;\n}\n.value-block p[data-v-8261b84a]:last-child {\n    margin-left: auto;\n    text-align: right;\n    min-width: 100px;\n}\n.buttons-container[data-v-8261b84a] {\n  margin-top: 60px;\n  margin-bottom: 60px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n@media all and (max-width: 414px) {\n.buttons-container[data-v-8261b84a] {\n      margin-top: 30px;\n}\n}\n.buttons-container div[data-v-8261b84a] {\n    margin: auto;\n    text-align: center;\n    border-radius: 5px;\n    cursor: pointer;\n    padding: 20px;\n    width: 260px;\n}\n@media all and (max-width: 414px) {\n.buttons-container div[data-v-8261b84a] {\n        width: 100%;\n}\n}\n.buttons-container .submit-btn[data-v-8261b84a] {\n    width: 189px;\n    height: 62px;\n    border-radius: 4px;\n    background-color: #05c0a5;\n    color: #fff;\n}\n.buttons-container .submit-btn.disable[data-v-8261b84a] {\n      background-color: #506175;\n      cursor: not-allowed;\n}\n.buttons-container .cancel-btn[data-v-8261b84a] {\n    background-color: #fff;\n    width: 189px;\n    height: 62px;\n    border-radius: 4px;\n    border: solid 1px #506175;\n    color: #506175;\n}\n.time-remaining[data-v-8261b84a] {\n  text-align: center;\n}\n.time-remaining h1[data-v-8261b84a] {\n    font-weight: 500;\n    font-size: 50px;\n    color: #ff2f49;\n    margin: 0;\n}\n.value[data-v-8261b84a] {\n  font-size: 20px;\n  font-weight: 500;\n  margin-bottom: 13px;\n  margin-top: 13px;\n}\n.value span[data-v-8261b84a] {\n    font-size: 20px;\n    font-weight: 500;\n}\n.block-title[data-v-8261b84a] {\n  font-size: 15px;\n  font-weight: 500;\n  margin-bottom: 3px;\n}\n.address[data-v-8261b84a] {\n  line-height: 19px;\n  overflow-wrap: break-word;\n  word-wrap: break-word;\n  -ms-word-break: break-all;\n  word-break: break-all;\n  word-break: break-word;\n  -ms-hyphens: auto;\n  -webkit-hyphens: auto;\n  hyphens: auto;\n}\n.swap-detail[data-v-8261b84a] {\n  display: grid;\n  grid-template-columns: 1fr 80px 1fr;\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.from-address[data-v-8261b84a],\n.to-address[data-v-8261b84a] {\n  background-color: #f9f9f9;\n  padding: 20px;\n  border-radius: 5px;\n}\n.right-arrow[data-v-8261b84a] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-pack: distribute;\n      justify-content: space-around;\n}\n.confirm-send-button[data-v-8261b84a] {\n  margin-top: 40px;\n  margin-bottom: 20px;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.confirm-send-button > li[data-v-8261b84a] {\n    margin: 0 auto;\n}\n.confirm-send-button > li .provider-address-details[data-v-8261b84a] {\n      text-align: center;\n      margin-right: 15px;\n}\n.check-box[data-v-8261b84a] {\n  position: relative;\n}\n\n/* Customize the label (the container) */\n.check-box-container[data-v-8261b84a] {\n  display: block;\n  position: relative;\n  padding-left: 35px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  font-size: 22px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  line-height: 21px;\n}\n\n/* Hide the browser's default checkbox */\n.check-box-container input[data-v-8261b84a] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n\n/* Create a custom checkbox */\n.checkmark[data-v-8261b84a] {\n  position: absolute;\n  top: 2px;\n  left: 0;\n  height: 25px;\n  width: 25px;\n  background-color: #eee;\n  border-radius: 7px;\n}\n\n/* On mouse-over, add a grey background color */\n.check-box-container:hover input ~ .checkmark[data-v-8261b84a] {\n  background-color: #ccc;\n}\n\n/* When the checkbox is checked, add a blue background */\n.check-box-container input:checked ~ .checkmark[data-v-8261b84a] {\n  background-color: #05c0a5;\n}\n\n/* Create the checkmark/indicator (hidden when not checked) */\n.checkmark[data-v-8261b84a]::after {\n  content: '';\n  position: absolute;\n  display: none;\n}\n\n/* Show the checkmark when checked */\n.check-box-container input:checked ~ .checkmark[data-v-8261b84a]::after {\n  display: block;\n}\n\n/* Style the checkmark/indicator */\n.check-box-container .checkmark[data-v-8261b84a]::after {\n  left: 10px;\n  top: 7px;\n  width: 5px;\n  height: 10px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".message[data-v-281f82a3] {\n  line-height: 19px;\n}\n.cc-icon[data-v-281f82a3] {\n  font-size: 36px;\n}\n.modal-content-container[data-v-281f82a3] {\n  padding: 30px;\n}\n.inputs-container[data-v-281f82a3] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.inputs-container .input-container[data-v-281f82a3] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    margin-bottom: 20px;\n}\n.inputs-container .input-container label[data-v-281f82a3] {\n      color: #0b2840;\n      font-size: 16px;\n      font-weight: 600;\n      padding: 10px 7px;\n}\n.inputs-container .input-container label i[data-v-281f82a3] {\n        font-size: 14px;\n        margin-right: 2px;\n}\n.inputs-container .input-container label .input-title[data-v-281f82a3] {\n        font-size: 16px;\n}\n.inputs-container .input-container .input-box[data-v-281f82a3] {\n      margin-bottom: 10px;\n      position: relative;\n      border-radius: 4px;\n}\n.inputs-container .input-container .input-box.danger[data-v-281f82a3] {\n        border: 1px solid red;\n}\n.inputs-container .input-container .input-box input[data-v-281f82a3] {\n        background-color: #f9f9f9;\n        border: 0;\n        border-radius: 4px;\n        font-size: 14px;\n        padding: 20px;\n        width: 100%;\n}\n.inputs-container .input-container .input-box .input-unit[data-v-281f82a3] {\n        font-size: 14px;\n        color: #b2bfc9;\n        font-weight: 500;\n        position: absolute;\n        right: 20px;\n        top: 20px;\n}\n.top-buttons[data-v-281f82a3] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0 10px;\n}\n.top-buttons .max-withdraw[data-v-281f82a3] {\n    margin-left: auto;\n    position: relative;\n    font-weight: 500;\n    color: #05c0a5;\n    cursor: pointer;\n}\n.sub-text[data-v-281f82a3] {\n  padding-left: 10px;\n  padding-bottom: 10px;\n}\n.sub-text .peth[data-v-281f82a3] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    margin-top: 10px;\n}\n.sub-text .peth .peth-value[data-v-281f82a3] {\n      margin-right: 5px;\n}\n.sub-text .above-max[data-v-281f82a3] {\n    margin-bottom: 2px;\n    color: #f00;\n    font-weight: 600;\n}\n.sub-text .btn[data-v-281f82a3] {\n    color: #adadad;\n}\n.sub-text .btn[data-v-281f82a3]:hover {\n      cursor: pointer;\n}\n.buttons[data-v-281f82a3] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.buttons > *[data-v-281f82a3] {\n    width: 100%;\n}\n.buttons > *[data-v-281f82a3]:first-child {\n      margin-right: 10px;\n}\n.padding-container[data-v-281f82a3] {\n  padding: 0 10px;\n}\n.padding-container .grid-block[data-v-281f82a3] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n    padding: 10px 0;\n}\n.padding-container .grid-block p[data-v-281f82a3]:last-child {\n      margin-left: auto;\n      text-align: right;\n      min-width: 100px;\n}\n.warning-confirmation[data-v-281f82a3] {\n  margin-top: 20px;\n  border: 1px solid #f5a623;\n  background-color: #fff6e6;\n  padding: 20px;\n  border-radius: 4px;\n}\n.warning-confirmation .grid-block[data-v-281f82a3] {\n    display: grid;\n    grid-template-columns: 60px 1fr;\n}\n.warning-confirmation .grid-block .sign[data-v-281f82a3] {\n      font-size: 30px;\n}\n.warning-confirmation .grid-block .text-content .title[data-v-281f82a3] {\n      font-size: 18px;\n      font-weight: 600;\n      margin: 0;\n      padding: 0;\n}\n.warning-confirmation .grid-block .text-content .warning-details[data-v-281f82a3] {\n      margin-top: 5px;\n      color: #0b2840;\n      margin-bottom: 10px;\n      font-size: 14px;\n}\n.warning-confirmation .grid-block .text-content .checkbox-label[data-v-281f82a3] {\n      color: #05c0a5;\n      font-weight: 500;\n}\n", ""]);

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

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("51d76628", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("3287cecc", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("72fee7ae", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("6de006f7", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("36fac2c1", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

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

/***/ "./src/dapps/MakerDai/MakerCDP.js":
/*!****************************************!*\
  !*** ./src/dapps/MakerDai/MakerCDP.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MakerCDP; });
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime-corejs2/helpers/esm/classCallCheck.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/createClass */ "./node_modules/@babel/runtime-corejs2/helpers/esm/createClass.js");
/* harmony import */ var _makerdao_dai__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @makerdao/dai */ "./node_modules/@makerdao/dai/dist/src/index.js");
/* harmony import */ var _makerdao_dai__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_makerdao_dai__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(bignumber_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers */ "./src/dapps/MakerDai/helpers.js");








var MKR = _makerdao_dai__WEBPACK_IMPORTED_MODULE_5___default.a.MKR,
    DAI = _makerdao_dai__WEBPACK_IMPORTED_MODULE_5___default.a.DAI;

var toBigNumber = function toBigNumber(num) {
  return new bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a(num);
};

var MakerCDP =
/*#__PURE__*/
function () {
  function MakerCDP(cdpId, web3, services, sysVars) {
    Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_3__["default"])(this, MakerCDP);

    this.cdpId = cdpId;
    this.cdp = {};
    this.web3 = web3 || {};
    this.ready = false;
    this.doUpdate = 0;
    this.cdps = [];
    this.noProxy = sysVars.noProxy || false;
    this.services = services || null;
    this.needsUpdate = false;
    this.closing = false;
    this.opening = false;
    this.migrated = false;
    this.migrateCdpActive = false;
    this.migrateCdpStage = 0;
    this._liqPrice = toBigNumber(0);
    this.isSafe = false;
    this.debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this.ethCollateral = toBigNumber(0);
    this.pethCollateral = toBigNumber(0);
    this._usdCollateral = toBigNumber(0);
    this._governanceFee = toBigNumber(0);
  } // Getters


  Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(MakerCDP, [{
    key: "init",
    // Methods
    value: function () {
      var _init = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var cdpId,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                cdpId = _args.length > 0 && _args[0] !== undefined ? _args[0] : this.cdpId;
                _context.next = 3;
                return this.updateValues(cdpId);

              case 3:
                _context.next = 5;
                return this.cdpService.getGovernanceFee(this.cdpId, MKR);

              case 5:
                this._governanceFee = _context.sent.toBigNumber();
                this.ready = true;
                return _context.abrupt("return", this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "updateValues",
    value: function () {
      var _updateValues = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var cdpId,
            liqPrice,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                cdpId = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : this.cdpId;
                _context2.next = 3;
                return this.services.getProxy();

              case 3:
                this._proxyAddress = _context2.sent;
                this.noProxy = this._proxyAddress === null;

                if (!this._proxyAddress) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 8;
                return this.services.getCdp(cdpId, this._proxyAddress);

              case 8:
                this.cdp = _context2.sent;
                _context2.next = 14;
                break;

              case 11:
                _context2.next = 13;
                return this.services.getCdp(cdpId, false);

              case 13:
                this.cdp = _context2.sent;

              case 14:
                _context2.next = 16;
                return this.cdp.getLiquidationPrice();

              case 16:
                liqPrice = _context2.sent;
                this._liqPrice = liqPrice.toBigNumber().toFixed(2);
                _context2.next = 20;
                return this.cdp.isSafe();

              case 20:
                this.isSafe = _context2.sent;
                _context2.next = 23;
                return this.cdp.getDebtValue();

              case 23:
                this.debtValue = _context2.sent.toBigNumber();
                _context2.next = 26;
                return this.cdp.getCollateralizationRatio();

              case 26:
                this._collatRatio = _context2.sent;
                _context2.next = 29;
                return this.cdp.getCollateralValue();

              case 29:
                this.ethCollateral = _context2.sent.toBigNumber();
                _context2.next = 32;
                return this.cdp.getCollateralValue(_makerdao_dai__WEBPACK_IMPORTED_MODULE_5___default.a.PETH);

              case 32:
                this.pethCollateral = _context2.sent.toBigNumber();
                _context2.next = 35;
                return this.cdp.getCollateralValue(_makerdao_dai__WEBPACK_IMPORTED_MODULE_5___default.a.USD);

              case 35:
                this._usdCollateral = _context2.sent.toBigNumber();

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateValues() {
        return _updateValues.apply(this, arguments);
      }

      return updateValues;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var currentProxy;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.migrated) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 3;
                return this.proxyService.currentProxy();

              case 3:
                currentProxy = _context3.sent;

                if (!currentProxy) {
                  _context3.next = 8;
                  break;
                }

                this.migrated = false;
                _context3.next = 8;
                return this.cdpService.give(this.cdpId, this._proxyAddress);

              case 8:
                if (!this.needsUpdate) {
                  _context3.next = 15;
                  break;
                }

                this.opening = false;
                this.needsUpdate = false;
                _context3.next = 13;
                return this.updateValues(this.cdpId);

              case 13:
                this.doUpdate++;
                return _context3.abrupt("return", this);

              case 15:
                return _context3.abrupt("return", this);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: "getProxy",
    value: function () {
      var _getProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.services.getProxy();

              case 2:
                this._proxyAddress = _context4.sent;

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getProxy() {
        return _getProxy.apply(this, arguments);
      }

      return getProxy;
    }()
  }, {
    key: "migrateCdp",
    value: function () {
      var _migrateCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        var currentProxy;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getProxy();

              case 2:
                currentProxy = _context5.sent;

                if (currentProxy) {
                  _context5.next = 10;
                  break;
                }

                this.needsUpdate = true;
                _context5.next = 7;
                return this.proxyService.ensureProxy();

              case 7:
                return _context5.abrupt("return", _context5.sent);

              case 10:
                if (!this.needToFinishMigrating) {
                  _context5.next = 14;
                  break;
                }

                this.needsUpdate = true;
                _context5.next = 14;
                return this.cdpService.give(this.cdpId, this._proxyAddress);

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function migrateCdp() {
        return _migrateCdp.apply(this, arguments);
      }

      return migrateCdp;
    }()
  }, {
    key: "openCdp",
    value: function () {
      var _openCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(ethQty, daiQty) {
        var newCdp;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(ethQty <= 0)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return", 0);

              case 2:
                if (this.hasProxy) {
                  _context6.next = 10;
                  break;
                }

                this.opening = true;
                this.needsUpdate = true;
                _context6.next = 7;
                return this.cdpService.openProxyCdpLockEthAndDrawDai(ethQty, daiQty, null);

              case 7:
                newCdp = _context6.sent;
                _context6.next = 15;
                break;

              case 10:
                this.opening = true;
                this.needsUpdate = true;
                _context6.next = 14;
                return this.cdpService.openProxyCdpLockEthAndDrawDai(ethQty, daiQty, this.proxyAddress);

              case 14:
                newCdp = _context6.sent;

              case 15:
                return _context6.abrupt("return", newCdp.id);

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function openCdp(_x, _x2) {
        return _openCdp.apply(this, arguments);
      }

      return openCdp;
    }()
  }, {
    key: "lockEth",
    value: function () {
      var _lockEth = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(amount) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;

                if (!this.noProxy) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return");

              case 3:
                this.needsUpdate = true;
                _context7.next = 6;
                return this.cdpService.lockEthProxy(this._proxyAddress, this.cdpId, amount);

              case 6:
                _context7.next = 11;
                break;

              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](0);
                // eslint-disable-next-line
                console.error(_context7.t0);

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 8]]);
      }));

      function lockEth(_x3) {
        return _lockEth.apply(this, arguments);
      }

      return lockEth;
    }()
  }, {
    key: "drawDai",
    value: function drawDai(amount) {
      var acknowledgeBypass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.calcCollatRatio(this.ethCollateral, this.debtValue.plus(amount)).gt(2) || acknowledgeBypass) {
        try {
          if (this.noProxy) {
            return;
          }

          this.needsUpdate = true;
          this.cdpService.drawDaiProxy(this._proxyAddress, this.cdpId, amount);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        }
      }
    } // This should also have a acknowledgeBypass

  }, {
    key: "freeEth",
    value: function () {
      var _freeEth = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(amount) {
        var acknowledgeBypass,
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                acknowledgeBypass = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : false;

                if (!(this.debtValue.eq(0) || this.calcCollatRatio(this.ethCollateral.minus(amount), this.debtValue).gt(1.5) || acknowledgeBypass)) {
                  _context8.next = 13;
                  break;
                }

                _context8.prev = 2;

                if (!this.noProxy) {
                  _context8.next = 5;
                  break;
                }

                return _context8.abrupt("return");

              case 5:
                this.needsUpdate = true;
                _context8.next = 8;
                return this.cdpService.freeEthProxy(this._proxyAddress, this.cdpId, amount);

              case 8:
                _context8.next = 13;
                break;

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8["catch"](2);
                // eslint-disable-next-line
                console.error(_context8.t0);

              case 13:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2, 10]]);
      }));

      function freeEth(_x4) {
        return _freeEth.apply(this, arguments);
      }

      return freeEth;
    }()
  }, {
    key: "wipeDai",
    value: function () {
      var _wipeDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(amount) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;

                if (!this.noProxy) {
                  _context9.next = 3;
                  break;
                }

                return _context9.abrupt("return");

              case 3:
                this.needsUpdate = true;
                _context9.next = 6;
                return this.cdpService.wipeDaiProxy(this._proxyAddress, this.cdpId, amount);

              case 6:
                _context9.next = 11;
                break;

              case 8:
                _context9.prev = 8;
                _context9.t0 = _context9["catch"](0);
                // eslint-disable-next-line
                console.error(_context9.t0);

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 8]]);
      }));

      function wipeDai(_x5) {
        return _wipeDai.apply(this, arguments);
      }

      return wipeDai;
    }()
  }, {
    key: "canCloseCdp",
    value: function () {
      var _canCloseCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10() {
        var value;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                value = this.debtValue.toNumber();
                _context10.next = 3;
                return this.cdpService.enoughMkrToWipe(this.cdpId, value);

              case 3:
                return _context10.abrupt("return", _context10.sent);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function canCloseCdp() {
        return _canCloseCdp.apply(this, arguments);
      }

      return canCloseCdp;
    }()
  }, {
    key: "closeCdp",
    value: function () {
      var _closeCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                this.needsUpdate = true;
                this.closing = true;

                if (!this.hasProxy) {
                  _context11.next = 6;
                  break;
                }

                _context11.next = 6;
                return this.cdpService.shutProxy(this._proxyAddress, this.cdpId);

              case 6:
                _context11.next = 12;
                break;

              case 8:
                _context11.prev = 8;
                _context11.t0 = _context11["catch"](0);
                // eslint-disable-next-line
                console.log('closeCdp Error:'); // eslint-disable-next-line

                console.error(_context11.t0);

              case 12:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 8]]);
      }));

      function closeCdp() {
        return _closeCdp.apply(this, arguments);
      }

      return closeCdp;
    }()
  }, {
    key: "checkIfDestAddressHasProxy",
    value: function () {
      var _checkIfDestAddressHasProxy = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(address) {
        var proxy;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.getProxy();

              case 2:
                _context12.next = 4;
                return this.proxyService.getProxyAddress(address);

              case 4:
                proxy = _context12.sent;
                return _context12.abrupt("return", proxy);

              case 6:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function checkIfDestAddressHasProxy(_x6) {
        return _checkIfDestAddressHasProxy.apply(this, arguments);
      }

      return checkIfDestAddressHasProxy;
    }()
  }, {
    key: "moveCdp",
    value: function () {
      var _moveCdp = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13(address) {
        var proxy;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.getProxy();

              case 2:
                _context13.next = 4;
                return this.proxyService.getProxyAddress(address);

              case 4:
                proxy = _context13.sent;

                if (!proxy) {
                  _context13.next = 12;
                  break;
                }

                this.needsUpdate = true;
                this.closing = true; // for the purpose of displaying to the user closing and moving are the same

                _context13.next = 10;
                return this.cdpService.giveProxy(this._proxyAddress, this.cdpId, proxy);

              case 10:
                _context13.next = 23;
                break;

              case 12:
                if (this.noProxy) {
                  _context13.next = 19;
                  break;
                }

                this.needsUpdate = true;
                this.closing = true;
                _context13.next = 17;
                return this.cdpService.giveProxy(this._proxyAddress, this.cdpId, address);

              case 17:
                _context13.next = 23;
                break;

              case 19:
                this.needsUpdate = true;
                this.closing = true;
                _context13.next = 23;
                return this.cdpService.give(this.cdpId, address);

              case 23:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function moveCdp(_x7) {
        return _moveCdp.apply(this, arguments);
      }

      return moveCdp;
    }()
  }, {
    key: "enoughMkrToWipe",
    value: function enoughMkrToWipe(amount) {
      return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
    } // Calculations

  }, {
    key: "toUSD",
    value: function toUSD(eth) {
      var toUsd = this.services.toUSD(eth);

      if (toUsd.lt(0)) {
        return toBigNumber(0);
      }

      return toUsd;
    }
  }, {
    key: "toPeth",
    value: function toPeth(eth) {
      return this.services.toPeth(eth);
    }
  }, {
    key: "maxDaiDraw",
    value: function maxDaiDraw() {
      var tl = toBigNumber(this.ethPrice).times(toBigNumber(this.ethCollateral));
      var tr = toBigNumber(this.debtValue).times(toBigNumber(this.liquidationRatio));
      return tl.minus(tr).div(toBigNumber(this.ethPrice));
    }
  }, {
    key: "calcCollatRatio",
    value: function calcCollatRatio(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
      return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["calcCollatRatio"])(this.ethPrice, ethQty, daiQty);
    }
  }, {
    key: "calcLiquidationPrice",
    value: function calcLiquidationPrice(ethQty, daiQty) {
      if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
      return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["calcLiquidationPrice"])(ethQty, daiQty, this.ethPrice, this.liquidationRatio);
    } // Helpers

  }, {
    key: "approveDai",
    value: function () {
      var _approveDai = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14() {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.daiToken.approveUnlimited(this.proxyAddress);

              case 2:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function approveDai() {
        return _approveDai.apply(this, arguments);
      }

      return approveDai;
    }()
  }, {
    key: "approveMkr",
    value: function () {
      var _approveMkr = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.mkrToken.approveUnlimited(this.proxyAddress);

              case 2:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function approveMkr() {
        return _approveMkr.apply(this, arguments);
      }

      return approveMkr;
    }()
  }, {
    key: "getDaiBalances",
    value: function () {
      var _getDaiBalances = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee16() {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.services.daiToken.balance();

              case 2:
                this.daiBalance = _context16.sent;
                return _context16.abrupt("return", this.daiBalance);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getDaiBalances() {
        return _getDaiBalances.apply(this, arguments);
      }

      return getDaiBalances;
    }() // Static Helpers

  }, {
    key: "currentAddress",
    get: function get() {
      return this.services.account.address;
    }
  }, {
    key: "liquidationPenalty",
    get: function get() {
      return this.services.liquidationPenalty;
    }
  }, {
    key: "stabilityFee",
    get: function get() {
      return this.services.stabilityFee;
    }
  }, {
    key: "ethPrice",
    get: function get() {
      return this.services.ethPrice;
    }
  }, {
    key: "pethPrice",
    get: function get() {
      return this.services._pethPrice;
    }
  }, {
    key: "wethToPethRatio",
    get: function get() {
      return this.services.wethToPethRatio;
    }
  }, {
    key: "liquidationRatio",
    get: function get() {
      return this.services.liquidationRatio;
    }
  }, {
    key: "proxyAddress",
    get: function get() {
      return this.services._proxyAddress;
    }
  }, {
    key: "hasProxy",
    get: function get() {
      return this.services.hasProxy;
    }
  }, {
    key: "proxyAllowanceDai",
    get: function get() {
      return this.services.proxyAllowanceDai;
    }
  }, {
    key: "proxyAllowanceMkr",
    get: function get() {
      return this.services.proxyAllowanceMkr;
    }
  }, {
    key: "daiToken",
    get: function get() {
      return this.services._daiToken;
    }
  }, {
    key: "daiBalance",
    get: function get() {
      return this.services.daiBalance;
    }
  }, {
    key: "mkrToken",
    get: function get() {
      return this.services._mkrToken;
    }
  }, {
    key: "mkrBalance",
    get: function get() {
      return this.services.mkrBalance;
    }
  }, {
    key: "proxyService",
    get: function get() {
      return this.services._proxyService;
    }
  }, {
    key: "cdpService",
    get: function get() {
      return this.services._cdpService;
    }
  }, {
    key: "minEth",
    get: function get() {
      return this.services.minEth();
    }
  }, {
    key: "pethMin",
    get: function get() {
      return this.services.pethMin;
    } // CDP Instance/item values

  }, {
    key: "zeroDebt",
    get: function get() {
      return toBigNumber(this.debtValue).eq(0);
    }
  }, {
    key: "usdCollateral",
    get: function get() {
      return this.toUSD(this.ethCollateral);
    }
  }, {
    key: "ethCollateralNum",
    get: function get() {
      return this.ethCollateral.toNumber();
    }
  }, {
    key: "collatRatio",
    get: function get() {
      return this._collatRatio;
    }
  }, {
    key: "liquidationPrice",
    get: function get() {
      return this._liqPrice;
    }
  }, {
    key: "governanceFeeOwed",
    get: function get() {
      return this._governanceFee;
    }
  }, {
    key: "maxDai",
    get: function get() {
      if (this.ethPrice && this.ethCollateral && this.liquidationRatio && this.debtValue) {
        return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["maxDai"])(this.ethPrice, this.ethCollateral, this.liquidationRatio.plus(0.001), this.debtValue);
      }

      return toBigNumber(0);
    }
  }, {
    key: "maxEthDraw",
    get: function get() {
      if (this.ethPrice && this.debtValue && this.liquidationRatio) {
        if (this.zeroDebt) {
          return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["maxEthDraw"])(this.ethCollateral, this.liquidationRatio.plus(0.001), this.debtValue, this.ethPrice, this.minEth.times(1.0));
        }

        return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["maxEthDraw"])(this.ethCollateral, this.liquidationRatio.plus(0.001), this.debtValue, this.ethPrice);
      }

      return toBigNumber(0);
    }
  }, {
    key: "maxPethDraw",
    get: function get() {
      if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
        if (this.zeroDebt) {
          return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["maxPethDraw"])(this.pethCollateral, this.liquidationRatio.plus(0.001), this.debtValue, this.pethPrice, this.pethMin.times(1.0));
        }

        return Object(_helpers__WEBPACK_IMPORTED_MODULE_7__["maxPethDraw"])(this.pethCollateral, this.liquidationRatio.plus(0.001), this.debtValue, this.pethPrice);
      }

      return toBigNumber(0);
    }
  }, {
    key: "maxUsdDraw",
    get: function get() {
      if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
        return this.toUSD(this.maxEthDraw);
      }

      return toBigNumber(0);
    }
  }, {
    key: "needToFinishMigrating",
    get: function get() {
      return this._proxyAddress && this.noProxy;
    }
  }], [{
    key: "toNumber",
    value: function toNumber(val) {
      if (bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a.isBigNumber(val)) {
        return val.toNumber();
      }

      return toBigNumber(val).toNumber();
    }
  }, {
    key: "displayPercentValue",
    value: function displayPercentValue(raw) {
      if (!bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a.isBigNumber(raw)) raw = new bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a(raw);
      return raw.times(100).toString();
    }
  }, {
    key: "displayFixedValue",
    value: function displayFixedValue(raw) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (!bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a.isBigNumber(raw)) raw = new bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a(raw);
      if (round) return raw.toFixed(decimals, bignumber_js__WEBPACK_IMPORTED_MODULE_6___default.a.ROUND_DOWN).toString();
      return raw.toFixed(decimals).toString();
    }
  }]);

  return MakerCDP;
}();



/***/ }),

/***/ "./src/dapps/MakerDai/MakerDai.vue":
/*!*****************************************!*\
  !*** ./src/dapps/MakerDai/MakerDai.vue ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& */ "./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&");
/* harmony import */ var _MakerDai_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MakerDai.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& */ "./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _MakerDai_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "284aac6d",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('284aac6d')) {
      api.createRecord('284aac6d', component.options)
    } else {
      api.reload('284aac6d', component.options)
    }
    module.hot.accept(/*! ./MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& */ "./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& */ "./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&");
(function () {
      api.rerender('284aac6d', {
        render: _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/MakerDai.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js&":
/*!******************************************************************!*\
  !*** ./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js& ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&":
/*!***************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=style&index=0&id=284aac6d&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_style_index_0_id_284aac6d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&":
/*!************************************************************************************!*\
  !*** ./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./MakerDai.vue?vue&type=template&id=284aac6d&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/MakerDai.vue?vue&type=template&id=284aac6d&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MakerDai_vue_vue_type_template_id_284aac6d_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue":
/*!*********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DepositModal/DepositModal.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&");
/* harmony import */ var _DepositModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DepositModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DepositModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "14929f7b",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('14929f7b')) {
      api.createRecord('14929f7b', component.options)
    } else {
      api.reload('14929f7b', component.options)
    }
    module.hot.accept(/*! ./DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&");
(function () {
      api.rerender('14929f7b', {
        render: _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/DepositModal/DepositModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=style&index=0&id=14929f7b&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_style_index_0_id_14929f7b_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&":
/*!****************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./DepositModal.vue?vue&type=template&id=14929f7b&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/DepositModal/DepositModal.vue?vue&type=template&id=14929f7b&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DepositModal_vue_vue_type_template_id_14929f7b_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/DepositModal/index.js":
/*!*************************************************************!*\
  !*** ./src/dapps/MakerDai/components/DepositModal/index.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DepositModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DepositModal */ "./src/dapps/MakerDai/components/DepositModal/DepositModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _DepositModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue":
/*!***********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&");
/* harmony import */ var _GenerateModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GenerateModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _GenerateModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3d926dcd",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('3d926dcd')) {
      api.createRecord('3d926dcd', component.options)
    } else {
      api.reload('3d926dcd', component.options)
    }
    module.hot.accept(/*! ./GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&");
(function () {
      api.rerender('3d926dcd', {
        render: _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=style&index=0&id=3d926dcd&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_style_index_0_id_3d926dcd_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&":
/*!******************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& ***!
  \******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue?vue&type=template&id=3d926dcd&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GenerateModal_vue_vue_type_template_id_3d926dcd_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/GenerateModal/index.js":
/*!**************************************************************!*\
  !*** ./src/dapps/MakerDai/components/GenerateModal/index.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GenerateModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GenerateModal */ "./src/dapps/MakerDai/components/GenerateModal/GenerateModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _GenerateModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue":
/*!*********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&");
/* harmony import */ var _PaybackModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PaybackModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _PaybackModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "8261b84a",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('8261b84a')) {
      api.createRecord('8261b84a', component.options)
    } else {
      api.reload('8261b84a', component.options)
    }
    module.hot.accept(/*! ./PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&");
(function () {
      api.rerender('8261b84a', {
        render: _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=style&index=0&id=8261b84a&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_style_index_0_id_8261b84a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&":
/*!****************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& ***!
  \****************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue?vue&type=template&id=8261b84a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PaybackModal_vue_vue_type_template_id_8261b84a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/PaybackModal/index.js":
/*!*************************************************************!*\
  !*** ./src/dapps/MakerDai/components/PaybackModal/index.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PaybackModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PaybackModal */ "./src/dapps/MakerDai/components/PaybackModal/PaybackModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _PaybackModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue":
/*!***********************************************************************!*\
  !*** ./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&");
/* harmony import */ var _WithdrawModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WithdrawModal.vue?vue&type=script&lang=js& */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _WithdrawModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "281f82a3",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('281f82a3')) {
      api.createRecord('281f82a3', component.options)
    } else {
      api.reload('281f82a3', component.options)
    }
    module.hot.accept(/*! ./WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&");
(function () {
      api.rerender('281f82a3', {
        render: _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js&":
/*!************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../../../node_modules/babel-loader/lib!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&":
/*!*********************************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=style&index=0&id=281f82a3&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_style_index_0_id_281f82a3_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&":
/*!******************************************************************************************************************!*\
  !*** ./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& ***!
  \******************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue?vue&type=template&id=281f82a3&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_WithdrawModal_vue_vue_type_template_id_281f82a3_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./src/dapps/MakerDai/components/WithdrawModal/index.js":
/*!**************************************************************!*\
  !*** ./src/dapps/MakerDai/components/WithdrawModal/index.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _WithdrawModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WithdrawModal */ "./src/dapps/MakerDai/components/WithdrawModal/WithdrawModal.vue");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _WithdrawModal__WEBPACK_IMPORTED_MODULE_0__["default"]; });



/***/ }),

/***/ 10:
/*!*************************!*\
  !*** request (ignored) ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

}]);
//# sourceMappingURL=18.js.map