<template>
  <v-sheet class="d-flex flex-column">
    <v-sheet class="pt-8 px-3 mb-10" width="100%">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-3">Create password</div>
      <div class="my-5" />
      <PasswdFieldButton btnlabel="Create" fldlabel="Password" />
    </v-sheet>
  </v-sheet>
</template>

<script>
import PasswdFieldButton from '@/components/PasswdFieldButton';

export default {
  components: { PasswdFieldButton },
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
