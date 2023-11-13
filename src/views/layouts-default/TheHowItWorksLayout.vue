<template>
  <div class="mew-component--how-it-works">
    <the-layout-header :title="$t('howItWorks.title')" />
    <div class="py-7" />
    <v-container>
      <v-sheet color="transparent" max-width="500px" class="mx-auto mb-10">
        <h1 class="text-sm-center">{{ $t('home.features.heading') }}</h1>
      </v-sheet>
    </v-container>

    <how-it-works-send />
    <how-it-works-swap />
    <how-it-works-dapps-center />
    <how-it-works-tokens />
    <how-it-works-more />
    <get-started />
  </div>
</template>

<script>
export default {
  name: 'TheHowItWorksLayout',
  components: {
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader'),
    HowItWorksSwap: () => import('../components-default/HowItWorksSwap'),
    HowItWorksSend: () => import('../components-default/HowItWorksSend'),
    HowItWorksDappsCenter: () =>
      import('../components-default/HowItWorksDappsCenter'),
    HowItWorksTokens: () => import('../components-default/HowItWorksTokens'),
    HowItWorksMore: () => import('../components-default/HowItWorksMore'),
    GetStarted: () => import('../components-default/GetStarted')
  }
};
</script>

<style lang="scss" scoped>
.mew-component--how-it-works {
  .v-slide-group__prev {
    display: none !important;
  }
  .v-slide-group__content {
    display: flex !important;
    justify-content: center !important;
  }
  .v-tab {
    margin-left: 0 !important;
    font-size: 14px !important;
    font-weight: 400 !important;
  }
  .v-tab--active {
    font-weight: 600 !important;
  }
  .v-tabs-bar {
    height: 70px !important;
  }
  .v-tabs-slider-wrapper {
    height: 4px !important;
    .v-tabs-slider {
      background-color: var(--v-greenPrimary-base);
    }
  }
}
</style>
