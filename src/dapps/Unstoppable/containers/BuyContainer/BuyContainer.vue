<template lang="html">
  <div>
    <div class="domain-available-container">
      <div class="content-header">
        <div>
          <h4>{{ domainName }}</h4>
          <p>{{ $t('unstoppable.is-available') }}</p>
        </div>
        <div class="content-right">
          <h4 class="domain-price">${{ domainPrice }}</h4>
          <div class="buttons-container" @click="registerDomain()">
            <div class="mid-round-button-green-filled submit">
              {{ $t('unstoppable.buyDomain') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    domainPrice: {
      type: Number,
      default: 0
    }
  },
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice) {
      this.$router.replace('/interface/dapps/unstoppable');
    }
  },
  methods: {
    registerDomain() {
      this.$router.push({ path: 'buy/stripe' });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'BuyContainer.scss';
</style>
