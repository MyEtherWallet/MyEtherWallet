<template>
  <div class="help-center">
    <div class="wrap">
      <div>
        <keyword-search />
      </div>
      <div>
        HelpCenterLayout
      </div>
    </div>
  </div>
</template>

<script>
import KeywordSearch from './components/KeywordSearch'
export default {
  components: {
    'keyword-search': KeywordSearch
  },
  data () {
    return {
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HelpCenterLayout.scss';
</style>
