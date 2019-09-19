<template>
  <div class="">
    <button :class="button ? 'active' : ''" class="show-button" @click="toggle">
      <img src="@/assets/images/icons/DecisionTree/need-help.svg" />
    </button>

    <customer-support :no-icon="true" :show="showCustomerSupport" />

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
          <multiselect
            v-model="searchSelect"
            :options="searchOptions"
            placeholder="Search"
            label="name"
            track-by="name"
          >
            <span slot="noResult" class="no-result"
              ><i class="fa fa-meh-o" aria-hidden="true"></i> Oops! No search
              results found.</span
            >
          </multiselect>
          <img class="magnifier" src="@/assets/images/icons/magnifier.svg" />
          <p class="clear">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
          </p>
        </div>

        <div ref="mdList" class="md-content">
          <ul v-if="currentIndex.sub">
            <li
              v-for="(qa, key) in currentIndex.sub"
              :key="key"
              class="flex--row--align-center"
              @click="getSub(index[qa])"
            >
              <div class="qa-title-container">
                <p v-if="!index[qa].md" class="sub-categories">
                  <i class="fa fa-align-left" aria-hidden="true"></i>
                  Subcategories
                </p>
                <p v-if="index[qa].md" class="sub-categories">
                  <i class="fa fa-book" aria-hidden="true"></i>
                  Read
                </p>
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
import Multiselect from 'vue-multiselect';
import MdContainer from './components/MdContainer';
import CustomerSupport from '@/components/CustomerSupport';
import qaIndex from '@/data/DecisionTree/MDIndex.js';
import marked from 'marked';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer,
    'customer-support': CustomerSupport,
    multiselect: Multiselect
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
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
      if (val !== null && val.value) {
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
          name: qaIndex[key].title + ' ' + qaIndex[key].subtitle
        };
        this.searchOptions.push(index);
      }
    }
  },
  mounted() {},
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
      this.$refs.mdList.scrollTop = 0;
    },
    getSub(qa) {
      this.historyStack.push(this.currentIndex);
      this.currentIndex = qa;
      this.$refs.mdList.scrollTop = 0;
    },
    back() {
      if (this.historyStack.length > 0) {
        this.currentIndex = this.historyStack.pop();
        this.$refs.mdList.scrollTop = 0;
      }
    },
    top() {
      this.currentIndex = qaIndex.ROOT;
      this.historyStack = [];
      this.$refs.mdList.scrollTop = 0;
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
  @media all and (min-width: $tablet-width + 1px) {
    .modal-dialog {
      width: 400px;
      position: fixed;
      right: 50px;
    }
  }

  .modal-content {
    border-radius: 10px;
  }

  .modal-body {
    background-color: transparent;
  }

  .decision-tree-search {
    .multiselect {
      height: 100%;
    }
    .multiselect__tags {
      height: 100%;
    }
    .multiselect__input {
      padding-left: 45px !important;
      padding-right: 50px !important;
      height: 100%;
      border: 0;
      background-color: transparent;
      width: 100% !important;
    }

    .multiselect__content-wrapper {
      overflow: auto;
      max-height: 500px !important;
      background-color: #f1f1f1;
      margin-top: 3px;
      box-shadow: 0px 4px 10px #00000033;
      @media all and (max-width: $tablet-width) {
        max-height: 400px !important;
      }
    }

    .multiselect__element {
      border-bottom: 1px solid #e0e0e0;

      cursor: pointer;

      span {
        display: block;
      }

      span span {
        padding: 10px 20px;
        font-size: 13px;
        font-weight: 400;
      }

      &:hover {
        background-color: #ececec;
        span {
          font-weight: 400;
        }
      }
    }

    .multiselect__placeholder {
      position: absolute;
      top: 14px;
      left: 45px;
    }

    .multiselect__content {
      width: 100%;
    }
    .no-result {
      padding: 10px 20px;
      display: block;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      width: 100%;
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      i {
        font-size: 22px;
        margin-right: 10px;
      }
    }
  }
}
</style>
