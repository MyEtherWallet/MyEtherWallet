export default {
  closeOverlay(state, name) {
    state.overlays[name].isOpen = false;
  }
};
