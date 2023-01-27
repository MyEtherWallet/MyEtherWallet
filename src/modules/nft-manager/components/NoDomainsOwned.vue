<template>
  <div class="text-center justify-center mt-12">
    <img :src="noDomainsIcon" alt="no-domains" />
    <div class="mt-7 mx-auto" style="max-width: 360px">
      <h1 class="title-header">You have no domains</h1>
      <p class="pa-1 mt-3 mb-1 text-muted">
        A domain is a custom user name that you can assign to your wallet
        address
      </p>
      <a
        href="https://www.mewtopia.com/domain-names-on-ethereum-blockchain/"
        class="learn-link"
        target="_blank"
        >Learn more</a
      >
    </div>
    <div class="d-flex mt-10 mx-auto" style="max-width: 360px; gap: 8px">
      <div>
        <img :src="unstoppableIcon" alt="unstoppable" class="mb-3" />
        <mew-button has-full-width>
          <span class="button-text">Get a domain</span>
        </mew-button>
      </div>
      <div class="ml-auto">
        <img :src="ensIcon" alt="ens" class="mb-3" />
        <mew-button has-full-width>
          <span class="button-text">Get a domain</span>
        </mew-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    noDomainsIcon() {
      return require('@/assets/images/icons/phone-what-is-your-addr.png');
    },
    unstoppableIcon() {
      return require('@/assets/images/icons/icon-unstoppable.svg');
    },
    ensIcon() {
      return require('@/assets/images/icons/icon-ens.svg');
    }
  }
};
</script>

<style lang="scss" scoped>
.title-header {
  font-size: 32px;
  line-height: 28px;
  letter-spacing: 0px;
}

.text-muted {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  color: #1f242f;
  opacity: 0.6;
}

.learn-link {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  text-decoration-line: underline;
  color: #4b83e8;
}

.button-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
}
</style>
