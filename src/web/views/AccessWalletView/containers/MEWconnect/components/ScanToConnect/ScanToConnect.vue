<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Scan to connect"
      subtitle="Please use the MEWconnect App to scan the QR code."
      :right-icon="require('@/assets/images/snippets/bg-mew-wallet.png')"
    />

    <mew6-flexible-btn noclick>
      <div class="d-flex align-center justify-space-between">
        <div class="pr-9">
          <div class="d-flex align-center mb-2">
            <h4 class="mr-2 font-weight-bold">Scan to connect</h4>
          </div>
          <div>Please use the MEWconnect App to scan the QR code.</div>
        </div>
        <VueQrcode
          class="my-n2"
          value="C4078c76aa30fb32"
          :options="{ size: 130 }"
        />
      </div>
    </mew6-flexible-btn>
  </div>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: { VueQrcode },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
