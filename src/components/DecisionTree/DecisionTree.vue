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

        <div class="decision-tree-search">
          <model-select
            :options="searchOptions"
            v-model="searchSelect"
            placeholder="Search"
            class="search-results"
          >
          </model-select>
          <img class="magnifier" src="@/assets/images/icons/magnifier.svg" />
          <p class="clear">Clear</p>
        </div>

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
import CustomerSupport from '@/components/CustomerSupport';
import qaIndex from '@/data/DecisionTree/MDIndex.js';
import marked from 'marked';
import { ModelSelect } from 'vue-search-select';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer,
    'customer-support': CustomerSupport,
    'model-select': ModelSelect
  },
  props: {},
  data() {
    return {
      index: qaIndex,
      currentIndex: qaIndex.ROOT,
      historyStack: [],
      showCustomerSupport: false,
      searchOptions: [],
      searchSelect: {}
    };
  },
  watch: {
    searchSelect(val) {
      if (val.value) {
        this.getSearchItem(val.value);
        this.searchSelect = {};
      }
    }
  },
  beforeMount() {
    // Push all searchable items to local variable
    for (const key in qaIndex) {
      if (!qaIndex[key].nosearch) {
        const index = {
          value: qaIndex[key],
          text: qaIndex[key].title + ' ' + qaIndex[key].subtitle
        };
        this.searchOptions.push(index);
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
    getSearchItem(qa) {
      this.historyStack.push(this.currentIndex);
      this.currentIndex = qa;
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
@import '~@/scss/GlobalVariables';

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

  .decision-tree-search {
    .search {
      position: relative;
      height: 100%;

      &::after {
        position: absolute;
        top: 50px;
        left: 0;
        content: 'No results found.';
        text-align: center;
        width: 100%;
        height: 500px;
        z-index: 1;
        background-color: #f2f4fa;
        display: none;
        padding-top: 10px;
      }

      &.visible::after {
        display: block;
      }

      &.active {
        .text {
          color: #c3c3c3;
        }
      }

      input {
        background-color: transparent;
        padding-left: 45px;
        padding-right: 70px;
        border: 0;
        border-radius: 0;
        width: 100%;
      }

      .text {
        position: absolute;
        top: 13px;
        left: 45px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 330px;
        pointer-events: none;
        color: #b3b3b3;
      }

      .menu {
        position: absolute;
        top: 50px;
        left: 0;
        max-height: 500px;
        overflow-y: auto;
        width: 100%;
        background-color: #f2f4fa;
        z-index: 2;
        //height: 500px;

        .item {
          border-bottom: 1px solid #e0e0e0;
          padding: 13px 20px;
          padding-left: 50px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: #444444;
          line-height: 18px;
          position: relative;

          &::after {
            content: 'A';
            position: absolute;
            left: 18px;
            top: calc(50% - 10px);
            border-radius: 100%;
            background-color: #dcdcdc;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 12px;
          }

          &.selected {
            background-color: #ececec;
          }

          &:hover {
            background-color: #ececec;
          }
        }
      }
    }
  }
}
</style>
