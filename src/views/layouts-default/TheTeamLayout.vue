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

import Kosala from '@/assets/images/team/kosala.jpg';
import Brian from '@/assets/images/team/brian.jpg';
import Olga from '@/assets/images/team/olga.jpg';
import Alex from '@/assets/images/team/alex.jpg';
import Misha from '@/assets/images/team/misha.jpg';
import Yel from '@/assets/images/team/gamaliel.jpg';
import Gage from '@/assets/images/team/gage.jpg';
import placeholder from '@/assets/images/team/placeholder.jpg';
import doggiePlaceholder from '@/assets/images/team/doggie.jpg';
import David from '@/assets/images/team/david.jpg';
import Brittany from '@/assets/images/team/brittany.jpg';
import Richie from '@/assets/images/team/richie.jpg';
import Semaja from '@/assets/images/team/semaja.jpg';
import Katya from '@/assets/images/team/katya.jpg';

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
    team: [
      { img: Kosala, name: 'Kosala', title: 'Founder/CEO' },
      { img: Brian, name: 'Brian', title: 'COO' },
      { img: Olga, name: 'Olga', title: 'VP' },
      { img: Alex, name: 'Alex', title: 'Director of Mobile' },
      { img: Misha, name: 'Misha', title: 'Lead Mobile Developer' },
      { img: Yel, name: 'Yel', title: 'Lead Web Developer' },
      { img: Gage, name: 'Gage', title: 'Full-Stack Developer' },
      { img: placeholder, name: 'Jessica', title: 'Full-Stack Developer' },
      { img: placeholder, name: 'Ryan', title: 'Full-Stack Developer' },
      { img: placeholder, name: 'Andrew', title: 'Full-Stack Developer' },
      { img: David, name: 'David', title: 'Front-End Developer' },
      { img: doggiePlaceholder, name: 'Russell', title: 'Product UI/UX' },
      { img: Brittany, name: 'Brittany', title: 'Operations Manager' },
      { img: placeholder, name: 'Vince', title: 'Marketing Manager' },
      { img: Katya, name: 'Katya', title: 'Community and Content Lead' },
      { img: Semaja, name: 'Semaja', title: 'Blockchain Community Specialist' },
      {
        img: placeholder,
        name: 'Jazmine',
        title: 'Blockchain Community Specialist'
      },
      {
        img: placeholder,
        name: 'Michael',
        title: 'Blockchain Community Specialist'
      },
      {
        img: Richie,
        name: 'Duke & Richie Wolf',
        title: 'Blockchain Community Specialist'
      },
      {
        img: placeholder,
        name: 'Brionne',
        title: 'Blockchain Community Specialist'
      }
    ]
  })
};
</script>
