<template>
  <mew6-white-sheet>
    <mew-button
      title="Confirmation"
      :has-full-width="false"
      button-size="xsmall"
      @click.native="openOverlay('transactionTxConfirmation')"
    />
    <mew-button
      title="WooCommerce"
      :has-full-width="false"
      button-size="xsmall"
      @click.native="openModal('walletWooCommerce')"
    />

    <mew-banner
      :text-obj="topBanner"
      :banner-img="BG"
      @closeBanner="closeBanner"
    />
    <div class="content-width py-12">
      <div class="pa-10 bg_datablock">
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="mb-1 font-weight-bold">
              My Subscription Balance
            </div>
            <div class="mew-heading-1 mb-2">
              $2,545.12
            </div>
            <div class="emerald--text font-weight-bold">
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
    </div>
  </mew6-white-sheet>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';

export default {
  components: {},
  data() {
    return {
      myDomains: [
        {
          name: 'Network',
          subtext: 'ETH - myetherapi.com'
        },
        {
          name: 'Address to interact with',
          subtext: '',
          tooltip: 'Tooltip'
        }
      ],
      warning: {
        color: 'red',
        text: 'Expire soon'
      },
      BG: BG,
      topBanner: {
        title: 'Ambrpay',
        subtext: 'Replace cryptocurrency addresses with a human readable name.',
        exit: 'Exit Dapp'
      },
      tab: 1,
      results: [
        {
          label: 'Labelhash (mewwallet)',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402fC6C864DC8402f2a3C3b'
        },
        {
          label: 'Namehash (mewwallet.eth)',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402fC6C864DC8402f2a3C3b'
        },
        {
          label: 'Owner',
          value: '0x527b9715d99aCfB7E1b01C6C864DC8402f2a3C3b'
        },
        {
          label: 'Multi-coin',
          value: 'None'
        },
        {
          label: 'ETH address',
          value: '0x502e119bbf7b476a449a67fdabfa35f486194c9a'
        }
      ]
    };
  },

  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    },
    openModal(name) {
      this.$store.commit('openModal', name);
    },
    closeBanner() {}
  }
};
</script>

<style lang="scss" scoped>
.content-width {
  max-width: 800px;
  margin: 0 auto;
}
</style>
