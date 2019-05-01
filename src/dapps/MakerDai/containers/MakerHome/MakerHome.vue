<template>
  <div>
    <loading-sign
      loadingmessage1="$t('dappsMaker.initialLoadingOne')"
      loadingmessage2="$t('dappsMaker.initialLoadingTwo')"
    />
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';

export default {
  components: {
    'loading-sign': LoadingSign
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MakerHome';
</style>
