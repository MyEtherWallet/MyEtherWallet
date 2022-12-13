import Vue from 'vue';
import mewComponents from '@myetherwallet/mew-components';
import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
import QrCode from '@/core/components/AppQrCode.vue';
import MewExpandPanel from '@/components/MewExpandPanel/MewExpandPanel.vue';
import MewSelect from '@/components/MewSelect/MewSelect.vue';
import MewIconButton from '@/components/MewIconButton/MewIconButton.vue';
import MewInput from '@/components/MewInput/MewInput.vue';

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});
Vue.component('Mew6WhiteSheet', whiteSheet);
Vue.component('QrCode', QrCode);
Vue.component('MewExpandPanel', MewExpandPanel);
Vue.component('MewSelect', MewSelect);
Vue.component('MewIconButton', MewIconButton);
Vue.component('MewInput', MewInput);
