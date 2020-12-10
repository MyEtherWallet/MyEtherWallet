<template>
  <div class="decision-tree-container">
    <button :class="button ? 'active' : ''" class="show-button" @click="toggle">
      <img src="@/assets/images/icons/DecisionTree/need-help.svg" />
      <p>{{ $t('common.decision-tree.quick-help') }}</p>
    </button>

    <v-dialog
      v-model="dialog"
      width="500"
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
          <div class="tree-title">
            <div v-if="historyStack.length > 0" class="breadcrumb hidden">
              <p v-for="h in historyStack" :key="h.key">
                <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                {{ h.title }}
              </p>
            </div>
            <p v-if="currentIndex.title.length < 27">
              {{ currentIndex.title }}
            </p>
            <p v-else class="long-title">{{ currentIndex.title }}</p>
          </div>
        </div>

        <div class="breadcrumb-container">
          <i class="fa fa-home" aria-hidden="true"></i>&nbsp;{{
            $t('common.home')
          }}
          <span v-for="h in historyStackFiltered" :key="h.key">
            <i class="fa fa-angle-right" aria-hidden="true"></i>
            {{ h.breadcrumb }}
          </span>
          <span v-if="currentIndex.breadcrumb">
            <i class="fa fa-angle-right" aria-hidden="true"></i>
            {{ currentIndex.breadcrumb }}
          </span>
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
                  {{ $t('common.decision-tree.subcategories') }}
                </p>
                <p v-if="index[qa].md" class="sub-categories">
                  <i class="fa fa-book" aria-hidden="true"></i>
                  {{ $t('common.read') }}
                </p>
                <p class="qa-title">{{ index[qa].title }}</p>
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
              {{ $t('common.contact-support') }}
            </p>
            <p class="ml-2 mr-2">|</p>
            <a
              href="https://kb.myetherwallet.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>{{ $t('common.help-center') }}</p>
            </a>
          </div>
          <button v-if="historyStack.length > 0" class="ml-auto" @click="top()">
            <img src="@/assets/images/icons/DecisionTree/home.svg" />
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import MdContainer from './components/MdContainer/MdContainer';
import mdIndex from './data/MDIndex.js';
import marked from 'marked';

export default {
  name: 'DecisionTree',
  components: {
    'md-container': MdContainer
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    historyStackFiltered() {
      const filtered = {};
      for (const h in this.historyStack) {
        if (this.historyStack[h].breadcrumb) filtered[h] = this.historyStack[h];
      }
      return filtered;
    }
  },
  beforeMount() {
    // Push all searchable items to local variable
    for (const key in mdIndex) {
      if (!mdIndex[key].nosearch) {
        const index = {
          value: mdIndex[key],
          name: mdIndex[key].title + ' ' + mdIndex[key].subtitle
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
      this.currentIndex = mdIndex.ROOT;
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
