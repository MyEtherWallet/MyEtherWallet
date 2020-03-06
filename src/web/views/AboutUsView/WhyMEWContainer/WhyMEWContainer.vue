<template>
  <div>
    <PageTitle title="About us" />
    <div class="py-7" />
    <BlockTitle />
  </div>
</template>

<script>
import PageTitle from '@/web/components/PageTitle';
import BlockTitle from '@/web/components/BlockTitle';

export default {
  components: { PageTitle, BlockTitle },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';

a {
  text-decoration: underline;
}
</style>
