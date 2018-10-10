<template>
  <b-modal
    ref="tutorial"
    hide-footer
    centered
    hide-header
    class="bootstrap-modal">
    <div class="tutorial-modal-content">
      <div class="d-block text-center">
        <h3 class="title">Welcome to MEW</h3>
        <p class="content">
          Please take a moment to read through this short introduction. It's
          extreamely important to pay attention to what we have to say,
          for your own security. Ignoring this step will highly increase your
          chances of getting phished.
          <span @click="skip">Skip</span> at your own risk.
        </p>
      </div>

      <div class="modal-button-container">
        <router-link
          to="/getting-started">
          <standard-button 
            :options="buttonContinue"
            @click.native="interact = true"
          />
        </router-link>
      </div>

    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    skip: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      buttonContinue: {
        title: 'Continue',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: false
      }
    };
  },
  mounted() {
    //this.$refs.tutorial.show();
  }
};
</script>

<style lang="scss" scoped>
@import 'TutorialModal-desktop.scss';
@import 'TutorialModal-tablet.scss';
@import 'TutorialModal-mobile.scss';
</style>
