<template functional>
  <div class="loading-overlay">
    <div class="loading-sign">
      <keep-alive>
        <component
          :is="injections.components.LoadingSign"
          :loadingmessage1="props.loadingmessage"
          color="white"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';

export default {
  inject: {
    components: {
      default: {
        LoadingSign
      }
    }
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
