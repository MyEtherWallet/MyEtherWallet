<template>
  <the-layout-wallet-grid :total-left-col-items="2" :total-right-col-items="2">
    <template #leftColItem1>
      <mew6-white-sheet
        v-if="true"
        class="mew-component--eth-balance pa-7 pb-4"
      >
        <div class="d-flex">
          <mew-module
            class="block-title"
            :subtitle="subtitle"
            :title="title"
            :caption="convertedBalance"
          />
          <div class="ml-auto">
            <div class="d-flex align-center">
              <mew-toggle
                :button-group="chartButtons"
                @onBtnClick="handleBtnClick"
              />
              <mew-button
                v-if="false"
                style="border-radius: 100% !important"
                class="options-btn ml-2"
                btn-size="small"
                icon-type="mdi"
                icon="mdi-dots-vertical"
                btn-style="transparent"
                color-theme="secondary"
              />
            </div>
          </div>
        </div>
        <chart :data="chartData" class="mt-5" />
        <v-row class="align-center">
          <v-col class="d-flex align-center justify-center">
            <div class="font-weight-bold">{{ network.type.name }} PRICE</div>
            <div class="ml-2 font-weight-regular text-color--mew-green">
              ${{ ETHUSDValue.price_change_24h }}
            </div>
            <v-icon
              :class="[
                priceChange ? 'primary--text' : 'light_red--text error-text',
                'body-2'
              ]"
              >{{ priceChangeArrow }}</v-icon
            >
            <div class="ml-5">
              {{ ETHUSDValue.symbol + ETHUSDValue.value }} / 1
              {{ network.type.currenyName }} ETH
            </div>
          </v-col>
          <v-col class="text-right">
            <mew-button
              :has-full-width="false"
              title="Send Transaction"
              btn-size="xlarge"
              @click.native="navigateToSwap"
            />
          </v-col>
        </v-row>
      </mew6-white-sheet>

      <div v-if="showBuyEth" class="mew-component--no-eth-balance">
        <mew6-white-sheet class="position--relative">
          <div
            class="bg-container"
            :class="$vuetify.theme.dark ? 'dark' : ''"
          />
          <v-sheet color="transparent" max-width="360px">
            <div class="pa-12">
              <h2 class="mb-6">My {{ network.type.name }} balance is empty</h2>
              <mew-button
                :has-full-width="false"
                title="Buy ETH with a credit card"
                btn-size="xlarge"
                btn-link="https://ccswap.myetherwallet.com/#/"
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
                Tip: You can also send your ETH here from another wallet!
              </div>
            </div>
          </v-sheet>
        </mew6-white-sheet>
      </div>
    </template>
    <template #leftColItem2>
      <mew6-white-sheet
        v-if="tokensData.length > 0"
        class="mew-component--my-token-value"
      >
        <div class="d-flex align-center pa-7 pb-4">
          <mew-module
            class="block-title"
            subtitle="My Tokens Value"
            :title="`$ ${totalTokensValue}`"
            :icon="require('@/assets/images/icons/icon-token-grey.png')"
            icon-align="left"
          >
            <!-- <template #rightHeaderContainer>
            <mew-button
              class="ml-auto"
              :has-full-width="false"
              title="All tokens"
              btn-size="small"
              btn-style="transparent"
            />
          </template> -->
          </mew-module>
        </div>
        <mew-table
          :has-color="false"
          :table-headers="tableHeaders"
          :table-data="tokensData"
        />
      </mew6-white-sheet>
      <div v-else class="mew-component--empty-token-list">
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
                :title="'+ ' + 'Buy ERC20 tokens'"
                btn-size="xsmall"
                btn-style="transparent"
                @click.native="navigateToSwap"
              />
            </div>
          </v-sheet>
          <div class="py-12" />
          <div class="py-5" />
        </mew6-white-sheet>
      </div>
    </template>
    <template #rightColItem1>
      <swap />
    </template>
    <template #rightColItem2>
      <app-carousel />
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import chart from '@/modules/balance/components/BalanceChart';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import WalletCalls from '@/apollo/queries/wallets/index';
import utils from 'web3-utils';
import AppCarousel from '@/core/components/AppCarousel';
import swap from '@/core/components/AppSwap';
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';
export default {
  components: {
    TheLayoutWalletGrid,
    chart,
    AppCarousel,
    swap
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
          sortable: true
        },
        {
          text: 'Price',
          value: 'price',
          sortable: true
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: true
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: true
        },
        {
          text: 'Token Value',
          value: 'value',
          sortable: true,
          width: '250px'
        }
      ],
      chartData: [],
      key: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapState('external', ['ETHUSDValue']),
    ...mapGetters('global', ['network']),
    ...mapGetters('wallet', ['balanceInETH']),
    showBuyEth() {
      return this.balanceInETH <= 0.075;
    },
    convertedBalance() {
      const converted = BigNumber(this.balanceInETH).times(
        this.ETHUSDValue.value
      );
      return `$ ${converted.toFixed(2)}`;
    },
    title() {
      return `${this.balanceInETH} ${this.network.type.name}`;
    },
    subtitle() {
      return `My ${this.network.type.name} Balance`;
    },
    priceChangeArrow() {
      return this.priceChange > 0 ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold';
    },
    priceChange() {
      return this.ETHUSDValue.price_change_24h > 0;
    },
    tokensData() {
      return this.ownersTokens
        .filter(item => {
          if (item.price_change_24h || item.market_cap) {
            return item;
          }
        })
        .map(item => {
          const newObj = {};
          newObj.value = `$ ${item.usdBalance}`;
          newObj.token = item.symbol;
          newObj.cap = item.market_cap;
          newObj.change = item.price_change_24h;
          newObj.status = item.price_change_24h > 0 ? '+' : '-';
          newObj.price = item.price;
          newObj.tokenImg = item.img;
          newObj.usdBalance = item.usdBalance;

          return newObj;
        });
    },
    totalTokensValue() {
      return new BigNumber(
        this.tokensData.reduce((acc, currentVal) => {
          return new BigNumber(acc).plus(currentVal.usdBalance).toFixed();
        }, 0)
      ).toFixed(2);
    }
  },
  watch: {
    chartData: {
      handler: function () {},
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
    getBalanceHistory(timeString, scale, nextKey) {
      const todaysDate = new Date().getTime();
      const wallet = new WalletCalls(this.$apollo);
      wallet
        .getBalanceHistory(timeString, todaysDate, this.address, scale, nextKey)
        .then(res => {
          const parsedResult = res.data.getTimeseriesData.items.map(item => {
            const fromWei = utils.fromWei(item.value);
            const value = BigNumber(fromWei).toFixed(4);
            const returnedValue = BigNumber(value).toNumber();
            const actualTimeStamp = BigNumber(item.timestamp)
              .times(1000)
              .toNumber();
            return [actualTimeStamp, returnedValue];
          });
          do {
            if (!res.data.getTimeseriesData.nextKey) {
              // when null
              this.chartData = parsedResult;
            } else {
              // when key exists
              const key = res.data.getTimeseriesData.nextKey;
              const timeString = new Date();
              const lastYear = timeString.getTime() - 1000 * 60 * 60 * 24 * 365;
              this.chartData.push(parsedResult);
              this.getBalanceHistory(lastYear, 'days', key);
            }
          } while (res.data.getTimeseriesData.nextKey);
        });
    },
    navigateToSend() {
      this.$router.push({ name: 'SendTX' });
    },
    navigateToSwap() {
      this.$router.push({ name: 'Swap' });
    }
  }
};
</script>

<style lang="scss">
.mew-component--dashboard {
  width: 100%;

  .block-title > div > div > div {
    align-items: flex-start !important;
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

.mew-component--dashboard-mobile {
  .mew-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
