<template>
  <div>
    <mew-toast
      v-for="toast in toastGenerator"
      :ref="getName(toast)"
      :key="getName(toast) + getRef(toast)"
      :persistent="false"
      :duration="duration"
      :toast-type="getRef(toast)"
      :text="text"
      :link-object="linkObj"
      @closed="onClose"
    />
  </div>
</template>
<script>
import ToastEvents from './toastEvents.js';
import { EventBus } from '@/plugins/eventBus.js';
export default {
  name: 'Toast',
  data() {
    return {
      text: '',
      linkObj: {},
      duration: 3000
    };
  },
  computed: {
    toastGenerator() {
      const initialArray = Object.keys(ToastEvents);
      return initialArray.map(item => {
        return {
          [item]: ToastEvents[item]
        };
      });
    }
  },
  beforeMount() {
    Object.keys(ToastEvents).forEach(item => {
      EventBus.$on(ToastEvents[item], (text, obj, duration) => {
        this.text = text;
        this.linkObj = obj;
        this.duration = duration ? duration : 3000;
        this.callToast(ToastEvents[item]);
      });
    });
  },
  beforeDestroy() {
    Object.keys(ToastEvents).forEach(item => {
      EventBus.$off(ToastEvents[item], () => {
        this.text = '';
        this.linkObj = {};
        this.duration = 3000;
      });
    });
  },
  methods: {
    onClose() {
      this.text = '';
      this.linkObj = {};
      this.duration = 3000;
    },
    getRef(obj) {
      return Object.keys(obj)[0];
    },
    getName(obj) {
      return Object.values(obj)[0];
    },
    callToast(ref) {
      console.log(ref, this.$refs);
      this.$refs[ref][0].showToast();
    }
  }
};
</script>
