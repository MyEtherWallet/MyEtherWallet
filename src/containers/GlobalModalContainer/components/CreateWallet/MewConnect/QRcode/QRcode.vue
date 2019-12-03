<template>
  <div>
    <ModalWithTitle width="350px" title="Scan to Download">
      <div>
        <v-img
          max-width="150px"
          class="mx-auto"
          src="@/assets/images/Etc/CreateWallet/QrMewConnect.png"
        />
        <div class="mt-3 mb-6 text-center grey--text">
          iOS 9.0 or up
        </div>
        <v-btn-toggle class="d-flex">
          <v-btn class="d-flex align-center flex-grow-1" color="#001425">
            <img
              class="mt-n1"
              src="@/assets/images/Etc/CreateWallet/Apple.svg"
            />
            <div class="white--text ml-1">iPhone</div>
          </v-btn>
          <v-btn class="d-flex align-center flex-grow-1">
            <img
              class="mt-n1"
              src="@/assets/images/Etc/CreateWallet/Android.svg"
            />
            <div class="grey--text text--darken-1 ml-1">Android</div>
          </v-btn>
        </v-btn-toggle>
      </div>
    </ModalWithTitle>
  </div>
</template>

<script>
import ModalWithTitle from '@/components/ModalWithTitle';

export default {
  components: { ModalWithTitle },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
