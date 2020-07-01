<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Keystore File"
      subtitle="Keystore file contains all the sensitive information of your wallet.
            We don't recommand using this method to create your wallet."
      :right-icon="require('@/assets/images/icons/icon-keystore-file.svg')"
    />

    <mew6-flexible-btn
      :to="{ name: 'HomeCreateWalletKeystore', query: { step: '1' } }"
    >
      <div class="d-flex align-center">
        <div class="pr-9">
          <div class="d-flex align-center mb-2">
            <h4 class="mr-2 font-weight-bold">Keystore File</h4>
          </div>
          <div>
            Keystore file contains all the sensitive information of your wallet.
            We don't recommand using this method to create your wallet.
          </div>
        </div>
        <div>
          <img
            height="80"
            src="@/assets/images/icons/icon-keystore-file.svg"
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
