<template>
  <mew-overlay
    :show-overlay="open"
    title="Interact with contract"
    :right-btn-text="$t('common.cancel')"
    :close="close"
  >
    <template #mewOverlayBody>
      <v-sheet max-width="500px" width="100%" class="elevation-10 pa-8">
        <mew-select label="Function" :items="methods" @input="methodSelect" />
        <mew-input label="_bidValue (unit256)" />
        <mew-button
          class="d-block mx-auto"
          btn-size="xlarge"
          title="View result"
        />

        <v-divider class="my-7" />

        <div class="px-2">
          <div class="mew-heading-3">Results</div>
          <div class="d-flex align-center justify-space-between my-2">
            <div>Token count:</div>
            <div class="font-weight-bold">10000</div>
          </div>
          <div class="d-flex align-center justify-space-between my-2">
            <div>Purchase value:</div>
            <div class="font-weight-bold">2000</div>
          </div>
        </div>
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
export default {
  components: {},
  props: {
    open: { default: false, type: Boolean },
    close: {
      type: Function,
      default: function () {
        return {};
      }
    },
    methods: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
