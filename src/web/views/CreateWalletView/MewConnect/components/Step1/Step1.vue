<template>
  <v-sheet class="d-flex align-end px-3" min-height="370px">
    <v-col cols="6" class="pb-10">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-3">Download &amp; Install</div>
      <p class="mb-6">
        Please scan the
        <span class="text-color--mew-green">QR Code</span>, or search
        "MEWconnect" in
        <a
          href="https://www.apple.com/lae/ios/app-store/"
          class="text-decoration--none text-color--mew-green"
          target="_blank"
          >Apple App Store</a
        >
        or
        <a
          href="https://play.google.com/store"
          class="text-decoration--none text-color--mew-green"
          target="_blank"
          >Google Play Store</a
        >. Continue if you have already installed the App.
      </p>
      <div class="d-flex align-center">
        <StdButton
          buttonclass="button--green"
          :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '2' } }"
          >Continue</StdButton
        >
      </div>
      <p class="mt-4 mb-0">
        Already knew how to do it?
        <router-link
          class="text-decoration--none orange--text font-weight-bold"
          :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '3' } }"
          >Skip</router-link
        >
      </p>
    </v-col>
    <v-col cols="6" class="pb-0">
      <v-img
        class="mx-auto"
        max-height="330px"
        max-width="290px"
        src="@/assets/images/snippets/mobile/mobile-mewconnect-no-hardware.png"
      />
    </v-col>
  </v-sheet>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  data: () => ({}),
  methods: {}
};
</script>
