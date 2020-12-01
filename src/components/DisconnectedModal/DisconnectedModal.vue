<template>
  <div class="address-qrcode-modal">
    <b-modal
      ref="disconnected"
      hide-footer
      hide-header
      centered
      static
      lazy
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <div class="icon">
          <img
            :alt="$t('common.disconnected')"
            src="@/assets/images/icons/disconnected.png"
          />
        </div>
        <div class="modal-title">
          {{ $t('common.oops') }}
        </div>
        <div class="text-content">
          {{ $t('interface.mewconnect-disconnected') }}
        </div>
        <div class="ok-button">
          <standard-button
            :options="{
              title: $t('common.ok'),
              buttonStyle: 'green'
            }"
            :click-function="close"
          />
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
  methods: {
    close() {
      this.$refs.disconnected.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DisconnectedModal.scss';
</style>
