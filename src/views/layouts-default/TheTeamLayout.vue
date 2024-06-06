<template>
  <div>
    <the-layout-header title="Join us" class="pt-16" />
    <div class="py-7" />
    <v-container>
      <v-sheet max-width="700px" class="mx-auto">
        <app-block-title no-page-title :data="titleData" />
      </v-sheet>
    </v-container>
    <div class="py-5" />
    <v-container class="px-0">
      <v-row class="mx-0">
        <v-col
          v-for="t in team"
          :key="t.key"
          cols="12"
          md="6"
          lg="4"
          class="px-0 text-center"
        >
          <v-img :src="t.img" style="background-color: #79e2e1" />
          <div class="mt-6 title">{{ t.name }}</div>
          <div class="grey--text text--lighten-1 mt-1">{{ t.title }}</div>
          <div class="py-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

import TheLayoutHeader from '@/views/components-default/TheLayoutHeader.vue';

// data
const titleData = {
  textProps: '',
  toptitle: '',
  title: 'team.title',
  description: 'team.description',
  centered: true
};
const team = ref([]);
const loadingTeam = ref(true);

// onMounted
onMounted(() => {
  fetchTeam();
});

// methods
const fetchTeam = () => {
  axios
    .get(
      'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/team.json'
    )
    .then(res => {
      loadingTeam.value = false;
      team.value = res.data.Team;
    });
};
</script>
