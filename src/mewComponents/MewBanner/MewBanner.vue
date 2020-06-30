<template>
  <div
    class="mew-banner full-width font-weight-medium d-flex flex-column align-center justify-center"
    :style="{backgroundImage: `url(${banner})` }"
  >
    <div
      @click="closeBanner"
      class="cursor-pointer error--text exit-container"
    >
      <v-icon
        class="mr-2"
        color="error"
      >
        mdi-close-circle-outline
      </v-icon>
      <span>{{ textObj.exit }}</span>
    </div>
    <div class="d-flex text-center align-center justify-center white--text flex-column">
      <span class="mew-subtitle">{{ textObj.title }}</span>
      <span class="mew-body">{{ textObj.subtext }} </span>
    </div>
  </div>
</template>

<script>
import placeholder from '@/assets/images/bg.png'

export default {
  data() {
    return  {
      banner: this.bannerImg ? this.bannerImg : placeholder
    }
  },
  props: {
    /**
     * Text obj contains title, subtext and exit text , i.e. { title: '' , subtext: '', exit: ''}
     */
    textObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /**
     * Banner image url.
     */
    bannerImg: {
      type: [ String, Array],
      default: ''
    }
  },
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    }
  }
}
</script>

<style lang="scss" scoped>
.mew-banner {
  background-size: contain;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  min-height: 190px;

  .exit-container {
    position: absolute;
    right: 80px;
    top: 60px;
  }
}
</style>