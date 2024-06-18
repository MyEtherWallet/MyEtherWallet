<template>
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="show"
    :title="'Confirmation'"
    :back="backFunc"
    :close="backFunc"
  >
    <div class="text-center mb-5">
      <h2 class="redPrimary--text">{{ timeLeftStr }}</h2>
      <div class="textLight--text font-weight-bold text-uppercase">
        Time Remaining
      </div>
    </div>
    <from-to-block
      :from="from"
      :to="to"
      :from-type="fromType"
      :to-type="toType"
      :from-img="fromImg"
      :to-img="toImg"
      :from-val="fromVal"
      :to-val="toVal"
      class="mb-8"
    />
    <div class="d-flex justify-center my-8">
      <mew-button
        btn-size="xlarge"
        title="Confirm and Swap"
        :disabled="!sendEnabled"
        @click.native="send"
      />
    </div>
    <mew-warning-sheet :description="warningDescription" />
  </mew-overlay>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import fromToBlock from './SwapFromToBlock.vue';

// props
const props = defineProps({
  to: {
    type: String,
    default: ''
  },
  from: {
    type: String,
    default: ''
  },
  fromType: {
    type: String,
    default: ''
  },
  fromImg: {
    type: String,
    default: ''
  },
  toType: {
    type: String,
    default: ''
  },
  toImg: {
    type: String,
    default: ''
  },
  fromVal: {
    type: String,
    default: '0'
  },
  toVal: {
    type: String,
    default: '0'
  },
  show: {
    type: Boolean,
    default: false
  },
  validUntil: {
    type: Number,
    default: 0
  },
  backFunc: {
    type: Function,
    default: () => {}
  },
  send: {
    type: Function,
    default: () => {}
  }
});

// data
const warningDescription =
  'Make sure all your transaction details are CORRECT. Canceling or replacing transactions can not be guaranteed to work. You still be charged gas fee even transaction failing. Learn more here…';
const timeLeftStr = ref('0:0');
const sendEnabled = ref(true);
const timeLeftTimer = ref(null);

// mounted
onMounted(() => {
  timeLeftTimer.value = setInterval(() => {
    timeLeftStr.value = getTimeLeft().str;
    if (getTimeLeft().seconds < 0) sendEnabled.value = false;
    else sendEnabled.value = true;
  }, 1000);
});

// before unmount
onBeforeUnmount(() => {
  clearInterval(timeLeftTimer.value);
});

// methods
const getTimeLeft = () => {
  const distance = props.validUntil - new Date().getTime();
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return {
    str: distance > 0 ? minutes + ':' + seconds : '0:0',
    seconds: distance
  };
};
</script>
