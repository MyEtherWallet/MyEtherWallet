<template>
  <mew-overlay
    :show-overlay="open"
    title="Select Token to Deposit"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody>
      <v-sheet color="white" max-width="650px" class="border-radius--10px pa-4">
        <AaveTable />
      </v-sheet>
    </template>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
export default {
  components: { AaveTable },
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

<style lang="scss" scoped></style>
