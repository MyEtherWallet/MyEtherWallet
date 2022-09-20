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
export default {
  name: 'TheCompanyLayout',
  components: {
    TheLayoutHeader: () => import('../components-default/TheLayoutHeader'),
    AppPartnersBlock: () => import('@/core/components/AppPartnersBlock'),
    AppMewtopiaBlock: () => import('@/core/components/AppMewtopiaBlock'),
    CompanyWhatIsMew: () => import('../components-default/CompanyWhatIsMew'),
    CompanyOurStory: () => import('../components-default/CompanyOurStory'),
    CompanyCommunity: () => import('../components-default/CompanyCommunity')
  }
};
</script>
