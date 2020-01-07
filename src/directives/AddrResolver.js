import { toChecksumAddress } from '@/helpers/addressUtils';
import WAValidator from 'wallet-address-validator';
import { Misc } from '@/helpers';
import Resolution, { ResolutionError } from '@unstoppabledomains/resolution';

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
