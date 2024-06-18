<template>
  <div>
    <mew-toast
      v-for="toast in toastGenerator"
      :ref="`(el) => (providerRef[getName(toast)] = el)`"
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
<script setup>
import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue';

import ToastEvents from './handler/toastEvents.js';
import { EventBus } from '@/core/plugins/eventBus.js';

// data
const text = ref('');
const linkObj = ref({});
const duration = ref(6000);
const toastRefs = ref({});

// computed
const toastGenerator = computed(() => {
  const initialArray = Object.keys(ToastEvents);
  return initialArray.map(item => {
    return {
      [item]: ToastEvents[item]
    };
  });
});

// watch
watch(
  linkObj,
  newVal => {
    linkObj.value = newVal;
  },
  { deep: true }
);

// onBeforeMount
onBeforeMount(() => {
  Object.keys(ToastEvents).forEach(item => {
    EventBus.$on(ToastEvents[item], (text, obj, duration) => {
      text.value = text;
      linkObj.value = obj;
      duration.value = duration ? duration : 6000;
      callToast(ToastEvents[item]);
    });
  });
});

// onBeforeUnmount
onBeforeUnmount(() => {
  Object.keys(ToastEvents).forEach(item => {
    EventBus.$off(ToastEvents[item], () => {
      text.value = '';
      linkObj.value = {};
      duration.value = 6000;
    });
  });
});

// methods
const onClose = () => {
  text.value = '';
  linkObj.value = {};
  duration.value = 6000;
};

const getRef = obj => {
  return Object.keys(obj)[0];
};

const getName = obj => {
  return Object.values(obj)[0];
};

const callToast = ref => {
  if (toastRefs.value[ref] && toastRefs.value[ref].length > 0) {
    toastRefs.value[ref][0].showToast();
  }
};
</script>
