<template>
  <div>
    <mew-toast
      v-for="toast in toastGenerator"
      :ref="getRef(toast)"
      :key="getName(toast) + getRef(toast)"
      :persistent="false"
      :duration="1500"
      :toast-type="getName(toast)"
      :text="text"
      :link-object="linkObj"
      @closed="onClose"
    />
  </div>
</template>
<script>
import ToastEvents from './toastEvents.js';
export default {
  name: 'Toast',
  data() {
    return {
      text: '',
      linkObj: {}
    };
  },
  computed: {
    toastGenerator() {
      const initialArray = Object.keys(ToastEvents);
      return initialArray.map(item => {
        return {
          [item]: item.replace('toast').toLowerCase()
        };
      });
    }
  },
  created() {
    Object.keys(ToastEvents).forEach(item => {
      this.$eventHub.$on(ToastEvents[item], (text, obj) => {
        this.text = text;
        this.linkObj = obj;
        this.$refs[ToastEvents[item]].showToast();
      });
    });
  },
  methods: {
    onClose() {
      this.text = '';
      this.linkObj = {};
    },
    getRef(obj) {
      return Object.keys(obj)[0];
    },
    getName(obj) {
      return Object.values(obj)[0];
    }
  }
};
</script>
