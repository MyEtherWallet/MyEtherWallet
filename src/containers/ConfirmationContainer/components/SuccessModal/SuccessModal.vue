<template>
  <b-modal
    ref="success"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal">

    <div class="success-modal">
      <img src="~@/assets/images/etc/checked.svg">
      <p>Success</p>
      <p>Your transaction has been sent successfully.</p>
      <standard-button 
        :options="buttonSuccess"
        @click.native="hideModal"
      />
    </div>

  </b-modal>
</template>

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
  data() {
    return {
      buttonSuccess: {
        title: 'Okay',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false
      }
    };
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


<style lang="scss" scoped>
@import 'SuccessModal';
</style>
