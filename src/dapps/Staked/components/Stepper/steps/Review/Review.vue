<template>
  <div class="review-step d-flex">
    <div class="review-container">
      <div class="d-flex">
        <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
        <i18n
          class="align-right"
          tag="span"
          path="dappsStaked.validator-created"
        >
          <span slot="number" class="number">{{ details.amount / 32 }}</span>
        </i18n>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.amount') }}:</span>
        <span class="eth-value"
          >{{ details.amount }} {{ $t('common.currency.eth') }}
          <span class="convert-value ml-1"
            >({{ '$' + usdPrice(details.amount) }})</span
          ></span
        >
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.one-time-fee') }}:</span>
        <span class="eth-value"
          >{{ oneTimeFee }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(oneTimeFee) }})</span>
        </span>
      </div>
      <div class="d-flex mt-4">
        <span>{{ $t('dappsStaked.total') }}:</span>
        <span class="eth-value"
          >{{ getTotal }} {{ $t('common.currency.eth') }}
          <span class="convert-value">({{ '$' + usdPrice(getTotal) }})</span>
        </span>
      </div>
    </div>
    <div class="address-container mt-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ details.address }}</span>
    </div>
    <label class="switch mt-4 d-flex">
      <input type="checkbox" @click="agree" />
      <i18n class="ml-2" tag="span" path="dappsStaked.read-and-agree">
        <a
          slot="terms-of-service"
          target="_blank"
          href="https://staked.us/terms/"
          class="link"
          >{{ $t('dappsStaked.terms-of-service') }}</a
        >
      </i18n>
    </label>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import stakeConfigs from '@/dapps/Staked/configs';
import { mapState } from 'vuex';

export default {
  props: {
    details: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      agreed: false,
      oneTimeFee: ''
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3']),
    getTotal() {
      return new BigNumber(this.oneTimeFee)
        .plus(this.details.amount)
        .toFixed(4);
    }
  },
  mounted() {
    this.getFees();
  },
  methods: {
    async getFees() {
      const batchContract =
        stakeConfigs.network[this.network.type.name].batchContract;
      const abi = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'numValidators',
              type: 'uint256'
            }
          ],
          name: 'getFees',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256'
            }
          ],
          stateMutability: 'view',
          type: 'function'
        }
      ];
      const contract = new this.web3.eth.Contract(abi, batchContract);
      const fees = await contract.methods.getFees(this.details.amount).call();
      this.oneTimeFee = this.web3.utils.fromWei(
        new BigNumber(fees).toString(),
        'ether'
      );
    },
    usdPrice(amount) {
      if (this.details.ethPrice) {
        return new BigNumber(this.details.ethPrice).times(amount);
      }
      return 0;
    },
    agree() {
      this.agreed = !this.agreed;
      this.$emit('completed', this.agreed, {
        key: 'review',
        value: this.agreed
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Review.scss';
</style>
