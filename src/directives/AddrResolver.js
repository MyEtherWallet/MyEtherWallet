import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import utils from 'web3-utils';
import WAValidator from 'wallet-address-validator';
import { EthereumTokens } from '@/partners';
import { canValidate } from '@/partners/helpers';
import MAValidator from 'multicoin-address-validator';
import getMultiCoinAddress from '@/helpers/ENSMultiCoin.js';

const AddrResolver = {
  bind: function(el, binding, vnode) {
    let network = vnode.context.$store.state.network;
    let parentCurrency = vnode.context.$parent.currency
      ? vnode.context.$parent.currency
      : network.type.name;

    vnode.context.$parent.$watch('$store.state.network', function(e) {
      network = e;
      parentCurrency = e.type.name;
    });
    vnode.context.$parent.$watch('currency', function(e) {
      parentCurrency = e;
    });
    vnode.context.$watch(binding.value, function(e) {
      const _this = vnode.context;
      const ens = _this.$store.state.ens;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const checkDarklist = function(addr) {
        const isDarklisted = Misc.isDarklisted(addr);
        if (isDarklisted.error) {
          removeElements();
          _this.isValidAddress = false;
          _this.hexAddress = '';
          errorPar.innerText =
            isDarklisted.msg.length > 0
              ? isDarklisted.msg
              : this.$t('ens.ens-resolver.address-reported-error');
          el.parentNode.parentNode.appendChild(errorPar);
          return true;
        }
        return false;
      };
      const removeElements = function() {
        const child = el.parentNode.parentNode.lastChild;
        Object.keys(child.classList).forEach(item => {
          if (child.classList[item] === 'resolver-error') {
            vnode.elm.parentNode.parentNode.removeChild(child);
          }
        });
      };

      if (EthereumTokens[parentCurrency] && parentCurrency !== 'ETH') {
        const addCheck = WAValidator.validate(e, 'ETH');
        if (addCheck) {
          _this.isValidAddress = addCheck;
          _this.hexAddress = toChecksumAddress(e);
          removeElements();
        }
      } else if (Misc.isValidENSorEtherAddress(e)) {
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
            errorPar.innerText = `No ${
              network.type.name[0]
            }NS resolver in this node`;
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
                  errorPar.innerText = `${
                    network.type.name[0]
                  }NS name is invalid or not found`;
                    _this.isValidAddress = false;
                    _this.hexAddress = '';
                    vnode.elm.parentNode.parentNode.appendChild(errorPar);
                  });
              });
          }
        }
      } else if (e !== '') {
        try {
          _this.isValidAddress = WAValidator.validate(e, parentCurrency);
          _this.hexAddress =
            parentCurrency === 'ETH' ? toChecksumAddress(e) : e;
        } catch (err) {
          if (canValidate(parentCurrency)) {
            try {
              _this.isValidAddress = MAValidator.validate(e, parentCurrency);
              _this.hexAddress = e;
            } catch (error) {
              _this.isValidAddress = false;
              _this.hexAddress = '';
              removeElements();
              if (e.length > 0) {
                if (e.length !== 42 || !utils.isHexStrict(e)) {
                  errorPar.innerText = this.$t(
                    'ens.ens-resolver.invalid-eth-addr'
                  );
                } else if (!utils.checkAddressChecksum(e)) {
                  errorPar.innerText = this.$t(
                    'ens.ens-resolver.addr-not-checksummed'
                  );
                  // 'Incorrect checksum: check address format on EthVM';
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
    });
  }
};

export default AddrResolver;
