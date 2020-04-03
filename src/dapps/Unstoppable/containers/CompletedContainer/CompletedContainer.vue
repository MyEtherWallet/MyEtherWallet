<template lang="html">
  <div class="completed-container">
    <div class="copy-container">
      <h3>
        {{ $t('unstoppable.congratulations') }}
      </h3>
      <h5 class="middle-copy">
        <b>{{ domainName + ' ' }}</b>
        {{
          $t('unstoppable.transfer-complete', {
            address: address
          })
        }}
      </h5>
      <h5>
        {{ $t('unstoppable.complete-manage-on-one') + ' ' }}
        <a href="https://unstoppabledomains.com" target="_blank"
          >unstoppabledomains.com</a
        >
        {{ ' ' + $t('unstoppable.manage-on-two') }}
      </h5>
      <button
        :class="['large-round-button-green-filled clickable continue-button']"
        @click="handleContinue"
      >
        <span>
          {{ $t('unstoppable.continue') }}
        </span>
      </button>
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
    account: {
      type: Object,
      default: function () {}
    }
  },
  computed: {
    address() {
      return this.account.address;
    }
  },
  beforeMount() {
    if (!this.domainName) {
      this.$router.push('/interface/dapps/unstoppable');
    }
  },
  methods: {
    handleContinue() {
      this.$router.push('/interface/dapps/unstoppable');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CompletedContainer.scss';
</style>
