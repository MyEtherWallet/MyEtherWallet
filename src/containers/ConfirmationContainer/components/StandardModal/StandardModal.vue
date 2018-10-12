<template>
  <b-modal
    ref="standardmodal"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal">

    <div class="standard-modal-container">
      <p class="title">Success</p>
      <p class="text">Your transaction has been sent successfully.</p>
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
    options: {
      type: Object,
      default: function() {
        return {};
      }
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
  mounted() {
    //this.$refs.standardmodal.show();
  },
  methods: {
    hideModal() {
      if (this.linkTo !== '/') {
        this.$router.push({ path: this.linkTo });
      }
      this.$refs.standardmodal.hide();
    }
  }
};
</script>


<style lang="scss" scoped>
@import 'StandardModal';
</style>
