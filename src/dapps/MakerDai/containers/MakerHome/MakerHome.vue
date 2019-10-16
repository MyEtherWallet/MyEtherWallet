<template functional>
  <div>
    <keep-alive>
      <component
        :is="injections.components.LoadingSign"
        :loadingmessage1="$t('dappsMaker.initialLoadingOne')"
        :loadingmessage2="$t('dappsMaker.initialLoadingTwo')"
      />
    </keep-alive>
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
  }
};
</script>

<style lang="scss" scoped>
@import 'MakerHome';
</style>
