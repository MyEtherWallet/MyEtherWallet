<template>
  <div class="team">
    <div class="wrap">
      <div class="page-container">

        <title-text-contents :options="titleAndTextContents" />

        <div class="team-info">
          <div 
            v-for="member in members" 
            :key="member.name" 
            class="member">
            <img 
              :src="member.img" 
              :alt="member.name" 
              :title="member.name">
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

import kosala from '@/assets/images/team/Kosala.jpg';
import brian from '@/assets/images/team/Brian.jpg';
import olchik from '@/assets/images/team/Olga.jpg';
import stephen from '@/assets/images/team/Stephen.jpg';
import richie from '@/assets/images/team/Richie.jpg';
import brittany from '@/assets/images/team/Brittany.jpg';
import yel from '@/assets/images/team/Gamaliel.jpg';
import steve from '@/assets/images/team/Steve.jpg';
import jack from '@/assets/images/team/Jack.jpg';
import david from '@/assets/images/team/David.jpg';
import samantha from '@/assets/images/team/Samantha.jpg';

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
          name: 'Kosala Hemachandra',
          position: 'Founder/CEO',
          img: kosala
        },
        {
          name: 'Brian Norton',
          position: 'COO',
          img: brian
        },
        {
          name: 'Olchik Kupchevskaya',
          position: 'VP',
          img: olchik
        },
        {
          name: 'Stephen Wooldridge II',
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
          name: 'Brittany Evans',
          position: 'Blockchain Specialist',
          otherInfo: '#MEWForce',
          img: brittany
        },
        {
          name: 'Yel Padill',
          position: 'Full-Stack Developer',
          img: yel
        },
        {
          name: 'Steve Mieskoski',
          position: 'Full-Stack Developer',
          img: steve
        },
        {
          name: 'Jack Huang',
          position: 'UI/UX Designer',
          img: jack
        },
        {
          name: 'David Hong',
          position: 'Front-End Developer',
          img: david
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
