<template>
  <mew6-flexible-btn
    :to="{ name: 'AccessWalletHardwareWallets', query: {} }"
    small
  >
    <div class="d-flex align-center justify-space-between">
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold">Hardware wallets</h4>
          <mew6-icon-secure />
        </div>
        <div>
          Ledge, Trezor, Keep key, FINNEY, BitBox, Secalot
        </div>
      </div>
      <div>
        <img
          height="80"
          src="@/assets/images/icons/icon-hardware-wallet.png"
          alt="MEWcx"
          class="mr-n4"
        />
      </div>
    </div>
  </mew6-flexible-btn>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
