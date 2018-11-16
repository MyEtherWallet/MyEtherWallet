<template>
  <div class="modal-container">
    <b-modal
      ref="logout"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <h2>Are you sure to logout your wallet?</h2>

        <div class="buttons">
          <standard-button :options="buttonNo" />
          <standard-button :options="buttonYes" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Lougout',
  components: {},
  data() {
    return {
      buttonNo: {
        title: 'No',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonYes: {
        title: 'Yes',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'LogoutModal.scss';
</style>
