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
        <h2 class="mb-9">
          All-in-one gateway to your Ethereum Blockchain service
        </h2>
      </v-sheet>
      <div class="features-tabs-container">
        <v-container>
          <mew-tabs
            class="mew-tabs-container d-flex align-center flex-column"
            :items="mewTabs"
            is-block
          >
            <template v-slot:tabContent1>
              <img
                class="pt-7 pb-3 tab-image-content"
                :src="require('@/assets/images/backgrounds/bg-send-page.png')"
                alt="Send"
              />
            </template>
            <template v-slot:tabContent2>
              <img
                class="pt-7 tab-image-content"
                :src="require('@/assets/images/backgrounds/bg-swap-page.png')"
                alt="Swap"
              />
            </template>
            <template v-slot:tabContent3>
              <img
                class="pt-7 tab-image-content"
                :src="require('@/assets/images/backgrounds/bg-dapps-page.png')"
                alt="Dapps"
              />
            </template>
            <template v-slot:tabContent4>
              <img
                class="pt-7 tab-image-content"
                :src="require('@/assets/images/backgrounds/bg-tokens-page.png')"
                alt="tokens"
              />
            </template>
          </mew-tabs>
        </v-container>
      </div>
    </div>
    <div class="mobile-content d-block d-lg-none">
      <div class="py-7" />
      <v-sheet
        color="transparent"
        max-width="400px"
        class="mx-auto text-center px-5"
      >
        <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
          Features
        </div>
        <h2 class="mb-9">
          All-in-one gateway to your Ethereum Blockchain service
        </h2>
      </v-sheet>
      <v-container>
        <v-tabs v-model="mobileTab">
          <v-tab v-for="item in mobileItems" :key="item.tab">
            {{ item.tab }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="mobileTab">
          <v-tab-item v-for="item in mobileItems" :key="item.tab">
            <img class="tab-image" :src="item.img" :alt="item.tab" />
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeFeatures',
  components: {},
  data: () => ({
    mobileTab: null,
    mobileItems: [
      {
        tab: 'Send',
        img: require('@/assets/images/snippets/mobile/mobile-features-send.svg')
      },
      {
        tab: 'Swap',
        img: require('@/assets/images/snippets/mobile/mobile-features-swap.svg')
      },
      {
        tab: 'Dapps',
        img: require('@/assets/images/snippets/mobile/mobile-features-dapps.svg')
      },
      {
        tab: 'Tokens',
        img: require('@/assets/images/snippets/mobile/mobile-features-tokens.svg')
      }
    ],
    mewTabs: [
      {
        name: 'Send'
      },
      {
        name: 'Swap'
      },
      {
        name: 'Dapps'
      },
      {
        name: 'Tokens'
      }
    ]
  })
};
</script>

<style lang="scss">
.mew-component--features {
  background-color: var(--v-overlayBg-base);
  .desktop-content {
    .features-tabs-container {
      background-image: url(../../../../assets/images/backgrounds/bg-waves-color.png);
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
    .v-tabs {
      //margin: 0 -10px;
    }
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
      height: 60px;
    }
    .v-tab {
      padding: 0;
      min-width: 90px;
      text-transform: initial;

      @media (max-width: 399px) {
        min-width: 22vw;
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
      width: 100%;
      max-width: 500px;
    }

    .v-window-item {
      height: 120vw;
      max-height: 680px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<style lang="scss" scoped></style>
