<template>
  <div class="sign-transaction-container">
    <div class="sign-transaction-header">
      <p>Confirmation</p>
    </div>
    <div class="sign-transaction-addresses">
      <amount-info-component />
      <img src="@/assets/images/icons/arrow-down-blue.svg" />
      <amount-info-component />
    </div>
    <div :class="[showDetails ? 'add-margin' : '', 'details-container']">
      <div class="details-header-container">
        <p>Details</p>
        <div class="sliding-switch-white">
          <label class="switch">
            <input
              :checked="showDetails"
              type="checkbox"
              @click="toggleDetails"
            />
            <span class="slider round" />
          </label>
        </div>
      </div>
      <div
        :class="[
          showDetails ? 'shown' : 'hide-box',
          'details-content-container'
        ]"
      >
        <ul class="details-item-container">
          <li class="detail-item" v-for="(val,name) in displayedData" :key="name">
            <span>{{ name | capitalize}}: </span>
            <span>{{ val }}</span>

          </li>
        </ul>
      </div>
    </div>
    <button
      :class="[showDetails ? '' : 'details-closed', 'continue-button']"
      @click="openPasswordModal"
    >
      Continue
    </button>
  </div>
</template>

<script>
import AmountInfoComponent from './components/AmountInfoComponent';
import { mapState } from 'vuex';
export default {
  components: {
    'amount-info-component': AmountInfoComponent
  },
  data() {
    return {
      stuff: [1, 2, 3, 4, 5, 6],
      showDetails: false
    };
  },
  computed: {
    ...mapState(['linkQuery']),
    displayedData() {
      const {
        chainId,
        data,
        from,
        gas,
        gasLimit,
        gasPrice,
        nonce,
        tokenSymbol,
        tokenTransferTo,
        tokenTransferVal,
        value
      } = this.linkQuery;

      return {
        'chain id': chainId,
        data: data,
        from: from,
        gas: gas,
        'gas limit': gasLimit,
        'gas price': gasPrice,
        nonce: nonce,
        value: value,
        'token symbol': tokenSymbol,
        'token transfer to': tokenTransferTo,
        'token transfer val': tokenTransferVal
      };
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    openPasswordModal() {
      console.log(this.displayedData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignTxContainer.scss';
</style>
