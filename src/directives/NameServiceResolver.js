import normalise from '@/helpers/normalise';
import { Misc } from '@/helpers';
const NameServiceResolver = {
  bind: function(el, binding, vnode) {
    vnode.context.$watch(binding.value, function(e) {
      const _this = vnode.context;
      const errorPar = document.createElement('p');
      errorPar.classList.add('resolver-error');
      const ens = _this.ens;
      const removeElements = function() {
        const child = el.parentNode.parentNode.lastChild;
        Object.keys(child.classList).forEach(item => {
          if (child.classList[item] === 'resolver-error') {
            vnode.elm.parentNode.parentNode.removeChild(child);
          }
        });
      };
      if (
        _this.network.type.chainID === 30 ||
        _this.network.type.chainID === 31
      ) {
        if (Misc.isValidRNSorRSKAddress(e)) {
          if (Misc.isValidETHAddress(e.toLowerCase())) {
            _this.isValidAddress = true;
            _this.hexAddress = e.toLowerCase();
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
              errorPar.innerText = 'No RNS resolver in this node';
              el.parentNode.parentNode.appendChild(errorPar);
            } else {
              ens
                .resolver(normalise(e))
                .addr()
                .then(address => {
                  removeElements();
                  _this.hexAddress = address.toLowerCase();
                  _this.isValidAddress = true;
                  errorPar.innerText = address.toLowerCase();
                  vnode.elm.parentNode.parentNode.appendChild(errorPar);
                })
                .catch(() => {
                  removeElements();
                  errorPar.innerText = 'RNS name is invalid or not found';
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
      } else {
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
                  _this.hexAddress = _this.web3.utils.toChecksumAddress(
                    address
                  );
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
          removeElements();
          errorPar.innerText = 'Invalid address';
          el.parentNode.parentNode.appendChild(errorPar);
        }
      }
    });
  }
};

export default NameServiceResolver;
