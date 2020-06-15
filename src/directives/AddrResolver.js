import { toChecksumAddress } from '@/helpers/addressUtils';
import { Misc } from '@/helpers';
import Resolution, { ResolutionError } from '@unstoppabledomains/resolution';
import normalise from '@/helpers/normalise';
import utils from 'web3-utils';
import { EthereumTokens } from '@/partners';
import MAValidator from 'multicoin-address-validator';
import getMultiCoinAddress from '@/helpers/ENSMultiCoin.js';
import ethMew from '@/networks/nodes/eth-mew';
import RegistryAbi from '@/dapps/ManageENS/ABI/registryAbi.js';
import ResolverAbi from '@/dapps/ManageENS/ABI/resolverAbi.js';
import * as nameHashPckg from 'eth-ens-namehash';

const AddrResolver = {
  bind: function (el, binding, vnode) {
    let network = vnode.context.$store.state.main.network;
    let parentCurrency = vnode.context.$parent.currency
      ? vnode.context.$parent.currency
      : network.type.name;
    let address = '';
    const resolution = new Resolution({
      blockchain: {
        ens: false,
        cns: {
          url: ethMew.url,
          network: 'mainnet'
        }
      }
    });
    vnode.context.$parent.$watch('$store.state.main.network', function (e) {
      network = e;
      parentCurrency = e.type.name;
      actualProcess(address);
    });
    vnode.context.$parent.$watch('currency', function (e) {
      parentCurrency = e;
      actualProcess(address);
    });
    vnode.context.$watch(binding.value, function (e) {
      address = e.trim();
      vnode.context.avatar = '';
      actualProcess(address);
    });
    const removeElements = function () {
      vnode.elm.parentNode.parentNode
        .querySelectorAll('.resolver-error, .resolver-addr')
        .forEach(e => e.remove());
    };
    const appendElement = function (ele) {
      removeElements();
      vnode.elm.parentNode.parentNode.appendChild(ele);
    };
    const actualProcess = async function (e) {
      removeElements();
      const _this = vnode.context;
      if (e === '') {
        _this.isValidAddress = false;
        _this.hexAddress = '';
        _this.avatar = '';
      } else resolveDomain(e);
    };
    const resolveViaENS = function (domain) {
      const _this = vnode.context;
      const ens = _this.$store.state.main.ens;
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
          checkAvatar(domain);
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
                      'ens.ens-resolver.domain-not-found'
                    );

                    _this.isValidAddress = false;
                    _this.hexAddress = '';
                    _this.avatar = '';
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
                _this.avatar = '';
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
            _this.avatar = '';
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
            _this.hexAddress = domain;
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

    const checkDarklist = function (addr) {
      const _this = vnode.context;
      const messagePar = document.createElement('p');
      const isDarklisted = Misc.isDarklisted(addr);
      if (isDarklisted.error) {
        _this.isValidAddress = false;
        _this.hexAddress = '';
        _this.avatar = '';
        messagePar.innerText =
          isDarklisted.msg.length > 0
            ? isDarklisted.msg
            : _this.$t('ens.unstoppableResolution.address-reported-error');
        appendElement(messagePar);
        return true;
      }
      return false;
    };

    const checkAvatar = async function (domain) {
      try {
        const domainHash = nameHashPckg.hash(domain);
        const _this = vnode.context;
        const web3 = _this.$store.state.main.web3;
        const network = _this.$store.state.main.network;
        const registryContract = new web3.eth.Contract(
          RegistryAbi,
          network.type.ens.registry
        );
        const currentResolver = await registryContract.methods
          .resolver(domainHash)
          .call();
        const resolver = new web3.eth.Contract(ResolverAbi, currentResolver);
        const supportsTxt = await resolver.methods
          .supportsInterface('0x59d1d43c')
          .call();
        if (supportsTxt) {
          const avatar = await resolver.methods
            .text(domainHash, 'avatar')
            .call();
          if (avatar !== '') {
            const convertedMewAvatar = `https://img.mewapi.io/?image=${avatar}&width=30&height=30&fit=scale-down&quality=100`;
            _this.avatar = convertedMewAvatar ? convertedMewAvatar : '';
          }
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    };

    const resolveDomain = async function (domain) {
      const messagePar = document.createElement('p');
      const _this = vnode.context;
      if (
        domain.indexOf('.') > 0 &&
        /^[a-zA-Z\-\.0-9]*\.(zil|crypto)$/.test(domain)
      ) {
        try {
          const address = await resolution.addressOrThrow(
            domain,
            parentCurrency
          );
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
          _this.avatar = '';
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
                currencyTicker: parentCurrency
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
