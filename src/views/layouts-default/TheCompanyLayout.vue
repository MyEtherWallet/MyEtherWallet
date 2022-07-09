<template>
  <div>
    <the-layout-header :title="$t('aboutUs.title')" />
    <div class="py-9" />
    <company-what-is-mew />
    <div class="py-7" />
    <company-our-story />
    <div class="py-10" />
    <company-community />
    <div class="py-10" />
    <app-partners-block />
    <div class="py-9" />
    <app-mewtopia-block />
    <div class="py-1" />
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import AppPartnersBlock from '@/core/components/AppPartnersBlock';
import AppMewtopiaBlock from '@/core/components/AppMewtopiaBlock';
import CompanyWhatIsMew from '../components-default/CompanyWhatIsMew';
import CompanyOurStory from '../components-default/CompanyOurStory';
import CompanyCommunity from '../components-default/CompanyCommunity';

export default {
  name: 'TheCompanyLayout',
  components: {
    TheLayoutHeader,
    AppPartnersBlock,
    AppMewtopiaBlock,
    CompanyWhatIsMew,
    CompanyOurStory,
    CompanyCommunity
  }
};
</script>
