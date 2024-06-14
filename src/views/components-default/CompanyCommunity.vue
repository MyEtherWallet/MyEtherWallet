<template>
  <div class="company-community">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
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
              :title="$t('aboutUs.get-answers.btn-title')"
              btn-size="xlarge"
            />
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
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
                color="textDark"
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

<script setup>
import { useI18n } from 'vue-i18n-composable';
import Telegram from '@/assets/images/icons/icon-telegram-dark.svg';
import Slack from '@/assets/images/icons/icon-slack-dark.svg';
import Reddit from '@/assets/images/icons/icon-reddit-dark.svg';
import Github from '@/assets/images/icons/icon-github-dark.svg';

// injections
const { t } = useI18n();

// data
const titleData = {
  title: t('aboutUs.get-answers.title'),
  description: t('aboutUs.get-answers.description'),
  centered: false
};

const titleDataRight = {
  title: t('aboutUs.community.title'),
  description: t('aboutUs.community.description'),
  centered: false
};

const icons = [
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
];
</script>
