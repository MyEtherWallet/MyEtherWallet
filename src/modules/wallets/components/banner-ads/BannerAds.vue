<template>
  <mew-carousel class="box-shadow" carousel-height="145" :total-slides="2">
    <template v-slot:slide1>
      <mew6-white-sheet class="banner">
        <div class="ad1 px-5 d-flex flex-column justify-center">
          <div class="titlePrimary--text title font-weight-bold mb-n1">
            MEWwallet
          </div>
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
        </div>
      </mew6-white-sheet>
    </template>
    <template v-slot:slide2>
      <mew6-white-sheet class="banner">
        aaaa
      </mew6-white-sheet>
    </template>
  </mew-carousel>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.banner {
  height: 145px;
}
</style>
