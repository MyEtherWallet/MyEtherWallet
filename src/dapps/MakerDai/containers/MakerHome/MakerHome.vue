<template functional>
  <div>
    <component
      :is="injections.components.LoadingSign"
      :loadingmessage1="props.loadingMessage1"
      :loadingmessage2="props.loadingMessage2"
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
    loadingMessage1: {
      type: String,
      default: ''
    },
    loadingMessage2: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerHome';
</style>
