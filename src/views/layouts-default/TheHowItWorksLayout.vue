<template>
  <div class="mew-component--how-it-works">
    <the-layout-header title="How it works" />
    <mew-tabs :items="mewTabs" has-underline>
      <template #tabContent1>
        <how-it-works-send />
      </template>
      <template #tabContent2>
        <how-it-works-swap />
      </template>
      <template #tabContent3>
        <how-it-works-dapps-center />
      </template>
      <template #tabContent4>
        <how-it-works-tokens />
      </template>
      <template #tabContent5>
        <how-it-works-more />
      </template>
    </mew-tabs>
    <get-started />
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import getStarted from '@/components/get-started/GetStarted';

import HowItWorksSwap from '../components-default/HowItWorksSwap';
import HowItWorksSend from '../components-default/HowItWorksSend';
import HowItWorksDappsCenter from '../components-default/HowItWorksDappsCenter';
import HowItWorksTokens from '../components-default/HowItWorksTokens';
import HowItWorksMore from '../components-default/HowItWorksMore';

export default {
  name: 'TheHowItWorksLayout',
  components: {
    TheLayoutHeader,
    HowItWorksSwap,
    HowItWorksSend,
    HowItWorksDappsCenter,
    HowItWorksTokens,
    HowItWorksMore,
    getStarted
  },
  data() {
    return {
      mewTabs: [
        {
          name: 'send'
        },
        {
          name: 'swap'
        },
        {
          name: 'dapps'
        },
        {
          name: 'tokens'
        },
        {
          name: 'more'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
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
      background-color: var(--v-primary-base);
    }
  }
}
</style>
