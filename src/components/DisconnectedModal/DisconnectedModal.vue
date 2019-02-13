<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="disconnected"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">Disconnected content</div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'DisconnectedModal',
  props: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DisconnectedModal.scss';
</style>
