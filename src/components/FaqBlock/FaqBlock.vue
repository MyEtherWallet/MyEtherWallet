<template>
  <div class="card-block">
    <h4 class="title">{{ title }}</h4>
    <div class="questions">
      <router-link v-for="(item, index) in articles" :to="item.to" :key="item+index+`${title}`">
        <p>
          {{ $t(`${"faqs.article" + (index + 1)}`) }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqBlock',
  props: [
    'title',
    'articles'
  ],
  data: function () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FaqBlock.scss";
</style>
