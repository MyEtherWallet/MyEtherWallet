<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-sheet max-width="400px">
            <v-img
              src="@/assets/images/icons/icon-message2-mew.svg"
              max-width="65px"
              max-height="65px"
              aspect-ratio="1"
              class="mb-5"
            />
            <app-block-title no-page-title :data="titleData" />
            <mew-button
              class="mt-5"
              btn-link="https://help.myetherwallet.com/en/"
              :has-full-width="false"
              title="Visit Help Center"
              btn-size="xlarge"
            />
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet max-width="400px">
            <v-img
              src="@/assets/images/icons/icon-community-mew.svg"
              max-width="65px"
              max-height="65px"
              aspect-ratio="1"
              class="mb-5"
            />
            <app-block-title no-page-title :data="titleDataRight" />
            <div class="d-flex align-center mt-5">
              <v-btn
                v-for="(i, key) in icons"
                :key="key"
                text
                icon
                color="titlePrimary"
                class="mr-4"
                :href="i.link"
                target="_blank"
              >
                <img :src="i.img" height="27px" />
              </v-btn>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';
import Telegram from '@/assets/images/icons/icon-telegram-dark.svg';
import Slack from '@/assets/images/icons/icon-slack-dark.svg';
import Reddit from '@/assets/images/icons/icon-reddit-dark.svg';
import Github from '@/assets/images/icons/icon-github-dark.svg';
export default {
  components: { AppBlockTitle },
  data: () => ({
    icons: [
      {
        link: 'https://t.me/myetherwallet',
        img: Telegram
      },
      {
        link: '#',
        img: Slack
      },
      {
        link: 'https://www.reddit.com/r/MyEtherWallet/',
        img: Reddit
      },
      {
        link: 'https://github.com/myetherwallet',
        img: Github
      }
    ],
    titleData: {
      title: 'Get answers to questions',
      description:
        'See our Help Center for assistance with using MEW, sending transactions, swapping, DeFi, DApps, and much more.',
      centered: false
    },
    titleDataRight: {
      title: 'Join the MEW community',
      description:
        'Follow us on our social channels for Ethereum news, guides, security tips, and support from other MEW users.',
      centered: false
    }
  })
};
</script>
