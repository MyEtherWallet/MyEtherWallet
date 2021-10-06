<template>
  <div class="mew-component--features">
    <div class="desktop-content d-none d-lg-block">
      <div class="py-10" />
      <v-sheet
        color="transparent"
        max-width="400px"
        class="mx-auto text-center"
      >
        <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
          Features
        </div>
        <h1 class="mb-9">Your Gateway to the Ethereum Blockchain</h1>
      </v-sheet>
      <div class="features-tabs-container">
        <v-container>
          <mew-tabs
            class="mew-tabs-container d-flex align-center flex-column"
            :items="mewTabs"
            is-block
          >
            <template #tabContent1>
              <home-features-send class="mt-16 mb-10" />
            </template>
            <template #tabContent2>
              <home-features-swap class="mt-16 mb-10" />
            </template>
            <template #tabContent3>
              <home-features-dapps class="mt-16 mb-10" />
            </template>
            <template #tabContent4>
              <home-features-tokens class="mt-16 mb-10" />
            </template>
          </mew-tabs>
        </v-container>
      </div>
    </div>

    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-container>
        <v-sheet color="transparent" max-width="500px" class="mx-auto">
          <h5 class="font-weight-bold text-uppercase textPrimary--text mb-2">
            Features
          </h5>
          <h1 class="mb-10">Your Gateway to the Ethereum Blockchain</h1>

          <v-tabs v-model="mobileTab" fixed-tabs>
            <v-tab v-for="item in mobileItems" :key="item.tab">
              {{ item.tab }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="mobileTab">
            <v-tab-item v-for="item in mewTabs" :key="item.tab">
              <div class="mt-10 mb-5">
                <home-features-send v-if="item.name === 'ETH'" />
                <home-features-swap v-if="item.name === 'Swap'" />
                <home-features-dapps v-if="item.name === 'DApps'" />
                <home-features-tokens v-if="item.name === 'Tokens'" />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-sheet>
      </v-container>
      <div class="py-2" />
    </div>
  </div>
</template>

<script>
import HomeFeaturesSend from './HomeFeaturesSend';
import HomeFeaturesSwap from './HomeFeaturesSwap';
import HomeFeaturesDapps from './HomeFeaturesDapps';
import HomeFeaturesTokens from './HomeFeaturesTokens';

export default {
  name: 'HomeFeatures',
  components: {
    HomeFeaturesSend,
    HomeFeaturesSwap,
    HomeFeaturesDapps,
    HomeFeaturesTokens
  },
  data: () => ({
    mobileTab: null,
    mobileItems: [
      {
        tab: 'ETH',
        img: require('@/assets/images/snippets/mobile/mobile-features-send.svg')
      },
      {
        tab: 'Swap',
        img: require('@/assets/images/snippets/mobile/mobile-features-swap.svg')
      },
      {
        tab: 'DApps',
        img: require('@/assets/images/snippets/mobile/mobile-features-dapps.svg')
      },
      {
        tab: 'Tokens',
        img: require('@/assets/images/snippets/mobile/mobile-features-tokens.svg')
      }
    ],
    mewTabs: [
      {
        name: 'ETH'
      },
      {
        name: 'Swap'
      },
      {
        name: 'DApps'
      },
      {
        name: 'Tokens'
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
.mew-component--features {
  .desktop-content {
    .features-tabs-container {
      background-image: url(../../assets/images/backgrounds/bg-waves-color.png);
      background-size: contain;
      background-position: bottom center;
    }

    .tab-image-content {
      max-width: 800px;
      margin: 0 auto;
      display: block;
    }
    .mew-tabs-block {
      max-width: 550px;
    }
  }
  .mobile-content {
    background-color: var(--v-overlayBg-base);
    .v-item-group {
      background-color: transparent !important;
      justify-content: center !important;
    }
    .v-slide-group__wrapper {
      justify-content: center !important;
      flex-grow: 0 !important;
      margin: 0;
      background-color: white !important;
      overflow: hidden;
      border-radius: 10px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.07);
    }
    .v-tabs-slider-wrapper {
      display: none;
    }
    .v-tabs-bar {
      height: 3.5rem;
    }
    .v-tab {
      padding: 0;
      min-width: 90px;
      text-transform: initial;

      @media (max-width: 399px) {
        min-width: 20vw;
      }
    }
    .v-tab--active {
      background-color: rgb(11, 26, 64);
      color: white;
    }
    .v-slide-group__prev {
      display: none !important;
    }

    .tab-image {
      width: 105%;
      max-width: 500px;
    }

    .v-window-item {
      //height: 125vw;
      //max-height: 680px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .v-window {
      overflow: visible;
    }
  }
}
</style>

<style lang="scss" scoped></style>
