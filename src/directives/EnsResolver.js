import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
import { toChecksumAddress } from '@/helpers/addressUtils';
import utils from 'web3-utils';
const EnsResolver = {
  bind: function(el, binding, vnode) {
    vnode.context.$watch(binding.value, function(e) {
      const _this = vnode.context;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const ens = _this.$store.state.ens;
      const network = _this.$store.state.network;
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
            errorPar.innerText = `No ${
              network.type.name[0]
            }NS resolver in this node`;
            el.parentNode.parentNode.appendChild(errorPar);
          } else {
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
          }
        }
      } else {
        _this.isValidAddress = false;
        _this.hexAddress = '';
        removeElements();
        if (e.length > 0) {
          if (e.length !== 42 || !utils.isHexStrict(e)) {
            errorPar.innerText = this.$t('ens.ens-resolver.invalid-eth-addr');
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
    });
  }
};

export default EnsResolver;
