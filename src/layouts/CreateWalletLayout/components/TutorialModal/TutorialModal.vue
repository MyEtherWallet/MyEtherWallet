<template>
  <b-modal
    ref="tutorial"
    hide-footer
    centered
    hide-header
    class="bootstrap-modal">
    <div class="d-block text-center">
      <h2 class="title">Welcome to MEW</h2>
      <p class="content">
        Please take a moment to read through this short introduction. It's
        extreamely important to pay attention to what we have to say,
        for your own security. Ignoring this step will highly increase your
        chances of getting phished.<br>
        <span @click="skip">Skip</span> at your own risk.
      </p>
    </div>
    <div class="button-container fixed-width-1">
      <router-link
        to="/getting-started"
        class="mid-round-button-green-filled close-button">
        Continue
      </router-link>
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
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'TutorialModal.scss';
</style>
