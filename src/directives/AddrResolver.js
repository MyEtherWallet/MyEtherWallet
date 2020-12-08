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
import twitterVerifiedLogo from '@/assets/images/etc/twitter_verified_logo.svg';
import ethereumLogo from '@/assets/images/etc/ethereum_logo.svg';

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
      const elements = [
        '.resolution-container',
        '.resolver-error',
        '.resolver-addr',
        '.contract-addr-resolved',
        '.twitter-verify'
      ];
      elements.forEach(e =>
        vnode.elm.parentNode.parentNode
          .querySelectorAll(e)
          .forEach(e => e.remove())
      );
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
      if (domain.substring(0,3) === 'xdc') {
        domain = "0x" + domain.substring(3);
      }
      const _this = vnode.context;
      const ens = _this.$store.state.main.ens;

      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('resolution-container');
      messageDiv.appendChild(errorPar);
      if (
        (parentCurrency === network.type.name ||
          EthereumTokens[parentCurrency]) &&
        Misc.isValidETHAddress(domain)
      ) {
        if (!checkDarklist(domain)) {
          _this.isValidAddress = true;
          _this.hexAddress = toChecksumAddress(domain);
          checkAddressIsContract(domain).then(res => {
            if (res) {
              if (res) {
                errorPar.classList.add('contract-addr-resolved');
              }
              errorPar.innerText = _this.$t('errorsGlobal.address-is-contract');
              appendElement(errorPar);
            }
          });
        }
      } else if (Misc.isValidENSAddress(domain)) {
        if (network.type.ens === '' || ens === null || ens === undefined) {
          _this.isValidAddress = false;
          _this.hexAddress = '';
          // eslint-disable-next-line
          errorPar.innerText = _this.$t('ens.ens-resolver.no-resolver', {
            network: network.type.name[0]
          });
          appendElement(messageDiv);
        } else {
          checkAvatar(domain);
          getMultiCoinAddress(ens, normalise(domain), parentCurrency)
            .then(address => {
              if (!checkDarklist(address)) {
                _this.hexAddress = address;
                _this.isValidAddress = true;
                const ethAddressDisplay = `<img style="padding:1em" src="${ethereumLogo}"/><span style="font-weight: 600">${address}</span>`;
                checkAddressIsContract(address).then(res => {
                  if (res) {
                    errorPar.classList.add('contract-addr-resolved');
                  }
                  errorPar.innerText = res
                    ? _this.$t('errorsGlobal.address-is-contract')
                    : '';
                  errorPar.innerHTML = !res ? ethAddressDisplay : '';

                  appendElement(errorPar);
                });
                errorPar.innerHTML = ethAddressDisplay;
                appendElement(messageDiv);
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
                      checkAddressIsContract(address).then(res => {
                        if (res) {
                          errorPar.classList.add('contract-addr-resolved');
                        }
                        errorPar.innerText = res
                          ? _this.$t('errorsGlobal.address-is-contract')
                          : address;
                        appendElement(messageDiv);
                      });
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
                    appendElement(messageDiv);
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
                appendElement(messageDiv);
              }
            });
        }
      } else if (domain !== '') {
        if (domain.substring(0,3) === 'xdc') {
          domain = "0x" + domain.substring(3);
        }
        try {
          const isValid = true;
          _this.isValidAddress = isValid;
          _this.hexAddress = domain;
          if (!isValid) {
            _this.hexAddress = '';
            _this.avatar = '';
            if (domain.length > 0) {
              if (
                parentCurrency === 'ETH' &&
                (domain.length !== 43 || !utils.isHexStrict(domain))
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
            appendElement(messageDiv);
          }
        } catch (e) {
          if (e.message.includes('Missing validator for currency: ')) {
            console.log(e,"eeeee")
            _this.isValidAddress = true;
            _this.hexAddress = domain;
            errorPar.innerText = _this.$t('swap.warning.unable-validate-addr', {
              currency: parentCurrency
            });
            appendElement(messageDiv);
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
      const messageDiv = document.createElement('div');
      const messagePar = document.createElement('p');
      messageDiv.appendChild(messagePar);
      messageDiv.classList.add('resolution-container');
      const _this = vnode.context;
      if (
        domain.indexOf('.') > 0 &&
        // eslint-disable-next-line
        /^[a-zA-Z\-\.0-9]*\.(zil|crypto)$/.test(domain)
      ) {
        try {
          const address = await resolution.addr(domain, parentCurrency);
          if (!checkDarklist(address)) {
            _this.isValidAddress = true;
            _this.hexAddress =
              parentCurrency === network.type.name
                ? toChecksumAddress(address)
                : address;
            const contractAddress = await checkAddressIsContract(address);
            if (contractAddress) {
              messagePar.classList.add('contract-addr-resolved');
              messagePar.innerText = _this.$t(
                'errorsGlobal.address-is-contract'
              );
            } else {
              messagePar.classList.add('resolver-addr');
              messagePar.style.cssText = 'display:flex;align-items:center';
              messagePar.innerHTML = `${
                parentCurrency === 'ETH'
                  ? `<img style="padding:1em" src="${ethereumLogo}"/>`
                  : `<p style="padding:1em .5em 1em 1em">${parentCurrency} Address: </p>`
              }<span style="font-weight: 600">${_this.hexAddress}</span>`;
              const twitterUsername = await resolution.cns
                .twitter(domain)
                .catch(() => null);
              if (twitterUsername) {
                const twitterVerifiedPar = document.createElement('p');
                twitterVerifiedPar.classList.add('twitter-verify');

                twitterVerifiedPar.innerHTML = `<div style="display:flex; align-items:center; padding: 0 0 1em 1em"><img style="padding: 0 6px 0 0"src="${twitterVerifiedLogo}" /> <a href="https://twitter.com/${twitterUsername}" target="_blank" style="margin-right:5px; font-weight:600">@${twitterUsername}</a> - ${_this.$t(
                  'ens.unstoppableResolution.twitter-verified'
                )} <a href="https://chain.link/" target="_blank" rel="noopener noreferrer" style="margin-left: 5px">Chainlink</a></div>`;
                messageDiv.appendChild(twitterVerifiedPar);
              }
            }
            appendElement(messageDiv);
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
                recordName: parentCurrency
              }
            );
            appendElement(messageDiv);
          } else throw err;
        }
      } else {
        resolveViaENS(domain);
      }
    };

    const checkAddressIsContract = async function (addr) {
      if (addr.substring(0,3) === 'xdc') {
        addr = "0x" + addr.substring(3);
      }
      const web3 = vnode.context.$store.state.main.web3;
      const isContract = await web3.eth.getCode(addr);
      // returns true if it is a contract
      return isContract !== '0x';
    };
  }
};

export default AddrResolver;
