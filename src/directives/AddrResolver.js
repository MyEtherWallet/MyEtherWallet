import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import utils from 'web3-utils';
import WAValidator from 'wallet-address-validator';
import { EthereumTokens } from '@/partners';
import { canValidateMulticoin, canValidateCoin } from '@/partners/helpers';
import MAValidator from 'multicoin-address-validator';
import getMultiCoinAddress from '@/helpers/ENSMultiCoin.js';

const AddrResolver = {
  bind: function(el, binding, vnode) {
    let network = vnode.context.$store.state.network;
    let parentCurrency = vnode.context.$parent.currency
      ? vnode.context.$parent.currency
      : network.type.name;
    let address = '';
    vnode.context.$parent.$watch('$store.state.network', function(e) {
      network = e;
      parentCurrency = e.type.name;
      removeElements();
      actualProcess(address);
    });
    vnode.context.$parent.$watch('currency', function(e) {
      parentCurrency = e;
      removeElements();
      actualProcess(address);
    });
    vnode.context.$watch(binding.value, function(e) {
      address = e;
      removeElements();
      actualProcess(e);
    });
    const removeElements = function() {
      const child = el.parentNode.parentNode.lastChild;
      Object.keys(child.classList).forEach(item => {
        if (child.classList[item] === 'resolver-error') {
          vnode.elm.parentNode.parentNode.removeChild(child);
        }
      });
    };
    const actualProcess = function(e) {
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const _this = vnode.context;
      const ens = _this.$store.state.ens;
      const checkDarklist = function(addr) {
        const isDarklisted = Misc.isDarklisted(addr);
        if (isDarklisted.error) {
          removeElements();
          _this.isValidAddress = false;
          _this.hexAddress = '';
          errorPar.innerText =
            isDarklisted.msg.length > 0
              ? isDarklisted.msg
              : _this.$t('ens.ens-resolver.address-reported-error');
          el.parentNode.parentNode.appendChild(errorPar);
          return true;
        }
        return false;
      };
      if (Misc.isValidENSorEtherAddress(e)) {
        if (Misc.isValidETHAddress(e)) {
          if (!checkDarklist(e)) {
            _this.isValidAddress = true;
            _this.hexAddress = toChecksumAddress(e);
            removeElements();
          }
        } else {
          if (network.type.ens === '' || ens === null || ens === undefined) {
            removeElements();
            _this.isValidAddress = false;
            _this.hexAddress = '';
            // eslint-disable-next-line
            errorPar.innerText = _this.$t('ens.ens-resolver.no-resolver', { network: network.type.name[0]});
            el.parentNode.parentNode.appendChild(errorPar);
          } else {
            getMultiCoinAddress(ens, normalise(e), parentCurrency)
              .then(address => {
                if (!checkDarklist(address)) {
                  removeElements();
                  _this.hexAddress =
                    parentCurrency === 'ETH'
                      ? toChecksumAddress(address)
                      : address;
                  _this.isValidAddress = true;
                  errorPar.innerText = address;
                  vnode.elm.parentNode.parentNode.appendChild(errorPar);
                }
              })
              .catch(() => {
                if (
                  parentCurrency === 'ETH' ||
                  EthereumTokens[parentCurrency]
                ) {
                  ens
                    .resolver(normalise(e))
                    .addr()
                    .then(address => {
                      if (!checkDarklist(address)) {
                        removeElements();
                        _this.hexAddress = toChecksumAddress(address);
                        _this.isValidAddress = true;
                        errorPar.innerText = address;
                        vnode.elm.parentNode.parentNode.appendChild(errorPar);
                      }
                    })
                    .catch(() => {
                      removeElements();
                      // eslint-disable-next-line
                    errorPar.innerText = _this.$t('ens.ens-resolver.network-not-found', { network: network.type.name[0]});
                      _this.isValidAddress = false;
                      _this.hexAddress = '';
                      vnode.elm.parentNode.parentNode.appendChild(errorPar);
                    });
                } else {
                  removeElements();
                  // eslint-disable-next-line
                    errorPar.innerText = _this.$t('ens.ens-resolver.network-not-found', { network: network.type.name[0]});
                  _this.isValidAddress = false;
                  _this.hexAddress = '';
                  vnode.elm.parentNode.parentNode.appendChild(errorPar);
                }
              });
          }
        }
      } else if (
        e !== '' &&
        canValidateCoin(parentCurrency) &&
        canValidateMulticoin(parentCurrency)
      ) {
        if (canValidateCoin(parentCurrency)) {
          const isValid = WAValidator.validate(e, parentCurrency);
          _this.isValidAddress = isValid;
          _this.hexAddress =
            parentCurrency === 'ETH' ? toChecksumAddress(e) : e;
        } else {
          if (canValidateMulticoin(parentCurrency)) {
            const isValid = MAValidator.validate(e, parentCurrency);
            if (isValid) {
              _this.isValidAddress = isValid;
              _this.hexAddress = e;
            } else {
              _this.isValidAddress = false;
              _this.hexAddress = '';
              removeElements();

              if (e.length > 0) {
                if (
                  parentCurrency === 'ETH' &&
                  (e.length !== 42 || !utils.isHexStrict(e))
                ) {
                  errorPar.innerText = _this.$t(
                    'ens.ens-resolver.invalid-eth-addr'
                  );
                } else if (
                  parentCurrency === 'ETH' &&
                  !utils.checkAddressChecksum(e)
                ) {
                  errorPar.innerText = _this.$t(
                    'ens.ens-resolver.addr-not-checksummed'
                  );
                  // 'Incorrect checksum: check address format on EthVM';
                } else {
                  errorPar.innerText = _this.$t(
                    'ens.ens-resolver.invalid-addr',
                    { coin: parentCurrency }
                  );
                }
              } else {
                errorPar.innerText = '';
              }

              el.parentNode.parentNode.appendChild(errorPar);
            }
          }
        }
      } else {
        removeElements();
        _this.isValidAddress = false;
        _this.hexAddress = '';
        errorPar.innerText = '';
        el.parentNode.parentNode.appendChild(errorPar);
      }
    };
  }
};

export default AddrResolver;
