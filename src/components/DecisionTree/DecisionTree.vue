<template>
  <div class="">
    <customer-support :no-icon="true" :show="showCustomerSupport" />
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
          <div class="close" @click="close" />
          <button v-if="historyStack.length > 0" @click="back()">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
          </button>
          <div v-else class="question">
            <img src="@/assets/images/icons/DecisionTree/question.svg" />
          </div>
          <p v-if="currentIndex.title.length < 27">{{ currentIndex.title }}</p>
          <p v-else class="long-title">{{ currentIndex.title }}</p>
        </div>

        <search-container>
          <input v-model="searchKeyword" type="text" placeholder="Search" />
        </search-container>

        <div class="md-content">
          <ul v-if="currentIndex.sub">
            <li
              v-for="(qa, key) in currentIndex.sub"
              :key="key"
              class="flex--row--align-center"
              @click="getSub(index[qa])"
            >
              <div class="qa-title-container">
                <p class="qa-title">
                  {{ index[qa].title }}
                </p>
                <p v-if="index[qa].subtitle" class="qa-subtitle">
                  {{ index[qa].subtitle }}
                </p>
              </div>
              <i class="fa fa-angle-right ml-auto" aria-hidden="true"></i>
            </li>
          </ul>
          <md-container v-else :md="mdToHtml(currentIndex.md)" />
        </div>

        <div class="footer">
          <div class="help flex--row--align-center">
            <p
              class="cursor-pointer"
              @click="showCustomerSupport = !showCustomerSupport"
            >
              Contact support
            </p>
            <p class="ml-2 mr-2">|</p>
            <a href="https://kb.myetherwallet.com/" target="_blank">
              <p>Help center</p>
            </a>
          </div>
          <button class="ml-auto" @click="top()">
            <img src="@/assets/images/icons/DecisionTree/home.svg" />
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import MdContainer from './components/MdContainer';
import SearchContainer from './components/SearchContainer';
import CustomerSupport from '@/components/CustomerSupport';
import qaIndex from '@/data/DecisionTree/MDIndex.js';
import marked from 'marked';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer,
    'search-container': SearchContainer,
    'customer-support': CustomerSupport
  },
  props: {},
  data() {
    return {
      index: qaIndex,
      currentIndex: qaIndex.ROOT,
      historyStack: [],
      showCustomerSupport: false,
      searchKeyword: ''
    };
  },
  watch: {
    searchKeyword(val) {
      if (val !== '') {
        console.log(val);
      }
    }
  },
  mounted() {
    this.toggle();
  },
  methods: {
    toggle() {
      this.$refs.DecisionTree.toggle();
    },
    close() {
      this.$refs.DecisionTree.hide();
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
    width: 400px;
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
