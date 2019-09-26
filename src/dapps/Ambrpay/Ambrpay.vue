<template>
  <div class="ambrpay-container">
    <back-button />
    <b-container class="pl-5 pr-5">
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
            >{{ availableBalanceUSD }} USD</span
          >
        </div>
      </div>
      <subscription-form
        :available-balance-eth="availableBalanceEth"
        @startSubscription="startSubscription"
      ></subscription-form>
      <b-row class="mb-4">
        <b-button class="mx-auto active-sub-btn" @click="openManageSubModal()"
          >My Active Subscriptions</b-button
        >
      </b-row>
    </b-container>
    <manage-funds-modal
      ref="manageFunds"
      :manage-funds-text="manageFundsText"
      :available-balance-eth="availableBalanceEth"
      :available-balance-usd="availableBalanceUSD"
      @addFunds="addFunds"
      @withdrawFunds="withdrawFunds"
    />
    <manage-subscriptions-modal
      ref="manageSubs"
      :subscriptions="subscriptions"
      @unsubscribeSub="unsubscribeSub"
    />
  </div>
</template>

<script>
import SubscriptionForm from './containers/SubscriptionForm';
import ManageFundsModal from './components/ManageFundsModal';
import ManageSubscriptionsModal from './components/ManageSubscriptionsModal';
import Ambrpay from './AmbrpayModified';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Toast } from '@/helpers';

export default {
  components: {
    'subscription-form': SubscriptionForm,
    'back-button': BackButton,
    'manage-funds-modal': ManageFundsModal,
    'manage-subscriptions-modal': ManageSubscriptionsModal
  },
  data() {
    return {
      availableBalanceEth: '',
      availableBalanceUSD: '',
      manageFundsText: '',
      ethPrice: 0,
      loadingBalance: true,
      ambrpay: '',
      subscriptions: []
    };
  },
  computed: {
    ...mapState(['web3', 'account', 'network', 'online'])
  },
  mounted() {
    this.init();
    this.getSubscriptions();
    if (this.online && this.network.type.name === 'ETH') this.getEthPrice();
  },
  methods: {
    init() {
      const account = {
        publicApiKey: 'api_public_DXfGdjBB4eIVgbURCCCAIQ2S',
        address: this.account.address,
        netId: this.network.type.chainID.toString()
      };
      this.ambrpay = new Ambrpay(account, this.web3);
      this.ambrpay
        .getSubscriptionFunds()
        .then(res => {
          this.availableBalanceEth = new BigNumber(
            this.web3.utils.fromWei(res, 'ether')
          ).toFixed();
          this.convertToUSD();
          this.loadingBalance = false;
        })
        .catch(err => {
          this.loadingBalance = false;
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    convertToUSD() {
      this.availableBalanceUSD = '--';

      if (this.availableBalanceEth) {
        this.availableBalanceUSD = new BigNumber(
          new BigNumber(this.availableBalanceEth).times(
            new BigNumber(this.ethPrice)
          )
        ).toFixed(2);
      }
    },
    openManageFundsModal(str) {
      this.manageFundsText = str;
      this.$refs.manageFunds.$refs.manageFundsModal.show();
    },
    openManageSubModal() {
      this.$refs.manageSubs.$refs.manageSubscriptionsModal.show();
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
    },
    startSubscription(params) {
      this.ambrpay.subscribe(params).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    addFunds(amt) {
      this.ambrpay.addFunds(amt).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    withdrawFunds(amt) {
      this.ambrpay.withdrawFunds(amt).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    unsubscribeSub(data) {
      this.ambrpay.unsubscribe(data.pos, data.addr).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    getSubscriptions() {
      this.ambrpay
        .getSubscriptions()
        .then(res => {
          this.subscriptions = res;
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Ambrpay.scss';
</style>
