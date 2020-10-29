<template>
  <div class="d-flex mew-component--dashboard">
    <div class="flex-grow-1">
      <mew6-white-sheet class="mew-component--eth-balance pa-7 pb-4">
        <div class="d-flex">
          <mew-module
            class="block-title"
            :subtitle="subtitle"
            :title="title"
            :caption="convertedBalance"
            :icon="network.type.icon"
            icon-align="left"
          />
          <div class="ml-auto">
            <div class="d-flex align-center">
              <mew-toggle
                :button-group="chartButtons"
                @onBtnClick="handleBtnClick"
              />
            </div>
          </div>
        </div>
        <div v-if="chartData.length > 0">
          <chart :data="chartData" class="mt-5" />
        </div>
        <div v-else>
          <p class="mew-heading-1 text-center">No chart data available!</p>
        </div>
        <v-row class="align-center">
          <v-col class="d-flex align-center justify-center">
            <div class="font-weight-bold">
              {{ network.type.currenyName }} PRICE
            </div>
            <div class="ml-2 font-weight-regular text-color--mew-green">
              $ {{ usd.price_change_24h }}
            </div>
            <v-icon
              :class="[
                priceChange ? 'primary--text' : 'light_red--text error-text',
                'body-2'
              ]"
              >{{ priceChangeArrow }}</v-icon
            >
            <div class="ml-5">
              $ {{ usd.current_price }} / 1 {{ network.type.currenyName }}
            </div>
          </v-col>
          <v-col class="text-right">
            <mew-button
              :has-full-width="false"
              title="Send Transaction"
              btn-size="xlarge"
              @click.native="navigateToSend"
            />
          </v-col>
        </v-row>
      </mew6-white-sheet>

      <div class="pa-4"></div>

      <div v-if="showBuyEth" class="mew-component--no-eth-balance">
        <mew6-white-sheet class="position--relative">
          <div
            class="bg-container"
            :class="$vuetify.theme.dark ? 'dark' : ''"
          />
          <v-sheet color="transparent" max-width="360px">
            <div class="pa-12">
              <h2 class="mb-6">
                My {{ network.type.currenyName }} balance is empty
              </h2>
              <mew-button
                :has-full-width="false"
                :title="`Buy ${network.type.currenyName} with a credit card`"
                btn-size="xlarge"
              />
              <div class="d-flex align-center mt-4">
                <div>We accept credit card</div>
                <img
                  v-if="!$vuetify.theme.dark"
                  class="ml-2 mr-1"
                  height="21"
                  src="@/assets/images/icons/icon-visa-dark.png"
                />
                <img
                  v-if="$vuetify.theme.dark"
                  class="ml-2 mr-2"
                  height="13"
                  src="@/assets/images/icons/icon-visa-white.png"
                />
                <img
                  height="18"
                  src="@/assets/images/icons/icon-mastercard-mew.png"
                />
              </div>
              <div class="text-color--gray1 mt-12">
                Tip: You can also send your {{ network.type.currenyName }} here
                from another wallet!
              </div>
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>

      <div class="pa-4"></div>

      <mew6-white-sheet class="mew-component--my-token-value">
        <div class="d-flex align-center pa-7 pb-4">
          <mew-module
            class="block-title"
            subtitle="My Tokens Value"
            title="$3,132.25"
            :icon="require('@/assets/images/icons/icon-token-grey.png')"
            icon-align="left"
          >
            <template #rightHeaderContainer>
              <mew-button
                class="ml-auto"
                :has-full-width="false"
                title="All tokens"
                btn-size="small"
                btn-style="transparent"
              />
            </template>
          </mew-module>
        </div>
        <mew-table
          :has-color="false"
          :table-headers="tableHeaders"
          :table-data="tableData"
        />
      </mew6-white-sheet>
      <div class="pa-4"></div>
      <div class="mew-component--empty-token-list">
        <mew6-white-sheet class="position--relative">
          <div
            class="bg-container"
            :class="$vuetify.theme.dark ? 'dark' : ''"
          />
          <v-sheet color="transparent" max-width="360px">
            <div class="pa-12">
              <h2 class="mb-6">My token list is empty</h2>
              <mew-button
                class="ml-auto ml-n3"
                :has-full-width="false"
                :title="'+ ' + 'Add custom tokens'"
                btn-size="xsmall"
                btn-style="transparent"
              />
            </div>
          </v-sheet>
          <div class="py-12" />
          <div class="py-5" />
        </mew6-white-sheet>
      </div>
    </div>
    <div class="pa-4"></div>
  </div>
</template>

<script>
// import staticData from './staticData.js';
import chart from '@/modules/wallets/components/chart/Chart';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import WalletCalls from '@/apollo/queries/wallets/index';
import utils from 'web3-utils';
export default {
  components: {
    chart
  },
  props: {
    ownersTokens: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      chartButtons: ['1D', '1W', '1M', '1Y'],
      tableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'Price',
          value: 'price',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '120px'
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '120px'
        },
        {
          text: 'Token Value',
          value: 'value',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '100px'
        },
        {
          text: '',
          value: 'callToAction',
          sortable: false,
          filterable: false,
          containsLink: false,
          width: '140px'
        }
      ],
      tableData: [
        {
          token: 'XMR',
          price: '$8.23',
          cap: '$1.23B',
          change: '2.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'AMIS',
          price: '$23.11',
          cap: '$5.22B',
          change: '0.43%',
          status: '-',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'JCK',
          price: '$3.65',
          cap: '$0.43B',
          change: '10.23%',
          status: '+',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          value: '$27.54',
          callToAction: 'Trade'
        },
        {
          token: 'AMN',
          price: '$10.72',
          cap: '0.11B',
          change: '8.88%',
          value: '$27.54',
          status: '-',
          changeData: {
            x: [1, 4, 10, 4],
            y: [0, 1, 34, 43]
          },
          callToAction: 'Trade'
        }
      ],
      chart: {
        data: [],
        key: ''
      },
      chartData: [],
      key: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'usd', 'network', 'address']),
    showBuyEth() {
      return this.balannce === 0;
    },
    convertedBalance() {
      const converted = BigNumber(this.balance).times(this.usd.current_price);
      return `$ ${converted.toFixed(2)}`;
    },
    title() {
      return `${this.balance} ${this.network.type.currencyName}`;
    },
    subtitle() {
      return `My ${this.network.type.currencyName} Balance`;
    },
    priceChangeArrow() {
      return this.priceChange > 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    priceChange() {
      return this.usd.price_change_24h > 0;
    }
  },
  watch: {
    chartData: {
      handler: () => {},
      deep: true
    }
  },
  mounted() {
    this.setDataYesterday();
  },
  methods: {
    handleBtnClick(e) {
      switch (e) {
        case this.chartButtons[0]:
          this.setDataYesterday();
          break;
        case this.chartButtons[1]:
          this.setDataWeek();
          break;
        case this.chartButtons[2]:
          this.setDataMonth();
          break;
        case this.chartButtons[3]:
          this.setDataYear();
          break;
        default:
          this.setDataMonth();
      }
    },
    setDataMonth() {
      const timeString = new Date();
      const lastMonth = timeString.getTime() - 1000 * 60 * 60 * 24 * 31;
      this.key = '1m';
      this.getBalanceHistory(lastMonth, 'days');
    },
    setDataYear() {
      const timeString = new Date();
      const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
      this.key = '1y';
      this.getBalanceHistory(lastYear, 'days');
    },
    setDataWeek() {
      const timeString = new Date();
      const lastWeek = timeString.getTime() - 1000 * 60 * 60 * 24 * 7;
      this.key = '1w';
      this.getBalanceHistory(lastWeek, 'days');
    },
    setDataYesterday() {
      const timeString = new Date();
      const yesterday = timeString.getTime() - 1000 * 60 * 60 * 24 * 1;
      this.key = '1d';
      this.getBalanceHistory(yesterday, 'hours');
    },
    getBalanceHistory(timeString, scale) {
      const wallet = new WalletCalls(this.$apollo);
      wallet.getBalanceHistory(timeString, this.address, scale).then(res => {
        this.chartData = res.data.getTimeseriesData.items.map(item => {
          const fromWei = utils.fromWei(item.value);
          const value = BigNumber(fromWei).toFixed(4);
          const returnedValue = BigNumber(value).toNumber();
          const actualTimeStamp = BigNumber(item.timestamp)
            .times(1000)
            .toNumber();
          return [actualTimeStamp, returnedValue];
        });
      });
    },
    navigateToSend() {
      this.$router.push({ name: 'SendTX' });
    }
  }
};
</script>

<style lang="scss">
.mew-component--dashboard {
  .mew-toggle-btn {
    .v-btn {
      padding: 8px !important;
      height: initial !important;
      margin-right: 4px !important;
    }
    .v-btn--active:before {
      opacity: 0 !important;
    }
  }
  .block-title > div > div > div {
    align-items: flex-start !important;
  }
  .left-wrapper {
    > div:nth-child(2) {
      > span:nth-child(1) {
        margin-bottom: 5px;
      }
      > span:nth-child(2) {
        margin-bottom: 5px;
      }
    }
    .left-icon {
      padding-right: 5px !important;
      img {
        height: 45px;
      }
    }
  }
}
.mew-component--eth-balance {
  .options-btn.v-btn {
    padding: 0 !important;
    width: 35px !important;
    height: 35px !important;
    min-width: 35px !important;

    .icon {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
  .theme--dark.v-sheet {
    background-color: var(--v-mewBg-base);
    border-color: var(--v-mewBg-base);
  }
  .block-title {
    margin-left: 10px;
    .header-wrapper {
      padding: 0 !important;
    }
    .left-wrapper {
      padding-left: 0 !important;
    }
  }
}

.mew-component--no-eth-balance {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
    background-position: right 60px bottom -1px;
    background-size: 245px;

    &.dark {
      opacity: 0.4;
      filter: saturate(1) brightness(0.47) contrast(3);
    }
  }
}

.mew-component--my-token-value {
  .theme--dark.v-sheet {
    background-color: var(--v-mewBg-base);
    border-color: var(--v-mewBg-base);
  }
  .block-title {
    margin-left: 10px;
    .header-wrapper {
      padding: 0 !important;
    }
    .left-wrapper {
      padding-left: 0 !important;
    }
    .right-wrapper {
      padding: 0 !important;
      margin-right: 10px;
    }
  }
}

.mew-component--empty-token-list {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
      url(~@/assets/images/backgrounds/bg-small-half-circle.png);
    background-position: right -16px bottom -26px, left -18px bottom -29px;
    background-size: 357px, 150px;

    &.dark {
      opacity: 0.3;
      filter: saturate(1) brightness(0.47) contrast(5);
    }
  }
}
</style>
