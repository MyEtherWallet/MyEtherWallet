<template>
  <mew6-white-sheet>
    <div
      class="d-block d-lg-flex align-center bg_datablock pa-3 pa-lg-6 border-radius--10px text-center text-lg-left"
    >
      <v-icon class="check-icon error--text mr-lg-3 mb-4 mb-lg-0">
        mdi-do-not-disturb
      </v-icon>
      <div>
        <div class="mew-heading-2 error--text mb-1">Domain has been taken</div>
        <div class="mew-heading-2">mewdev009.eth</div>
      </div>
    </div>

    <div class="d-flex justify-center mt-6">
      <mew-button title="Okay" btn-size="xlarge" />
    </div>
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.check-icon {
  font-size: 65px !important;
}
</style>
