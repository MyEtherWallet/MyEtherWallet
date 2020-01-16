<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>{{ $t('home.social.title') }}</h2>
          </div>
          <div class="icons">
            <a
              v-for="(link, index) in links"
              :key="link.name + index"
              :href="link.to"
              :aria-label="link.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div :class="link.name">
                <img :src="link.img" alt />
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
import github from '@/assets/images/icons/github.png';
import reddit from '@/assets/images/icons/reddit.svg';
import medium from '@/assets/images/icons/medium.png';
import twitter from '@/assets/images/icons/twitter.jpg';
import facebook from '@/assets/images/icons/facebook.png';
import vkontakte from '@/assets/images/icons/11-512.png';

export default {
  data() {
    return {
      links: [
        {
          img: facebook,
          to: 'https://www.facebook.com/MyEtherWallet',
          name: 'Facebook'
        },
        {
          img: twitter,
          to: 'https://twitter.com/myetherwallet',
          name: 'Twitter'
        },
        {
          img: medium,
          to: 'https://medium.com/@myetherwallet',
          name: 'Medium'
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
        },
        {
          img: vkontakte,
          to: 'https://vk.com/public190491855',
          name: 'vkontakte'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'Social.scss';
</style>
