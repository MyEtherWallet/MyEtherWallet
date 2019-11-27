<template>
  <v-sheet class="d-flex align-end" min-height="350px">
    <v-col cols="6">
      <div class="subtitle-1 font-weight-bold grey--text">
        STEP 3.
      </div>
      <div class="headline font-weight-bold mb-3">
        Well done!
      </div>
      <div class="mb-6">
        Congratulation! Please use the MEWconnect App to scan this QR code in
        order to access your new wallet. And you are done!
      </div>
      <div class="d-flex align-center">
        <StdButton
          buttonclass="button--green-border"
          class="mr-3"
          :minwidth="false"
          >Back</StdButton
        >
        <StdButton buttonclass="button--green">Scan &amp; Access</StdButton>
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
        max-height="380px"
        max-width="340px"
        src="@/assets/images/Etc/CreateWallet/Done.png"
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
