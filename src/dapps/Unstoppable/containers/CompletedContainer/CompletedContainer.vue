<template lang="html">
  <div class="completed-container">
    <img
      class="pixel"
      src="https://unstoppabledomains.com/api/v1/resellers/myetherwallet/users/mew@unstoppabledomains.com/set-cookie"
    />
    <div class="copy-container">
      <h3>
        {{ $t('unstoppable.congratulations') }}
      </h3>
      <h5 class="middle-copy">
        {{ $t('unstoppable.following-been-claimed') }}:
        <h4
          v-for="domain of domainsClaimed"
          :key="`${domain.label}.${domain.extension}`"
          class="domain-container"
        >
          {{ domain.label + '.' + domain.extension }}
        </h4>
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
    domainsClaimed: {
      type: Array,
      default: () => {
        return [];
      }
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
    if (!this.domainsClaimed.length) {
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
