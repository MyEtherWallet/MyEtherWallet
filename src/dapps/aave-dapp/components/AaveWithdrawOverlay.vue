<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Withdraw"
    right-btn-text="Close"
    :close="close"
  >
    <template #mewOverlayBody> Withdraw </template>
  </mew-overlay>
</template>

<script>
import actualTokenMixin from '../handlers/actualTokenMixin';
export default {
  mixins: [actualTokenMixin],
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
