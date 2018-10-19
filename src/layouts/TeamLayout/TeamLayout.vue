<template>
  <div class="team">
    <div class="wrap">
      <div class="page-container">

        <div class="page-header">
          <h1>{{ $t("team.title") }}</h1>
          <p>
            {{ $t("team.desc") }}
          </p>
        </div>

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
              <h6 v-if="member.hashtag">{{ member.hashtag }}</h6>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
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
          name: 'Olga Kupchevskaya',
          position: 'VP',
          img: olchik
        },
        {
          name: 'Stephen Wooldridge II',
          position: 'Customer Support',
          hashtag: '#MEWForce',
          img: stephen
        },
        {
          name: 'Duke & Richie Wolf',
          position: 'Customer Support',
          hashtag: '#MEWForce',
          img: richie
        },
        {
          name: 'Brittany Evans',
          position: 'Customer Support',
          hashtag: '#MEWForce',
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
          position: 'Media & Communications Officer',
          img: samantha
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TeamLayout-desktop.scss';
@import 'TeamLayout-tablet.scss';
@import 'TeamLayout-mobile.scss';
</style>
