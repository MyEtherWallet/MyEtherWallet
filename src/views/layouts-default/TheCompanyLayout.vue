<template>
  <div>
    <the-layout-header :title="$t('aboutUs.title')" class="pt-16" />
    <div class="py-9" />
    <company-what-is-mew />
    <div class="py-7" />
    <company-our-story />
    <div class="py-10" />
    <company-community />
    <div class="py-10" />
    <partners-block />
    <div class="py-9" />
    <mewtopia-block />
    <div class="py-1" />
  </div>
</template>

<script>
export default {
  name: 'TheCompanyLayout',
  components: {
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader'),
    CompanyWhatIsMew: () => import('../components-default/CompanyWhatIsMew'),
    CompanyOurStory: () => import('../components-default/CompanyOurStory'),
    CompanyCommunity: () => import('../components-default/CompanyCommunity'),
    MewtopiaBlock: () => import('../components-default/MewtopiaBlock'),
    PartnersBlock: () => import('../components-default/PartnersBlock')
  }
};
</script>
