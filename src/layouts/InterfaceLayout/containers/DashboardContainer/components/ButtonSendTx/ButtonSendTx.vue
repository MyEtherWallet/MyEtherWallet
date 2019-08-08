<template>
  <div class="button-send-tx">
    <div class="content-container">
      <img :src="left" class="left" />
      <img :src="right" class="right" />
      <img :src="spaceman" class="spaceman" />
      <p>Send<br />Transaction</p>
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
