<template>
  <div class="modal-container">
    <b-modal
      ref="swapconfirmation"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Confirmation"
    >
      <help-center-button />
    </b-modal>
  </div>
</template>

<script>
import HelpCenterButton from '@/components/Buttons/HelpCenterButton';

export default {
  components: {
    'help-center-button': HelpCenterButton
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'PaybackDai.scss';
</style>
