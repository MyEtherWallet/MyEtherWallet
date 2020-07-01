<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Mnemonic phrase"
      subtitle="Mnemonic Phrase can be lost or stolen by someone else. We don't
            recommand using this method to create your wallet."
      :right-icon="require('@/assets/images/icons/icon-mnemonic.svg')"
    />

    <mew6-flexible-btn
      :to="{ name: 'HomeCreateWalletMnemonic', query: { step: '1' } }"
    >
      <div class="d-flex align-center">
        <div class="pr-9">
          <div class="d-flex align-center mb-2">
            <h4 class="mr-2 font-weight-bold">Mnemonic phrase</h4>
          </div>
          <div>
            Mnemonic Phrase can be lost or stolen by someone else. We don't
            recommand using this method to create your wallet.
          </div>
        </div>
        <div>
          <img
            height="80"
            src="@/assets/images/icons/icon-mnemonic.svg"
            alt="MEWcx"
          />
        </div>
      </div>
    </mew6-flexible-btn>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
