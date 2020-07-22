<template>
  <v-sheet class="d-flex align-end px-3" min-height="370px">
    <v-col cols="6" class="pb-10">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
      <div class="headline font-weight-bold mb-3">You are done!</div>
      <p class="mb-6">
        Congratulation! Please use the MEWconnect App to scan this QR code in
        order to access your new wallet. And you are done!
      </p>
      <div class="d-flex align-center">
        <mew-button
          class="mr-3"
          button-size="xlarge"
          title="Back"
          :to="{ name: 'HomeCreateWalletMewWallet', query: { step: '2' } }"
        />
        <mew-button button-size="xlarge" title="Scan & Access" />
      </div>
      <p class="mt-4 mb-0">
        Need more help?
        <a
          class="emerald--text text-decoration--none font-weight-medium"
          href="https://www.mewtopia.com/"
          target="_blank"
          >Watch tutorial</a
        >
      </p>
    </v-col>
    <v-col cols="6" class="pb-0">
      <v-img
        class="mx-auto"
        max-height="360px"
        max-width="330px"
        src="@/assets/images/snippets/mobile/mobile-scan-qr.png"
      />
    </v-col>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  methods: {}
};
</script>
