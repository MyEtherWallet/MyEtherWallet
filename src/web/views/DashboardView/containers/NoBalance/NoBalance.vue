<template>
  <div id="id-4e910eeead37ba158dafdbd93bb1d543">
    <mew6-white-sheet class="position--relative">
      <div class="bg-container" :class="$vuetify.theme.dark ? 'dark' : ''" />
      <v-sheet color="transparent" max-width="360px">
        <div class="pa-12">
          <div class="mew-subtitle mb-6">
            My ETH balance is empty
          </div>
          <mew-button
            :has-full-width="false"
            title="Buy ETH with a credit card"
            button-size="xlarge"
          />
          <div class="d-flex align-center mt-4">
            <div>We accept credit card</div>
            <img
              v-if="!$vuetify.theme.dark"
              class="ml-2 mr-1"
              height="21"
              src="@/assets/images/icons/icon-visa-dark.png"
            />
            <img
              v-if="$vuetify.theme.dark"
              class="ml-2 mr-2"
              height="13"
              src="@/assets/images/icons/icon-visa-white.png"
            />
            <img
              height="18"
              src="@/assets/images/icons/icon-mastercard-mew.png"
            />
          </div>
          <div class="text-color--gray1 mt-12">
            Tip: You can also send your ETH here from another wallet!
          </div>
        </div>
      </v-sheet>
    </mew6-white-sheet>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss">
#id-4e910eeead37ba158dafdbd93bb1d543 {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
    background-position: right 60px bottom -1px;
    background-size: 245px;

    &.dark {
      opacity: 0.4;
      filter: saturate(1) brightness(0.47) contrast(3);
    }
  }
}
</style>
