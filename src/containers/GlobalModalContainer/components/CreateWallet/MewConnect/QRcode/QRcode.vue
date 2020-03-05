<template>
  <div>
    <ModalWithTitle width="350px" title="Scan to Download" :active="active">
      <div>
        <v-img
          max-width="150px"
          class="mx-auto"
          src="@/assets/images/snippets/mobile/qr-code-mew-connect-blue.png"
        />
        <div class="mt-3 mb-6 text-center grey--text">
          iOS 9.0 or up
        </div>
        <v-btn-toggle class="d-flex">
          <v-btn class="d-flex align-center flex-grow-1" color="#001425">
            <img
              class="mt-n1"
              src="@/assets/images/icons/light/white/icon-apple-white.svg"
            />
            <div class="white--text ml-1">iPhone</div>
          </v-btn>
          <v-btn class="d-flex align-center flex-grow-1">
            <img
              class="mt-n1"
              src="@/assets/images/icons/light/grey/icon-android-grey.svg"
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
  props: {
    active: { default: false, type: Boolean }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
