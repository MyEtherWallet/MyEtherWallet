<template>
  <v-sheet color="white" class="border-radius--10px pa-12">
    <div class="d-flex align-center">
      <div class="mr-8">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
        <div class="headline font-weight-bold mb-3">You are done!</div>
        <p class="mb-6">
          Congratulation! Please use the MEWconnect App to scan this QR code in
          order to access your new wallet. And you are done!
        </p>
        <mew-button
          title="Access my wallet"
          button-size="xlarge"
          :has-full-width="false"
          class="mb-5"
        />
        <p class="mt-4 mb-0">
          Need help?
          <router-link
            class="emerald--text text-decoration--none font-weight-bold"
            to="/"
            >Get helps from MEWconnect</router-link
          >
        </p>
      </div>
      <v-img
        max-width="250px"
        src="@/assets/images/icons/icon-keystore-mew.png"
      />
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  methods: {}
};
</script>
