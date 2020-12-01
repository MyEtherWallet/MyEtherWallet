<template functional>
  <div class="loading-overlay">
    <component
      :is="injections.components.LoadingSign"
      :loadingmessage1="props.loadingmessage"
      color="white"
    />
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
  }
};
</script>

<style lang="scss" scoped>
@import './LoadingOverlay';
</style>
