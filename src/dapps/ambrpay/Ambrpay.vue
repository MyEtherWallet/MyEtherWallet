<template>
  <div class="mew-component-fix--ambrpay">
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
        <div class="pa-10 walletBg">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="mb-1 font-weight-bold">
                My Subscription Balance
              </div>
              <div class="mew-heading-1 mb-2">
                $2,545.12
              </div>
              <div class="primary--text font-weight-bold">
                9.231234 ETH
              </div>
            </div>
            <div class="d-flex align-center">
              <mew-button
                btn-style="outline"
                title="Withdraw Funds"
                class="mr-3"
              ></mew-button>
              <mew-button btn-style="outline" title="Add Funds"></mew-button>
            </div>
          </div>
        </div>
        <div class="mt-12">
          <address-select />
          <div class="d-flex justify-space-between">
            <mew-select label="Type" place-holder=" " class="mr-3" />
            <mew-input label="Amount" placeholder=" " class="flex-grow-1" />
          </div>
        </div>
        <div class="d-flex justify-center">
          <mew-button
            class="display--block"
            :has-full-width="false"
            title="Start Recurring"
            button-size="xlarge"
          />
        </div>
        <div class="d-flex justify-center mt-2">
          <mew-button
            class="display--block"
            :has-full-width="false"
            btn-style="transparent"
            title="My Subscription (2)"
            button-size="xlarge"
          />
        </div>
      </v-sheet>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
export default {
  components: {},
  data() {
    return {
      BG: BG,
      topBanner: {
        title: 'Ambrpay',
        subtext: 'Replace cryptocurrency addresses with a human readable name.'
      }
    };
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--ambrpay {
  .mew-banner {
    min-height: 180px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    .exit-container {
      display: none;
    }
    .banner-content {
      > div:nth-child(2) {
        margin-top: 9px;
        max-width: 700px;
        padding: 0 20px !important;
      }
    }
    .mew-subtitle {
      font-size: 36px !important;
    }
  }
  .v-tab {
    letter-spacing: -0.1px;
  }
  .v-tabs-bar {
    height: 70px;
  }
}
</style>
