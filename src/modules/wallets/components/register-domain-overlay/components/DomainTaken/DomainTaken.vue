<template>
  <v-sheet width="100%" max-width="600px" class="mx-auto pa-8">
    <mew6-white-sheet class="pa-7">
      <div class="d-flex align-center bg_datablock pa-6 border-radius--10px">
        <v-icon class="check-icon error--text mr-3">
          mdi-do-not-disturb
        </v-icon>
        <div>
          <div class="mew-heading-2 error--text mb-1">
            Domain has been taken
          </div>
          <div class="mew-heading-2">mewdev009.eth</div>
        </div>
      </div>

      <div class="d-flex justify-center mt-6">
        <mew-button title="Okay" button-size="xlarge" />
      </div>
    </mew6-white-sheet>
  </v-sheet>
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
