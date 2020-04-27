<template>
  <v-sheet>
    <v-sheet class="px-5 mt-8 mb-4" width="100%">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>
      <PasswdField btnlabel="Create" fldlabel="Password" />
    </v-sheet>
    <NotRecommended class="mx-n6 border-radius-bottom" />
  </v-sheet>
</template>

<script>
import PasswdField from '@/web/components/PasswdField';
import NotRecommended from '@/web/components/NotRecommended';

export default {
  components: { PasswdField, NotRecommended },
  data: () => ({}),
  methods: {
    linkToStep(step) {
      this.$router.push({
        path: '/create-wallet/mewconnect',
        query: { step: step }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.border-radius-bottom {
  border-radius: 0 0 10px 10px;
}
</style>
