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
        <div>
          <span class="fund-text">{{ availableBalanceEth }} ETH </span>
          <span class="usd-text">USD</span>
        </div>
      </div>
      <subscription-form></subscription-form>
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
      manageFundsText: ''
    };
  },
  computed: {
    ...mapState(['web3', 'account', 'network'])
  },
  mounted() {
    this.init();
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
          // eslint-disable-next-line
          console.log('res', res);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log('err', err);
        });
    },
    openManageFundsModal(str) {
      this.manageFundsText = str;
      console.error('in here');
      this.$refs.manageFunds.$refs.manageFundsModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Ambrpay.scss';
</style>
