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
import David from '@/assets/images/team/david.jpg';
import Brittany from '@/assets/images/team/brittany.jpg';
import Richie from '@/assets/images/team/richie.jpg';
import Semaja from '@/assets/images/team/semaja.jpg';
import Katya from '@/assets/images/team/katya.jpg';
import Raden from '@/assets/images/team/raden.jpg';
import Vince from '@/assets/images/team/vince.jpg';
import Michael from '@/assets/images/team/michael.jpg';
import Chindalath from '@/assets/images/team/chindalath.jpg';
import Andrew from '@/assets/images/team/andrew.jpg';
import Jazmine from '@/assets/images/team/jazmine.jpg';
import Jason from '@/assets/images/team/jason.jpg';
import Brionne from '@/assets/images/team/brionne.jpg';
import Russell from '@/assets/images/team/russell.jpg';
import Marcus from '@/assets/images/team/marcus.jpg';
import AndrewDao from '@/assets/images/team/andrew-dao.jpg';
import Christian from '@/assets/images/team/christian.jpg';

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
      { img: David, name: 'David', title: 'Front-End Developer' },
      { img: Raden, name: 'Raden', title: 'Full-Stack Developer' },
      { img: Andrew, name: 'Andrew', title: 'Full-Stack Developer' },
      { img: Semaja, name: 'Semaja', title: 'QA Specialist' },
      { img: Russell, name: 'Russell', title: 'Product UI/UX' },
      { img: Brittany, name: 'Brittany', title: 'Operations Manager' },
      { img: Vince, name: 'Vince', title: 'Marketing Manager' },
      { img: Katya, name: 'Katya', title: 'Community and Content Lead' },
      {
        img: Jason,
        name: 'Jason',
        title: 'Social Media Specialist'
      },
      {
        img: Brionne,
        name: 'Brionne',
        title: 'Educational Content Writer'
      },
      { img: Marcus, name: 'Marcus', title: 'Blockchain Community Specialist' },
      {
        img: Chindalath,
        name: 'Chindalath',
        title: 'Blockchain Community Specialist'
      },
      {
        img: AndrewDao,
        name: 'Andrew Dao',
        title: 'Blockchain Community Specialist'
      },
      {
        img: Jazmine,
        name: 'Jazmine',
        title: 'Blockchain Community Specialist'
      },
      {
        img: Michael,
        name: 'Michael',
        title: 'Blockchain Community Specialist'
      },
      {
        img: Richie,
        name: 'Wolfgang',
        title: 'Blockchain Community Specialist'
      },
      {
        img: Christian,
        name: 'Christian',
        title: 'Blockchain Community Specialist'
      },
      {
        img: placeholder,
        name: 'Lily',
        title: 'Executive Assistant'
      }
    ]
  })
};
</script>
