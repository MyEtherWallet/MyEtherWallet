<template>
  <mew6-flexible-btn :to="{ name: 'AccessWalletMEWconnect', query: {} }" small>
    <div class="d-flex align-center justify-space-between">
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold">MEWconnect</h4>
          <mew6-icon-secure />
        </div>
        <div>
          Use MEWconnect to access my wallet
        </div>
      </div>
      <div>
        <img
          height="80"
          src="@/assets/images/icons/icon-mew-connect.png"
          alt="MEWcx"
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
