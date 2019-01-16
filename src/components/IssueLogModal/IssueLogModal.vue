<template>
  <div class="wrap">
    <div class="modal-container">
      <b-modal
        ref="issuelog"
        hide-footer
        hide-header
        centered
        class="bootstrap-modal nopadding"
      >
        <div class="modal-contents">
          <div class="modal-header-block">
            <h2 class="title">Oops! Something Goes Wrong :(</h2>
            <p class="sub-text">
              You can send out this log to MEW force team. And we will assist
              you to solve the issue ASAP.
            </p>
          </div>
          <div class="modal-user-input-block">
            <standard-input :options="userInputOptions" />
          </div>
          <div class="modal-button-block">
            <standard-button :options="cancelButtonOptions" />
            <standard-button :options="sendButtonOptions" />
          </div>
        </div>

        <!-- .modal-contents -->
      </b-modal>
    </div>
    <!-- .modal-container -->
  </div>
  <!-- .wrap -->
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';

export default {
  name: 'IssueLogModal',
  components: {
    'standard-button': StandardButton,
    'standard-input': StandardInput
  },
  data() {
    return {
      cancelButtonOptions: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        noMinWidth: true,
        fullWidth: true
      },
      sendButtonOptions: {
        title: 'Send',
        buttonStyle: 'green',
        noMinWidth: true
      },
      userInputOptions: {
        title: 'Issue Log',
        buttonCopy: true,
        isTextarea: true
      }
    };
  },
  mounted() {},
  methods: {
    modalOpen() {
      this.$refs.issuelog.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'IssueLogModal.scss';
</style>
