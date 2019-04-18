<template>
  <div class="modal-container">
    <b-modal
      ref="modal"
      title="DAI Confirmation"
      centered
      class="bootstrap-modal bootstrap-modal-wide padding-40-20"
      hide-footer
    >
      <div class="inputs-container"></div>
    </b-modal>
  </div>
</template>

<script>
export default {
  components: {},
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
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DaiConfirmationModal';
</style>
