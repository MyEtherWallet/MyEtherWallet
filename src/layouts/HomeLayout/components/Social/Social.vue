<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>{{ $t("social.title") }}</h2>
            <h5>{{ $t("social.subheading") }}</h5>
          </div>
          <div class="icons">
            <a v-for="(link, index) in links" :href="link.to" target="_blank" :key="link.name + index">
              <div :class="link.name">
                <img :src="link.img">
                <p>{{ link.name | capitalize }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import github from '@/assets/images/icons/github.png'
import reddit from '@/assets/images/icons/reddit.png'
import slack from '@/assets/images/icons/slack.png'

export default {
  data () {
    return {
      links: [
        {
          img: slack,
          to: 'https://www.google.com',
          name: 'slack'
        },
        {
          img: reddit,
          to: 'https://www.reddit.com/r/myetherwallet',
          name: 'reddit'
        },
        {
          img: github,
          to: 'https://www.github.com/myetherwallet',
          name: 'github'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "Social.scss";
</style>
