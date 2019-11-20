<template>
  <div>
    <PageTitle title="About us - Company" />
    <div class="py-9" />
    <WhatIsMew />
    <div class="py-7" />
    <OurStory />
    <div class="py-7" />
    <Partners />
    <div class="py-7" />
    <Ad2 />
  </div>
</template>

<script>
import PageTitle from '@/layouts/components/PageTitle';
import Partners from '@/layouts/HomeLayout/components/Partners';
import Ad2 from '@/layouts/HomeLayout/components/Ad2';
import WhatIsMew from './components/WhatIsMew';
import OurStory from './components/OurStory';

export default {
  components: { PageTitle, Partners, Ad2, WhatIsMew, OurStory },
  data: () => ({})
};
</script>
