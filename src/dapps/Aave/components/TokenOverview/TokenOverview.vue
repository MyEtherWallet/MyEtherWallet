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
    <div class="body-container">
      <div class="left-container">
        <p>{{ $t('dappsAave.utilization-rate') }}</p>
        <p>{{ $t('dappsAave.total-liquidity') }}</p>
        <p>{{ $t('dappsAave.avail-liquidity') }}</p>
        <p>{{ $t('dappsAave.stable-rate') }}</p>
        <p>{{ $t('dappsAave.variable-rate') }}</p>
      </div>
      <div class="right-container">
        <!-- placeholders -->
        <p>29.9%</p>
        <p>1,201,133.73149 DAI</p>
        <p>840,113.16273 DAI</p>
        <p class="stable-text">9.49%</p>
        <p class="variable-text">13.48%</p>
      </div>
    </div>
    <div class="footer-container">
      <div class="footer-header">
        <p class="title">{{ $t('dappsAave.historical-rate') }}</p>
        <div class="key-container">
          <div class="key"></div>
          <p>{{ $t('dappsAave.apr') }}</p>
        </div>
      </div>
      <p class="info">{{ $t('dappsAave.no-data') }}</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'TokenOverview.scss';
</style>
