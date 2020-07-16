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
        <v-sheet color="transparent" max-width="700px" class="mx-auto">
          <div class="py-12">
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
            <div class="mt-8">
              <div class="mew-heading-3 mb-3">History</div>
              <History />
            </div>
          </div>
        </v-sheet>
      </template>
      <template v-slot:tabContent1>
        <v-sheet color="transparent" max-width="700px" class="mx-auto">
          <div class="mt-10 text-right">
            <mew-button
              :has-full-width="false"
              title="Collateralize DAI"
              button-size="medium"
              btn-style="outline"
            />
          </div>
          <div class="py-4">
            <div class="tab-width">
              <v-row>
                <v-col cols="6">
                  <div class="bg_datablock pa-5 border-radius--5px">
                    <h5 class="mb-2 font-weight-bold">
                      Total Collateral Locked
                    </h5>
                    <h3 class="font-weight-bold">
                      $42.03
                    </h3>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="bg_datablock pa-5 border-radius--5px">
                    <h5 class="mb-2 font-weight-bold">
                      Total DAI Debt
                    </h5>
                    <h3 class="font-weight-bold">
                      30.20<span class="mew-body"> DAI</span>
                    </h3>
                  </div>
                </v-col>
                <v-col cols="12" class="mt-6">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="mew-heading-3">My Vaults</div>
                    <mew-button
                      :has-full-width="false"
                      title="+ Add Vault"
                      button-size="medium"
                      btn-style="transparent"
                    />
                  </div>
                  <MyVaults />
                </v-col>
              </v-row>
            </div>
            <div class="d-flex justify-center mt-5">
              <mew-button title="Deposit" button-size="xlarge"></mew-button>
            </div>
          </div>
        </v-sheet>
      </template>
    </mew-tabs>
  </mew6-white-sheet>
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
      tabs: [{ name: 'Save' }, { name: 'Borrow' }],
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
