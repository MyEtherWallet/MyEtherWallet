const EnsResolver = {
  update: function(el, binding, vnode) {
    const errorPar = document.createElement('p');
    const web3 = vnode.context.$store.state.web3;
    const ens = vnode.context.$store.state.ens;
    const _this = vnode.context;
    const removeElements = function() {
      if (vnode.elm.parentElement.children.length > 2) {
        vnode.elm.parentElement.classList.remove('with-resolver');
        vnode.elm.parentElement.children[1].remove();
      }
    };
    if (el.value.length >= 7) {
      if (el.value.substr(0, 2) === '0x') {
        if (!web3.utils.isAddress(el.value)) {
          _this.validAddress = false;
          removeElements();
          errorPar.innerText = 'Invalid address';
          vnode.elm.parentElement.classList.add('with-resolver');
          vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
        } else {
          _this.validAddress = true;
          removeElements();
        }
      } else {
        if (_this.$store.state.network.type.ens === '') {
          removeElements();
          _this.validAddress = false;
          errorPar.innerText = 'No ENS resolver in this node';
          vnode.elm.parentElement.classList.add('with-resolver');
          vnode.elm.parentNode.insertBefore(errorPar, el.nextSibling);
        } else {
          ens
            .owner(el.value)
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
