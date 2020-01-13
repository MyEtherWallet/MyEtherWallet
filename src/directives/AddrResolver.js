import { toChecksumAddress } from '@/helpers/addressUtils';
import WAValidator from 'wallet-address-validator';
import { Misc } from '@/helpers';
import Resolution, { ResolutionError } from '@unstoppabledomains/resolution';
import normalise from '@/helpers/normalise';
import utils from 'web3-utils';
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
    let address = '';
    const resolution = new Resolution({ ens: { network: network } });
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
        if (
          child.classList[item] === 'resolver-error' ||
          child.classList[item] === 'resolver-addr'
        ) {
          vnode.elm.parentNode.parentNode.removeChild(child);
        }
      });
    };
    const actualProcess = async function(e) {
      const _this = vnode.context;
      if (e === '') {
        removeElements();
        _this.isValidAddress = false;
        _this.hexAddress = '';
      } else if (e.startsWith('0x')) {
        if (!checkDarklist(e)) {
          const addrCheck = WAValidator.validate(e, parentCurrency);
          if (addrCheck) {
            _this.isValidAddress = addrCheck;
            _this.hexAddress = toChecksumAddress(e);
            removeElements();
          }
        }
      } else resolveDomain(e);
    };

    const resolveViaENS = function(domain) {
      console.log('resolving via ens!');
      const _this = vnode.context;
      const ens = _this.$store.state.ens;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      if (Misc.isValidENSorEtherAddress(domain)) {
        if (Misc.isValidETHAddress(domain)) {
          if (!checkDarklist(domain)) {
            _this.isValidAddress = true;
            _this.hexAddress = toChecksumAddress(domain);
            removeElements();
          }
        } else {
          if (network.type.ens === '' || ens === null || ens === undefined) {
            removeElements();
            _this.isValidAddress = false;
            _this.hexAddress = '';
            // eslint-disable-next-line
            errorPar.innerText = _this.$t('ens.ens-resolver.no-resolver', { network: network.type.name[0] });
            el.parentNode.parentNode.appendChild(errorPar);
          } else {
            getMultiCoinAddress(ens, normalise(domain), parentCurrency)
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
                    .resolver(normalise(domain))
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
                      errorPar.innerText = _this.$t('ens.ens-resolver.network-not-found', { network: network.type.name[0] });
                      _this.isValidAddress = false;
                      _this.hexAddress = '';
                      vnode.elm.parentNode.parentNode.appendChild(errorPar);
                    });
                } else {
                  removeElements();
                  // eslint-disable-next-line
                  errorPar.innerText = _this.$t('ens.ens-resolver.network-not-found', { network: network.type.name[0] });
                  _this.isValidAddress = false;
                  _this.hexAddress = '';
                  vnode.elm.parentNode.parentNode.appendChild(errorPar);
                }
              });
          }
        }
      } else if (domain !== '') {
        const isValid = WAValidator.validate(domain, parentCurrency);
        if (isValid) {
          _this.isValidAddress = isValid;
          _this.hexAddress =
            parentCurrency === 'ETH' ? toChecksumAddress(domain) : domain;
        } else {
          if (canValidate(parentCurrency)) {
            const isValid = MAValidator.validate(domain, parentCurrency);
            if (isValid) {
              _this.isValidAddress = isValid;
              _this.hexAddress = domain;
            } else {
              _this.isValidAddress = false;
              _this.hexAddress = '';
              removeElements();

              if (domain.length > 0) {
                if (
                  parentCurrency === 'ETH' &&
                  (domain.length !== 42 || !utils.isHexStrict(domain))
                ) {
                  errorPar.innerText = _this.$t(
                    'ens.ens-resolver.invalid-eth-addr'
                  );
                } else if (
                  parentCurrency === 'ETH' &&
                  !utils.checkAddressChecksum(domain)
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

    const checkDarklist = function(addr) {
      const _this = vnode.context;
      const messagePar = document.createElement('p');
      const isDarklisted = Misc.isDarklisted(addr);
      if (isDarklisted.error) {
        removeElements();
        _this.isValidAddress = false;
        _this.hexAddress = '';
        messagePar.innerText =
          isDarklisted.msg.length > 0
            ? isDarklisted.msg
            : _this.$t('ens.unstoppableResolution.address-reported-error');
        el.parentNode.parentNode.appendChild(messagePar);
        return true;
      }
      return false;
    };

    const resolveDomain = async function(domain) {
      const messagePar = document.createElement('p');
      const _this = vnode.context;
      try {
        if (resolution.serviceName(domain) === 'ENS')
          return resolveViaENS(domain);
        console.log('resolving via resolution');
        const address = await resolution.addressOrThrow(domain, parentCurrency);
        if (!checkDarklist(address)) {
          _this.isValidAddress = true;
          _this.hexAddress =
            parentCurrency === 'ETH' ? toChecksumAddress(address) : address;
          removeElements();
          messagePar.classList.add('resolver-addr');
          messagePar.innerText = _this.hexAddress;
          el.parentNode.parentNode.appendChild(messagePar);
        }
      } catch (err) {
        removeElements();
        _this.isValidAddress = false;
        _this.hexAddress = '';
        messagePar.classList.add('resolver-error');
        if (err instanceof ResolutionError) {
          messagePar.innerText = _this.$t(
            `ens.unstoppableResolution.${err.code}`,
            {
              domain,
              method:
                err.code != 'UnsupportedDomain'
                  ? resolution.serviceName(domain)
                  : '',
              currencyticker: parentCurrency
            }
          );
          el.parentNode.parentNode.appendChild(messagePar);
        } else throw err;
      }
    };
  }
};

export default AddrResolver;
