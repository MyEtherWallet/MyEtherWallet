<template>
  <div class="modal-container">
    <div class="modal-open-button" @click="modalOpen">
      <h5>Test Button</h5>
      <p>Open Settings Modal</p>
    </div>

    <b-modal
      ref="settings"
      title="Settings"
      hide-footer
      centered
      class="bootstrap-modal nopadding">

      <div class="modal-contents">
        aaa
      </div>

    </b-modal>    
  </div>
</template>

<script>
export default {
  name: 'Settings',
  components: {},
  data() {
    return {

    };
  },
  methods: {
    modalOpen() {
      this.$refs.settings.show();
    }
  },
  mounted() {
    
  }
};
</script>

<style lang="scss" scoped>
@import 'SettingsModal.scss';
</style>
