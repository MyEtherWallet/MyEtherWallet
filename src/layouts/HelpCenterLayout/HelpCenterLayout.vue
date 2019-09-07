<template>
  <div class="help-center">
    <div class="wrap">
      <keyword-search />

      <div class="page-container">
        <div class="content">
          <div class="switcher">
            <span
              :class="openFAQs ? 'active' : ''"
              @click="(openFAQs = true), (openCategories = false)"
              >FAQs</span
            >
            <span
              :class="openCategories ? 'active' : ''"
              @click="(openFAQs = false), (openCategories = true)"
              >Categories</span
            >
          </div>
          <div v-if="openFAQs"><faqs /></div>
          <div v-if="openCategories"><categories /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KeywordSearch from './components/KeywordSearch';
import FAQs from './components/FAQs';
import Categories from './components/Categories';

export default {
  components: {
    'keyword-search': KeywordSearch,
    faqs: FAQs,
    categories: Categories
  },
  data() {
    return {
      openFAQs: true,
      openCategories: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'HelpCenterLayout.scss';
</style>
