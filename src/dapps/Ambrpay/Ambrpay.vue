<template>
  <div class="ambrpay-container">
    <back-button :title="$t('dappsAmbrpay.exit-dapp')" />
    <b-container class="pl-5 pr-5">
      <div class="ambrpay-header mt-5">
        <div class="title-container">
          <h3 class="page-title">{{ $t('dappsAmbrpay.title') }}</h3>
          <popover
            :popcontent="$t('dappsAmbrpay.ambrpay-popover')"
            class="dapp-popover"
          ></popover>
        </div>
        <div class="btns-container">
          <b-button
            class="withdraw-btn"
            @click="openManageFundsModal('dappsAmbrpay.withdraw')"
            >{{ $t('dappsAmbrpay.withdraw-funds') }}</b-button
          >
          <b-button
            class="add-btn"
            @click="openManageFundsModal('dappsAmbrpay.add')"
          >
            {{ $t('dappsAmbrpay.add-funds') }}
          </b-button>
        </div>
      </div>
      <div class="funds-container">
        <span class="fund-text">{{ $t('dappsAmbrpay.balance') }}</span>
        <div class="balance-container">
          <i v-show="loadingBalance" class="fa fa-spinner fa-spin" />
          <span v-show="!loadingBalance" class="fund-text"
            >{{ availableBalanceEth }} {{ $t('common.currency.eth') }}
          </span>
          <span v-show="!loadingBalance" class="usd-text"
            >{{ availableBalanceUSD }} {{ $t('common.currency.usd') }}</span
          >
        </div>
      </div>
      <subscription-form
        :subscriptions="subscriptions"
        @startSubscription="startSubscription"
        @openManageSubModal="openManageSubModal"
      ></subscription-form>
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
    this.$refs.manageSubs.$refs.manageSubscriptionsModal.$on('show', () => {
      this.getSubscriptions();
    });
    if (this.online) this.getEthPrice();
  },
  methods: {
    init() {
      const account = {
        publicApiKey: 'api_public_DXfGdjBB4eIVgbURCCCAIQ2S',
        address: this.account.address,
        netId: this.network.type.chainID.toString()
      };
      this.ambrpay = new Ambrpay(account, this.web3);
      this.getSubscriptionFunds();
    },
    getSubscriptionFunds() {
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
      this.manageFundsText = this.$t(str);
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
      this.ambrpay
        .subscribe(params)
        .then(this.getSubscriptions)
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    addFunds(amt) {
      this.ambrpay
        .addFunds(amt)
        .then(this.getSubscriptionFunds)
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    withdrawFunds(amt) {
      this.ambrpay
        .withdrawFunds(amt)
        .then(this.getSubscriptionFunds)
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    unsubscribeSub(data) {
      this.ambrpay
        .unsubscribe(data.pos, data.addr)
        .then(this.getSubscriptions)
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    getSubscriptions() {
      this.ambrpay
        .getSubscriptions()
        .then(res => {
          this.subscriptions = res.map(subscription => ({
            ...subscription,
            moreInfo: false
          }));
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
