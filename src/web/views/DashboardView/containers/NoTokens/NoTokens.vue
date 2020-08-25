<template>
  <div id="id-3c6d3124fa862b83b5d03c21da68c074">
    <mew6-white-sheet class="position--relative">
      <div class="bg-container" :class="$vuetify.theme.dark ? 'dark' : ''" />
      <v-sheet color="transparent" max-width="360px">
        <div class="pa-12">
          <div class="mew-subtitle mb-6">
            My token list is empty
          </div>
          <mew-button
            class="ml-auto ml-n3"
            :has-full-width="false"
            :title="'+ ' + 'Add custom tokens'"
            button-size="xsmall"
            btn-style="transparent"
            @click.native="goTo('HomeAccessWallet')"
          />
        </div>
      </v-sheet>
      <div class="py-12" />
      <div class="py-5" />
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

<style lang="scss" scoped>
#id-3c6d3124fa862b83b5d03c21da68c074 {
  .bg-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
      url(~@/assets/images/backgrounds/bg-small-half-circle.png);
    background-position: right -16px bottom -26px, left -18px bottom -29px;
    background-size: 357px, 150px;

    &.dark {
      opacity: 0.3;
      filter: saturate(1) brightness(0.47) contrast(5);
    }
  }

  .block-title {
    line-height: 36px !important;
  }

  .top-button-icon {
    border-radius: 100%;
    background-color: #b4ece4;
    margin-right: 5px;
  }
}
</style>
