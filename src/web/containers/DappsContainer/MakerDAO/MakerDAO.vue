<template>
  <div id="id-90e7520f1273d102d753fa27229f6e10">
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

      <v-tabs v-model="tab" background-color="transparent" class="px-10">
        <v-tab class="text-transform--initial mew-heading-2">
          Save
        </v-tab>
        <v-tab class="text-transform--initial mew-heading-2">
          Borrow
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="py-12 tab-width">
            <v-row>
              <v-col cols="6">
                <div class="mew-heading-3 mb-2">DAI Balance</div>
                <h3 class="font-weight-bold">
                  30.1234 <span class="mew-body">DAI</span>
                </h3>
                <div>$30.12</div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex">
                  <div class="bg_datablock pa-5 mr-3 flex-grow-1">
                    <div>Savings to Date</div>
                    <div class="emerald--text font-weight-bold">0.0157</div>
                  </div>
                  <div class="bg_datablock pa-5 flex-grow-1">
                    <div>Dai Savings rate</div>
                    <div class="emerald--text font-weight-bold">2.00%</div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col cols="6" class="text-right">
                <mew-button
                  :has-full-width="true"
                  btn-style="outline"
                  title="Withdraw"
                  button-size="xlarge"
                ></mew-button>
              </v-col>
              <v-col cols="6">
                <mew-button
                  :has-full-width="true"
                  title="Deposit"
                  button-size="xlarge"
                ></mew-button>
              </v-col>
            </v-row>
            <div class="mt-12">
              <div class="mew-heading-3 mb-3">Wallet Balance</div>
              <WalletBalance />
            </div>
            <div>
              <div class="mew-heading-3 mb-3">History</div>
              <History />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="py-12">
            <div class="d-flex align-center justify-end mr-12 mb-5">
              <div class="mr-3">Health factor</div>
              <div class="emerald--text font-weight-bold mr-3">2.45345</div>
              <info-tooltip text="Health factor" />
            </div>
            <div class="tab-width">
              <v-row>
                <v-col cols="6">
                  <div class="bg_datablock pa-5 border-radius--5px">
                    <h5 class="mb-2 font-weight-bold">
                      Aggregated Balance
                    </h5>
                    <h3 class="font-weight-bold">
                      $40.00
                    </h3>
                    <div class="mt-2">0 ETH</div>
                    <mew6-divider-line class="my-2" />
                    <div class="d-flex justify-space-between">
                      <div class="font-weight-medium">Composition</div>
                      <div class="d-flex align-center">
                        <div class="blue--text font-weight-bold mr-2">100%</div>
                        <div>Available</div>
                      </div>
                    </div>
                    <mew-progress-bar class="mt-2" :balance-obj="balance" />
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="bg_datablock pa-5 border-radius--5px">
                    <h5 class="mb-2 font-weight-bold">
                      Aggregated Balance
                    </h5>
                    <h3 class="font-weight-bold">
                      $40.00
                    </h3>
                    <div class="mt-2">0 ETH</div>
                    <mew6-divider-line class="my-2" />
                    <div class="d-flex justify-space-between">
                      <div class="font-weight-medium">Composition</div>
                      <div class="d-flex align-center">
                        <div class="blue--text font-weight-bold mr-2">100%</div>
                        <div>Available</div>
                      </div>
                    </div>
                    <mew-progress-bar class="mt-2" :balance-obj="balance" />
                  </div>
                </v-col>
                <v-col cols="12" class="mt-6">
                  <div class="mew-heading-3 mb-3">My Vaults</div>
                  <MyVaults />
                </v-col>
              </v-row>
            </div>
            <div class="d-flex justify-center mt-5">
              <mew-button title="Deposit" button-size="xlarge"></mew-button>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import WalletBalance from './components/WalletBalance';
import History from './components/History';
import MyVaults from './components/MyVaults';

export default {
  components: { WalletBalance, History, MyVaults },
  data() {
    return {
      BG: BG,
      balance: {
        total: 20.32,
        data: [
          {
            title: 'sendBal',
            color: 'titlePrimary',
            amount: 5.3,
            tooltip: 'Send: 5.3',
            percentage: '26.08'
          },
          {
            title: 'feeBal',
            color: 'warning darken-1',
            amount: 3.2,
            tooltip: 'Fee: 3.2',
            percentage: '15.75'
          }
        ]
      },
      topBanner: {
        title: 'MakerDAO',
        subtext:
          'DAI is a stable, decentralized currency that does not discriminate. Any business or individual can realize the advantages of digital money.',
        exit: 'Exit Dapp'
      },
      tab: 1
    };
  },
  watch: {
    $route() {
      this.checkQueryTab();
    },
    tab(val) {
      if (val == 0) {
        this.$router.replace({
          name: 'MakerDAO',
          query: { tab: 'save' }
        });
      } else if (val == 1) {
        this.$router.replace({
          name: 'MakerDAO',
          query: { tab: 'borrow' }
        });
      } else {
        this.$router.replace({
          name: 'MakerDAO',
          query: { tab: 'save' }
        });
      }
    }
  },
  mounted() {
    this.checkQueryTab();
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    },
    openModal(name) {
      this.$store.commit('openModal', name);
    },
    closeBanner() {},
    checkQueryTab() {
      const currentTab = this.$route.query.tab;

      if (currentTab == 'save') {
        this.tab = 0;
      } else if (currentTab == 'borrow') {
        this.tab = 1;
      } else {
        this.tab = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-width {
  max-width: 800px;
  margin: 0 auto;
}
.v-tabs {
  border-bottom: 2px solid var(--v-bg_wallet-base);
}
</style>

<style lang="scss">
#id-90e7520f1273d102d753fa27229f6e10 {
  .v-tabs-bar {
    height: 70px;
  }
}
</style>
