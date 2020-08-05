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
import homeHeader from '@/components/home-header';
import partners from '@/components/partners';
import join from '@/components/join';
import whatIsMew from './components/what-is-mew';
import ourStory from './components/our-story';
import community from './components/community';

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
