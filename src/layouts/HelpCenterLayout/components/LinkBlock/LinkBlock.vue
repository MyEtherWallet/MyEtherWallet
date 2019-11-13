<template functional>
  <div class="link-block wrap">
    <div class="block-icon"><img :src="props.content.icon" alt /></div>
    <div>
      <p class="block-title">{{ props.content.title }}</p>
      <p class="description">{{ props.content.description }}</p>
      <div v-if="props.content.email" class="email">
        <a
          :href="'mailto:' + props.content.email"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Email us</span>
          <i class="fa fa-long-arrow-right" aria-hidden="true" />
        </a>
      </div>
      <div v-if="props.content.social" class="social">
        <div v-for="social in props.content.social" :key="social.key">
          <a :href="social.link" target="_blank" rel="noopener noreferrer">
            <img :src="social.icon" alt />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'LinkBlock.scss';
</style>
