<template>
  <v-sheet class="d-flex align-end" min-height="370px">
    <v-col cols="6" class="pb-10">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="headline font-weight-bold mb-3">Create a new wallet</div>
      <div class="mb-6">
        Please follow the prompts in MEWconnect App and create a new wallet.
        Continue if you have already created a new wallet in the App.
      </div>
      <div class="d-flex align-center">
        <StdButton
          buttonclass="button--green-border"
          class="mr-3"
          :minwidth="false"
          @click.native="linkToStep(1)"
          >Back</StdButton
        >
        <StdButton buttonclass="button--green" @click.native="linkToStep(3)">
          Continue
        </StdButton>
      </div>
      <div class="mt-4">
        Need more help?
        <router-link
          class="text-decoration--none text-color--mew-green font-weight-bold"
          to="/"
        >
          Watch tutorial
        </router-link>
      </div>
    </v-col>
    <v-col cols="6" class="pb-0">
      <v-img
        class="mx-auto"
        max-height="320px"
        max-width="240px"
        src="@/assets/images/Etc/CreateWallet/CreateNewWallet.png"
      />
    </v-col>
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
