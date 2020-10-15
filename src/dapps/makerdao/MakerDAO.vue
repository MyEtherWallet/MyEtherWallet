<template>
  <div class="mew-component-fix--maker-dao">
    <div class="d-flex align-center">
      <transactionConfirmationOverlay
        :open="openTXConfirmationOverlay"
        @close="openTXConfirmationOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openTXConfirmationOverlay = true"
      >
        Confirmation Overlay
      </div>

      <collateralizeDaiOverlay
        :open="openCollateralizeDaiOverlay"
        @close="openCollateralizeDaiOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openCollateralizeDaiOverlay = true"
      >
        Collateralize Dai Overlay
      </div>

      <depositDaiOverlay
        :open="openDepositDaiOverlay"
        @close="openDepositDaiOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openDepositDaiOverlay = true"
      >
        Deposit Overlay
      </div>

      <withdrawDaiOverlay
        :open="openWithdrawDaiOverlay"
        @close="openWithdrawDaiOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openWithdrawDaiOverlay = true"
      >
        Withdraw Overlay
      </div>

      <manageMyVaultOverlay
        :open="openManageMyVaultOverlay"
        @close="openManageMyVaultOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openManageMyVaultOverlay = true"
      >
        Manage MyVault Overlay
      </div>

      <migrateOverlay
        :open="openMigrateOverlay"
        @close="openMigrateOverlay = false"
      />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openMigrateOverlay = true"
      >
        Migrate Overlay
      </div>
    </div>
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template #tabContent1>
          <v-sheet
            color="transparent"
            max-width="700px"
            class="mx-auto py-12 px-4"
          >
            <div class="d-flex justify-end">
              <mew-button
                btn-style="outline"
                title="Collateralize DAI"
                btn-size="small"
                class="display--block"
              />
            </div>

            <v-row>
              <v-col cols="12" lg="6">
                <div class="mew-heading-3">DAI Balance</div>
                <h3 class="font-weight-bold">
                  30.1234 <span class="mew-body">DAI</span>
                </h3>
                <div>$30.12</div>
              </v-col>
              <v-col cols="12" lg="6">
                <div class="d-flex">
                  <div class="walletBg px-6 py-3 mr-3 flex-grow-1">
                    <div>Savings to Date</div>
                    <div class="primary--text font-weight-bold">0.0157</div>
                  </div>
                  <div class="walletBg px-6 py-3 flex-grow-1">
                    <div>Dai Savings rate</div>
                    <div class="primary--text font-weight-bold">2.00%</div>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" lg="6">
                <mew-button
                  :has-full-width="true"
                  btn-style="outline"
                  title="Withdraw"
                  btn-size="xlarge"
                ></mew-button>
              </v-col>
              <v-col cols="12" lg="6" class="mt-n3 mt-lg-0">
                <mew-button
                  :has-full-width="true"
                  title="Deposit"
                  btn-size="xlarge"
                ></mew-button>
              </v-col>
            </v-row>
            <div class="mt-12">
              <div class="mew-heading-3 mb-3">Wallet Balance</div>
              <mew-table
                class="d-none d-lg-block"
                :table-headers="walletBalanceTableHeaders"
                :table-data="walletTableData"
              />

              <mobile-table
                token="DAI"
                button="Trade"
                :table-data="mobileTableData"
                class="d-block d-lg-none"
              />
            </div>

            <div class="mt-8">
              <div class="mew-heading-3 mb-3">History</div>
              <mew-table
                class="d-none d-lg-block"
                :table-headers="historyTableHeaders"
                :table-data="historyTableData"
              />
              <mobile-table
                v-for="(d, key) in mobileTableData2"
                :key="key"
                :table-data="d"
                class="d-block d-lg-none mb-3"
              />
            </div>
          </v-sheet>
        </template>
        <template #tabContent2>
          <v-sheet
            color="transparent"
            max-width="700px"
            class="mx-auto py-12 px-4"
          >
            <div class="text-right">
              <mew-button
                :has-full-width="false"
                title="Collateralize DAI"
                btn-size="small"
                btn-style="outline"
              />
            </div>

            <v-row>
              <v-col cols="12" lg="6">
                <div class="walletBg pa-5 border-radius--5px height--full">
                  <h5 class="mb-2 font-weight-bold">Total Collateral Locked</h5>
                  <h3 class="font-weight-bold">$42.03</h3>
                </div>
              </v-col>
              <v-col cols="12" lg="6" class="mt-n3 mt-lg-0">
                <div class="walletBg pa-5 border-radius--5px height--full">
                  <h5 class="mb-2 font-weight-bold">Total DAI Debt</h5>
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
                    btn-size="small"
                    btn-style="transparent"
                  />
                </div>
                <mew-table
                  class="d-none d-lg-block"
                  :table-headers="myVaultsTableHeaders"
                  :table-data="myVaultsTableData"
                />
                <mobile-table
                  vault
                  :table-data="myVaults"
                  class="d-block d-lg-none"
                />
              </v-col>
            </v-row>
          </v-sheet>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-makerdao.jpg';
import transactionConfirmationOverlay from '@/modules/wallets/components/transaction-confirmation-overlay/TransactionConfirmationOverlay';
import collateralizeDaiOverlay from '@/modules/wallets/components/maker-dao-collateralize-dai-overlay/CollateralizeDaiOverlay';
import depositDaiOverlay from '@/modules/wallets/components/maker-dao-deposit-dai-overlay/DepositDaiOverlay';
import withdrawDaiOverlay from '@/modules/wallets/components/maker-dao-withdraw-dai-overlay/WithdrawDaiOverlay';
import manageMyVaultOverlay from '@/modules/wallets/components/maker-dao-manage-my-vault-overlay/ManageMyVaultOverlay';
import migrateOverlay from '@/modules/wallets/components/maker-dao-migrate-overlay/MigrateOverlay';
import mobileTable from '@/components/mobile-table/MobileTable';

export default {
  components: {
    transactionConfirmationOverlay,
    collateralizeDaiOverlay,
    depositDaiOverlay,
    withdrawDaiOverlay,
    manageMyVaultOverlay,
    migrateOverlay,
    mobileTable
  },
  data() {
    return {
      myVaults: [
        {
          label: 'Activity',
          value: 'Deposited 12.0000 DAI'
        },
        {
          label: 'Date',
          value: '01/02/2020, 2:16:32 PM'
        },
        {
          label: 'TX Hash',
          value:
            '0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0',
          link:
            'https://www.ethvm.com/tx/0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0'
        }
      ],
      mobileTableData: [
        {
          label: 'Activity',
          value: 'Deposited 12.0000 DAI'
        },
        {
          label: 'Date',
          value: '01/02/2020, 2:16:32 PM'
        },
        {
          label: 'TX Hash',
          value:
            '0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0',
          link:
            'https://www.ethvm.com/tx/0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0'
        }
      ],
      mobileTableData2: [
        [
          {
            label: 'Activity',
            value: 'Deposited 12.0000 DAI'
          },
          {
            label: 'Date',
            value: '01/02/2020, 2:16:32 PM'
          },
          {
            label: 'TX Hash',
            value:
              '0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0',
            link:
              'https://www.ethvm.com/tx/0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0'
          }
        ],
        [
          {
            label: 'Activity',
            value: 'Deposited 12.0000 DAI'
          },
          {
            label: 'Date',
            value: '01/02/2020, 2:16:32 PM'
          },
          {
            label: 'TX Hash',
            value:
              '0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0',
            link:
              'https://www.ethvm.com/tx/0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0'
          }
        ],
        [
          {
            label: 'Activity',
            value: 'Deposited 12.0000 DAI'
          },
          {
            label: 'Date',
            value: '01/02/2020, 2:16:32 PM'
          },
          {
            label: 'TX Hash',
            value:
              '0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0',
            link:
              'https://www.ethvm.com/tx/0xd74ba6354b1189d7bdb71045446f893d2e4dae082dfe20e6db3cd3d243d1f3b0'
          }
        ]
      ],
      openTXConfirmationOverlay: false,
      openCollateralizeDaiOverlay: false,
      openDepositDaiOverlay: false,
      openWithdrawDaiOverlay: false,
      openManageMyVaultOverlay: false,
      openMigrateOverlay: false,
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
          activity: 'Deposited 32.00000 DAI',
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
