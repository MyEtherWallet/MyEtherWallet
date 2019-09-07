<template>
  <div class="">
    <button class="toggle-button" @click="toggle">toggle</button>
    <b-modal
      ref="DecisionTree"
      hide-footer
      hide-header
      centered
      static
      lazy
      class="bootstrap-modal nopadding decision-tree-modal"
    >
      <div class="modal-contents">
        <div>header</div>
        <md-container />
        <div>footer</div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MdContainer from './components/MdContainer';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer
  },
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
