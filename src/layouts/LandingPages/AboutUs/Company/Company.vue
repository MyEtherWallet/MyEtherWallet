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
    <Ad2 />
    <div class="py-1" />
  </div>
</template>

<script>
import PageTitle from '../../components/PageTitle';
import Partners from '../../components/Partners';
import Ad2 from '../../components/Ad2';
import WhatIsMew from './components/WhatIsMew';
import OurStory from './components/OurStory';
import TwoBlockContent from './components/TwoBlockContent';

export default {
  components: {
    PageTitle,
    Partners,
    Ad2,
    WhatIsMew,
    OurStory,
    TwoBlockContent
  },
  data: () => ({})
};
</script>
