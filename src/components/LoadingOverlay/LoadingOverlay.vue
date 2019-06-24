<template>
  <div class="loading-overlay">
    <div class="loading-sign">
      <loading-sign :loadingmessage1="loadingmessage" color="white" />
    </div>
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';

export default {
  components: {
    'loading-sign': LoadingSign
  },
  props: {
    loadingmessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import './LoadingOverlay';
</style>
