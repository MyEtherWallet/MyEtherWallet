<template>
  <div>
    <white-sheet>
      <div class="px-5 pl-lg-7 pr-lg-1 py-5">
        <div class="d-flex align-center justify-space-between">
          <span :class="[{ 'ml-7': draggable }, 'mew-heading-2']"
            >Get Trending Tokens</span
          >
        </div>
      </div>

      <!-- NOT ON DASHBOARD BUTTONS-->
      <div v-if="!isDashboard && !error" class="pa-3" style="min-height: 330px">
        <v-row v-if="isLoaded" class="justify-start wrap">
          <v-col
            v-for="(data, key) in tokenData"
            :key="key"
            cols="12"
            class="py-0"
          >
            <mew-button
              btn-style="transparent"
              class="px-3"
              color-theme="basic"
              btn-size="xlarge"
              has-full-width
              :btn-link="getLink(data)"
              @click.native="goToToken(data)"
            >
              <v-row class="justify-space-between align-center pa-3">
                <div class="d-flex align-center justify-start">
                  <mew-token-container
                    :img="data.img"
                    size="medium"
                    :name="data.symbol"
                  />
                  <div class="text-uppercase text-h6 ml-3 textDark--text">
                    {{ data.symbol }}
                  </div>
                </div>
                <div v-if="data.price" class="textDark--text">
                  {{ data.price }}
                  <span
                    v-if="data.priceChange"
                    :class="[
                      data.priceChangeIsNegative
                        ? 'redPrimary--text'
                        : 'greenPrimary--text',
                      'ml-2'
                    ]"
                    >{{ data.priceChange }}
                    <v-icon
                      v-if="data.priceChangeIsNegative"
                      small
                      color="redPrimary"
                    >
                      mdi-arrow-down-thick
                    </v-icon>
                    <v-icon v-else small color="greenPrimary">
                      mdi-arrow-up-thick
                    </v-icon>
                  </span>
                </div>
              </v-row>
            </mew-button>
          </v-col>
        </v-row>
        <v-row v-else class="pa-3">
          <v-col v-for="(n, key) in 5" :key="key" cols="12" class="px-3 py-1">
            <v-skeleton-loader height="52px" width="100%" type="image" />
          </v-col>
        </v-row>
      </div>
      <!-- ON DASHBOARD BUTTONS-->
      <div v-else-if="!error">
        <v-row v-if="isLoaded" class="px-5 mb-0 pb-2">
          <v-col
            v-for="(data, key) in tokenData"
            :key="key"
            cols="auto"
            class="pa-2"
          >
            <v-btn
              rounded
              large
              depressed
              class="bs-button pa-3"
              color="buttonGrayLight"
              :target="!data.isSwap ? '_blank' : ''"
              :href="getLink(data)"
              @click="goToToken(data)"
            >
              <v-row class="justify-space-between align-center pa-3">
                <div class="d-flex align-center justify-start">
                  <mew-token-container
                    :img="data.img"
                    size="medium"
                    :name="data.symbol"
                  />
                  <div class="text-uppercase text-h6 ml-3 textDark--text">
                    {{ data.symbol }}
                  </div>
                </div>
                <div
                  v-if="data.priceChange"
                  :class="[
                    data.priceChangeIsNegative
                      ? 'redPrimary--text'
                      : 'greenPrimary--text',
                    'ml-3 d-flex align-center justify-center'
                  ]"
                >
                  {{ data.priceChange }}

                  <v-icon
                    v-if="data.priceChangeIsNegative"
                    small
                    color="redPrimary"
                  >
                    mdi-arrow-down-thick
                  </v-icon>
                  <v-icon v-else small color="greenPrimary">
                    mdi-arrow-up-thick
                  </v-icon>
                </div>
              </v-row>
            </v-btn>
          </v-col>
          <v-col cols="auto" class="pa-2">
            <v-btn
              v-if="isEthNetwork"
              rounded
              large
              depressed
              class="bs-button pa-3 textDark--text text-capitalize"
              color="buttonGrayLight"
              @click.native="popupOpen"
            >
              <div class="d-flex justify-center align-center">
                <span class="font-weight-medium"> More tokens </span>
              </div>
              <v-icon small class="ml-1"> mdi-arrow-right </v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row v-else class="px-5 mb-0 pb-2">
          <v-col v-for="(n, key) in 5" :key="key" cols="4" class="pa-2">
            <v-skeleton-loader
              height="44px"
              width="100%"
              type="image"
              class="rounded-pill"
            />
          </v-col>
        </v-row>
      </div>
      <div
        v-else
        class="d-flex flex-column align-center justify-center"
        style="min-height: 128px"
      >
        <h3 class="mb-6">Having issues loading trending tokens.</h3>
        <mew-button
          button-size="small"
          title="Try again?"
          @click.native="setTrendingHandler"
        />
      </div>
      <div
        v-if="!isDashboard && isEthNetwork && !error"
        class="d-flex justify-center align-center pb-3 mt-n4"
      >
        <mew-button
          btn-style="outline"
          button-size="small"
          title="More tokens"
          @click.native="popupOpen"
        >
          <v-icon small class="ml-1"> mdi-arrow-right </v-icon>
        </mew-button>
      </div>
    </white-sheet>
    <!-- All Tokens popup-->
    <mew-popup
      max-width="620px"
      :show="showPopup"
      title="Get Trending Tokens"
      :has-buttons="false"
      :has-body-content="true"
      :left-btn="leftBtn"
      :has-padding="false"
      scrollable
    >
      <template #popupHeaderContent>
        <v-row class="justify-start mx-3 mx-sm-8 align-center">
          <mew-search
            is-compact
            placeholder="Search name or symbol"
            :value="searchInput"
            @input="setSearchInput"
          />

          <v-menu rounded offset-y>
            <template #activator="{ attrs, on }">
              <v-btn
                rounded
                large
                depressed
                class="pa-3 ml-3 ml-sm-10 text-capitalize"
                color="buttonGrayLight"
                v-bind="attrs"
                v-on="on"
              >
                Sort: {{ activeSort.btnText }}
                <span>
                  <v-icon v-if="activeSort.direction === 'asc'" small>
                    mdi-arrow-up
                  </v-icon>
                  <v-icon v-else small> mdi-arrow-down </v-icon>
                </span>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="item in sortOptions"
                :key="item.text"
                @click="setActiveSort(item)"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>

        <v-row
          class="justify-start wrap px-6 px-sm-9 table-header bg-popupBg mb-0"
        >
          <v-col
            cols="6"
            class="px-2 py-1 overline textPrimaryModule--text font-weight-medium"
            >Token</v-col
          >
          <v-col
            cols="4"
            sm="2"
            class="px-2 py-1 overline textPrimaryModule--text font-weight-medium"
            >Price/24h
          </v-col>
          <v-col
            v-if="$vuetify.breakpoint.smAndUp"
            cols="2"
            class="pl-2 pr-0 py-1 overline textPrimaryModule--text font-weight-medium"
          >
            Market cap</v-col
          >
          <v-col
            cols="2"
            class="px-2 py-1 overline textPrimaryModule--text font-weight-medium text-center"
          >
            Rank</v-col
          >
        </v-row>
      </template>
      <div v-if="showPopup">
        <v-row class="justify-start wrap px-1 py-3 pa-sm-3 ma-0">
          <v-col
            v-for="(data, key) in allTokens"
            :key="key"
            cols="12"
            class="pa-0"
          >
            <mew-button
              btn-style="transparent"
              class="rounded-pill px-3"
              color-theme="basic"
              btn-size="xlarge"
              has-full-width
              :btn-link="getLink(data)"
              @click.native="goToToken(data, true)"
            >
              <v-row class="justify-space-between align-center pa-3 text-left">
                <v-col cols="6" class="px-2">
                  <div
                    class="d-flex align-center justify-start"
                    style="overflow-x: hidden"
                  >
                    <mew-token-container
                      :img="data.img"
                      size="medium"
                      :name="data.symbol"
                      style="min-width: 32px"
                    />
                    <div style="max-width: 210px">
                      <div class="text-h6 ml-3 textDark--text truncate">
                        {{ data.name }}
                      </div>
                      <div
                        class="text-uppercase ml-3 textMedium--text truncate"
                      >
                        {{ data.symbol }}
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" sm="2" class="px-2">
                  <div>
                    <div v-if="data.price" class="textDark--text">
                      {{ data.price }}
                    </div>
                    <div
                      v-if="data.priceChange"
                      :class="[
                        data.priceChangeIsNegative
                          ? 'redPrimary--text'
                          : 'greenPrimary--text',
                        'mt-1'
                      ]"
                    >
                      {{ data.priceChange }}
                      <span>
                        <v-icon
                          v-if="data.priceChangeIsNegative"
                          small
                          color="redPrimary"
                        >
                          mdi-arrow-down-thick
                        </v-icon>
                        <v-icon v-else small color="greenPrimary">
                          mdi-arrow-up-thick
                        </v-icon>
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-col v-if="$vuetify.breakpoint.smAndUp" cols="2" class="px-2">
                  <div v-if="data.market_capf" class="textDark--text">
                    {{ data.market_capf }}
                  </div>
                </v-col>
                <v-col cols="2" class="px-2">
                  <div v-if="data.rank" class="textDark--text text-center">
                    {{ data.rank }}
                  </div>
                </v-col>
              </v-row>
            </mew-button>
          </v-col>
          <v-col v-if="allTokens.length < 1" cols="12" class="search-not-found">
            <p class="mt-10 text-center textPrimaryModule--text">
              No tokens found
              <span v-if="searchInput !== ''">: {{ searchInput }}</span>
            </p>
          </v-col>
        </v-row>
      </div>
    </mew-popup>
  </div>
</template>

<script>
import ethIcon from '@/assets/images/networks/eth.svg';
import { mapState, mapGetters, mapActions } from 'vuex';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import { ethmewws } from '@/utils/networks/nodes/index.js';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import handlerTrendingTokens from '@/modules/swap/handlers/handlerTrendingTokens';
import buyMore from '@/core/mixins/buyMore.mixin.js';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

const CCSWAPLINKS = {
  bitcoin: {
    link: 'https://ccswap.myetherwallet.com/?network=BTC&crypto=BTC'
  },
  solana: {
    link: 'https://ccswap.myetherwallet.com/?network=SOLANA&crypto=SOL'
  },
  dogecoin: {
    link: 'https://ccswap.myetherwallet.com/?network=DOGE&crypto=Doge'
  }
};

const buyInWallet = ['ethereum'];

export default {
  name: 'ModuleTrendingTokens',
  mixins: [handlerAnalytics, buyMore],
  props: {
    isDashboard: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ethIcon: ethIcon,
      trendingHandler: null,
      error: false,
      showPopup: false,
      ccswapLinks: CCSWAPLINKS,
      searchInput: '',
      activeSort: {
        text: 'Rank Best to Worst',
        value: 'rank',
        direction: 'asc',
        btnText: 'rank'
      }
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'swapRates', 'isOfflineApp', 'identifier']),
    ...mapState('external', ['selectedEIP6963Provider']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    ...mapGetters('external', ['getCoinGeckoTokenById']),
    ...mapState('trendingTokens', [
      'lastLoadedTimestamp',
      'ethereumTrendingTokens',
      'ethereumTokensRank',
      'defaultList'
    ]),
    sortOptions() {
      this.$vuetify.breakpoint.smAndDown;
      const options = [
        {
          text: 'Name A-Z',
          value: 'name',
          direction: 'asc',
          btnText: 'name'
        },
        {
          text: 'Name Z-A',
          value: 'name',
          direction: 'desc',
          btnText: 'name'
        },
        {
          text: 'Price High to Low',
          value: 'priceRaw',
          direction: 'desc',
          btnText: 'price'
        },
        {
          text: 'Price Low to High',
          value: 'priceRaw',
          direction: 'asc',
          btnText: 'price'
        },
        {
          text: '24h Performace  Gain to Loss',
          value: 'priceChangeRaw',
          direction: 'desc',
          btnText: '24h'
        },
        {
          text: '24h Performace Loss to  Gain',
          value: 'priceChangeRaw',
          direction: 'asc',
          btnText: '24h'
        },
        {
          text: 'Rank Worst to Best',
          value: 'rank',
          direction: 'desc',
          btnText: 'rank'
        },
        {
          text: 'Rank Best to Worst',
          value: 'rank',
          direction: 'asc',
          btnText: 'rank'
        }
      ];
      const marketCapOptions = [
        {
          text: 'Market Cap High to Low',
          value: 'market_capRaw',
          direction: 'desc',
          btnText: 'market cap'
        },
        {
          text: 'Market Cap Low to High',
          value: 'market_capRaw',
          direction: 'asc',
          btnText: 'market cap'
        }
      ];
      return this.$vuetify.breakpoint.smAndDown
        ? options
        : [...options, ...marketCapOptions];
    },
    tokenData() {
      if (!this.isLoaded) return [];
      let _tokens = [];
      if (this.isEthNetwork) {
        _tokens = this.ethereumTrendingTokens.slice(0, 4).map(item => {
          const token = this.getCoinGeckoTokenById(item.id);
          return {
            ...item,
            isSwap: true,
            img: token?.img,
            price: formatFiatValue(token?.price).value,
            priceChange: token?.price_change_percentage_24hf,
            priceChangeIsNegative: token?.price_change_percentage_24h < 0
          };
        });
      }

      let i = 0;
      while (_tokens.length < 5 && i < this.defaultList.length) {
        const token = this.getCoinGeckoTokenById(this.defaultList[i].id);
        _tokens.push({
          ...this.defaultList[i],
          isSwap: false,
          img:
            this.defaultList[i].id === 'ethereum' ? this.ethIcon : token?.img,
          priceRaw: token?.price,
          price: formatFiatValue(token?.price).value,
          priceChange: token?.price_change_percentage_24hf,
          priceChangeIsNegative: token?.price_change_percentage_24h < 0
        });
        i++;
      }
      return _tokens;
    },
    allTokens() {
      if (!this.isLoaded || !this.isEthNetwork) return [];
      const _all = this.ethereumTokensRank
        .map(item => {
          const token = this.getCoinGeckoTokenById(item.id);
          const isBuy = this.defaultList.some(
            defaultItem => defaultItem.id === item.id
          );
          return {
            ...item,
            isSwap: !isBuy,
            img: token?.img,
            priceRaw: token?.price,
            price: formatFiatValue(token?.price).value,
            priceChange: token?.price_change_percentage_24hf,
            priceChangeIsNegative: token?.price_change_percentage_24h < 0,
            market_capf: token?.market_capf,
            market_capRaw: token?.market_cap,
            priceChangeRaw: token?.price_change_percentage_24h
          };
        })
        .sort((a, b) => {
          if (this.activeSort.value === 'name') {
            if (this.activeSort.direction === 'asc') {
              return a[this.activeSort.value].localeCompare(
                b[this.activeSort.value]
              );
            }
            return b[this.activeSort.value].localeCompare(
              a[this.activeSort.value]
            );
          }
          if (this.activeSort.direction === 'asc') {
            return a[this.activeSort.value] - b[this.activeSort.value];
          }
          return b[this.activeSort.value] - a[this.activeSort.value];
        });
      if (this.searchInput) {
        return _all.filter(item => {
          return (
            item.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
            item.symbol.toLowerCase().includes(this.searchInput.toLowerCase())
          );
        });
      }
      return _all;
    },
    leftBtn() {
      return {
        text: 'Cancel',
        color: 'basic',
        method: this.popupClose
      };
    },
    isLoaded() {
      return this.lastLoadedTimestamp > 0;
    }
  },
  mounted() {
    this.setTrendingHandler();
  },
  methods: {
    ...mapActions('trendingTokens', ['setTrendingTokensState']),
    ...mapActions('global', ['setNetwork']),
    ...mapActions('wallet', ['setWeb3Instance']),
    async setTrendingHandler() {
      this.error = false;
      this.trendingHandler = new handlerTrendingTokens();
      const currentTime = Date.now();
      if (
        this.lastLoadedTimestamp === 0 ||
        currentTime - this.lastLoadedTimestamp >= 3600000
      ) {
        await this.trendingHandler.init();
        this.setTrendingTokensState(this.trendingHandler.getData());
      }
      if (this.trendingHandler.hasError) {
        this.error = true;
      }
    },
    popupOpen() {
      this.showPopup = true;
    },
    popupClose() {
      this.showPopup = false;
    },
    getLink(data) {
      const isBuyInWallet = buyInWallet.includes(data.id);
      if (!data.isSwap && !isBuyInWallet) {
        return this.ccswapLinks[data.id]?.link;
      }
      return undefined;
    },
    goToToken(data, closePopup = false) {
      if (data.isSwap) {
        this.goToSwap(data);
      } else {
        const isBuyInWallet = buyInWallet.includes(data.id);
        if (isBuyInWallet) {
          if (!this.isEthNetwork) {
            this.setNetwork({
              network: ethmewws,
              walletType: this.identifier
            })
              .then(() => {
                if (this.identifier === WALLET_TYPES.WEB3_WALLET) {
                  this.setWeb3Instance(this.selectedEIP6963Provider);
                } else {
                  this.setWeb3Instance();
                }
                Toast(`Switched network to: Ethereum`, {}, SUCCESS);
              })
              .then(() => {
                this.openBuySell('ModuleTrendingTokens');
              })
              .catch(e => {
                Toast(e, {}, ERROR);
              });
          } else {
            this.openBuySell('ModuleTrendingTokens');
          }
        }
      }
      if (closePopup) {
        this.popupClose();
      }
    },
    goToSwap(data) {
      const obj = {
        toToken: data.contract,
        amount: '0'
      };
      // this.trackDashboardAmplitude(DASHBOARD.SWAP_PAIRS, {
      //   TokenPair: `${data.fromT.symbol} to ${data.toT.symbol}`
      // });
      this.navigateToSwap(obj);
    },
    navigateToSwap(query) {
      const obj = { name: 'Swap' };
      if (query) {
        obj['query'] = query;
      }
      if (this.$route.name === 'Swap') {
        // this will allow vue to update query param
        // within the swap page when user clicks on the pairs again
        this.$router.replace(obj);
      } else {
        this.$router.push(obj);
      }
    },
    /**
     * Method sets the search value
     */
    setSearchInput(val) {
      this.searchInput = val;
    },
    /**
     * Method sets active sort value
     */
    setActiveSort(val) {
      this.activeSort = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.table-header {
  border-bottom: 1px solid var(--v-greyMedium-base);
  border-top: 1px solid var(--v-greyMedium-base);
}

.search-not-found {
  min-height: calc(90vh - 192px);
}
</style>
