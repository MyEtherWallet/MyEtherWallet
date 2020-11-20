<template>
  <div class="generate-address-layout d-flex">
    <div class="title">{{ $t('dappsStaked.generate-address.title') }}</div>
    <i18n tag="div" class="desc" path="dappsStaked.generate-address.desc">
      <!-- change to link -->
      <span slot="learn-more">{{ $t('common.learn-more') }}</span>
    </i18n>
    <create-password />
  </div>
</template>

<script>
import createPassword from './components/CreatePassword/CreatePassword';

export default {
  components: {
    createPassword
  }
};
</script>
<style lang="scss" scoped>
@import 'GenerateAddressLayout.scss';
</style>
