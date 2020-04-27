<template>
  <div>
    <PageTitle title="About us - Team" />
    <div class="py-7" />
    <v-sheet max-width="700px" class="mx-auto">
      <BlockTitle :data="titleData" />
    </v-sheet>
    <div class="py-5" />
    <v-container>
      <v-row class="mx-0">
        <v-col v-for="t in team" :key="t.key" cols="4" class="px-0 text-center">
          <v-img :src="t.img" />
          <div class="mt-6 title font-weight--500">{{ t.name }}</div>
          <div class="grey--text text--lighten-1 mt-1">{{ t.title }}</div>
          <div class="py-6" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PageTitle from '@/web/components/PageTitle';
import BlockTitle from '@/web/components/BlockTitle';

import Kosala from '@/assets/images/team/kosala.jpg';
import Brian from '@/assets/images/team/brian.jpg';
import Olga from '@/assets/images/team/olga.jpg';
import Alex from '@/assets/images/team/alex.jpg';
import Misha from '@/assets/images/team/misha.jpg';
import Yel from '@/assets/images/team/gamaliel.jpg';
import Steve from '@/assets/images/team/steve.jpg';
import Gage from '@/assets/images/team/gage.jpg';
import Jessica from '@/assets/images/team/jessica.jpg';
import David from '@/assets/images/team/david.jpg';
import Jack from '@/assets/images/team/jack.jpg';
import Stephen from '@/assets/images/team/stephen.jpg';
import Brittany from '@/assets/images/team/brittany.jpg';
import Richie from '@/assets/images/team/richie.jpg';
import Semaja from '@/assets/images/team/semaja.jpg';
import Katya from '@/assets/images/team/katya.jpg';
import Samantha from '@/assets/images/team/samantha.jpg';

export default {
  components: { PageTitle, BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Meet the #MEWteam',
      description:
        'At dolor et sit erat lorem at, dolor magna sed eirmod eos magna takimata ipsum. Eos rebum nonumy ea sit, nonumy sed duo no gubergren sea rebum, stet ut aliquyam amet gubergren erat. Voluptua lorem diam et ea ut, et sanctus justo ea aliquyam vero ipsum est amet sed.',
      centered: true
    },
    team: [
      { img: Kosala, name: 'Kosala', title: 'Founder/CEO' },
      { img: Brian, name: 'Brian', title: 'COO' },
      { img: Olga, name: 'Olga', title: 'VP' },
      { img: Alex, name: 'Alex', title: 'Director of Mobile' },
      { img: Misha, name: 'Misha', title: 'Lead Mobile Developer' },
      { img: Yel, name: 'Yel', title: 'Full-Stack Developer' },
      { img: Steve, name: 'Steve', title: 'Full-Stack Developer' },
      { img: Gage, name: 'Gage', title: 'Full-Stack Developer' },
      { img: Jessica, name: 'Jessica', title: 'Full-Stack Developer' },
      { img: David, name: 'David', title: 'Front-End Developer' },
      { img: Jack, name: 'Jack', title: 'Head of UI/UX Design' },
      { img: Stephen, name: 'Stephen', title: 'Educational Project Lead' },
      { img: Brittany, name: 'Brittany', title: 'Operations Coordinator' },
      {
        img: Richie,
        name: 'Duke & Richie Wolf',
        title: 'Blockchain Community Specialist'
      },
      { img: Semaja, name: 'Semaja', title: 'Blockchain Community Specialist' },
      { img: Katya, name: 'Katya', title: 'Community Advocate' },
      { img: Samantha, name: 'Samantha', title: 'Communications and Media' }
    ]
  })
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

a {
  text-decoration: underline;
}
</style>
