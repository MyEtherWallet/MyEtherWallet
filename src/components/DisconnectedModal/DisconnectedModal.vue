<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="disconnected"
      hide-footer
      hide-header
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <div class="icon">
          <img src="@/assets/images/icons/disconnected.png" />
        </div>
        <div class="modal-title">
          Oops!
        </div>
        <div class="text-content">
          Seems like you are disconnected with MEWconnect, please reconnect
          using App.
        </div>
        <div class="ok-button">
          <standard-button :options="okayButtonOptions" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  name: 'DisconnectedModal',
  components: {
    'standard-button': StandardButton
  },
  props: {},
  data() {
    return {
      okayButtonOptions: {
        title: this.$t('common.ok'),
        buttonStyle: 'green'
      }
    };
  },
  mounted() {
    //this.$refs.disconnected.show();
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DisconnectedModal.scss';
</style>
