<template>
  <v-sheet class="d-flex align-end" min-height="350px">
    <v-col cols="6">
      <div class="subtitle-1 font-weight-bold grey--text">
        STEP 2.
      </div>
      <div class="headline font-weight-bold mb-3">
        Create a new wallet
      </div>
      <div class="mb-6">
        Please follow the prompts in MEWconnect App and create a new wallet.
        Continue if you have already created a new wallet in the App.
      </div>
      <div class="d-flex align-center">
        <StdButton
          buttonclass="button--green-border"
          class="mr-3"
          :minwidth="false"
          >Back</StdButton
        >
        <StdButton buttonclass="button--green">Continue</StdButton>
      </div>
      <div class="mt-4">
        Need more help?
        <router-link
          class="text-decoration--none text-color--mew-green font-weight-bold"
          to="/"
          >Watch tutorial</router-link
        >
      </div>
    </v-col>
    <v-col cols="6">
      <v-img
        class="mb-n9 mx-auto"
        max-height="340px"
        max-width="250px"
        src="@/assets/images/Etc/CreateWallet/CreateNewWallet.png"
      />
    </v-col>
  </v-sheet>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  components: { StdButton },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
