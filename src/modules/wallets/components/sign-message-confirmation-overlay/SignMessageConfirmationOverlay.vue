<template>
  <mew-overlay :show-overlay="open" @closeOverlay="$emit('close')">
    <template #mewOverlayBody>
      <div>
        <h2 class="text-center mb-10">Confirmation</h2>
        <mew6-white-sheet>
          <v-sheet
            color="transparent"
            max-width="600px"
            width="100%"
            class="pa-3 pa-lg-8"
          >
            <mew-address-select />
            <v-textarea
              outlined
              label="Message in Hax"
              value="0xf6827a968275bd62c8ca5fc08cf498b8711491c175bd62c8ca5fc08cf498b8711491c1"
            ></v-textarea>
            <div class="text-center">
              <mew-button title="Confirm & Sign" btn-size="xlarge" />
            </div>
          </v-sheet>
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
