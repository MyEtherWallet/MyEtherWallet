import * as uts46 from 'idna-uts46';

const EnsResolver = {
  update: function(el, binding, vnode) {
    const _this = vnode.context;
    const errorPar = document.createElement('p');
    const web3 = _this.web3;
    const ens = _this.ens;
    const removeElements = function() {
      if (vnode.elm.parentElement.children.length > 2) {
        vnode.elm.parentElement.classList.remove('with-resolver');
        vnode.elm.parentElement.children[1].remove();
      }
    };
    const normalise = function(str) {
      return uts46.toUnicode(str, {
        useStd3ASCII: true,
        transitional: false
      });
    };

    if (normalise(el.value).length >= 7) {
      if (normalise(el.value).substr(0, 2) === '0x') {
        if (!web3.utils.isAddress(normalise(el.value))) {
          _this.validAddress = false;
          removeElements();
          _this.resolvedAddress = '';
          errorPar.innerText = 'Invalid address';
          vnode.elm.parentElement.classList.add('with-resolver');
          vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
        } else {
          _this.validAddress = true;
          removeElements();
        }
      } else {
        if (_this.network.type.ens === '' || ens === null || ens === undefined) {
          removeElements();
          _this.resolvedAddress = '';
          _this.validAddress = false;
          errorPar.innerText = 'No ENS resolver in this node';
          vnode.elm.parentElement.classList.add('with-resolver');
          vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
        } else {
          ens
            .resolver(normalise(el.value))
            .addr()
            .then(address => {
              removeElements();
              _this.resolvedAddress = address;
              _this.validAddress = true;
              errorPar.innerText = address;
              vnode.elm.parentElement.classList.add('with-resolver');
              vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
            })
            .catch(() => {
              removeElements();
              _this.resolvedAddress = '';
              errorPar.innerText = 'ENS name is invalid or not found';
              _this.validAddress = false;
              vnode.elm.parentElement.classList.add('with-resolver');
              vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
            });
        }
      }
    } else {
      removeElements();
    }
  }
};

export default EnsResolver;
