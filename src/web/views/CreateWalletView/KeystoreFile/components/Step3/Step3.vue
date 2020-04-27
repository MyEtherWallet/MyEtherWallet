<template>
  <v-sheet class="d-flex px-3 py-8">
    <v-col cols="6" class="pt-0">
      <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
      <div class="headline font-weight-bold mb-3">You are done!</div>
      <p class="mb-6">
        Congratulation! Please use the MEWconnect App to scan this QR code in
        order to access your new wallet. And you are done!
      </p>
      <div class="d-flex align-center">
        <StdButton size="x-large" buttonclass="button--green">
          Access my wallet
        </StdButton>
      </div>
      <p class="mt-4 mb-0">
        Need help?
        <router-link
          class="emerald--text text-decoration--none font-weight-bold"
          to="/"
          >Get helps from MEWconnect</router-link
        >
      </p>
    </v-col>
    <v-col cols="6" class="pt-10">
      <v-img
        class="mx-auto"
        max-width="280px"
        src="@/assets/images/icons/icon-keystore-mew.png"
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
