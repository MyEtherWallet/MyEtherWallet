export default {
  closeOverlay(state, name) {
    state.overlays[name].isOpen = false;
  },
  openOverlay(state, name) {
    console.log(name);
    state.overlays[name].isOpen = true;
  }
};
