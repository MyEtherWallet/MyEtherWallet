<template>
  <div class="mew-component--decision-tree decision-tree-container">
    <button
      :class="button ? 'active' : ''"
      class="show-button"
      @click="dialog = true"
    >
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
          <v-btn
            v-if="historyStack.length > 0"
            class="mr-2"
            outlined
            x-small
            fab
            color="white"
            @click="back()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <div v-else class="mr-2">
            <img src="@/assets/images/icons/DecisionTree/question.svg" />
          </div>
          <div class="tree-title">
            <div v-if="historyStack.length > 0" class="breadcrumb hidden">
              <div v-for="h in historyStack" :key="h.key">
                <i class="fa fa-chevron-circle-down" aria-hidden="true"></i>
                {{ h.title }}
              </div>
            </div>
            <div v-if="currentIndex.title.length < 27">
              {{ currentIndex.title }}
            </div>
            <div v-else class="long-title">{{ currentIndex.title }}</div>
          </div>

          <v-btn icon class="ml-auto" @click="dialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="breadcrumb-container d-flex -align-center">
          <div class="d-flex align-center">
            <v-icon small class="mr-1">mdi-home</v-icon>{{ $t('common.home') }}
          </div>
          <div v-for="h in historyStackFiltered" :key="h.key">
            <v-icon small class="ml-auto">mdi-chevron-right</v-icon>
            {{ h.breadcrumb }}
          </div>
          <div v-if="currentIndex.breadcrumb">
            <v-icon small class="ml-auto">mdi-chevron-right</v-icon>
            {{ currentIndex.breadcrumb }}
          </div>
        </div>

        <div ref="mdList" class="md-content">
          <ul v-if="currentIndex.sub">
            <li
              v-for="(qa, key) in currentIndex.sub"
              :key="key"
              class="d-flex align-center"
              @click="getSub(index[qa])"
            >
              <div class="qa-title-container">
                <p v-if="!index[qa].md" class="sub-categories">
                  <v-icon small color="#bfbfbf"
                    >mdi-format-list-bulleted-square</v-icon
                  >
                  {{ $t('common.decision-tree.subcategories') }}
                </p>
                <p v-if="index[qa].md" class="sub-categories">
                  <v-icon small color="#bfbfbf"
                    >mdi-file-document-outline</v-icon
                  >
                  {{ $t('common.read') }}
                </p>
                <p class="qa-title">{{ index[qa].title }}</p>
                <p v-if="index[qa].subtitle" class="qa-subtitle">
                  {{ index[qa].subtitle }}
                </p>
              </div>

              <v-icon class="ml-auto">mdi-chevron-right</v-icon>
            </li>
          </ul>
          <md-container v-else :md="mdToHtml(currentIndex.md)" />
        </div>

        <div class="footer d-flex align-center">
          <div class="help d-flex align-center">
            <a
              class="cursor-pointer white--text"
              href="mailto:support@myetherwallet.com"
              target="_blank"
            >
              {{ $t('common.contact-support') }}
            </a>
            <div class="ml-2 mr-2">|</div>
            <a
              href="https://kb.myetherwallet.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>{{ $t('common.help-center') }}</div>
            </a>
          </div>

          <v-btn
            v-if="historyStack.length > 0"
            x-small
            outlined
            fab
            color="white"
            class="ml-auto"
            @click="top()"
          >
            <v-icon>mdi-home</v-icon>
          </v-btn>
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
  name: 'ModuleDecisionTree',
  components: {
    MdContainer
  },
  props: {
    button: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      index: mdIndex,
      currentIndex: mdIndex.ROOT,
      historyStack: [],
      searchOptions: []
    };
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
