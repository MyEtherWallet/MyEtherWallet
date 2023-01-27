import Vue from 'vue';
import mewComponents from '@myetherwallet/mew-components';
import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
import QrCode from '@/core/components/AppQrCode.vue';
import TheSimpleBtn from '@/core/components/TheSimpleBtn.vue';
import TheDot from '@/core/components/TheDot.vue';

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});
Vue.component('Mew6WhiteSheet', whiteSheet);
Vue.component('QrCode', QrCode);
Vue.component('MewSimpleBtn', TheSimpleBtn);
Vue.component('MewDot', TheDot);
