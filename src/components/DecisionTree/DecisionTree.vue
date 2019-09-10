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
        <div class="header">
          <button @click="back()">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
          </button>
          <p>header</p>
        </div>
        <div class="search">search</div>

        <div class="md-content">
          <ul v-if="currentIndex.sub">
            <li
              v-for="(qa, key) in currentIndex.sub"
              :key="key"
              class="p-4 flex--row--align-center"
            >
              <p class="qa-title" @click="getSub(index[qa])">
                {{ index[qa].title }}
              </p>
              <p class="ml-auto right-arrow">></p>
            </li>
          </ul>
          <div v-else>
            <md-container :md="mdToHtml(currentIndex.md)" />
          </div>
        </div>

        <div class="footer">
          <div class="help flex--row--align-center">
            <p>Contact support</p>
            <p class="ml-2 mr-2">|</p>
            <p>Help center</p>
          </div>
          <button class="ml-auto" @click="top()">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MdContainer from './components/MdContainer';
import marked from 'marked';
import qaIndex from '@/data/DecisionTree/index.js';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer
  },
  props: {},
  data() {
    return {
      index: qaIndex,
      currentIndex: qaIndex.ROOT,
      historyStack: []
    };
  },
  mounted() {
    this.toggle();
  },
  methods: {
    toggle() {
      this.$refs.DecisionTree.toggle();
    },
    getSub(qa) {
      this.historyStack.push(this.currentIndex);
      this.currentIndex = qa;
    },
    back() {
      if (this.historyStack.length > 0) {
        this.currentIndex = this.historyStack.pop();
      }
    },
    top() {
      this.currentIndex = qaIndex.ROOT;
      this.historyStack = [];
    },
    mdToHtml(md) {
      return marked(md);
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

  .modal-content {
    border-radius: 10px;
  }

  .modal-body {
    background-color: transparent;
  }
}
</style>
