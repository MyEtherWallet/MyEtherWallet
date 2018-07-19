<template>
  <div class="card-block">
    <h4 class="title">{{ title }}</h4>
    <div class="questions">
      <a v-for="(item, index) in articles" :href="item.to" :key="item+index+`${title}`" target="_blank">
        <p>
          {{item.title}}
        </p>
      </a>
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
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "FaqBlock.scss";
</style>
