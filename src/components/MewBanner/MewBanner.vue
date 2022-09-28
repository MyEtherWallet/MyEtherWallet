<template>
  <!--
  =====================================================================================
    Mew Banner
  =====================================================================================
  -->
  <v-container
    fluid
    :class="['mew-banner full-width font-weight-medium pa-6', !textObj.exit ? 'd-flex align-center' : '']"
    :style="{backgroundImage: `url(${banner})` }"
  >
    <!--
  =====================================================================================
    Exit Button
  =====================================================================================
  -->
    <v-row
      v-if="textObj.exit"
      @click="closeBanner"
      class="cursor-pointer error--text exit-container mr-3"
    >
      <v-col
        class="d-flex justify-end align-center pa-0"
        offset-md="6"
      >
        <v-icon
          class="mr-2"
          color="error"
        >
          mdi-close-circle-outline
        </v-icon>
        <span>{{ textObj.exit }}</span>
      </v-col>
    </v-row>
    <!--
  =====================================================================================
    Banner Title and Subtext
  =====================================================================================
  -->
    <v-row class="d-flex text-center align-center justify-center white--text flex-column pa-4">
      <v-col class="pa-0">
        <span class="mew-subtitle">{{ textObj.title }}</span>
      </v-col>
      <v-col class="pa-0">
        <span class="mew-body">{{ textObj.subtext }} </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import placeholder from '@/assets/images/bg.png'

export default {
  name: 'MewBanner',
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
      default: () => {
        return {title: '', subtext: '', exit: ''};
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
  background-size: cover;
  background-position: center center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  min-height: 150px;
  height: 100%;

  .exit-container {
    text-align: right;
  }
}
</style>