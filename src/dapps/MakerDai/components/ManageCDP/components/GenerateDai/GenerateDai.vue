<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      hide-footer
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      title="Generate"
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
  props: {
    activeCdp: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'GenerateDai.scss';
</style>
