import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
const NameServiceResolver = {
  bind: function(el, binding, vnode) {
    vnode.context.$watch(binding.value, function(e) {
      const _this = vnode.context;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const ens = _this.$store.state.ens;
      const removeElements = function() {
        const child = el.parentNode.parentNode.lastChild;
        Object.keys(child.classList).forEach(item => {
          if (child.classList[item] === 'resolver-error') {
            vnode.elm.parentNode.parentNode.removeChild(child);
          }
        });
      };
      const errorDescription1 =
        _this.network.type.chainID === 30 || _this.network.type.chainID === 31
          ? 'No RNS resolver in this node'
          : 'No ENS resolver in this node';
      const errorDescription2 =
        _this.network.type.chainID === 30 || _this.network.type.chainID === 31
          ? 'RNS name is invalid or not found'
          : 'ENS name is invalid or not found';

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
            errorPar.innerText = errorDescription1;
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
                errorPar.innerText = errorDescription2;
                _this.isValidAddress = false;
                _this.hexAddress = '';
                vnode.elm.parentNode.parentNode.appendChild(errorPar);
              });
          }
        }
      } else {
        _this.isValidAddress = false;
        removeElements();
        errorPar.innerText = 'Invalid address';
        el.parentNode.parentNode.appendChild(errorPar);
      }
    });
  }
};

export default NameServiceResolver;
