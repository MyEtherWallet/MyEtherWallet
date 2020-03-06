<template>
  <div class="ad1 px-5 d-flex flex-column justify-center">
    <div class="title font-weight-bold mb-n1">MEW wallet App</div>
    <div class="mb-2">Download it today!</div>
    <div class="d-flex align-center mb-1">
      <img
        class="mr-1"
        height="23"
        src="@/assets/images/icons/button-app-store.png"
      />
      <img
        class="mr-1"
        height="23"
        src="@/assets/images/icons/button-play-store.png"
      />
    </div>
    <div class="d-flex align-center">
      <img
        class="mr-1"
        height="23"
        src="@/assets/images/icons/button-samsung.png"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss" scopted>
.ad1 {
  height: 100%;
  background: url('~@/assets/images/snippets/mobile/mobile-mewconnect-no-hardware.png');
  background-size: 130px;
  background-position: right -10px bottom -20px;
  background-repeat: no-repeat;
}
</style>
