<template>
  <b-modal
    ref="errorModal"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal"
  >
    <div class="d-block text-center">
      <i class="check-icon fa fa-close" aria-hidden="true" />
      <h2 class="title">{{ $t('confirmation.error') }}</h2>
      <p>{{ message }}</p>
    </div>
    <div class="button-container">
      <b-btn
        class="mid-round-button-lightgrey-filled close-button"
        @click="hideModal"
      >
        {{ linkMessage === '' ? 'An Error Occured' : linkMessage }}
      </b-btn>
    </div>
  </b-modal>
</template>

<style lang="scss" scoped>
@import 'ErrorModal';
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
