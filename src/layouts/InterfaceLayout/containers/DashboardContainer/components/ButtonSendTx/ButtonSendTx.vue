<template>
  <div class="button-send-tx">
    <div :class="disabled ? 'button-disabled' : ''" class="content-container">
      <img :src="left" class="left" alt />
      <img :src="right" class="right" alt />
      <img :src="spaceman" class="spaceman" alt />
      <div class="text-content">
        <p class="title">{{ $t('sendTx.send') }}<br />{{ $t('sendTx.tx') }}</p>
        <p v-if="disabled" class="button-disabled">
          {{ $t('interface.no-avail') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LeftCircle from '@/assets/images/buttons/send-tx/left.png';
import RightCircle from '@/assets/images/buttons/send-tx/right.png';
import Spaceman from '@/assets/images/buttons/send-tx/spaceman.png';

export default {
  name: 'ButtonSendTx',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      left: LeftCircle,
      right: RightCircle,
      spaceman: Spaceman
    };
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
@import 'ButtonSendTx.scss';
</style>
