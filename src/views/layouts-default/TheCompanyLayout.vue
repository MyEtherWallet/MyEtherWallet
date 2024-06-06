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

<script setup>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import CompanyWhatIsMew from '../components-default/CompanyWhatIsMew';
import CompanyOurStory from '../components-default/CompanyOurStory';
import CompanyCommunity from '../components-default/CompanyCommunity';
import MewtopiaBlock from '../components-default/MewtopiaBlock';
import PartnersBlock from '../components-default/PartnersBlock';
</script>
