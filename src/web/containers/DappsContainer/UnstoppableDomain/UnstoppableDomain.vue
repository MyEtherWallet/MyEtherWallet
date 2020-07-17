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

    <mew-tabs :items="tabs">
      <template v-slot:tabContent0>
        <v-sheet max-width="800px" color="bg_white_sheet" class="py-12 mx-auto">
          <div class="tab-width">
            <div class="mb-5">
              <BlockTitle title="Find your blockchain domain" />
              <div class="d-flex align-start">
                <mew-input
                  :has-clear-btn="true"
                  right-label=".ctypto"
                  placeholder="Domain name"
                  class="mr-2 flex-grow-1"
                />
                <mew-button
                  :has-full-width="false"
                  button-size="xlarge"
                  title="Check availability"
                />
              </div>
            </div>
            <div>
              <BlockTitle title="Results" />
              <v-card flat color="bg_datablock" class="pa-10">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="mew-heading-1 mb-2">
                      mewwallet.crypto
                    </div>
                    <div>
                      <span class="font-weight-medium">0.0823234234</span>
                      ETH ($40.00)
                    </div>
                  </div>
                  <div class="d-flex align-center">
                    <div class="mew-heading-3 primary--text mr-6">
                      Available
                    </div>
                    <mew-button title="Buy"></mew-button>
                  </div>
                </div>
              </v-card>
              <div class="py-2"></div>
              <v-card flat color="bg_datablock" class="pa-10">
                <div class="d-flex align-center justify-space-between mb-8">
                  <div class="mew-heading-1">myetherwallet.crypto</div>
                  <div class="mew-heading-3 orange--text">Unavailable</div>
                </div>
                <v-list-item
                  v-for="(r, key) in results"
                  :key="key"
                  two-line
                  class="px-0"
                >
                  <v-list-item-content>
                    <div
                      class="mew-body font-weight-medium titlePrimary--text mb-2"
                    >
                      {{ r.label }}:
                    </div>
                    <div class="mew-body titlePrimary--text">
                      {{ r.value }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </div>
          </div>
        </v-sheet>
      </template>
      <template v-slot:tabContent1>
        <v-sheet max-width="800px" color="bg_white_sheet" class="py-12 mx-auto">
          <div class="d-flex align-center justify-space-between mb-7">
            <h4 class="font-weight-bold">
              My domains <span class="font-weight-regular">(1)</span>
            </h4>
            <mew-button
              btn-style="transparent"
              title="+ Add domain you own"
              button-size="large"
            ></mew-button>
          </div>
          <div>
            <mew-expand-panel
              color-theme="#f1eeeb"
              :panel-items="myDomains"
              :warning-badge="warning"
            />
          </div>
        </v-sheet>
      </template>
    </mew-tabs>
  </mew6-white-sheet>
</template>

<script>
import BlockTitle from '@/components/Titles/BlockTitle';
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';

export default {
  components: { BlockTitle },
  data() {
    return {
      tabs: [{ name: 'Buy domain' }, { name: 'Manage domain' }],
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
        title: 'Unstoppable Domain',
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
