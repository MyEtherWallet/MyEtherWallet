<template>
  <div class="mew-component-fix--aave">
    <div class="d-flex align-center">
      <deposit-overlay :open="openDepositOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openDepositOverlay = true"
      >
        Deposit Overlay
      </div>

      <borrow-overlay :open="openBorrowOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openBorrowOverlay = true"
      >
        Borrow Overlay
      </div>
    </div>
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="BG" />
      <mew-tabs :items="tabs" has-underline>
        <template v-slot:tabContent1>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="d-flex align-center justify-end">
              <div class="mr-3">Health factor</div>
              <div class="primary--text font-weight-bold mr-3">2.45345</div>
              <info-tooltip text="Health factor" />
            </div>

            <v-row>
              <v-col cols="6">
                <div class="tableHeader pa-5 border-radius--5px">
                  <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                  <h3 class="font-weight-bold">$40.00</h3>
                  <div class="mt-2">0 ETH</div>
                  <v-divider class="my-4" />
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
                <div class="tableHeader pa-5 border-radius--5px">
                  <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                  <h3 class="font-weight-bold">$40.00</h3>
                  <div class="mt-2">0 ETH</div>
                  <v-divider class="my-4" />
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
            <mew-table
              :table-headers="depositsTableHeader"
              :table-data="depositsTableData"
            />
            <div class="d-flex justify-center mt-9">
              <mew-button title="Deposit" button-size="xlarge"></mew-button>
            </div>
          </v-sheet>
        </template>
        <template v-slot:tabContent2>
          <v-sheet color="transparent" max-width="700px" class="mx-auto py-12">
            <div class="d-flex align-center justify-end">
              <div class="mr-3">Health factor</div>
              <div class="primary--text font-weight-bold mr-3">2.45345</div>
              <info-tooltip text="Health factor" />
            </div>

            <v-row>
              <v-col cols="6">
                <div class="tableHeader pa-5 border-radius--5px">
                  <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                  <h3 class="font-weight-bold">$40.00</h3>
                  <div class="mt-2">0 ETH</div>
                  <v-divider class="my-4" />
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
                <div class="tableHeader pa-5 border-radius--5px">
                  <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                  <h3 class="font-weight-bold">$40.00</h3>
                  <div class="mt-2">0 ETH</div>
                  <v-divider class="my-4" />
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
            <div
              class="tableHeader pa-5 border-radius--5px d-flex align-center justify-space-between"
            >
              <div class="font-weight-bold">Loan to value</div>
              <div class="font-weight-bold">65.04%</div>
            </div>
            <mew-table
              class="mt-3"
              :table-headers="borrowingsTableHeader"
              :table-data="borrowingsTableData"
            />
            <div class="d-flex justify-center mt-9">
              <mew-button title="Borrow" button-size="xlarge"></mew-button>
            </div>
          </v-sheet>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import depositOverlay from '@/modules/wallets/components/aave-deposit-overlay/AaveDepositOverlay';
import borrowOverlay from '@/modules/wallets/components/aave-borrow-overlay/AaveBorrowOverlay';

export default {
  components: { depositOverlay, borrowOverlay },
  data() {
    return {
      openDepositOverlay: false,
      openBorrowOverlay: false,
      depositsTableHeader: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
          filterable: false,
          width: '60%'
        },
        {
          text: 'Tx Hash',
          value: 'txHash',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      depositsTableData: [
        {
          activity: 'Deposited 0.0001 ETH into Vault',
          date: '01/02/2020, 2:16:32 PM',
          txHash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 30.0000 new Dai from Vault',
          date: '01/02/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 2.0 new Dai from Vault',
          date: '01/05/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      borrowingsTableHeader: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
          filterable: false,
          width: '60%'
        },
        {
          text: 'Tx Hash',
          value: 'txHash',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      borrowingsTableData: [
        {
          activity: 'Deposited 0.0001 ETH into Vault',
          date: '01/02/2020, 2:16:32 PM',
          txHash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 30.0000 new Dai from Vault',
          date: '01/02/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 2.0 new Dai from Vault',
          date: '01/05/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      tabs: [{ name: 'Deposits' }, { name: 'Borrowings' }],
      BG: BG,
      balance: {
        total: 20.32,
        data: [
          {
            color: 'titlePrimary',
            amount: 5.3,
            tooltip: 'Send: 5.3',
            percentage: '26.08'
          },
          {
            color: 'warning darken-1',
            amount: 3.2,
            tooltip: 'Fee: 3.2',
            percentage: '15.75'
          }
        ]
      },
      topBanner: {
        title: 'AAVE',
        subtext:
          'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
      }
    };
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--aave {
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
