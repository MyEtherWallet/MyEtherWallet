<template>
  <div class="ambrpay-container">
    <back-button />
    <b-container>
      <div class="ambrpay-header mt-5">
        <h3 class="page-title">Ambrpay</h3>

        <div class="btns-container">
          <b-button
            class="withdraw-btn"
            @click="openManageFundsModal('Withdraw')"
            >Withdraw Funds</b-button
          >
          <b-button class="add-btn" @click="openManageFundsModal('Add')"
            >Add Funds</b-button
          >
        </div>
      </div>
      <div class="funds-container">
        <span class="fund-text">Subscriptions Balance</span>
        <div class="balance-container">
          <i v-show="loadingBalance" class="fa fa-spinner fa-spin" />
          <span v-show="!loadingBalance" class="fund-text"
            >{{ availableBalanceEth }} ETH
          </span>
          <span v-show="!loadingBalance" class="usd-text"
            >{{ convertToUSD }} USD</span
          >
        </div>
      </div>
      <subscription-form></subscription-form>
      <b-row class="mb-4">
        <b-button class="mx-auto active-sub-btn"
          >My Active Subscriptions</b-button
        >
      </b-row>
    </b-container>
    <manage-funds-modal
      ref="manageFunds"
      :manage-funds-text="manageFundsText"
      :availabe-balance-eth="availableBalanceEth"
      :availabe-balance-usd="availableBalanceUSD"
    />
  </div>
</template>

<script>
import SubscriptionForm from './containers/SubscriptionForm';
import ManageFundsModal from './components/ManageFundsModal';
import Ambrpay from './AmbrpayModified';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast } from '@/helpers';

export default {
  components: {
    'subscription-form': SubscriptionForm,
    'back-button': BackButton,
    'manage-funds-modal': ManageFundsModal
  },
  data() {
    return {
      availableBalanceEth: 0,
      availableBalanceUSD: 0,
      manageFundsText: '',
      ethPrice: 0,
      loadingBalance: true
    };
  },
  computed: {
    ...mapState(['web3', 'account', 'network', 'online']),
    convertToUSD() {
      if (this.availableBalanceEth) {
        return new BigNumber(
          new BigNumber(this.availableBalanceEth).times(
            new BigNumber(this.ethPrice)
          )
        )
          .toFixed(2)
          .toString();
      }
      return '--';
    }
  },
  mounted() {
    this.init();
    if (this.online && this.network.type.name === 'ETH') this.getEthPrice();
  },
  methods: {
    init() {
      const account = {
          publicApiKey: 'api_public_DXfGdjBB4eIVgbURCCCAIQ2S',
          address: this.account.address,
          netId: this.network.type.chainID.toString()
        },
        ambrpay = new Ambrpay(account, this.web3);

      ambrpay
        .getSubscriptionFunds()
        .then(res => {
          this.availableBalanceEth = res;
          this.loadingBalance = false;
        })
        .catch(err => {
          this.loadingBalance = false;
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    openManageFundsModal(str) {
      this.manageFundsText = str;
      this.$refs.manageFunds.$refs.manageFundsModal.show();
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Ambrpay.scss';
</style>
