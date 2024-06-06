<template>
  <div class="company-what-is-mew">
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="5">
          <app-block-title no-page-title :data="titleData" class="pr-8" />
        </v-col>
        <v-col cols="12" md="7">
          <v-img
            src="@/assets/images/backgrounds/bg-spaceman.jpg"
            max-width="100%"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n-composable';

// injections
const { t } = useI18n();

// data
const titleData = {
  textProps: '',
  toptitle: '',
  title: t('aboutUs.what-is-mew.title'),
  description: t('aboutUs.what-is-mew.description'),
  centered: false
};
</script>
