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
          :click-function="continueRemove"
        />
        <standard-button
          :options="{
            title: $t('common.cancel'),
            buttonStyle: 'grey-border',
            helpCenter: false,
            noMinWidth: true,
            fullWidth: false
          }"
          :click-function="cancelRemove"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'standard-button': StandardButton
  },
  props: {
    forRemoval: {
      type: Object,
      default: function () {
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
