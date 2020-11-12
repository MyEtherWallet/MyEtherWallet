<template>
  <div class="amount-step d-flex">
    <span class="title">{{ $t('dappsStaked.amount-stake') }}</span>
    <i18n class="subtitle" path="dappsStaked.validator-required">
      <span slot="number" class="num">1</span>
      <!-- need to add link -->
      <span slot="learn-more" class="learn">{{ $t('common.learn-more') }}</span>
    </i18n>
    <div class="action-container">
      <input v-model="amount" type="number" placeholder="0" />
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
const types = ['32', '64', '96', '128'];

export default {
  data() {
    return {
      amount: '',
      disabled: false
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
      this.amount = types[idx];
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Amount.scss';
</style>
