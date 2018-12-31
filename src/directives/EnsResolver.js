import * as uts46 from 'idna-uts46';

const EnsResolver = {
  bind: function(el, binding, vnode) {
    vnode.context.$watch('address', function(e) {
      const _this = vnode.context;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');

      const web3 = _this.web3;
      const ens = _this.ens;
      const removeElements = function() {
        const child = vnode.elm.parentNode.parentNode.lastChild;
        Object.keys(child.classList).forEach(item => {
          if (child.classList[item] === 'resolver-error') {
            vnode.elm.parentNode.parentNode.removeChild(child);
          }
        });
      };
      const normalise = function(str) {
        return uts46.toUnicode(str, {
          useStd3ASCII: true,
          transitional: false
        });
      };
      if (normalise(e).length >= 7) {
        if (normalise(e).substr(0, 2) === '0x') {
          if (!web3.utils.isAddress(normalise(e))) {
            _this.validAddress = false;
            removeElements();
            _this.resolvedAddress = '';
            errorPar.innerText = 'Invalid address';
            vnode.elm.parentNode.parentNode.appendChild(errorPar);
          } else {
            _this.validAddress = true;
            removeElements();
          }
        } else {
          if (
            _this.network.type.ens === '' ||
            ens === null ||
            ens === undefined
          ) {
            removeElements();
            _this.resolvedAddress = '';
            _this.validAddress = false;
            errorPar.innerText = 'No ENS resolver in this node';
            vnode.elm.parentNode.parentNode.appendChild(errorPar);
          } else {
            ens
              .resolver(normalise(e))
              .addr()
              .then(address => {
                removeElements();
                _this.resolvedAddress = address;
                _this.validAddress = true;
                errorPar.innerText = address;
                vnode.elm.parentNode.parentNode.appendChild(errorPar);
              })
              .catch(() => {
                removeElements();
                _this.resolvedAddress = '';
                errorPar.innerText = 'ENS name is invalid or not found';
                _this.validAddress = false;
                vnode.elm.parentNode.parentNode.appendChild(errorPar);
              });
          }
        }
      } else {
        removeElements();
      }
    });
  }
};

export default EnsResolver;
