<template>
  <div class="social">
    <div class="wrap">
      <div class="page-container">
        <div class="flex-col-vertical-center content">
          <div class="title">
            <h2>{{ $t('home.social.title') }}</h2>
          </div>
          <div class="icons">
            <div v-for="(link, index) in links" :key="link.name + index">
              <a
                :href="link.to"
                :aria-label="link.name"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div :class="link.name">
                  <img :src="link.img" alt />
                  <p class="link-name">{{ link.name | capitalize }}</p>
                </div>
              </a>
            </div>
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
import vkontakte from '@/assets/images/icons/vkontakte.png';
import mewtopia from '@/assets/images/icons/mewtopia.png';
import youtube from '@/assets/images/icons/youtube.png';
import instagram from '@/assets/images/icons/instagram.png';

export default {
  data() {
    return {
      links: [
        {
          img: facebook,
          to: 'https://www.facebook.com/MyEtherWallet',
          name: this.$t('home.social.facebook')
        },
        {
          img: twitter,
          to: 'https://twitter.com/myetherwallet',
          name: this.$t('home.social.twitter')
        },
        {
          img: medium,
          to: 'https://medium.com/@myetherwallet',
          name: this.$t('home.social.medium')
        },
        {
          img: reddit,
          to: 'https://www.reddit.com/r/myetherwallet',
          name: this.$t('home.social.reddit')
        },
        {
          img: github,
          to: 'https://www.github.com/myetherwallet',
          name: this.$t('home.social.github')
        },
        {
          img: vkontakte,
          to: 'https://vk.com/public190491855',
          name: this.$t('home.social.vkontakte')
        },
        {
          img: youtube,
          to: 'https://www.youtube.com/c/myetherwallet',
          name: this.$t('home.social.youtube')
        },
        {
          img: mewtopia,
          to: 'https://www.mewtopia.com',
          name: this.$t('home.social.mewtopia')
        },
        {
          img: instagram,
          to: 'https://www.instagram.com/myetherwallet',
          name: this.$t('home.social.instagram')
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'Social.scss';
</style>
