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
            :handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
            @selectedCurrency="setSelectedCurrency"
          />
        </template>
        <template #tabContent2>
          <sell-eth-component
            :handler="moonpayHandler"
            :close="close"
            :tab="activeTab"
            :default-currency="defaltCurrency"
            @selectedCurrency="setSelectedCurrency"
          />
        </template>
      </mew-tabs>
      <!-- ============================================================== -->
      <!-- Powered by -->
      <!-- ============================================================== -->
      <div class="py-8">
        <div class="text-center mb-3 textLight--text">
          Moonpay.com will open on a new tab to continue
        </div>
        <div class="mew-body d-flex justify-center align-center textDark--text">
          Powered By
          <img
            src="@/modules/moon-pay/assets/moonpay-logo.svg"
            width="100px"
            class="ml-1"
          />
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script>
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
    ...mapState('wallet', ['address']),
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('global', ['network']),
    defaltCurrency() {
      if (isEmpty(this.selectedCurrency) && !this.network.type.isTestNetwork) {
        return this.tokensList.filter(
          item =>
            item.contract.toLowerCase() === MAIN_TOKEN_ADDRESS.toLowerCase()
        )[0];
      } else if (
        isEmpty(this.selectedCurrency) &&
        this.network.type.isTestNetwork
      ) {
        return {
          decimals: 18,
          img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
          name: 'ETH',
          subtext: 'Ethereum',
          value: 'Ethereum',
          symbol: 'ETH',
          network: 1
        };
      }
      return this.selectedCurrency;
    },
    leftBtn() {
      return {
        method: this.close
      };
    },
    tabItems() {
      return [
        {
          name: `Buy`
        },
        {
          name: `Sell`
        }
      ];
    }
  },
  watch: {
    open(newVal) {
      this.isOpen = newVal;
      if (newVal) {
        this.moonpayHandler = new handler(this.address);
      }
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

          this.setNetwork(defaultNetwork).then(() => {
            this.setWeb3Instance();
            this.activeTab = val;
            Toast(`Switched network to: ETH`, {}, SUCCESS);
          });
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
