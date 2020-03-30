<template>
  <div>
    <div>
      <div class="page-container">
        <page-title
          :options="{
            title: $t('team.title'),
            boldSubTitle: '',
            textContent: [$t('team.desc')]
          }"
        />

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
import PageTitleComponent from '@/components/PageTitleComponent';

import kosala from '@/assets/images/puppies/Kosala.png';
import brian from '@/assets/images/puppies/Brian.png';
import olchik from '@/assets/images/puppies/Olga.png';
import stephen from '@/assets/images/puppies/Stephen.png';
import richie from '@/assets/images/puppies/Richie.png';
import brittany from '@/assets/images/puppies/Brittany.png';
import yel from '@/assets/images/puppies/Gamaliel.png';
import steve from '@/assets/images/puppies/Steve.png';
import gage from '@/assets/images/puppies/Gage.png';
import jack from '@/assets/images/puppies/Jack.png';
import david from '@/assets/images/puppies/David.png';
import alex from '@/assets/images/puppies/Alex.png';
import misha from '@/assets/images/puppies/Misha.png';
import katya from '@/assets/images/puppies/Katya.png';
import semaja from '@/assets/images/puppies/Semaja.png';
import jessica from '@/assets/images/puppies/Jessica.png';

export default {
  components: {
    'page-title': PageTitleComponent
  },
  data() {
    return {
      members: [
        {
          name: 'Kosala',
          position: 'Head of Pawsitive Thinking',
          img: kosala
        },
        {
          name: 'Brian',
          position: 'Bone Treasury Officer',
          img: brian
        },
        {
          name: 'Olga',
          position: 'Vice Prancer',
          img: olchik
        },
        {
          name: 'Alex',
          position: 'Director of Fetching',
          img: alex
        },
        {
          name: 'Misha',
          position: 'Lead Chewing Developer',
          img: misha
        },
        {
          name: 'Yel',
          position: 'Full Stack Borker',
          img: yel
        },
        {
          name: 'Steve',
          position: 'Full Snack Developer',
          img: steve
        },
        {
          name: 'Gage',
          position: 'Full Stack Retriever',
          img: gage
        },
        {
          name: 'David',
          position: 'Front Yard Developer',
          img: david
        },
        {
          name: 'Jack',
          position: 'Head of Doghouse Design',
          img: jack
        },
        {
          name: 'Stephen',
          position: 'Educational Digging Lead',
          img: stephen
        },
        {
          name: 'Brittany',
          position: 'Doggy Date Coordinator',
          img: brittany
        },
        {
          name: 'Duke & Richie Wolf',
          position: 'Head of Treat Security',
          img: richie
        },
        {
          name: 'Semaja',
          position: 'Head of Whining Management',
          img: semaja
        },
        {
          name: 'Katya',
          position: 'CoWOOFnity Advocate',
          img: katya
        },
        {
          name: 'Jessica',
          position: 'Full Stack Eater',
          img: jessica
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TeamLayout.scss';
</style>
