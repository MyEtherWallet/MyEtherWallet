<template>
  <div>
    <PageTitle title="About us - Company" />
    <div class="py-9" />
    <WhatIsMew />
    <div class="py-7" />
    <OurStory />
    <div class="py-10" />
    <TwoBlockContent />
    <div class="py-10" />
    <Partners />
    <div class="py-9" />
    <Ad />
    <div class="py-1" />
  </div>
</template>

<script>
import PageTitle from '@/web/components/PageTitle';
import Partners from '@/web/components/Partners';
import Ad from '@/web/components/Ad';
import WhatIsMew from './components/WhatIsMew';
import OurStory from './components/OurStory';
import TwoBlockContent from './components/TwoBlockContent';

export default {
  components: {
    PageTitle,
    Partners,
    Ad,
    WhatIsMew,
    OurStory,
    TwoBlockContent
  },
  data: () => ({})
};
</script>
