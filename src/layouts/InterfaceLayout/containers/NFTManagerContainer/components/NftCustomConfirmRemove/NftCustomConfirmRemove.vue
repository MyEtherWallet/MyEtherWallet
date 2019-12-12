<template lang="html">
  <div>
    <b-modal
      ref="modal"
      :title="$t('nftManager.remove-custom')"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
    >
      <div class="button-container">
        <standard-button
          :options="{
            title: $t('nftManager.remove'),
            buttonStyle: 'red',
            helpCenter: false,
            noMinWidth: true,
            fullWidth: false
          }"
          @click.native="continueRemove"
        />
        <standard-button
          :options="{
            title: $t('common.cancel'),
            buttonStyle: 'grey-border',
            helpCenter: false,
            noMinWidth: true,
            fullWidth: false
          }"
          @click.native="cancelRemove"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'standard-button': StandardButton
  },
  props: {
    forRemoval: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    continueRemove() {
      this.$emit('remove', this.forRemoval);
      this.$refs.modal.hide();
    },
    cancelRemove() {
      this.$refs.modal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'NftCustomConfirmRemove.scss';
</style>
