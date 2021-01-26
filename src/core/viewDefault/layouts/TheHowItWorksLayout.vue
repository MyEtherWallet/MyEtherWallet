<template>
  <div class="mew-component--how-it-works">
    <home-header title="How it works" />
    <how-it-works-send />
    <how-it-works-swap />
    <how-it-works-dapps-center />
    <how-it-works-tokens />
    <how-it-works-more />
    <get-started />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header/HomeHeader';
import getStarted from '@/components/get-started/GetStarted';

import HowItWorksSwap from '../components/howItWorksLayout/HowItWorksSwap';
import HowItWorksSend from '../components/howItWorksLayout/HowItWorksSend';
import HowItWorksDappsCenter from '../components/howItWorksLayout/HowItWorksDappsCenter';
import HowItWorksTokens from '../components/howItWorksLayout/HowItWorksTokens';
import HowItWorksMore from '../components/howItWorksLayout/HowItWorksMore';

export default {
  name: 'TheHowItWorksLayout',
  components: {
    homeHeader,
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
