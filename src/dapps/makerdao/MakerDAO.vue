<template>
  <div class="mew-component--maker-dao">
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template v-slot:tabContent1>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
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
                  <div class="walletBg pa-5 mr-3 flex-grow-1">
                    <div>Savings to Date</div>
                    <div class="primary--text font-weight-bold">0.0157</div>
                  </div>
                  <div class="walletBg pa-5 flex-grow-1">
                    <div>Dai Savings rate</div>
                    <div class="primary--text font-weight-bold">2.00%</div>
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
              <mew-table
                :table-headers="walletBalanceTableHeaders"
                :table-data="walletTableData"
              />
            </div>
            <div class="mt-8">
              <div class="mew-heading-3 mb-3">History</div>
              <mew-table
                :table-headers="historyTableHeaders"
                :table-data="historyTableData"
              />
            </div>
          </v-sheet>
        </template>
        <template v-slot:tabContent2>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="text-right">
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
                    <div class="walletBg pa-5 border-radius--5px">
                      <h5 class="mb-2 font-weight-bold">
                        Total Collateral Locked
                      </h5>
                      <h3 class="font-weight-bold">
                        $42.03
                      </h3>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="walletBg pa-5 border-radius--5px">
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
                    <mew-table
                      :table-headers="myVaultsTableHeaders"
                      :table-data="myVaultsTableData"
                    />
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
  </div>
</template>

<script>
import staticData from './staticData.js';
export default {
  data() {
    return staticData;
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component--maker-dao {
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
