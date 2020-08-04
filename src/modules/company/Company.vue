<template>
  <div>
    <home-header title="About us - Company" />
    <div class="py-9" />
    <WhatIsMew />
    <div class="py-7" />
    <OurStory />
    <div class="py-10" />
    <TwoBlockContent />
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
import WhatIsMew from './components/WhatIsMew';
import OurStory from './components/OurStory';
import TwoBlockContent from './components/TwoBlockContent';

export default {
  components: {
    homeHeader,
    partners,
    join,
    WhatIsMew,
    OurStory,
    TwoBlockContent
  }
};
</script>
