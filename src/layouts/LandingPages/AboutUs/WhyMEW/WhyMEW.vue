<template>
  <div>
    <PageTitle title="About us" />
    <div class="py-7" />
    <BlockTitle />
  </div>
</template>

<script>
import PageTitle from '../../components/PageTitle';
import BlockTitle from '../../components/BlockTitle';

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
