<template>
  <div>
    <loading-sign
      :loadingmessage1="loadingMessage"
      :loadingmessage2="$t('dappsMaker.initialLoadingTwo')"
    />
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';

export default {
  components: {
    'loading-sign': LoadingSign
  },
  props: {
    loadingState: {
      type: String,
      default: 'none'
    }
  },
  data() {
    return {};
  },
  computed: {
    loadingMessage(){
      return this.loadingState
      // return `Loading: ${this.loadingState}`
    },
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MakerLoading';
</style>
