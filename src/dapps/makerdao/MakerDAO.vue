<template>
  <div class="mew-component-fix--maker-dao">
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
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
export default {
  data() {
    return {
      walletBalanceTableHeaders: [
        {
          text: 'Asset',
          value: 'asset',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Balance',
          value: 'balance',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'USD Value',
          value: 'value',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: '',
          value: 'btn',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100%'
        }
      ],
      walletTableData: [
        {
          asset: 'DAI',
          balance: '15.231234 DAI',
          value: '$12.23',
          btn: 'Send'
        }
      ],
      historyTableHeaders: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'TX Hash',
          value: 'txHash',
          sortable: true,
          filterable: false,
          containsLink: true,
          width: '150px'
        }
      ],
      historyTableData: [
        {
          activity: 'Deposited 12.00000 DAI',
          date: '01/02/2020, 2:16:32 PM',
          txHash:
            '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
        },
        {
          activity: 'Deposited 12.00000 DAI',
          date: '01/02/2020, 2:16:32 PM',
          txHash:
            '0x68f6ce1e607d6a6ec6fb1aaa6f43bb8210658f49065ae5a7325c5771ea1100e8'
        }
      ],
      myVaultsTableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Value ID',
          value: 'id',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Current Ratio',
          value: 'ratio',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Deposited',
          value: 'deposited',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'Avail. To Withdraw',
          value: 'avail',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: 'DAI',
          value: 'dai',
          sortable: true,
          filterable: false,
          containsLink: false,
          width: '100%'
        },
        {
          text: '',
          value: 'btn',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100%'
        }
      ],
      myVaultsTableData: [
        {
          token: 'DAI',
          id: '375',
          ratio: '243.11%',
          deposited: '0.40 ETH',
          avail: '0.15 ETH',
          dai: '30.08 DAI',
          btn: 'Manage'
        }
      ],
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
          'DAI is a stable, decentralized currency that does not discriminate. Any business or individual can realize the advantages of digital money.'
      }
    };
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--maker-dao {
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
