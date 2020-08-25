<template>
  <mew-overlay :show-overlay="open">
    <template v-slot:mewOverlayBody>
      <div class="pa-8">
        <h2 class="text-center mb-10">Add an owned domain</h2>
        <v-sheet color="transparent" width="700px">
          <div class="mb-3"></div>
          <div class="d-flex align-start">
            <mew-input
              :has-clear-btn="true"
              right-label=".ctypto"
              label="Domain name"
              placeholder=" "
              class="mr-3 flex-grow-1"
            />
            <mew-button
              :has-full-width="false"
              button-size="xlarge"
              title="Search"
            />
          </div>
        </v-sheet>
        <mew6-white-sheet class="pa-2">
          <div
            class="d-flex align-center justify-space-between informationBlock pa-6 border-radius--10px"
          >
            <div class="d-flex align-center">
              <v-icon class="check-icon primary--text mr-3">
                mdi-check-circle-outline
              </v-icon>
              <div>
                <div class="mew-heading-2 primary--text mb-2">Owned domain</div>
                <div class="mew-heading-2">mewdev009.eth</div>
              </div>
            </div>
            <mew-button
              :has-full-width="false"
              button-size="xlarge"
              title="Add to list"
              btn-style="outline"
            />
          </div>
        </mew6-white-sheet>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  components: {},
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
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
