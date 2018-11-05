<template>
  <div class="modal-container">
    <b-modal
      ref="settings"
      title="Settings"
      hide-footer
      centered
      class="bootstrap-modal">

      aaaa

    </b-modal>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.$refs.settings.show();
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
