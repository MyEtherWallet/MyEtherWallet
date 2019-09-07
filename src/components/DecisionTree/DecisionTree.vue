<template>
  <div class="">
    <b-modal
      ref="DecisionTree"
      hide-footer
      hide-header
      centered
      static
      lazy
      class="bootstrap-modal nopadding decision-tree-modal"
    >
      <div class="modal-contents">Hi</div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'DecisionTree',
  components: {},
  props: {},
  data() {
    return {};
  },
  mounted() {
    this.toggle();
  },
  methods: {
    toggle() {
      this.$refs.DecisionTree.toggle();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'DecisionTree.scss';
</style>

<style lang="scss">
.decision-tree-modal {
  .modal-dialog {
    max-width: 350px;
    width: 350px;
    position: fixed;
    right: 100px;
  }
}
</style>
