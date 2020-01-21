import { toChecksumAddress } from '@/helpers/addressUtils';
import { Misc } from '@/helpers';
import Resolution, { ResolutionError } from '@unstoppabledomains/resolution';
import normalise from '@/helpers/normalise';
import utils from 'web3-utils';
import { EthereumTokens } from '@/partners';
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
      actualProcess(address);
    });
    vnode.context.$parent.$watch('currency', function(e) {
      parentCurrency = e;
      actualProcess(address);
    });
    vnode.context.$watch(binding.value, function(e) {
      address = e.trim();
      actualProcess(address);
    });
    const removeElements = function() {
      vnode.elm.parentNode.parentNode
        .querySelectorAll('.resolver-error, .resolver-addr')
        .forEach(e => e.remove());
    };
    const appendElement = function(ele) {
      removeElements();
      vnode.elm.parentNode.parentNode.appendChild(ele);
    };
    const actualProcess = async function(e) {
      removeElements();
      const _this = vnode.context;
      if (e === '') {
        _this.isValidAddress = false;
        _this.hexAddress = '';
      } else resolveDomain(e);
    };
    const resolveViaENS = function(domain) {
      const _this = vnode.context;
      const ens = _this.$store.state.ens;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      if (
        (parentCurrency === network.type.name ||
          EthereumTokens[parentCurrency]) &&
        Misc.isValidETHAddress(domain)
      ) {
        if (!checkDarklist(domain)) {
          _this.isValidAddress = true;
          _this.hexAddress = toChecksumAddress(domain);
        }
      } else if (Misc.isValidENSAddress(domain)) {
        if (network.type.ens === '' || ens === null || ens === undefined) {
          _this.isValidAddress = false;
          _this.hexAddress = '';
          // eslint-disable-next-line
          errorPar.innerText = _this.$t('ens.ens-resolver.no-resolver', {
            network: network.type.name[0]
          });
          appendElement(errorPar);
        } else {
          getMultiCoinAddress(ens, normalise(domain), parentCurrency)
            .then(address => {
              if (!checkDarklist(address)) {
                _this.hexAddress = address;
                _this.isValidAddress = true;
                errorPar.innerText = address;
                appendElement(errorPar);
              }
            })
            .catch(() => {
              if (
                parentCurrency === network.type.name ||
                EthereumTokens[parentCurrency]
              ) {
                ens
                  .resolver(normalise(domain))
                  .addr()
                  .then(address => {
                    if (!checkDarklist(address)) {
                      _this.hexAddress = toChecksumAddress(address);
                      _this.isValidAddress = true;
                      errorPar.innerText = address;
                      appendElement(errorPar);
                    }
                  })
                  .catch(() => {
                    // eslint-disable-next-line
                    errorPar.innerText = _this.$t(
                      'ens.ens-resolver.network-not-found',
                      { network: network.type.name[0] }
                    );

                    _this.isValidAddress = false;
                    _this.hexAddress = '';
                    appendElement(errorPar);
                  });
              } else {
                // eslint-disable-next-line
                errorPar.innerText = _this.$t(
                  'ens.ens-resolver.network-not-found',
                  { network: network.type.name[0] }
                );
                _this.isValidAddress = false;
                _this.hexAddress = '';
                appendElement(errorPar);
              }
            });
        }
      } else if (domain !== '') {
        try {
          const isValid = MAValidator.validate(domain, parentCurrency);
          _this.isValidAddress = isValid;
          _this.hexAddress = domain;
          if (!isValid) {
            _this.hexAddress = '';
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
                errorPar.innerText = _this.$t('ens.ens-resolver.invalid-addr', {
                  coin: parentCurrency
                });
              }
            } else {
              errorPar.innerText = '';
            }
            appendElement(errorPar);
          }
        } catch (e) {
          if (e.message.includes('Missing validator for currency: ')) {
            _this.isValidAddress = true;
            errorPar.innerText = _this.$t('swap.warning.unable-validate-addr', {
              currency: parentCurrency
            });
            appendElement(errorPar);
          } else {
            throw e;
          }
        }
      }
    };

    const checkDarklist = function(addr) {
      const _this = vnode.context;
      const messagePar = document.createElement('p');
      const isDarklisted = Misc.isDarklisted(addr);
      if (isDarklisted.error) {
        _this.isValidAddress = false;
        _this.hexAddress = '';
        messagePar.innerText =
          isDarklisted.msg.length > 0
            ? isDarklisted.msg
            : _this.$t('ens.unstoppableResolution.address-reported-error');
        appendElement(messagePar);
        return true;
      }
      return false;
    };

    const resolveDomain = async function(domain) {
      const messagePar = document.createElement('p');
      const _this = vnode.context;
      if (
        domain.indexOf('.') > 0 &&
        /^[^-]*[^-]*\.(zil|crypto)$/.test(domain)
      ) {
        const maincur =
          parentCurrency === network.type.name || EthereumTokens[parentCurrency]
            ? network.type.name
            : parentCurrency;
        try {
          const address = await resolution.addressOrThrow(domain, maincur);
          if (!checkDarklist(address)) {
            _this.isValidAddress = true;
            _this.hexAddress =
              parentCurrency === network.type.name
                ? toChecksumAddress(address)
                : address;
            messagePar.classList.add('resolver-addr');
            messagePar.innerText = _this.hexAddress;
            appendElement(messagePar);
          }
        } catch (err) {
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
            appendElement(messagePar);
          } else throw err;
        }
      } else {
        resolveViaENS(domain);
      }
    };
  }
};

export default AddrResolver;
