import Vue from 'vue';
export default {
  install(VueInstance) {
    VueInstance.prototype.$eventHub = new Vue();
  }
};
