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
          :options="removeButton"
          @click.native="continueRemove"
        />
        <standard-button :options="cancelButton" @click.native="cancelRemove" />
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
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      removeButton: {
        title: `${this.$t('nftManager.remove')}`,
        buttonStyle: 'red',
        helpCenter: false,
        noMinWidth: true,
        fullWidth: false
      },
      cancelButton: {
        title: `${this.$t('common.cancel')}`,
        buttonStyle: 'grey-border',
        helpCenter: false,
        noMinWidth: true,
        fullWidth: false
      }
    };
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
