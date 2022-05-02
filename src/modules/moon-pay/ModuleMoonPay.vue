<template>
  <div class="mew-component--moon-pay">
    <mew-popup
      :show="open"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      max-width="540"
      :left-btn="leftBtn"
      scrollable
      has-body-content
    >
      <div>
        <div v-if="inWallet">
          <mew-tabs
            v-if="open"
            :items="tabItems"
            :active-tab="activeTab"
            active-color="greenPrimary"
            has-underline
            class="pt-3"
            @onTab="onTab"
          >
            <template #tabContent1>
              <buy-eth-component
                :moonpay-handler="moonpayHandler"
                :close="close"
                :tab="activeTab"
                :default-currency="defaltCurrency"
                :in-wallet="inWallet"
                @selectedCurrency="setSelectedCurrency"
              />
            </template>
            <template #tabContent2>
              <sell-eth-component
                :moonpay-handler="moonpayHandler"
                :close="close"
                :tab="activeTab"
                :default-currency="defaltCurrency"
                @selectedCurrency="setSelectedCurrency"
              />
            </template>
          </mew-tabs>
        </div>
        <div v-else>
          <buy-eth-component
            :moonpay-handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
            :in-wallet="inWallet"
            @selectedCurrency="setSelectedCurrency"
          />
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script>
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { mapGetters, mapState, mapActions } from 'vuex';
import BuyEthComponent from './components/MoonPayBuyComponent';
import SellEthComponent from './components/MoonPaySellComponent';
import handler from './handlers/handlerMoonpay';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { isEmpty } from 'lodash';
import nodes from '@/utils/networks';
import { SUCCESS, Toast } from '../toast/handler/handlerToast';
export default {
  name: 'MoonPay',
  components: { BuyEthComponent, SellEthComponent },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false,
      activeTab: 0,
      moonpayHandler: {},
      selectedCurrency: {},
      nodes: nodes
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'instance']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    inWallet() {
      return (
        this.$route.fullPath.includes('/wallet') && !this.$route.meta.noAuth
      );
    },
    defaltCurrency() {
      if (
        isEmpty(this.selectedCurrency) &&
        this.supportedBuy &&
        this.tokensList.length > 0
      ) {
        return this.tokensList.filter(
          item =>
            item.contract.toLowerCase() === MAIN_TOKEN_ADDRESS.toLowerCase()
        )[0];
      } else if (isEmpty(this.selectedCurrency) || !this.supportedBuy) {
        return {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          symbol: 'ETH',
          network: 'ETH',
          contract: MAIN_TOKEN_ADDRESS
        };
      }
      return this.selectedCurrency;
    },
    supportedBuy() {
      return (
        this.network.type === 'ETH' ||
        this.network.type === 'BSC' ||
        this.network.type === 'MATIC'
      );
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      if (this.inWallet) {
        return [
          {
            name: `Buy`
          },
          {
            name: `Sell`
          }
        ];
      }
      return [
        {
          name: 'Buy'
        }
      ];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.moonpayHandler = new handler();
      }
      this.selectedCurrency = {};
    },
    address() {
      this.selectedCurrency = {};
    }
  },
  methods: {
    ...mapActions('wallet', ['setWeb3Instance']),
    ...mapActions('global', ['setNetwork']),
    onTab(val) {
      this.selectedCurrency = {};
      if (val === 1) {
        if (this.network.type.chainID !== 1) {
          const defaultNetwork = this.nodes['ETH'].find(item => {
            return item.service === 'myetherwallet.com-ws';
          });
          if (this.instance.identifier !== WALLET_TYPES.WEB3_WALLET) {
            this.setNetwork(defaultNetwork).then(() => {
              this.setWeb3Instance();
              this.activeTab = val;
              Toast(`Switched network to: ETH`, {}, SUCCESS);
            });
          }
        }
      } else {
        this.activeTab = val;
      }
    },
    close() {
      this.activeTab = 0;
      this.$emit('close', false);
    },
    setSelectedCurrency(e) {
      this.selectedCurrency = e;
    }
  }
};
</script>

<style lang="scss" scoped></style>
