const ClickOutside = {
  bind: function(el, binding, vnode) {
    document.body.addEventListener('click', function() {
      if (vnode.context.open === true) {
        vnode.context.openDropdown();
      }
    });

    el.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  },
  unbind: function(el, binding, vnode) {
    document.body.removeEventListener('click', function() {
      if (vnode.context.open === true) {
        vnode.context.openDropdown();
      }
    });

    el.removeEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
};

export default ClickOutside;
