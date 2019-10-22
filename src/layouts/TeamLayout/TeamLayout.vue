<template>
  <div>
    <div>
      <div class="page-container">
        <title-text-contents :options="titleAndTextContents" />

        <div class="team-info">
          <div v-for="member in members" :key="member.name" class="member">
            <img :src="member.img" :alt="member.name" :title="member.name" />
            <div class="text">
              <h4>{{ member.name }}</h4>
              <h6>{{ member.position }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '../InformationPages/Components/TitleTextContentsLayout';

import kosala from '@/assets/images/team/Kosala.jpg';
import brian from '@/assets/images/team/Brian.jpg';
import olchik from '@/assets/images/team/Olga.jpg';
import stephen from '@/assets/images/team/Stephen.jpg';
import richie from '@/assets/images/team/Richie.jpg';
import brittany from '@/assets/images/team/Brittany.jpg';
import yel from '@/assets/images/team/Gamaliel.jpg';
import steve from '@/assets/images/team/Steve.jpg';
import gage from '@/assets/images/team/Gage.jpg';
import jack from '@/assets/images/team/Jack.jpg';
import david from '@/assets/images/team/David.jpg';
import samantha from '@/assets/images/team/Samantha.jpg';
import alex from '@/assets/images/team/Alex.jpg';
import misha from '@/assets/images/team/Misha.jpg';
import katya from '@/assets/images/team/Katya.jpg';
import semaja from '@/assets/images/team/Semaja.jpg';

export default {
  components: {
    'title-text-contents': TitleTextContentsLayout
  },
  data() {
    return {
      titleAndTextContents: {
        title: this.$t('team.title'),
        boldSubTitle: '',
        textContent: [this.$t('team.desc')]
      },
      members: [
        {
          name: 'Kosala',
          position: 'Founder/CEO',
          img: kosala
        },
        {
          name: 'Brian',
          position: 'COO',
          img: brian
        },
        {
          name: 'Olga',
          position: 'VP',
          img: olchik
        },
        {
          name: 'Alex',
          position: 'Director of Mobile',
          img: alex
        },
        {
          name: 'Misha',
          position: 'Lead Mobile Developer',
          img: misha
        },
        {
          name: 'Yel',
          position: 'Full-Stack Developer',
          img: yel
        },
        {
          name: 'Steve',
          position: 'Full-Stack Developer',
          img: steve
        },
        {
          name: 'Gage',
          position: 'Full-Stack Developer',
          img: gage
        },
        {
          name: 'David',
          position: 'Front-End Developer',
          img: david
        },
        {
          name: 'Jack',
          position: 'Head of UI/UX Design',
          img: jack
        },
        {
          name: 'Stephen',
          position: 'Educational Project Lead',
          img: stephen
        },
        {
          name: 'Brittany',
          position: 'Operations Coordinator',
          img: brittany
        },
        {
          name: 'Duke & Richie Wolf',
          position: 'Blockchain Community Specialist',
          img: richie
        },
        {
          name: 'Semaja',
          position: 'Blockchain Community Specialist',
          img: semaja
        },
        {
          name: 'Katya',
          position: 'Community Advocate',
          img: katya
        },
        {
          name: 'Samantha',
          position: 'Communications and Media',
          img: samantha
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TeamLayout.scss';
</style>
