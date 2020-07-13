<template>
  <div id="id-5823206fb29f9c5c12e44d0ec3e5738f">
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
          Deposits
        </v-tab>
        <v-tab class="text-transform--initial mew-heading-2">
          Borrowings
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
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
              </v-row>
            </div>
            <div class="d-flex justify-center mt-9">
              <mew-button title="Deposit" button-size="xlarge"></mew-button>
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
                <v-col cols="12">
                  <div
                    class="bg_datablock pa-5 border-radius--5px d-flex align-center justify-space-between"
                  >
                    <div class="font-weight-bold">Loan to value</div>
                    <div class="font-weight-bold">65.04%</div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div class="d-flex justify-center mt-9">
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

export default {
  components: {},
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
        title: 'Unstoppable Domain',
        subtext: 'Replace cryptocurrency addresses with a human readable name.',
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
          name: 'Aave',
          query: { tab: 'deposits' }
        });
      } else if (val == 1) {
        this.$router.replace({
          name: 'Aave',
          query: { tab: 'borrowings' }
        });
      } else {
        this.$router.replace({
          name: 'Aave',
          query: { tab: 'deposits' }
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

      if (currentTab == 'deposits') {
        this.tab = 0;
      } else if (currentTab == 'borrowings') {
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
#id-5823206fb29f9c5c12e44d0ec3e5738f {
  .v-tabs-bar {
    height: 70px;
  }
}
</style>
