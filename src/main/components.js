import Vue from 'vue';
import mewComponents from '@myetherwallet/mew-components';
import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
import QrCode from '@/core/components/AppQrCode.vue';
import MewTooltip from '@/components/MewTooltip/MewTooltip.vue';

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});
Vue.component('Mew6WhiteSheet', whiteSheet);
Vue.component('QrCode', QrCode);
Vue.component('MewTooltip', MewTooltip);
