<template>
  <div>
    <home-header title="About us - Company" />
    <div class="py-9" />
    <what-is-mew />
    <div class="py-7" />
    <our-story />
    <div class="py-10" />
    <community />
    <div class="py-10" />
    <partners />
    <div class="py-9" />
    <join />
    <div class="py-1" />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header/HomeHeader';
import partners from '@/components/partners/Partners';
import join from '@/components/join/Join';
import whatIsMew from './components/what-is-mew/WhatIsMew';
import ourStory from './components/our-story/OurStory';
import community from './components/community/Community';

export default {
  components: {
    homeHeader,
    partners,
    join,
    whatIsMew,
    ourStory,
    community
  }
};
</script>
