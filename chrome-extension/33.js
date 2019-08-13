((typeof self !== 'undefined' ? self : this)["webpackJsonp"] = (typeof self !== 'undefined' ? self : this)["webpackJsonp"] || []).push([[33],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es7.object.get-own-property-descriptors */ "./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js");
/* harmony import */ var core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es7_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.keys */ "./node_modules/core-js/modules/es6.object.keys.js");
/* harmony import */ var core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.array.find */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var _layouts_InterfaceLayout_components_BackButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/layouts/InterfaceLayout/components/BackButton */ "./src/layouts/InterfaceLayout/components/BackButton/index.js");
/* harmony import */ var _ABI_registrarAbi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ABI/registrarAbi */ "./src/dapps/ManageENS/ABI/registrarAbi.js");
/* harmony import */ var _ABI_permanentRegistrarController__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ABI/permanentRegistrarController */ "./src/dapps/ManageENS/ABI/permanentRegistrarController.js");
/* harmony import */ var _ABI_baseRegistrarAbi__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ABI/baseRegistrarAbi */ "./src/dapps/ManageENS/ABI/baseRegistrarAbi.js");
/* harmony import */ var _ABI_deedContractAbi__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ABI/deedContractAbi */ "./src/dapps/ManageENS/ABI/deedContractAbi.js");
/* harmony import */ var _ABI_registryAbi_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ABI/registryAbi.js */ "./src/dapps/ManageENS/ABI/registryAbi.js");
/* harmony import */ var _ABI_fifsRegistrarAbi_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ABI/fifsRegistrarAbi.js */ "./src/dapps/ManageENS/ABI/fifsRegistrarAbi.js");
/* harmony import */ var _ABI_resolverAbi_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ABI/resolverAbi.js */ "./src/dapps/ManageENS/ABI/resolverAbi.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ethjs-unit */ "./node_modules/ethjs-unit/lib/index.js");
/* harmony import */ var ethjs_unit__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(ethjs_unit__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var eth_ens_namehash__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! eth-ens-namehash */ "./node_modules/eth-ens-namehash/index.js");
/* harmony import */ var eth_ens_namehash__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(eth_ens_namehash__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _helpers_normalise__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @/helpers/normalise */ "./src/helpers/normalise.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @/helpers */ "./src/helpers/index.js");
/* harmony import */ var _ensdomains_dnsregistrar__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ensdomains/dnsregistrar */ "./node_modules/@ensdomains/dnsregistrar/dist/dnsregistrar.js");
/* harmony import */ var _ensdomains_dnsregistrar__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(_ensdomains_dnsregistrar__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js");
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(bignumber_js__WEBPACK_IMPORTED_MODULE_22__);









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
















var bip39 = __webpack_require__(/*! bip39 */ "./node_modules/bip39/src/index.js");

var permanentRegistrar = {
  INTERFACE_CONTROLLER: '0x018fac06',
  INTERFACE_LEGACY_REGISTRAR: '0x7ba18ba1'
};
var REGISTRAR_TYPES = {
  AUCTION: 'auction',
  FIFS: 'fifs',
  PERMANENT: 'permanent'
};
/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    'back-button': _layouts_InterfaceLayout_components_BackButton__WEBPACK_IMPORTED_MODULE_8__["default"]
  },
  data: function data() {
    return {
      domainName: '',
      loading: false,
      bidAmount: 0.01,
      bidMask: 0.02,
      nameHash: '',
      labelHash: '',
      owner: '',
      resolverAddress: '',
      deedOwner: '',
      secretPhrase: '',
      registrarAddress: '',
      auctionDateEnd: 0,
      raw: {},
      highestBid: '',
      contractInitiated: false,
      step: 1,
      domainNameErr: false,
      ensRegistryContract: {},
      dnsRegistrar: {},
      dnsClaim: {},
      dnsOwner: '',
      legacyRegistrar: {},
      minimumAge: 0,
      duration: 1,
      commitmentCreated: false
    };
  },
  computed: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_19__["mapState"])(['web3', 'network', 'account', 'gasPrice', 'ens']), {
    registrarTLD: function registrarTLD() {
      return this.network.type.ens.registrarTLD;
    },
    registrarType: function registrarType() {
      return this.network.type.ens.registrarType;
    },
    multiTld: function multiTld() {
      return this.network.type.ens.hasOwnProperty('supportedTld') && this.network.type.ens.supportedTld.length > 1;
    },
    parsedTld: function parsedTld() {
      if (this.parsedHostName.length) {
        var hasTld = this.domainName.lastIndexOf('.');
        return hasTld > -1 ? this.domainName.substr(hasTld + 1, this.domainName.length) : this.registrarTLD;
      }

      return '';
    },
    parsedHostName: function parsedHostName() {
      return this.domainName.substr(0, this.domainName.lastIndexOf('.') > -1 ? this.domainName.lastIndexOf('.') : this.domainName.length);
    },
    parsedDomainName: function parsedDomainName() {
      return this.parsedHostName + '.' + this.parsedTld;
    }
  }),
  watch: {
    ens: function ens(newVal) {
      if (newVal) {
        this.setRegistrar();
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setup();
    });
  },
  methods: {
    setup: function () {
      var _setup = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.isPermanentLive = true;
                this.domainName = '';
                this.loading = false;
                this.bidAmount = 0.01;
                this.bidMask = 0.02;
                this.nameHash = '';
                this.labelHash = '';
                this.owner = '';
                this.resolverAddress = '';
                this.deedOwner = '';
                this.secretPhrase = '';
                this.registrarAddress = '';
                this.auctionDateEnd = 0;
                this.raw = {};
                this.highestBid = '';
                this.contractInitiated = false;
                this.step = 1;
                this.contractInitiated = false;
                this.contractInitiated = true;
                this.domainNameErr = false;
                this.dnsRegistrar = {};
                this.dnsClaim = {};
                this.legacyRegistrar = {};
                this.minimumAge = 0;
                this.duration = 1;
                this.commitmentCreated = false;

                if (this.ens) {
                  this.setRegistrar();
                }

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setup() {
        return _setup.apply(this, arguments);
      }

      return setup;
    }(),
    setRegistrar: function () {
      var _setRegistrar = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var web3, tld, controllerAddress;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                web3 = this.web3;
                tld = this.registrarTLD;
                _context2.next = 4;
                return this.getRegistrarAddress(tld);

              case 4:
                this.registrarAddress = _context2.sent;
                this.ensRegistryContract = new web3.eth.Contract(_ABI_registryAbi_js__WEBPACK_IMPORTED_MODULE_13__["default"], this.network.type.ens.registry);

                if (!(this.registrarType === REGISTRAR_TYPES.AUCTION)) {
                  _context2.next = 10;
                  break;
                }

                this.registrarContract = new web3.eth.Contract(_ABI_registrarAbi__WEBPACK_IMPORTED_MODULE_9__["default"], this.registrarAddress);
                _context2.next = 27;
                break;

              case 10:
                if (!(this.registrarType === REGISTRAR_TYPES.FIFS)) {
                  _context2.next = 14;
                  break;
                }

                this.registrarContract = new web3.eth.Contract(_ABI_fifsRegistrarAbi_js__WEBPACK_IMPORTED_MODULE_14__["default"], this.registrarAddress);
                _context2.next = 27;
                break;

              case 14:
                if (!(this.registrarType === REGISTRAR_TYPES.PERMANENT)) {
                  _context2.next = 27;
                  break;
                }

                _context2.prev = 15;
                _context2.next = 18;
                return this.ens.resolver(this.registrarTLD, _ABI_resolverAbi_js__WEBPACK_IMPORTED_MODULE_15__["default"]).interfaceImplementer(permanentRegistrar.INTERFACE_CONTROLLER);

              case 18:
                controllerAddress = _context2.sent;
                this.registrarControllerContract = new this.web3.eth.Contract(_ABI_permanentRegistrarController__WEBPACK_IMPORTED_MODULE_10__["default"], controllerAddress);
                this.registrarContract = new this.web3.eth.Contract(_ABI_baseRegistrarAbi__WEBPACK_IMPORTED_MODULE_11__["default"], this.registrarAddress);
                _context2.next = 27;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](15);
                this.isPermanentLive = false;
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('ENS Permanent registrar is not available yet, please try again later', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);

              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[15, 23]]);
      }));

      function setRegistrar() {
        return _setRegistrar.apply(this, arguments);
      }

      return setRegistrar;
    }(),
    transferDomain: function () {
      var _transferDomain = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(toAddress) {
        var to, data, transferTx;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.registrarType === REGISTRAR_TYPES.AUCTION) {
                  data = this.registrarContract.methods.transfer(this.labelHash, toAddress).encodeABI();
                  to = this.registrarAddress;
                } else if (this.registrarType === REGISTRAR_TYPES.FIFS) {
                  data = this.ensRegistryContract.methods.setOwner(this.nameHash, toAddress).encodeABI();
                  to = this.network.type.ens.registry;
                } else if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
                  data = this.registrarContract.methods.safeTransferFrom(this.account.address, toAddress, this.labelHash).encodeABI();
                  to = this.registrarAddress;
                }

                transferTx = {
                  from: this.account.address,
                  to: to,
                  data: data,
                  value: 0
                };

                if (this.registrarType === REGISTRAR_TYPES.PERMANENT) {
                  this.web3.eth.sendTransaction(transferTx).catch(function (err) {
                    _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(err, false);
                  });
                }

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function transferDomain(_x) {
        return _transferDomain.apply(this, arguments);
      }

      return transferDomain;
    }(),
    updateResolver: function () {
      var _updateResolver = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(newResolverAddr) {
        var web3, address, resolver, publicResolverAddress, currentResolverAddress, publicResolverContract, setAddrTx, setResolverTx;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                web3 = this.web3;
                address = this.account.address; // Public resolver address

                _context4.next = 4;
                return this.ens.resolver('resolver.eth');

              case 4:
                resolver = _context4.sent;
                _context4.next = 7;
                return resolver.addr();

              case 7:
                publicResolverAddress = _context4.sent;
                _context4.next = 10;
                return this.ensRegistryContract.methods.resolver(this.nameHash).call();

              case 10:
                currentResolverAddress = _context4.sent;
                publicResolverContract = new web3.eth.Contract(_ABI_resolverAbi_js__WEBPACK_IMPORTED_MODULE_15__["default"], publicResolverAddress);
                _context4.t0 = address;
                _context4.t1 = publicResolverAddress;
                _context4.next = 16;
                return publicResolverContract.methods.setAddr(this.nameHash, newResolverAddr).encodeABI();

              case 16:
                _context4.t2 = _context4.sent;
                _context4.t3 = new bignumber_js__WEBPACK_IMPORTED_MODULE_22___default.a(ethjs_unit__WEBPACK_IMPORTED_MODULE_16__["toWei"](this.gasPrice, 'gwei')).toFixed();
                setAddrTx = {
                  from: _context4.t0,
                  to: _context4.t1,
                  data: _context4.t2,
                  value: 0,
                  gasPrice: _context4.t3
                };

                if (!(currentResolverAddress.toLowerCase() === publicResolverAddress.toLowerCase())) {
                  _context4.next = 23;
                  break;
                }

                web3.eth.sendTransaction(setAddrTx).catch(function (err) {
                  _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(err, false);
                });
                _context4.next = 31;
                break;

              case 23:
                _context4.t4 = address;
                _context4.t5 = this.network.type.ens.registry;
                _context4.next = 27;
                return this.ensRegistryContract.methods.setResolver(this.nameHash, publicResolverAddress).encodeABI();

              case 27:
                _context4.t6 = _context4.sent;
                _context4.t7 = new bignumber_js__WEBPACK_IMPORTED_MODULE_22___default.a(ethjs_unit__WEBPACK_IMPORTED_MODULE_16__["toWei"](this.gasPrice, 'gwei')).toFixed();
                setResolverTx = {
                  from: _context4.t4,
                  to: _context4.t5,
                  data: _context4.t6,
                  value: 0,
                  gasPrice: _context4.t7
                };
                web3.mew.sendBatchTransactions([setResolverTx, setAddrTx]);

              case 31:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateResolver(_x2) {
        return _updateResolver.apply(this, arguments);
      }

      return updateResolver;
    }(),
    finalize: function () {
      var _finalize = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        var address, web3, data, raw;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                address = this.account.address;
                web3 = this.web3;
                _context5.next = 4;
                return this.registrarContract.methods.finalizeAuction(this.labelHash).encodeABI();

              case 4:
                data = _context5.sent;
                raw = {
                  from: address,
                  value: 0,
                  to: this.registrarAddress,
                  data: data
                };
                web3.eth.sendTransaction(raw).catch(function (err) {
                  _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(err, false);
                });

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function finalize() {
        return _finalize.apply(this, arguments);
      }

      return finalize;
    }(),
    registerFifsName: function () {
      var _registerFifsName = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        var address, web3, data, raw;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                address = this.account.address;
                web3 = this.web3;
                _context6.next = 4;
                return this.registrarContract.methods.register(this.labelHash, address).encodeABI();

              case 4:
                data = _context6.sent;
                raw = {
                  from: address,
                  value: 0,
                  to: this.registrarAddress,
                  data: data
                };
                web3.eth.sendTransaction(raw).catch(function (err) {
                  _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(err, false);
                });

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function registerFifsName() {
        return _registerFifsName.apply(this, arguments);
      }

      return registerFifsName;
    }(),
    getRegistrarAddress: function () {
      var _getRegistrarAddress = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(tld) {
        var registrarAddress;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.ens.owner(tld);

              case 2:
                registrarAddress = _context7.sent;
                return _context7.abrupt("return", registrarAddress);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getRegistrarAddress(_x3) {
        return _getRegistrarAddress.apply(this, arguments);
      }

      return getRegistrarAddress;
    }(),
    checkDomain: function () {
      var _checkDomain = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var _this2 = this;

        var supportedTlds, isSupported, web3, domainStatus, expiryTime, isAvailable, oldRegistrarAddress, _domainStatus, deedContract, _isAvailable, registrarAddr, _owner;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                supportedTlds = this.network.type.ens.supportedTld;
                isSupported = supportedTlds.find(function (item) {
                  return item === _this2.parsedTld;
                });
                this.loading = true;
                web3 = this.web3;
                this.labelHash = web3.utils.sha3(this.parsedHostName);

                if (!(this.parsedTld !== '' && isSupported === undefined)) {
                  _context8.next = 10;
                  break;
                }

                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler("Domain TLD ".concat(this.parsedTld, " is not supported in this node!"), _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);
                this.loading = false;
                _context8.next = 77;
                break;

              case 10:
                if (!(this.parsedTld === this.registrarTLD)) {
                  _context8.next = 59;
                  break;
                }

                _context8.prev = 11;

                if (!(this.registrarType === REGISTRAR_TYPES.AUCTION)) {
                  _context8.next = 19;
                  break;
                }

                _context8.next = 15;
                return this.registrarContract.methods.entries(this.labelHash).call();

              case 15:
                domainStatus = _context8.sent;
                this.processResult(domainStatus);
                _context8.next = 51;
                break;

              case 19:
                if (!(this.registrarType === REGISTRAR_TYPES.FIFS)) {
                  _context8.next = 27;
                  break;
                }

                _context8.next = 22;
                return this.registrarContract.methods.expiryTimes(this.labelHash).call();

              case 22:
                expiryTime = _context8.sent;
                isAvailable = expiryTime * 1000 < new Date().getTime();

                if (isAvailable) {
                  this.$router.push({
                    path: 'manage-ens/fifs'
                  });
                  this.loading = false;
                } else {
                  this.getMoreInfo();
                  this.loading = false;
                }

                _context8.next = 51;
                break;

              case 27:
                if (!(this.registrarType === REGISTRAR_TYPES.PERMANENT)) {
                  _context8.next = 51;
                  break;
                }

                if (this.isPermanentLive) {
                  _context8.next = 31;
                  break;
                }

                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('ENS Permanent registrar is not available yet, please try again later', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);
                return _context8.abrupt("return");

              case 31:
                _context8.next = 33;
                return this.ens.resolver(this.registrarTLD, _ABI_resolverAbi_js__WEBPACK_IMPORTED_MODULE_15__["default"]).interfaceImplementer(permanentRegistrar.INTERFACE_LEGACY_REGISTRAR);

              case 33:
                oldRegistrarAddress = _context8.sent;
                this.legacyRegistrar = new this.web3.eth.Contract(_ABI_registrarAbi__WEBPACK_IMPORTED_MODULE_9__["default"], oldRegistrarAddress);
                _context8.next = 37;
                return this.legacyRegistrar.methods.entries(this.labelHash).call();

              case 37:
                _domainStatus = _context8.sent;

                if (!(_domainStatus[0] === '2')) {
                  _context8.next = 47;
                  break;
                }

                deedContract = new this.web3.eth.Contract(_ABI_deedContractAbi__WEBPACK_IMPORTED_MODULE_12__["default"], _domainStatus[1]);
                _context8.next = 42;
                return deedContract.methods.owner().call();

              case 42:
                this.deedOwner = _context8.sent;
                this.loading = false;
                this.$router.push({
                  path: 'manage-ens/transfer-registrar'
                });
                _context8.next = 51;
                break;

              case 47:
                _context8.next = 49;
                return this.registrarControllerContract.methods.available(this.parsedHostName).call();

              case 49:
                _isAvailable = _context8.sent;
                if (!_isAvailable) this.getMoreInfo();else {
                  this.generateKeyPhrase();
                  this.$router.push({
                    path: 'manage-ens/create-commitment'
                  });
                  this.loading = false;
                }

              case 51:
                _context8.next = 57;
                break;

              case 53:
                _context8.prev = 53;
                _context8.t0 = _context8["catch"](11);
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(_context8.t0, false);
                this.loading = false;

              case 57:
                _context8.next = 77;
                break;

              case 59:
                _context8.prev = 59;
                _context8.next = 62;
                return this.ens.owner(this.parsedTld);

              case 62:
                registrarAddr = _context8.sent;
                this.dnsRegistrar = new _ensdomains_dnsregistrar__WEBPACK_IMPORTED_MODULE_21___default.a(this.web3.currentProvider, registrarAddr);
                _context8.next = 66;
                return this.dnsRegistrar.claim(this.parsedDomainName);

              case 66:
                this.dnsClaim = _context8.sent;
                _context8.next = 69;
                return this.ens.owner(this.parsedDomainName);

              case 69:
                _owner = _context8.sent;

                if (this.dnsClaim.result.found && this.dnsClaim.getOwner().toLowerCase() === _owner.toLowerCase()) {
                  this.getMoreInfo();
                } else if (this.dnsClaim.result.found) {
                  this.dnsOwner = this.dnsClaim.getOwner();
                  this.processDNSresult('dnsClaimable'); // Claimable
                } else if (this.dnsClaim.result.nsec) {
                  this.owner = _owner;
                  this.processDNSresult('dnsMissingTXT'); // TXT missing/unclaim
                } else {
                  this.processDNSresult('dnsNotSetup'); // DNSEC not setup properly
                }

                _context8.next = 77;
                break;

              case 73:
                _context8.prev = 73;
                _context8.t1 = _context8["catch"](59);
                this.loading = false;
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Something went wrong! Please try again.', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);

              case 77:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[11, 53], [59, 73]]);
      }));

      function checkDomain() {
        return _checkDomain.apply(this, arguments);
      }

      return checkDomain;
    }(),
    createCommitment: function () {
      var _createCommitment = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        var _this3 = this;

        var utils, commitment;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                utils = this.web3.utils;
                _context9.prev = 1;
                _context9.next = 4;
                return this.registrarControllerContract.methods.makeCommitment(this.parsedHostName, this.account.address, utils.sha3(this.secretPhrase)).call();

              case 4:
                commitment = _context9.sent;
                _context9.next = 7;
                return this.registrarControllerContract.methods.minCommitmentAge().call();

              case 7:
                this.minimumAge = _context9.sent;
                _context9.next = 10;
                return this.registrarControllerContract.methods.commit(commitment).send({
                  from: this.account.address
                }).once('transactionHash', function () {
                  _this3.$router.push({
                    path: 'permanent-registration'
                  });
                }).on('receipt', function () {
                  _this3.loading = false;
                  _this3.commitmentCreated = true;
                });

              case 10:
                _context9.next = 16;
                break;

              case 12:
                _context9.prev = 12;
                _context9.t0 = _context9["catch"](1);
                this.loading = false;
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(_context9.t0, _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);

              case 16:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[1, 12]]);
      }));

      function createCommitment() {
        return _createCommitment.apply(this, arguments);
      }

      return createCommitment;
    }(),
    registerWithDuration: function () {
      var _registerWithDuration = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10() {
        var _this4 = this;

        var utils, SECONDS_YEAR, duration, rentPrice;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                utils = this.web3.utils;
                this.loading = true;
                SECONDS_YEAR = 60 * 60 * 24 * 365.25;
                duration = Math.ceil(SECONDS_YEAR * this.duration);
                _context10.prev = 4;
                _context10.next = 7;
                return this.registrarControllerContract.methods.rentPrice(this.parsedHostName, duration).call();

              case 7:
                rentPrice = _context10.sent;
                this.registrarControllerContract.methods.register(this.parsedHostName, this.account.address, duration, utils.sha3(this.secretPhrase)).send({
                  from: this.account.address,
                  value: rentPrice
                }).once('transactionHash', function () {
                  _this4.$router.push({
                    path: 'registration-in-progress'
                  });
                }).once('receipt', function () {
                  _this4.getMoreInfo();

                  _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Successfully Registered!', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].SUCCESS);
                });
                _context10.next = 15;
                break;

              case 11:
                _context10.prev = 11;
                _context10.t0 = _context10["catch"](4);
                this.loading = false;
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Something went wrong! Please try again.', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);

              case 15:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[4, 11]]);
      }));

      function registerWithDuration() {
        return _registerWithDuration.apply(this, arguments);
      }

      return registerWithDuration;
    }(),
    transferFunc: function transferFunc() {
      var _this5 = this;

      this.loading = true;

      try {
        this.legacyRegistrar.methods.transferRegistrars(this.labelHash).send({
          from: this.account.address
        }).once('receipt', function () {
          _this5.getMoreInfo();

          _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Successfully Transferred!', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].SUCCESS);
        });
      } catch (e) {
        this.loading = false;
        _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Something went wrong! Please try again.', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);
      }
    },
    claimFunc: function () {
      var _claimFunc = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11() {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                this.loading = true;
                _context11.prev = 1;
                _context11.next = 4;
                return this.dnsClaim.submit({
                  from: this.account.address
                });

              case 4:
                this.loading = false;
                _context11.next = 11;
                break;

              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11["catch"](1);
                this.loading = false;
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler('Something went wrong! Please try again.', _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].ERROR);

              case 11:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 7]]);
      }));

      function claimFunc() {
        return _claimFunc.apply(this, arguments);
      }

      return claimFunc;
    }(),
    updateStep: function updateStep(val) {
      this.step = val;
    },
    processDNSresult: function processDNSresult(type) {
      this.loading = false;

      switch (type) {
        case 'dnsOwned':
          this.$router.push({
            path: 'manage-ens/dns-owned'
          });
          break;

        case 'dnsClaimable':
          this.$router.push({
            path: 'manage-ens/claim'
          });
          break;

        case 'dnsNotSetup':
          this.$router.push({
            path: 'manage-ens/dns-error'
          });
          break;

        case 'dnsMissingTXT':
          this.$router.push({
            path: 'manage-ens/no-txt-setup'
          });
          break;
      }
    },
    processPermanentRegistrar: function processPermanentRegistrar() {},
    processResult: function processResult(res) {
      this.auctionDateEnd = res[2] * 1000;

      switch (res[0]) {
        case '0':
          this.generateKeyPhrase();
          this.$router.push({
            path: 'manage-ens/auction'
          });
          this.loading = false;
          break;

        case '1':
          this.generateKeyPhrase();
          this.loading = false;
          this.$router.push({
            path: 'manage-ens/bid'
          });
          break;

        case '2':
          this.getMoreInfo(res[1]);
          break;

        case '3':
          this.loading = false;
          this.$router.push({
            path: 'manage-ens/forbidden'
          });
          break;

        case '4':
          this.loading = false;
          this.highestBid = ethjs_unit__WEBPACK_IMPORTED_MODULE_16__["fromWei"](res[4], 'ether').toString();
          this.$router.push({
            path: 'manage-ens/reveal'
          });
          break;
      }
    },
    updateDomainName: function updateDomainName(value) {
      try {
        this.domainName = Object(_helpers_normalise__WEBPACK_IMPORTED_MODULE_18__["default"])(value);
      } catch (e) {
        _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(e, _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].WARN);
        this.domainNameErr = true;
        return;
      }

      if (this.parsedTld === this.registrarTLD) {
        this.domainNameErr = value.substr(0, 2) === '0x' || this.parsedHostName.length < 7;
      } else {
        this.domainNameErr = false;
      }
    },
    getMoreInfo: function () {
      var _getMoreInfo = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(deedOwner) {
        var highestBidder, deedContract, owner, resolverAddress;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                highestBidder = '0x';

                if (!(this.registrarType === REGISTRAR_TYPES.AUCTION && this.parsedTld === this.registrarTLD)) {
                  _context12.next = 6;
                  break;
                }

                deedContract = new this.web3.eth.Contract(_ABI_deedContractAbi__WEBPACK_IMPORTED_MODULE_12__["default"], deedOwner);
                _context12.next = 5;
                return deedContract.methods.owner().call();

              case 5:
                highestBidder = _context12.sent;

              case 6:
                _context12.prev = 6;

                if (!(this.registrarType === REGISTRAR_TYPES.PERMANENT)) {
                  _context12.next = 13;
                  break;
                }

                _context12.next = 10;
                return this.registrarContract.methods.ownerOf(this.labelHash).call();

              case 10:
                owner = _context12.sent;
                _context12.next = 16;
                break;

              case 13:
                _context12.next = 15;
                return this.ens.owner(this.parsedDomainName);

              case 15:
                owner = _context12.sent;

              case 16:
                _context12.next = 22;
                break;

              case 18:
                _context12.prev = 18;
                _context12.t0 = _context12["catch"](6);
                owner = '0x';
                _helpers__WEBPACK_IMPORTED_MODULE_20__["Toast"].responseHandler(_context12.t0, false);

              case 22:
                _context12.prev = 22;
                _context12.next = 25;
                return this.ens.resolver(this.parsedDomainName).addr();

              case 25:
                resolverAddress = _context12.sent;
                _context12.next = 31;
                break;

              case 28:
                _context12.prev = 28;
                _context12.t1 = _context12["catch"](22);
                resolverAddress = '0x';

              case 31:
                this.nameHash = eth_ens_namehash__WEBPACK_IMPORTED_MODULE_17__["hash"](this.parsedDomainName);
                this.resolverAddress = resolverAddress;
                this.deedOwner = highestBidder;
                this.owner = owner;

                if (this.$route.fullPath === '/interface/dapps/manage-ens') {
                  this.$router.push({
                    path: 'manage-ens/owned'
                  });
                } else {
                  this.$router.push({
                    path: 'owned'
                  });
                }

                this.loading = false;

              case 37:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[6, 18], [22, 28]]);
      }));

      function getMoreInfo(_x4) {
        return _getMoreInfo.apply(this, arguments);
      }

      return getMoreInfo;
    }(),
    createTransaction: function () {
      var _createTransaction = Object(_home_kvhnuke_GitHub_MyEtherWallet_node_modules_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__["default"])(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13(type) {
        var address, utils, bidHash, contractReference, date, auctionDateEnd, revealDate, raw;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                this.loading = true;
                address = this.account.address;
                utils = this.web3.utils;
                _context13.next = 5;
                return this.registrarContract.methods.shaBid(this.labelHash, address, utils.toWei(this.bidAmount.toString(), 'ether'), utils.sha3(this.secretPhrase)).call();

              case 5:
                bidHash = _context13.sent;

                if (type === 'start') {
                  contractReference = this.registrarContract.methods.startAuctionsAndBid([this.labelHash], bidHash);
                } else if (type === 'bid') {
                  contractReference = this.registrarContract.methods.newBid(bidHash);
                } else if (type === 'reveal') {
                  contractReference = this.registrarContract.methods.unsealBid(this.labelHash, utils.toWei(this.bidAmount.toString(), 'ether'), utils.sha3(this.secretPhrase));
                }

                date = new Date();
                auctionDateEnd = date.setDate(date.getDate() + 5);
                revealDate = date.setDate(date.getDate() - 2);
                raw = {
                  from: address,
                  value: type === 'reveal' ? 0 : ethjs_unit__WEBPACK_IMPORTED_MODULE_16__["toWei"](this.bidMask, 'ether').toString(),
                  to: this.registrarAddress,
                  data: contractReference.encodeABI(),
                  name: this.domainName,
                  nameSHA3: utils.sha3(this.domainName),
                  bidAmount: this.bidAmount,
                  bidMask: this.bidMask,
                  secretPhrase: this.secretPhrase,
                  secretPhraseSHA3: utils.sha3(this.secretPhrase),
                  auctionDateEnd: new Date(auctionDateEnd),
                  revealDate: new Date(revealDate)
                };
                this.raw = raw;
                this.loading = false;
                this.step = 2;

              case 14:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function createTransaction(_x5) {
        return _createTransaction.apply(this, arguments);
      }

      return createTransaction;
    }(),
    startAuctionAndBid: function startAuctionAndBid() {
      this.createTransaction('start');
    },
    sendBid: function sendBid() {
      this.createTransaction('bid');
    },
    revealBid: function revealBid() {
      this.createTransaction('reveal');
    },
    updateSecretPhrase: function updateSecretPhrase(e) {
      this.secretPhrase = e;
    },
    updateDuration: function updateDuration(e) {
      this.duration = e;
    },
    updateBidAmount: function updateBidAmount(val) {
      this.bidAmount = val;
    },
    updateBidMask: function updateBidMask(val) {
      this.bidMask = val;
    },
    generateKeyPhrase: function generateKeyPhrase() {
      var wordsArray = [];
      var min = 0;
      var max = bip39.wordlists.EN.length;

      for (var i = 0; i < 3; i++) {
        wordsArray.push(bip39.wordlists.EN[Math.floor(Math.random() * (max - min + 1)) + min]);
      }

      this.secretPhrase = wordsArray.join(' ');
    }
  }
});

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "manage-ens-container" },
    [
      _c("back-button"),
      _c("router-view", {
        attrs: {
          "contract-initiated": _vm.contractInitiated,
          "check-domain": _vm.checkDomain,
          "bid-amount": _vm.bidAmount,
          "bid-mask": _vm.bidMask,
          "secret-phrase": _vm.secretPhrase,
          "start-auction-and-bid": _vm.startAuctionAndBid,
          "host-name": _vm.parsedHostName,
          "domain-name": _vm.parsedDomainName,
          "auction-date-end": _vm.auctionDateEnd,
          loading: _vm.loading,
          "name-hash": _vm.nameHash,
          "label-hash": _vm.labelHash,
          owner: _vm.owner,
          "resolver-address": _vm.resolverAddress,
          "deed-owner": _vm.deedOwner,
          "highest-bidder": _vm.highestBid,
          raw: _vm.raw,
          step: _vm.step,
          "send-bid": _vm.sendBid,
          "reveal-bid": _vm.revealBid,
          "domain-name-err": _vm.domainNameErr,
          "generate-key-phrase": _vm.generateKeyPhrase,
          finalize: _vm.finalize,
          "update-resolver": _vm.updateResolver,
          "transfer-domain": _vm.transferDomain,
          tld:
            _vm.parsedTld === ""
              ? _vm.network.type.ens.registrarTLD
              : _vm.parsedTld,
          "network-name": _vm.network.type.name,
          "register-fifs-name": _vm.registerFifsName,
          "multi-tld": _vm.multiTld,
          "claim-func": _vm.claimFunc,
          "dns-owner": _vm.dnsOwner,
          "dns-claim": _vm.dnsClaim,
          "transfer-func": _vm.transferFunc,
          "create-commitment": _vm.createCommitment,
          "register-with-duration": _vm.registerWithDuration,
          "minimum-age": _vm.minimumAge,
          "commitment-created": _vm.commitmentCreated
        },
        on: {
          updateSecretPhrase: _vm.updateSecretPhrase,
          updateBidAmount: _vm.updateBidAmount,
          updateBidMask: _vm.updateBidMask,
          domainNameChange: _vm.updateDomainName,
          updateStep: _vm.updateStep,
          updateDuration: _vm.updateDuration
        }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".auction-started[data-v-d9fcc10e] {\n  color: #5a78f0;\n  padding: 10px 0 15px;\n}\n.manage-ens-container[data-v-d9fcc10e] {\n  border-radius: 5px;\n  grid-area: main;\n  overflow: hidden;\n  padding-bottom: 10px;\n}\n.manage-ens-container > div[data-v-d9fcc10e] {\n    background-color: #fff;\n}\n.manage-ens-container .submit-button[data-v-d9fcc10e] {\n    margin: 0 auto;\n    text-align: center;\n    width: 300px;\n}\n@media all and (max-width: 414px) {\n.manage-ens-container .submit-button[data-v-d9fcc10e] {\n        width: 100%;\n}\n}\n.back-button[data-v-d9fcc10e] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 36px 0 25px;\n}\n.back-button button[data-v-d9fcc10e] {\n    border-radius: 5px;\n    cursor: pointer;\n    padding: 20px;\n    width: 300px;\n}\n.errored[data-v-d9fcc10e] {\n  border: 1px solid #f00 !important;\n  border-radius: 5px;\n  padding: 11px 13px;\n}\n.erroredMsg[data-v-d9fcc10e] {\n  color: #f00;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader??ref--8-oneOf-1-0!./node_modules/css-loader??ref--8-oneOf-1-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-2!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/vue-style-loader/lib/addStylesClient.js */ "./node_modules/vue-style-loader/lib/addStylesClient.js").default
var update = add("3b80fb2b", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&", function() {
     var newContent = __webpack_require__(/*! !../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&");
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/baseRegistrarAbi.js":
/*!*****************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/baseRegistrarAbi.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var baseRegistrar = [{
  constant: true,
  inputs: [{
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'getApproved',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'to',
    type: 'address'
  }, {
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'approve',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'from',
    type: 'address'
  }, {
    name: 'to',
    type: 'address'
  }, {
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'transferFrom',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'ens',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'from',
    type: 'address'
  }, {
    name: 'to',
    type: 'address'
  }, {
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'safeTransferFrom',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'transferPeriodEnds',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'MIGRATION_LOCK_PERIOD',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'owner',
    type: 'address'
  }],
  name: 'balanceOf',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'renounceOwnership',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'owner',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'isOwner',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'to',
    type: 'address'
  }, {
    name: 'approved',
    type: 'bool'
  }],
  name: 'setApprovalForAll',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'previousRegistrar',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'from',
    type: 'address'
  }, {
    name: 'to',
    type: 'address'
  }, {
    name: 'tokenId',
    type: 'uint256'
  }, {
    name: '_data',
    type: 'bytes'
  }],
  name: 'safeTransferFrom',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'GRACE_PERIOD',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '',
    type: 'address'
  }],
  name: 'controllers',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'baseNode',
  outputs: [{
    name: '',
    type: 'bytes32'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'owner',
    type: 'address'
  }, {
    name: 'operator',
    type: 'address'
  }],
  name: 'isApprovedForAll',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'newOwner',
    type: 'address'
  }],
  name: 'transferOwnership',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  inputs: [{
    name: '_ens',
    type: 'address'
  }, {
    name: '_previousRegistrar',
    type: 'address'
  }, {
    name: '_baseNode',
    type: 'bytes32'
  }, {
    name: '_transferPeriodEnds',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'controller',
    type: 'address'
  }],
  name: 'ControllerAdded',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'controller',
    type: 'address'
  }],
  name: 'ControllerRemoved',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'id',
    type: 'uint256'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: false,
    name: 'expires',
    type: 'uint256'
  }],
  name: 'NameMigrated',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'id',
    type: 'uint256'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: false,
    name: 'expires',
    type: 'uint256'
  }],
  name: 'NameRegistered',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'id',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'expires',
    type: 'uint256'
  }],
  name: 'NameRenewed',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'previousOwner',
    type: 'address'
  }, {
    indexed: true,
    name: 'newOwner',
    type: 'address'
  }],
  name: 'OwnershipTransferred',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'from',
    type: 'address'
  }, {
    indexed: true,
    name: 'to',
    type: 'address'
  }, {
    indexed: true,
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'Transfer',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: true,
    name: 'approved',
    type: 'address'
  }, {
    indexed: true,
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'Approval',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: true,
    name: 'operator',
    type: 'address'
  }, {
    indexed: false,
    name: 'approved',
    type: 'bool'
  }],
  name: 'ApprovalForAll',
  type: 'event'
}, {
  constant: true,
  inputs: [{
    name: 'tokenId',
    type: 'uint256'
  }],
  name: 'ownerOf',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'controller',
    type: 'address'
  }],
  name: 'addController',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'controller',
    type: 'address'
  }],
  name: 'removeController',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'resolver',
    type: 'address'
  }],
  name: 'setResolver',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'id',
    type: 'uint256'
  }],
  name: 'nameExpires',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'id',
    type: 'uint256'
  }],
  name: 'available',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'id',
    type: 'uint256'
  }, {
    name: 'owner',
    type: 'address'
  }, {
    name: 'duration',
    type: 'uint256'
  }],
  name: 'register',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'id',
    type: 'uint256'
  }, {
    name: 'duration',
    type: 'uint256'
  }],
  name: 'renew',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'id',
    type: 'uint256'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'reclaim',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'label',
    type: 'bytes32'
  }, {
    name: 'deed',
    type: 'address'
  }, {
    name: '',
    type: 'uint256'
  }],
  name: 'acceptRegistrarTransfer',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'interfaceID',
    type: 'bytes4'
  }],
  name: 'supportsInterface',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}];
/* harmony default export */ __webpack_exports__["default"] = (baseRegistrar);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/deedContractAbi.js":
/*!****************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/deedContractAbi.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var DeedContractAbi = [{
  constant: true,
  inputs: [],
  name: 'creationDate',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'destroyDeed',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'newOwner',
    type: 'address'
  }],
  name: 'setOwner',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'registrar',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'owner',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'refundRatio',
    type: 'uint256'
  }],
  name: 'closeDeed',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'newRegistrar',
    type: 'address'
  }],
  name: 'setRegistrar',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'newValue',
    type: 'uint256'
  }],
  name: 'setBalance',
  outputs: [],
  payable: true,
  type: 'function'
}, {
  inputs: [],
  type: 'constructor'
}, {
  payable: true,
  type: 'fallback'
}, {
  anonymous: false,
  inputs: [{
    indexed: false,
    name: 'newOwner',
    type: 'address'
  }],
  name: 'OwnerChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [],
  name: 'DeedClosed',
  type: 'event'
}];
/* harmony default export */ __webpack_exports__["default"] = (DeedContractAbi);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/fifsRegistrarAbi.js":
/*!*****************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/fifsRegistrarAbi.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([{
  constant: true,
  inputs: [],
  name: 'ens',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '',
    type: 'bytes32'
  }],
  name: 'expiryTimes',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'subnode',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'register',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'rootNode',
  outputs: [{
    name: '',
    type: 'bytes32'
  }],
  payable: false,
  type: 'function'
}, {
  inputs: [{
    name: 'ensAddr',
    type: 'address'
  }, {
    name: 'node',
    type: 'bytes32'
  }],
  type: 'constructor'
}]);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/permanentRegistrarController.js":
/*!*****************************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/permanentRegistrarController.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var registrarController = [{
  constant: false,
  inputs: [],
  name: 'renounceOwnership',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '',
    type: 'bytes32'
  }],
  name: 'commitments',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'MIN_REGISTRATION_DURATION',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'minCommitmentAge',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'owner',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'isOwner',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'maxCommitmentAge',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'newOwner',
    type: 'address'
  }],
  name: 'transferOwnership',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  inputs: [{
    name: '_base',
    type: 'address'
  }, {
    name: '_prices',
    type: 'address'
  }, {
    name: '_minCommitmentAge',
    type: 'uint256'
  }, {
    name: '_maxCommitmentAge',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: false,
    name: 'name',
    type: 'string'
  }, {
    indexed: true,
    name: 'label',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: false,
    name: 'cost',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'expires',
    type: 'uint256'
  }],
  name: 'NameRegistered',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: false,
    name: 'name',
    type: 'string'
  }, {
    indexed: true,
    name: 'label',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'cost',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'expires',
    type: 'uint256'
  }],
  name: 'NameRenewed',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'oracle',
    type: 'address'
  }],
  name: 'NewPriceOracle',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'previousOwner',
    type: 'address'
  }, {
    indexed: true,
    name: 'newOwner',
    type: 'address'
  }],
  name: 'OwnershipTransferred',
  type: 'event'
}, {
  constant: true,
  inputs: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'duration',
    type: 'uint256'
  }],
  name: 'rentPrice',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'name',
    type: 'string'
  }],
  name: 'valid',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'name',
    type: 'string'
  }],
  name: 'available',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'owner',
    type: 'address'
  }, {
    name: 'secret',
    type: 'bytes32'
  }],
  name: 'makeCommitment',
  outputs: [{
    name: '',
    type: 'bytes32'
  }],
  payable: false,
  stateMutability: 'pure',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'commitment',
    type: 'bytes32'
  }],
  name: 'commit',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'owner',
    type: 'address'
  }, {
    name: 'duration',
    type: 'uint256'
  }, {
    name: 'secret',
    type: 'bytes32'
  }],
  name: 'register',
  outputs: [],
  payable: true,
  stateMutability: 'payable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'name',
    type: 'string'
  }, {
    name: 'duration',
    type: 'uint256'
  }],
  name: 'renew',
  outputs: [],
  payable: true,
  stateMutability: 'payable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_prices',
    type: 'address'
  }],
  name: 'setPriceOracle',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_minCommitmentAge',
    type: 'uint256'
  }, {
    name: '_maxCommitmentAge',
    type: 'uint256'
  }],
  name: 'setCommitmentAges',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [],
  name: 'withdraw',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'interfaceID',
    type: 'bytes4'
  }],
  name: 'supportsInterface',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'pure',
  type: 'function'
}];
/* harmony default export */ __webpack_exports__["default"] = (registrarController);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/registrarAbi.js":
/*!*************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/registrarAbi.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([{
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'releaseDeed',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'getAllowedTime',
  outputs: [{
    name: 'timestamp',
    type: 'uint256'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'unhashedName',
    type: 'string'
  }],
  name: 'invalidateName',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'hash',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }, {
    name: 'value',
    type: 'uint256'
  }, {
    name: 'salt',
    type: 'bytes32'
  }],
  name: 'shaBid',
  outputs: [{
    name: 'sealedBid',
    type: 'bytes32'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'bidder',
    type: 'address'
  }, {
    name: 'seal',
    type: 'bytes32'
  }],
  name: 'cancelBid',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'entries',
  outputs: [{
    name: '',
    type: 'uint8'
  }, {
    name: '',
    type: 'address'
  }, {
    name: '',
    type: 'uint256'
  }, {
    name: '',
    type: 'uint256'
  }, {
    name: '',
    type: 'uint256'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'ens',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }, {
    name: '_value',
    type: 'uint256'
  }, {
    name: '_salt',
    type: 'bytes32'
  }],
  name: 'unsealBid',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'transferRegistrars',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '',
    type: 'address'
  }, {
    name: '',
    type: 'bytes32'
  }],
  name: 'sealedBids',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'state',
  outputs: [{
    name: '',
    type: 'uint8'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }, {
    name: 'newOwner',
    type: 'address'
  }],
  name: 'transfer',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }, {
    name: '_timestamp',
    type: 'uint256'
  }],
  name: 'isAllowed',
  outputs: [{
    name: 'allowed',
    type: 'bool'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'finalizeAuction',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'registryStarted',
  outputs: [{
    name: '',
    type: 'uint256'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'launchLength',
  outputs: [{
    name: '',
    type: 'uint32'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'sealedBid',
    type: 'bytes32'
  }],
  name: 'newBid',
  outputs: [],
  payable: true,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'labels',
    type: 'bytes32[]'
  }],
  name: 'eraseNode',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hashes',
    type: 'bytes32[]'
  }],
  name: 'startAuctions',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'hash',
    type: 'bytes32'
  }, {
    name: 'deed',
    type: 'address'
  }, {
    name: 'registrationDate',
    type: 'uint256'
  }],
  name: 'acceptRegistrarTransfer',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_hash',
    type: 'bytes32'
  }],
  name: 'startAuction',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'rootNode',
  outputs: [{
    name: '',
    type: 'bytes32'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'hashes',
    type: 'bytes32[]'
  }, {
    name: 'sealedBid',
    type: 'bytes32'
  }],
  name: 'startAuctionsAndBid',
  outputs: [],
  payable: true,
  type: 'function'
}, {
  inputs: [{
    name: '_ens',
    type: 'address'
  }, {
    name: '_rootNode',
    type: 'bytes32'
  }, {
    name: '_startDate',
    type: 'uint256'
  }],
  payable: false,
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'registrationDate',
    type: 'uint256'
  }],
  name: 'AuctionStarted',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'bidder',
    type: 'address'
  }, {
    indexed: false,
    name: 'deposit',
    type: 'uint256'
  }],
  name: 'NewBid',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'status',
    type: 'uint8'
  }],
  name: 'BidRevealed',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'registrationDate',
    type: 'uint256'
  }],
  name: 'HashRegistered',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }],
  name: 'HashReleased',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'hash',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'name',
    type: 'string'
  }, {
    indexed: false,
    name: 'value',
    type: 'uint256'
  }, {
    indexed: false,
    name: 'registrationDate',
    type: 'uint256'
  }],
  name: 'HashInvalidated',
  type: 'event'
}]);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/registryAbi.js":
/*!************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/registryAbi.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([{
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'resolver',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'owner',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'label',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'setSubnodeOwner',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'ttl',
    type: 'uint64'
  }],
  name: 'setTTL',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'ttl',
  outputs: [{
    name: '',
    type: 'uint64'
  }],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'resolver',
    type: 'address'
  }],
  name: 'setResolver',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'owner',
    type: 'address'
  }],
  name: 'setOwner',
  outputs: [],
  payable: false,
  type: 'function'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'owner',
    type: 'address'
  }],
  name: 'Transfer',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'label',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'owner',
    type: 'address'
  }],
  name: 'NewOwner',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'resolver',
    type: 'address'
  }],
  name: 'NewResolver',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'ttl',
    type: 'uint64'
  }],
  name: 'NewTTL',
  type: 'event'
}]);

/***/ }),

/***/ "./src/dapps/ManageENS/ABI/resolverAbi.js":
/*!************************************************!*\
  !*** ./src/dapps/ManageENS/ABI/resolverAbi.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([{
  constant: true,
  inputs: [{
    name: 'interfaceID',
    type: 'bytes4'
  }],
  name: 'supportsInterface',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'pure',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'key',
    type: 'string'
  }, {
    name: 'value',
    type: 'string'
  }],
  name: 'setText',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'interfaceID',
    type: 'bytes4'
  }],
  name: 'interfaceImplementer',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'contentTypes',
    type: 'uint256'
  }],
  name: 'ABI',
  outputs: [{
    name: '',
    type: 'uint256'
  }, {
    name: '',
    type: 'bytes'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'x',
    type: 'bytes32'
  }, {
    name: 'y',
    type: 'bytes32'
  }],
  name: 'setPubkey',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'hash',
    type: 'bytes'
  }],
  name: 'setContenthash',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'addr',
  outputs: [{
    name: '',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'key',
    type: 'string'
  }],
  name: 'text',
  outputs: [{
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'contentType',
    type: 'uint256'
  }, {
    name: 'data',
    type: 'bytes'
  }],
  name: 'setABI',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'name',
  outputs: [{
    name: '',
    type: 'string'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'name',
    type: 'string'
  }],
  name: 'setName',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'contenthash',
  outputs: [{
    name: '',
    type: 'bytes'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }],
  name: 'pubkey',
  outputs: [{
    name: 'x',
    type: 'bytes32'
  }, {
    name: 'y',
    type: 'bytes32'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'addr',
    type: 'address'
  }],
  name: 'setAddr',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'interfaceID',
    type: 'bytes4'
  }, {
    name: 'implementer',
    type: 'address'
  }],
  name: 'setInterface',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '',
    type: 'bytes32'
  }, {
    name: '',
    type: 'address'
  }, {
    name: '',
    type: 'address'
  }],
  name: 'authorisations',
  outputs: [{
    name: '',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  inputs: [{
    name: '_ens',
    type: 'address'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'constructor'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'owner',
    type: 'address'
  }, {
    indexed: true,
    name: 'target',
    type: 'address'
  }, {
    indexed: false,
    name: 'isAuthorised',
    type: 'bool'
  }],
  name: 'AuthorisationChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'indexedKey',
    type: 'string'
  }, {
    indexed: false,
    name: 'key',
    type: 'string'
  }],
  name: 'TextChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'x',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'y',
    type: 'bytes32'
  }],
  name: 'PubkeyChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'name',
    type: 'string'
  }],
  name: 'NameChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'interfaceID',
    type: 'bytes4'
  }, {
    indexed: false,
    name: 'implementer',
    type: 'address'
  }],
  name: 'InterfaceChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'hash',
    type: 'bytes'
  }],
  name: 'ContenthashChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: false,
    name: 'a',
    type: 'address'
  }],
  name: 'AddrChanged',
  type: 'event'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: 'node',
    type: 'bytes32'
  }, {
    indexed: true,
    name: 'contentType',
    type: 'uint256'
  }],
  name: 'ABIChanged',
  type: 'event'
}, {
  constant: false,
  inputs: [{
    name: 'node',
    type: 'bytes32'
  }, {
    name: 'target',
    type: 'address'
  }, {
    name: 'isAuthorised',
    type: 'bool'
  }],
  name: 'setAuthorisation',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}]);

/***/ }),

/***/ "./src/dapps/ManageENS/ManageENS.vue":
/*!*******************************************!*\
  !*** ./src/dapps/ManageENS/ManageENS.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& */ "./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&");
/* harmony import */ var _ManageENS_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageENS.vue?vue&type=script&lang=js& */ "./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& */ "./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ManageENS_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "d9fcc10e",
  null
  
)

/* hot reload */
if (true) {
  var api = __webpack_require__(/*! ./node_modules/vue-hot-reload-api/dist/index.js */ "./node_modules/vue-hot-reload-api/dist/index.js")
  api.install(__webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.runtime.esm.js"))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('d9fcc10e')) {
      api.createRecord('d9fcc10e', component.options)
    } else {
      api.reload('d9fcc10e', component.options)
    }
    module.hot.accept(/*! ./ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& */ "./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& */ "./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&");
(function () {
      api.rerender('d9fcc10e', {
        render: _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
        staticRenderFns: _ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]
      })
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
  }
}
component.options.__file = "src/dapps/ManageENS/ManageENS.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--12-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=script&lang=js& */ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_cache_loader_dist_cjs_js_ref_12_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&":
/*!*****************************************************************************************************!*\
  !*** ./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-style-loader??ref--8-oneOf-1-0!../../../node_modules/css-loader??ref--8-oneOf-1-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--8-oneOf-1-2!../../../node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-3!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true& */ "./node_modules/vue-style-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=style&index=0&id=d9fcc10e&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_style_index_0_id_d9fcc10e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&":
/*!**************************************************************************************!*\
  !*** ./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!cache-loader?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"5569e56c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--0-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"5569e56c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/dapps/ManageENS/ManageENS.vue?vue&type=template&id=d9fcc10e&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _cache_loader_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_5569e56c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageENS_vue_vue_type_template_id_d9fcc10e_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);
//# sourceMappingURL=33.js.map