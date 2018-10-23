<template>
  <div class="modal-container">
    <b-modal
      ref="finalizeconfirmation"
      hide-footer
      centered
      class="bootstrap-modal confirmation-modal nopadding"
      title="Confirmation">

      <div class="modal-content-container">
        <p class="user-message">
          Are you about to finalize the auction for bestket1988.eth and claim this name?
        </p>

        <div class="button-block">
          <standard-button 
            :options="buttonCancel"
            class="button-cancel"
            @click.native="continueAccess"
          />
          <standard-button 
            :options="buttonConfirm"
            class="button-confirm"
            @click.native="continueAccess"
          />
        </div>

        <div class="bottom-text">
          <interface-bottom-text
            :link-text="$t('interface.etherscanIO')"
            :question="$t('interface.ethNodeProvidedBy')"
            link="/"/>
        </div>
      </div>

    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {},
  data() {
    return {
      buttonCancel: {
        title: 'Cancel',
        buttonStyle: 'green-border',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      },
      buttonConfirm: {
        title: 'Confirm',
        buttonStyle: 'green',
        rightArrow: false,
        leftArrow: false,
        fullWidth: true,
        noMinWidth: true
      }
    };
  },
  computed: {},
  mounted() {
    //this.$refs.finalizeconfirmation.show();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'FinalizeConfirmModal.scss';
</style>
