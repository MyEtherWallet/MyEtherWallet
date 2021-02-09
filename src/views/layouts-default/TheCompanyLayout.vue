<template>
  <div>
    <the-layout-header title="About us - Company" />
    <div class="py-9" />
    <company-what-is-mew />
    <div class="py-7" />
    <company-our-story />
    <div class="py-10" />
    <company-community />
    <div class="py-10" />
    <partners />
    <div class="py-9" />
    <join />
    <div class="py-1" />
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import partners from '@/components/partners/Partners';
import join from '@/components/join/Join';

import CompanyWhatIsMew from '../components-default/CompanyWhatIsMew';
import CompanyOurStory from '../components-default/CompanyOurStory';
import CompanyCommunity from '../components-default/CompanyCommunity';

export default {
  name: 'TheCompanyLayout',
  components: {
    TheLayoutHeader,
    partners,
    join,
    CompanyWhatIsMew,
    CompanyOurStory,
    CompanyCommunity
  }
};
</script>
