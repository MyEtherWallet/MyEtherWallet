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
          position: 'Educational Project Lead',
          img: stephen
        },
        {
          name: 'Duke & Richie Wolf',
          position: 'Blockchain Specialist',
          img: richie
        },
        {
          name: 'Brittany',
          position: 'Blockchain Specialist',
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
          name: 'Samantha',
          position: 'Customer Relation',
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
