<template>
  <v-sheet class="d-flex align-end px-3" min-height="370px">
    <v-col cols="6" class="pb-10">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
      <div class="headline font-weight-bold mb-3">Create a new wallet</div>
      <p class="mb-6">
        Please follow the prompts in MEWconnect App and create a new wallet.
        Continue if you have already created a new wallet in the App.
      </p>
      <div class="d-flex align-center">
        <StdButton
          buttonclass="button--green-border"
          class="mr-3"
          :minwidth="false"
          :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
          >Back</StdButton
        >
        <StdButton
          buttonclass="button--green"
          :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '3' } }"
        >
          Continue
        </StdButton>
      </div>
      <p class="mt-4 mb-0">
        Need more help?
        <a
          class="text-decoration--none text-color--mew-green font-weight-bold"
          href="https://www.mewtopia.com/"
          target="_blank"
        >
          Watch tutorial
        </a>
      </p>
    </v-col>
    <v-col cols="6" class="pb-0">
      <v-img
        class="mx-auto"
        max-height="320px"
        max-width="240px"
        src="@/assets/images/snippets/mobile/mobile-watch-again.png"
      />
    </v-col>
  </v-sheet>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  components: { StdButton },
  data: () => ({}),
  methods: {}
};
</script>

<style lang="scss" scoped></style>
