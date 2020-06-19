<template>
  <a
    href="https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en"
    target="_blank"
    class="display--block text-decoration--none"
  >
    <mew6-flexible-btn small>
      <div class="d-flex align-center justify-space-between">
        <div class="pr-9">
          <div class="d-flex align-center mb-2">
            <h4 class="mr-2 font-weight-bold">Mobile Apps</h4>
            <mew6-icon-secure />
          </div>
          <div>
            WalletConnect, Wallet Link
          </div>
        </div>
        <div class="d-flex align-center my-4">
          <img
            height="55"
            src="@/assets/images/icons/icon-wallet-connect.svg"
            alt="Wallet Connect"
            class="mr-3"
          />
          <img
            height="45"
            src="@/assets/images/icons/icon-wallet-link.png"
            alt="Wallet Link"
          />
        </div>
      </div>
    </mew6-flexible-btn>
  </a>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
