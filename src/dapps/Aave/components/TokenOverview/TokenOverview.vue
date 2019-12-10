<template>
  <div class="overview-container">
    <div class="header">
      <i18n tag="p" class="title" path="dappsAave.token-overview">
        <span slot="token" class="title">{{
          $t('dappsAave.dai-reserves')
        }}</span>
      </i18n>
      <img
        class="icon"
        src="~@/assets/images/currency/coins/AllImages/DAI.svg"
      />
    </div>
    <div class="body-container"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'TokenOverview.scss';
</style>
