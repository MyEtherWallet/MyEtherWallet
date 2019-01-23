import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
import store from '@/store';
const EnsResolver = {
  bind: function(el, binding, vnode) {
    vnode.context.$watch(binding.value, function(e) {
      const _this = vnode.context;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const ens = store.getters.ens;
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
          _this.isValidAddress = true;
          _this.hexAddress = _this.web3.utils.toChecksumAddress(e);
          removeElements();
        } else {
          if (
            _this.network.type.ens === '' ||
            ens === null ||
            ens === undefined
          ) {
            removeElements();
            _this.isValidAddress = false;
            _this.hexAddress = '';
            errorPar.innerText = 'No ENS resolver in this node';
            el.parentNode.parentNode.appendChild(errorPar);
          } else {
            ens
              .resolver(normalise(e))
              .addr()
              .then(address => {
                removeElements();
                _this.hexAddress = _this.web3.utils.toChecksumAddress(address);
                _this.isValidAddress = true;
                errorPar.innerText = address;
                vnode.elm.parentNode.parentNode.appendChild(errorPar);
              })
              .catch(() => {
                removeElements();
                errorPar.innerText = 'ENS name is invalid or not found';
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
        errorPar.innerText = 'Invalid address';
        el.parentNode.parentNode.appendChild(errorPar);
      }
    });
  }
};

export default EnsResolver;
