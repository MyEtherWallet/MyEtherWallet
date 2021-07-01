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
      :link-obj="linkObj"
      @closed="onClose"
    />
  </div>
</template>
<script>
import ToastEvents from './handler/toastEvents.js';
import { EventBus } from '@/core/plugins/eventBus.js';
export default {
  name: 'ModuleToast',
  data() {
    return {
      text: '',
      linkObj: {},
      duration: 6000
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
  watch: {
    linkObj: {
      handler: function (newVal) {
        this.linkObj = newVal;
      },
      deep: true
    }
  },
  beforeMount() {
    Object.keys(ToastEvents).forEach(item => {
      EventBus.$on(ToastEvents[item], (text, obj, duration) => {
        this.text = text;
        this.linkObj = obj;
        this.duration = duration ? duration : 6000;
        this.callToast(ToastEvents[item]);
      });
    });
  },
  beforeDestroy() {
    Object.keys(ToastEvents).forEach(item => {
      EventBus.$off(ToastEvents[item], () => {
        this.text = '';
        this.linkObj = {};
        this.duration = 6000;
      });
    });
  },
  methods: {
    onClose() {
      this.text = '';
      this.linkObj = {};
      this.duration = 6000;
    },
    getRef(obj) {
      return Object.keys(obj)[0];
    },
    getName(obj) {
      return Object.values(obj)[0];
    },
    callToast(ref) {
      if (this.$refs[ref] && this.$refs[ref].length > 0)
        this.$refs[ref][0].showToast();
    }
  }
};
</script>
