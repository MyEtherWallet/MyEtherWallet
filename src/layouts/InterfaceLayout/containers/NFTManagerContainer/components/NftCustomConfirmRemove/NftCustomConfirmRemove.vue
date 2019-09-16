<template lang="html">
  <div>
    <b-modal
      ref="modal"
      hide-footer
      class="bootstrap-modal nopadding max-height-1"
      centered
      title="Add Custom Token"
    >
      <div class="button-block">
        <standard-button
          :options="removeButton"
          @click.native="continueRemove"
        />
        <standard-button
          :options="cancelButton"
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
  data() {
    return {
      removeButton: {
        title: 'Remove',
        buttonStyle: 'red',
        helpCenter: false,
        noMinWidth: false,
        fullWidth: false
      },
      cancelButton: {
        title: 'Cancel',
        buttonStyle: 'grey-border',
        helpCenter: false,
        noMinWidth: false,
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
