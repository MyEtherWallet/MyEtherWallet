<template>
  <div>
    <the-layout-header title="About us - Team" />
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
          <v-img :src="t.img" />
          <div class="mt-6 title">{{ t.name }}</div>
          <div class="grey--text text--lighten-1 mt-1">{{ t.title }}</div>
          <div class="py-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import AppBlockTitle from '@/core/components/AppBlockTitle';
import axios from 'axios';

export default {
  name: 'TheTeamLayout',
  components: { TheLayoutHeader, AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Meet the #MEWteam',
      description:
        'MyEtherWallet is a group of talented, inspiring, and hardworking individuals from around the world. We share the passion to code, create, and ultimately build an open, accessible and fair financial future, one piece of software at a time.',
      centered: true
    },
    team: {},
    loadingTeam: true
  }),
  created() {
    this.fetchTeam();
  },
  methods: {
    fetchTeam() {
      axios
        .get(
          'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/team.json'
        )
        .then(res => {
          this.loadingTeam = false;
          this.team = res.data.Team;
        });
    }
  }
};
</script>
