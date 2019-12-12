<template>
  <v-sheet class="d-flex align-start" min-height="370px">
    <div class="pt-8 px-3">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-3">Create password</div>

      <div class="d-flex align-center">
        <StdButton buttonclass="button--green" @click.native="linkToStep(2)"
          >Continue</StdButton
        >
      </div>
      <p class="mt-4 mb-0">
        Already knew how to do it?
        <router-link
          class="text-decoration--none orange--text font-weight-bold"
          to="/"
          >Skip</router-link
        >
      </p>
    </div>
  </v-sheet>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  components: { StdButton },
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

<style lang="scss" scoped></style>
