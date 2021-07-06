<template>
  <v-container>
    <div class="py-7" />
    <v-sheet align="center">
      <h2 class="titlePrimary--text pb-5">Join MEW Community</h2>
    </v-sheet>
    <v-sheet color="transparent" max-width="700px" class="mx-auto">
      <v-row dense align="center" justify="center">
        <v-col
          v-for="(p, key) in socials"
          :key="key"
          align="center"
          cols="auto"
          sm="4"
          md="4"
          lg="1"
        >
          <a :href="p.link" target="_blank">
            <v-img :src="p.img" max-height="45px" max-width="45px" />
          </a>
          <div class="pt-2 textSecondary--text primary--text mew-label">
            {{ p.label }}
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  name: 'HomeSocials',
  components: {},
  data: () => ({
    socials: [
      {
        img: require('@/assets/images/icons/socials/facebook.png'),
        link: 'https://www.facebook.com/MyEtherWallet',
        label: 'Facebook'
      },
      {
        img: require('@/assets/images/icons/socials/twitter.png'),
        link: 'https://twitter.com/myetherwallet',
        label: 'Twitter'
      },
      {
        img: require('@/assets/images/icons/socials/medium.png'),
        link: 'https://medium.com/@myetherwallet',
        label: 'Medium'
      },
      {
        img: require('@/assets/images/icons/socials/reddit.png'),
        link: 'https://www.reddit.com/r/MyEtherWallet/',
        label: 'Reddit'
      },
      {
        img: require('@/assets/images/icons/socials/github.png'),
        link: 'https://github.com/myetherwallet',
        label: 'Github'
      },
      {
        img: require('@/assets/images/icons/socials/vkontakte.png'),
        link: 'https://vk.com/public190491855',
        label: 'Vkontakte'
      },
      {
        img: require('@/assets/images/icons/socials/youtube.png'),
        link: 'https://www.youtube.com/channel/UCQU5QbObwmaHNEMsuX3uQKA',
        label: 'Youtube'
      },
      {
        img: require('@/assets/images/icons/socials/mewtopia.png'),
        link: 'https://www.mewtopia.com/',
        label: 'Mewtopia'
      },
      {
        img: require('@/assets/images/icons/socials/instagram.png'),
        link: 'https://www.instagram.com/myetherwallet/',
        label: 'Instagram'
      },
      {
        img: require('@/assets/images/icons/socials/telegram.png'),
        link: 'https://t.me/myetherwallet',
        label: 'Telegram'
      }
    ]
  })
};
</script>
