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
              <h6>{{ member.otherInfo }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '../InformationPages/Components/TitleTextContentsLayout';

import kosala from '@/assets/images/team/Kosala.png';
import brian from '@/assets/images/team/Brian.png';
import olchik from '@/assets/images/team/Olga.png';
import stephen from '@/assets/images/team/Stephen.png';
import richie from '@/assets/images/team/Richie.png';
import brittany from '@/assets/images/team/Brittany.png';
import yel from '@/assets/images/team/Gamaliel.png';
import steve from '@/assets/images/team/Steve.png';
import jack from '@/assets/images/team/Jack.png';
import david from '@/assets/images/team/David.png';
import samantha from '@/assets/images/team/Samantha.png';
import alex from '@/assets/images/team/Alex.png';
import misha from '@/assets/images/team/Misha.png';
import katya from '@/assets/images/team/Katya.png';

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
          name: 'Olchik',
          position: 'VP',
          img: olchik
        },
        {
          name: 'Stephen',
          position: 'Customer Support',
          otherInfo: '#MEWForce',
          img: stephen
        },
        {
          name: 'Duke & Richie Wolf',
          position: 'Blockchain Specialist',
          otherInfo: '#MEWForce',
          img: richie
        },
        {
          name: 'Brittany',
          position: 'Blockchain Specialist',
          otherInfo: '#MEWForce',
          img: brittany
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
          name: 'Jack',
          position: 'UI/UX Designer',
          img: jack
        },
        {
          name: 'David',
          position: 'Front-End Developer',
          img: david
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
          name: 'Katya',
          position: 'Community Advocate',
          img: katya
        },
        {
          name: 'Samantha',
          position: 'Media & Communication Officer',
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
