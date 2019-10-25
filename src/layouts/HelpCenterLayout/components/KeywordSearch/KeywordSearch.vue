<template>
  <div class="keyword-search">
    <div class="wrap">
      <div class="page-container">
        <div class="block-title">
          <h1>{{ $t('helpCenter.keyword-search.lost') }}</h1>
        </div>

        <div class="search-form mew-custom-form__search">
          <div class="search-input-block">
            <input
              type="text"
              name=""
              placeholder="Search the keyword here..."
            />
          </div>
        </div>

        <div class="searchable-contents">
          <p>
            {{ $t('helpCenter.keyword-search.top-searches') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'KeywordSearch.scss';
</style>
