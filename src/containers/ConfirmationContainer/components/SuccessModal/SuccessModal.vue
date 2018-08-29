<template>
  <b-modal
    ref="success"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal">
    <div class="d-block text-center">
      <i
        class="check-icon fa fa-check"
        aria-hidden="true"/>
      <h2 class="title">Success</h2>
      <p>{{ message }}</p>
    </div>
    <div class="button-container">
      <b-btn
        class="mid-round-button-green-filled close-button"
        @click="hideModal">
        {{ linkMessage }}
      </b-btn>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
@import 'SuccessModal';
</style>
<script>
export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    linkMessage: {
      type: String,
      default: ''
    },
    linkTo: {
      type: String,
      default: '/'
    }
  },
  methods: {
    hideModal() {
      if (this.linkTo !== '/') {
        this.$router.push({ path: this.linkTo });
      }
      this.$refs.success.hide();
    }
  }
};
</script>
