<template>
  <div>
    <v-sheet max-width="800px" class="mx-auto border-radius--10px pa-12">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>
      <PasswdField btnlabel="Create" fldlabel="Password" />
      <mew6-std-btn @click.native="linkToStep(2)">Next</mew6-std-btn>
    </v-sheet>
    <NotRecommended class="mt-6 border-radius--10px" />
  </div>
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
        path: '/create-wallet/keystore',
        query: { step: step }
      });
    }
  }
};
</script>
