<template>
  <div class="ambrpay-container">
    <back-button />
    <div class="ambrpay-header mt-5">
      <h3 class="page-title">Ambrpay</h3>

      <div class="btns-container">
        <b-button class="withdraw-btn">Withdraw Funds</b-button>
        <b-button class="add-btn">Add Funds</b-button>
      </div>
    </div>
    <subscription-form></subscription-form>
  </div>
</template>

<script>
import SubscriptionForm from './containers/SubscriptionForm';
import Ambrpay from './AmbrpayModified';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import { mapState } from 'vuex';

export default {
  components: {
    'subscription-form': SubscriptionForm,
    'back-button': BackButton
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
          // eslint-disable-next-line
          console.log('res', res);
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log('err', err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Ambrpay.scss';
</style>
