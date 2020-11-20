<template>
  <div class="amount-step d-flex">
    <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
    <i18n class="subtitle" path="dappsStaked.validator-required-eth-per">
      <span slot="number" class="num">1</span>
      <!-- need to add link -->
      <span slot="learn-more" class="learn">{{ $t('common.learn-more') }}</span>
    </i18n>
    <div class="action-container">
      <input
        v-model="amount"
        type="number"
        placeholder="0"
        @change="setAmount"
      />
      <span v-if="hasError">hello</span>
      <div class="percentage-container pt-2">
        <div :class="isActive(0) ? 'active' : ''" @click="setAmount(0)">
          32 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(1) ? 'active' : ''" @click="setAmount(1)">
          64 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(2) ? 'active' : ''" @click="setAmount(2)">
          96 {{ $t('common.currency.eth') }}
        </div>
        <div :class="isActive(3) ? 'active' : ''" @click="setAmount(3)">
          128 {{ $t('common.currency.eth') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const types = [32, 64, 96, 128];

export default {
  data() {
    return {
      amount: 0,
      hasError: false
    };
  },
  methods: {
    isActive(idx) {
      if (this.amount === types[idx]) {
        return true;
      }
      return false;
    },
    setAmount(idx) {
      if (idx || idx === 0) {
        this.amount = types[idx];
      }
      if (this.amount !== 32 && this.amount % 32 !== 0) {
        this.hasError = true;
        console.error('in here')
        return false;
      }
      this.$emit('completed', { key: 'amount', value: this.amount });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SetAmount.scss';
</style>
