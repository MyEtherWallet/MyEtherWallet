export default {
  closeOverlay(state, name) {
    state.overlays[name].isOpen = false;
  },
  openOverlay(state, name) {
    state.overlays[name].isOpen = true;
  },
  closeModal(state, name) {
    state.modals[name].isOpen = false;
  },
  openModal(state, name) {
    state.modals[name].isOpen = true;
  }
};
