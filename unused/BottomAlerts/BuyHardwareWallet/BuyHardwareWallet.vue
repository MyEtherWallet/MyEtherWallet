<template>
  <AlertContainer :show="show" :hide-overlay="hideOverlay">
    <div class="d-flex align-center justify-center">
      <h5 class="font-weight-medium mr-4">
        Did you know? Hardware wallets offer the highest security for accessing
        your crypto.
      </h5>
      <mew-button
        title="Buy a hardware wallet"
        button-size="xlarge"
        btn-style="outline"
      />
    </div>
  </AlertContainer>
</template>

<script>
import AlertContainer from '../AlertContainer';
export default {
  components: { AlertContainer },
  props: {
    show: { default: false, type: Boolean },
    hideOverlay: { default: false, type: Boolean }
  },
  data() {
    return { bottomSheetShow: false };
  },
  mounted() {
    this.bottomSheetShow = this.show;
  }
};
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  right: 30px;
  top: 0;
  bottom: 0;
  margin: auto 0;
}
</style>
